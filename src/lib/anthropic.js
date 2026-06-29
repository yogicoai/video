import Anthropic from '@anthropic-ai/sdk';
import { resolveMotionId } from '@/lib/higgsfield';
import { insightsBlock } from '@/lib/brandInsights';

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

function buildSystemPrompt(brand, hasMotions, insights) {
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
${insightsBlock(insights)}
# 고품질 작성 원칙 (시네마틱 — 반드시 반영)
좋은 영상 프롬프트는 다음 요소를 구체적으로 담는다. 모호어("nice", "cozy room")는 금지하고 구체적으로:
- **조명**: golden hour, soft diffused light, warm window light, rim light 등 구체적으로
- **렌즈/광학**: shallow depth of field, soft bokeh, macro detail, wide establishing 등
- **재질/질감**: plush fabric texture, soft beads conforming, water beading 등 제품 질감을 살릴 것
- **분위기/색감**: warm pastel tones, dreamy, serene, premium lifestyle 등
- **일관성**: 모든 샷이 같은 제품·같은 조명·같은 색감 키워드를 공유해 한 편처럼 보이게 (브랜드 비주얼 스타일 고정)

# 샷마다 만들 것 (영어 프롬프트, 한국어 제목/설명)
1. **higgsfieldPrompt** (Higgsfield 전용 — 가장 중요): 위 원칙(조명·렌즈·재질·분위기)을 녹인 **시네마틱한 영어 장면 프롬프트**.
   - ⚠️ **카메라 무빙(dolly, orbit, zoom 등)을 절대 적지 마세요.** Higgsfield는 카메라 움직임을 "모션 프리셋"으로 따로 정하므로, 프롬프트에 넣으면 충돌합니다.
   - 2~3문장. 피사체+동작 / 조명·렌즈 / 재질·분위기가 다 들어가게. 브랜드 톤 반영.
2. **recommendedMotion**: ${
    hasMotions
      ? '아래 제공되는 "사용 가능한 모션 프리셋 목록"에서 이 샷의 의도에 가장 맞는 프리셋 **이름 하나를 그대로** 고르세요(목록에 없는 이름 금지). 잔잔하면 Zoom In/Push In류, 회전이면 360 Orbit/Arc류, 역동적이면 Action Run/Bullet Time류 등.'
      : '(모션 목록이 없으면 일반 카메라 무빙 이름을 한국어로 추천)'
  }
3. **veoPrompt**: (참고용) Veo 등 다른 엔진용. 위 원칙 + **카메라 무빙**까지 포함한 한 문단 영어 프롬프트.
4. **negativePrompt**: 영어. 브랜드의 "피해야 할 것" + 흔한 결함(왜곡된 손발, 워터마크, 흐릿함, 차가운 톤 등) 배제.
5. **title/description**: 한국어로 간결하게. description 끝에 **[음악/효과음 제안: ...]** 형태로 편집 시 넣을 사운드 한 줄 추천(예: 잔잔한 어쿠스틱, 물소리 ASMR). cameraMovement는 의도한 무빙(한 단어).

# 기타 규칙
- 스토리보드 컷에 연결된 이미지가 있으면 referenceImageId를 그대로 유지. 없으면 빈 문자열("").
- 전체 길이 합이 목표 길이에 대략 맞게 각 샷 durationSec(4~8초) 배분.
- 스토리보드가 비어 있으면 시나리오·브랜드로 샷 3~5개를 새로 구성.
- 모든 샷의 조명·색감을 통일해 시리즈 일관성을 유지할 것.`;
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
export async function generateShots({ project, brand, assets, storyboard, motions = [], insights = null }) {
  const anthropic = getClient();
  const motionNames = motions.map((m) => m.name).filter(Boolean);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 20000,
    system: buildSystemPrompt(brand, motionNames.length > 0, insights),
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
        recommendedMotionId: resolveMotionId(recName, motions), // UI 자동 선택용(유연 매칭)
        negativePrompt: String(s.negativePrompt || ''),
        durationSec: Number(s.durationSec) || 5,
        referenceImageId: validIds.has(String(s.referenceImageId)) ? String(s.referenceImageId) : null,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
}

// ───────────────────────── 쇼츠 아이디어 추천 ─────────────────────────

const IDEAS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' }, // 한국어 짧은 제목
          concept: { type: 'string' }, // 한국어 한두 문장 컨셉
          hook: { type: 'string' }, // 한국어 첫 1~2초 훅
          trendRationale: { type: 'string' }, // 한국어 — 왜 먹히나(트렌드 근거)
          scenePrompt: { type: 'string' }, // 영어 장면 프롬프트(카메라 묘사 제외)
          recommendedMotion: { type: 'string' }, // 모션 프리셋 이름
          durationSec: { type: 'number' }, // 쇼츠 추천 길이(6~15)
          tag: { type: 'string' }, // 트렌드/시즌 태그 (예: ASMR, 여름)
        },
        required: ['title', 'concept', 'hook', 'trendRationale', 'scenePrompt', 'recommendedMotion', 'durationSec', 'tag'],
      },
    },
  },
  required: ['ideas'],
};

// 라이브 트렌드 검색이 없을 때 기준이 되는 쇼츠 트렌드 레퍼런스 (2025~2026).
const SHORTS_TRENDS = `- ASMR·오감 만족: 소리·질감으로 몰입(시청유지율↑)
- 하루 루틴/집콕: 일상 공감·판타지
- POV(1인칭 시점): 몰입감
- 비포&애프터/변신: 짧고 강한 반전
- 오싱싱(oddly satisfying): 무한 반복 시청
- 계절 훅: 시즌성 콘텐츠를 알고리즘이 밀어줌
- 릴레이터블 상황극("~할 때"): 공감 유머
- 트렌드 오디오 + 제품 자연스러운 노출`;

export async function generateIdeas({ brand, motions = [], count = 5, season = '', vibe = '', focus = '', insights = null }) {
  const anthropic = getClient();
  const motionNames = motions.map((m) => m.name).filter(Boolean);

  const system = `당신은 ${'Yogibo'} 브랜드의 숏폼(쇼츠/릴스) 크리에이티브 전략가입니다. 트렌드를 반영한 **바로 만들 수 있는 쇼츠 아이디어**를 제안합니다.

# 브랜드 프로필 (모든 아이디어가 이 톤을 따른다)
- 한 줄 정의: ${brand.oneLiner || '-'}
- 핵심 가치: ${brand.coreValues || '-'}
- 영상 톤: ${brand.videoTone || '-'}
- 비주얼 스타일: ${brand.visualStyle || '-'}
- 타깃: ${brand.target || '-'}
- 제품 특징: ${brand.productFeatures || '-'}
- 피해야 할 것: ${brand.avoid || '-'}
${insightsBlock(insights)}
# 참고 쇼츠 트렌드
${SHORTS_TRENDS}

# 각 아이디어에 담을 것
- title/concept/hook/trendRationale: 한국어. hook은 "첫 1~2초에 무엇을 보여줄지", trendRationale은 "왜 이게 요즘 먹히는지".
- scenePrompt: 영어. 제품/상황/분위기 묘사. **카메라 무빙은 적지 말 것**(모션 프리셋이 담당).
- recommendedMotion: ${motionNames.length ? '아래 목록에서 가장 맞는 프리셋 이름 하나를 그대로 고를 것.' : '일반 카메라 무빙 이름 추천.'}
- durationSec: 쇼츠에 맞게 6~15초.
- tag: 트렌드/시즌 한 단어(예: ASMR, 비포애프터, 여름).
- 서로 겹치지 않게 다양한 트렌드를 섞을 것.${
    motionNames.length ? `\n\n# 사용 가능한 모션 프리셋\n${motionNames.join(', ')}` : ''
  }`;

  const ask = `요기보 쇼츠 아이디어 ${count}개를 제안하세요.${season ? ` 계절/시즌: ${season}.` : ''}${vibe ? ` 분위기: ${vibe}.` : ''}${focus ? ` 집중 주제: ${focus}.` : ''}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: ask }],
    output_config: { format: { type: 'json_schema', schema: IDEAS_SCHEMA } },
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('Claude 응답에서 결과를 찾지 못했습니다.');
  const parsed = JSON.parse(textBlock.text);

  return (parsed.ideas || []).map((it) => ({
    title: String(it.title || ''),
    concept: String(it.concept || ''),
    hook: String(it.hook || ''),
    trendRationale: String(it.trendRationale || ''),
    scenePrompt: String(it.scenePrompt || ''),
    recommendedMotion: String(it.recommendedMotion || ''),
    recommendedMotionId: resolveMotionId(it.recommendedMotion, motions),
    durationSec: Number(it.durationSec) || 10,
    tag: String(it.tag || ''),
  }));
}

export { MODEL };
