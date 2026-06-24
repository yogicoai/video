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
          veoPrompt: { type: 'string' }, // 영어 Veo 3 프롬프트(카메라 묘사 포함)
          higgsfieldPrompt: { type: 'string' }, // 영어 Higgsfield용 장면 프롬프트(카메라 묘사 제외, 간결)
          recommendedMotion: { type: 'string' }, // 제공된 모션 목록에서 고른 추천 프리셋 이름
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
          'higgsfieldPrompt',
          'recommendedMotion',
          'negativePrompt',
          'durationSec',
          'referenceImageId',
        ],
      },
    },
  },
  required: ['shots'],
};

function buildSystemPrompt(brand, hasMotions) {
  return `당신은 기업 광고 영상의 시니어 프롬프트 엔지니어입니다. 입력된 브랜드 정보·시나리오·스토리보드를 바탕으로, image-to-video 영상의 샷(shot)별 프롬프트를 작성합니다. 영상은 주로 **Higgsfield(DoP)** 로 제작합니다.

# 브랜드 프로필 (모든 프롬프트는 이 톤을 반드시 따른다)
- 한 줄 정의: ${brand.oneLiner || '-'}
- 핵심 가치: ${brand.coreValues || '-'}
- 영상 톤: ${brand.videoTone || '-'}
- 비주얼 스타일: ${brand.visualStyle || '-'}
- 타깃: ${brand.target || '-'}
- 제품 특징: ${brand.productFeatures || '-'}
- 피해야 할 것: ${brand.avoid || '-'}
- 자주 쓰는 키워드: ${brand.keywords || '-'}

# 샷마다 만들 것 (영어 프롬프트, 한국어 제목/설명)
1. **higgsfieldPrompt** (Higgsfield 전용 — 가장 중요): 제품/상황/동작/분위기/조명을 묘사하는 **간결한 영어 장면 프롬프트**.
   - ⚠️ **카메라 무빙(dolly, orbit, zoom 등)을 절대 적지 마세요.** Higgsfield는 카메라 움직임을 "모션 프리셋"으로 따로 정하므로, 프롬프트에 넣으면 충돌합니다.
   - 2~3문장 이내로 간결하게. 브랜드 톤 반영.
2. **recommendedMotion**: ${
    hasMotions
      ? '아래 제공되는 "사용 가능한 모션 프리셋 목록"에서 이 샷의 의도에 가장 맞는 프리셋 **이름 하나를 그대로** 고르세요(목록에 없는 이름 금지). 잔잔하면 Zoom In/Push In류, 회전이면 360 Orbit/Arc류, 역동적이면 Action Run/Bullet Time류 등.'
      : '(모션 목록이 없으면 일반 카메라 무빙 이름을 한국어로 추천)'
  }
3. **veoPrompt**: (참고용) Veo 등 다른 엔진에서도 쓸 수 있게 카메라 무빙까지 포함한 한 문단 영어 프롬프트.
4. **negativePrompt**: 영어. 브랜드의 "피해야 할 것" + 흔한 결함(왜곡된 손발, 워터마크 등) 배제.
5. **title/description**: 한국어로 간결하게. cameraMovement는 의도한 무빙(한 단어).

# 기타 규칙
- 스토리보드 컷에 연결된 이미지가 있으면 referenceImageId를 그대로 유지. 없으면 빈 문자열("").
- 전체 길이 합이 목표 길이에 대략 맞게 각 샷 durationSec(4~8초) 배분.
- 스토리보드가 비어 있으면 시나리오·브랜드로 샷 3~5개를 새로 구성.`;
}

function buildUserPrompt({ project, assets, storyboard, motionNames }) {
  const imageLines = assets.length
    ? assets.map((a, i) => `- 이미지#${i + 1} (id: ${a._id}, 파일: ${a.originalName})`).join('\n')
    : '(업로드된 이미지 없음)';

  const cutLines = storyboard?.length
    ? storyboard
        .map((c) => `- 컷 ${c.order}: ${c.text}${c.imageId ? ` [연결 이미지 id: ${c.imageId}]` : ''}`)
        .join('\n')
    : '(스토리보드 미작성)';

  const motionBlock = motionNames?.length
    ? `\n# 사용 가능한 모션 프리셋 목록 (recommendedMotion은 이 중에서만 고를 것)\n${motionNames.join(', ')}\n`
    : '';

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
${motionBlock}
위 내용을 바탕으로 샷별 프롬프트를 생성하세요. (Higgsfield 장면 프롬프트 + 추천 모션을 가장 신경 써서)`;
}

/**
 * 브랜드 + 프로젝트 + 에셋 + 스토리보드(+ 모션 목록) → 샷별 프롬프트.
 * @param {Array<{id:string,name:string}>} [motions] Higgsfield 모션 프리셋 목록
 * @returns {Promise<Array>} shots
 */
export async function generateShots({ project, brand, assets, storyboard, motions = [] }) {
  const anthropic = getClient();
  const motionNames = motions.map((m) => m.name).filter(Boolean);
  const motionIdByName = Object.fromEntries(motions.map((m) => [m.name, m.id]));

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 20000,
    system: buildSystemPrompt(brand, motionNames.length > 0),
    messages: [{ role: 'user', content: buildUserPrompt({ project, assets, storyboard, motionNames }) }],
    output_config: { format: { type: 'json_schema', schema: SHOTS_SCHEMA } },
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('Claude 응답에서 결과를 찾지 못했습니다.');

  const parsed = JSON.parse(textBlock.text);
  const validIds = new Set(assets.map((a) => String(a._id)));

  return (parsed.shots || [])
    .map((s, i) => {
      const recName = String(s.recommendedMotion || '');
      return {
        order: Number(s.order ?? i + 1),
        title: String(s.title || `샷 ${i + 1}`),
        description: String(s.description || ''),
        cameraMovement: String(s.cameraMovement || ''),
        veoPrompt: String(s.veoPrompt || ''),
        higgsfieldPrompt: String(s.higgsfieldPrompt || ''),
        recommendedMotion: recName,
        recommendedMotionId: motionIdByName[recName] || null, // UI 자동 선택용
        negativePrompt: String(s.negativePrompt || ''),
        durationSec: Number(s.durationSec) || 5,
        referenceImageId: validIds.has(String(s.referenceImageId)) ? String(s.referenceImageId) : null,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
}

export { MODEL };
