// 컬렉션 이름 상수 — 오타 방지 + 한 곳에서 관리
export const COLLECTIONS = {
  projects: 'projects', // 캠페인 단위
  assets: 'assets', // 업로드한 제품 이미지 / 스토리보드 컷
  shots: 'shots', // AI가 분해한 샷
  prompts: 'prompts', // 샷에 속한 Veo3 프롬프트 (버전)
  renderJobs: 'render_jobs', // (선택) 렌더 요청·결과
};

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
