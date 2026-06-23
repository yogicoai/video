// 컬렉션 이름 상수 — 오타 방지 + 한 곳에서 관리
export const COLLECTIONS = {
  projects: 'projects', // 캠페인 단위
  assets: 'assets', // 업로드한 제품 이미지 / 스토리보드 컷
  shots: 'shots', // AI가 분해한 샷
  prompts: 'prompts', // 샷에 속한 Veo3 프롬프트 (버전)
  renderJobs: 'render_jobs', // (선택) 렌더 요청·결과
  settings: 'settings', // 브랜드 프로필 등 싱글톤 설정
};

// 브랜드 프로필 문서는 settings 컬렉션에 고정 _id로 1개만 둔다.
export const BRAND_DOC_ID = 'brand';

// 브랜드 프로필 필드 정의 (화면 폼 + 정규화 공용).
// 각 필드: key, label(화면 라벨), hint(도움말), multiline 여부
export const BRAND_FIELDS = [
  { key: 'oneLiner', label: '한 줄 정의', hint: '브랜드를 한 문장으로', multiline: true },
  { key: 'coreValues', label: '핵심 가치', hint: '쉼표/가운뎃점으로 구분', multiline: true },
  { key: 'videoTone', label: '영상 톤', hint: '영상이 풍겨야 할 분위기', multiline: true },
  { key: 'visualStyle', label: '비주얼 스타일', hint: '색감·조명·공간 느낌', multiline: true },
  { key: 'target', label: '타깃 고객', hint: '누구를 위한 영상인가', multiline: false },
  { key: 'productFeatures', label: '제품 특징', hint: '강조할 제품의 강점', multiline: true },
  { key: 'avoid', label: '피해야 할 것', hint: '브랜드가 절대 피하는 연출·표현', multiline: true },
  { key: 'keywords', label: '자주 쓰는 키워드', hint: '프롬프트에 즐겨 넣을 단어(선택)', multiline: true },
];

// 요기보 초안 — 사용자가 저장한 게 없으면 이 값이 화면에 미리 채워진다.
export const DEFAULT_BRAND = {
  oneLiner: '몸을 감싸 안는 푹신한 빈백 소파, 집에서 누리는 완벽한 휴식.',
  coreValues: '편안함 · 휴식 · 자유로운 라이프스타일 · 일상의 여유',
  videoTone: '따뜻한, 감성적, 편안한, 포근한 (자극적·차가운·과한 역동성은 지양)',
  visualStyle: '밝은 자연광, 아늑한 실내, 부드러운 색감, 미니멀하고 깔끔한 공간',
  target: '20~30대 1인가구, 집에서의 휴식을 중시하는 사람',
  productFeatures: '몸에 맞게 변형되는 푹신함, 다양한 컬러, 소파·쿠션·바디필로우 라인',
  avoid: '딱딱한 느낌, 사무적인 분위기, 과도하게 화려하거나 시끄러운 연출',
  keywords: 'cozy, relaxation, soft, warm light, home, comfort, lounging',
};

/** 클라이언트 입력을 브랜드 프로필 문서로 정규화 (허용 필드만, 문자열 trim). */
export function normalizeBrand(body = {}) {
  const out = {};
  for (const { key } of BRAND_FIELDS) {
    out[key] = String(body[key] ?? '').trim();
  }
  out.updatedAt = new Date();
  return out;
}

// 프로젝트 상태
export const PROJECT_STATUS = {
  draft: 'draft', // 작성 중
  generating: 'generating', // 프롬프트 생성 중
  review: 'review', // 검수 중
  done: 'done', // 완료
};

/**
 * 클라이언트 입력을 Project 문서로 정규화한다.
 * Phase 0에서는 메타데이터만 다룬다 (에셋·샷은 이후 Phase).
 */
export function normalizeProjectInput(body = {}) {
  const now = new Date();
  return {
    title: String(body.title || '').trim(),
    scenario: String(body.scenario || '').trim(), // 상황/시나리오 설명
    tone: String(body.tone || '').trim(), // 톤·분위기 (예: 따뜻한, 역동적인)
    target: String(body.target || '').trim(), // 타깃 (예: 20대 1인가구)
    durationSec: Number(body.durationSec) || 30, // 전체 목표 길이(초)
    aspectRatio: String(body.aspectRatio || '16:9'), // 16:9 / 9:16 / 1:1
    status: PROJECT_STATUS.draft,
    createdAt: now,
    updatedAt: now,
  };
}

// 수정 시 허용 필드만 추려낸다.
export function pickProjectPatch(body = {}) {
  const patch = {};
  const fields = ['title', 'scenario', 'tone', 'target', 'aspectRatio', 'status'];
  for (const f of fields) {
    if (body[f] !== undefined) patch[f] = typeof body[f] === 'string' ? body[f].trim() : body[f];
  }
  if (body.durationSec !== undefined) patch.durationSec = Number(body.durationSec) || 30;
  if (Object.keys(patch).length) patch.updatedAt = new Date();
  return patch;
}

// 허용 이미지 MIME
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB

/**
 * 스토리보드 컷 배열을 정규화한다.
 * 각 컷: { id, order, text, imageId }
 *  - text: 컷 설명(사람이 작성)
 *  - imageId: 이 컷에 연결할 업로드 이미지(assets) _id (선택)
 */
export function normalizeStoryboard(cuts = []) {
  if (!Array.isArray(cuts)) return [];
  return cuts
    .map((c, i) => ({
      id: String(c.id || `cut_${i + 1}`),
      order: Number(c.order ?? i + 1),
      text: String(c.text || '').trim(),
      imageId: c.imageId ? String(c.imageId) : null,
    }))
    .sort((a, b) => a.order - b.order)
    .map((c, i) => ({ ...c, order: i + 1 })); // 순번 재정렬
}
