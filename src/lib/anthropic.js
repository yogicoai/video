import Anthropic from '@anthropic-ai/sdk';

// 모델: 기본 최고 품질(Opus 4.8). 비용 절감이 필요하면 .env.local의 ANTHROPIC_MODEL로 교체
// (예: claude-sonnet-4-6). 다운그레이드는 사용자의 선택이므로 기본값은 건드리지 않는다.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

let client = null;
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY가 설정되지 않았습니다 (.env.local).');
    }
    client = new Anthropic(); // ANTHROPIC_API_KEY 환경변수에서 자동 로드
  }
  return client;
}

// 구조화 출력 스키마 — Claude가 이 형태로만 응답하도록 강제한다.
const SHOTS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    shots: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          order: { type: 'integer' },
          title: { type: 'string' }, // 짧은 한글 샷 제목
          description: { type: 'string' }, // 한글 샷 설명
          cameraMovement: { type: 'string' }, // 예: dolly-in, orbit, static, pan
          veoPrompt: { type: 'string' }, // 영어 Veo 3 프롬프트
          negativePrompt: { type: 'string' }, // 영어 네거티브 프롬프트
          durationSec: { type: 'number' },
          referenceImageId: { type: 'string' }, // 연결 이미지 _id (없으면 "")
        },
        required: [
          'order',
          'title',
          'description',
          'cameraMovement',
          'veoPrompt',
          'negativePrompt',
          'durationSec',
          'referenceImageId',
        ],
      },
    },
  },
  required: ['shots'],
};

function buildSystemPrompt(brand) {
  return `당신은 기업 광고 영상의 시니어 프롬프트 엔지니어입니다. 입력된 브랜드 정보·시나리오·스토리보드를 바탕으로, Google Veo 3(image-to-video) 규격에 맞는 샷(shot) 단위 영상 프롬프트를 작성합니다.

# 브랜드 프로필 (모든 프롬프트는 이 톤을 반드시 따른다)
- 한 줄 정의: ${brand.oneLiner || '-'}
- 핵심 가치: ${brand.coreValues || '-'}
- 영상 톤: ${brand.videoTone || '-'}
- 비주얼 스타일: ${brand.visualStyle || '-'}
- 타깃: ${brand.target || '-'}
- 제품 특징: ${brand.productFeatures || '-'}
- 피해야 할 것: ${brand.avoid || '-'}
- 자주 쓰는 키워드: ${brand.keywords || '-'}

# 작성 규칙
- 각 샷의 veoPrompt와 negativePrompt는 **영어로** 작성한다 (영상 엔진은 영어에 가장 잘 반응).
- veoPrompt에는 피사체+동작, 카메라 무빙, 조명/분위기, 스타일을 한 문단으로 자연스럽게 녹인다.
- 브랜드의 "영상 톤"과 "비주얼 스타일"을 매 프롬프트에 반영하고, "피해야 할 것"은 negativePrompt와 연출에서 배제한다.
- title/description은 한국어로 간결하게 작성한다.
- cameraMovement는 dolly-in / orbit / static / pan / tracking 등 구체적으로.
- 스토리보드 컷에 연결된 이미지가 있으면 그 referenceImageId를 그대로 유지한다. 없으면 빈 문자열("").
- 전체 샷 길이의 합이 목표 길이에 대략 맞도록 각 샷 durationSec(보통 4~8초)을 배분한다.
- 스토리보드가 비어 있으면 시나리오와 브랜드를 바탕으로 합리적인 샷 3~5개를 새로 구성한다.`;
}

function buildUserPrompt({ project, assets, storyboard }) {
  const imageLines = assets.length
    ? assets
        .map((a, i) => `- 이미지#${i + 1} (id: ${a._id}, 파일: ${a.originalName})`)
        .join('\n')
    : '(업로드된 이미지 없음)';

  const cutLines = storyboard?.length
    ? storyboard
        .map((c) => `- 컷 ${c.order}: ${c.text}${c.imageId ? ` [연결 이미지 id: ${c.imageId}]` : ''}`)
        .join('\n')
    : '(스토리보드 미작성)';

  return `# 이 프로젝트
- 제목: ${project.title}
- 시나리오/상황: ${project.scenario || '(미입력)'}
- 톤: ${project.tone || '(미입력)'}
- 타깃: ${project.target || '(미입력)'}
- 목표 전체 길이: ${project.durationSec}초
- 화면 비율: ${project.aspectRatio}

# 사용 가능한 이미지
${imageLines}

# 스토리보드
${cutLines}

위 내용을 바탕으로 샷별 Veo 3 프롬프트를 생성하세요.`;
}

/**
 * 브랜드 + 프로젝트 + 에셋 + 스토리보드 → 샷별 Veo3 프롬프트.
 * @returns {Promise<Array>} shots
 */
export async function generateShots({ project, brand, assets, storyboard }) {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: buildSystemPrompt(brand),
    messages: [{ role: 'user', content: buildUserPrompt({ project, assets, storyboard }) }],
    output_config: { format: { type: 'json_schema', schema: SHOTS_SCHEMA } },
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('Claude 응답에서 결과를 찾지 못했습니다.');

  const parsed = JSON.parse(textBlock.text);
  const validIds = new Set(assets.map((a) => String(a._id)));

  // 순번 정렬 + 연결 이미지 id 검증
  return (parsed.shots || [])
    .map((s, i) => ({
      order: Number(s.order ?? i + 1),
      title: String(s.title || `샷 ${i + 1}`),
      description: String(s.description || ''),
      cameraMovement: String(s.cameraMovement || ''),
      veoPrompt: String(s.veoPrompt || ''),
      negativePrompt: String(s.negativePrompt || ''),
      durationSec: Number(s.durationSec) || 5,
      referenceImageId: validIds.has(String(s.referenceImageId)) ? String(s.referenceImageId) : null,
    }))
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
}

export { MODEL };
