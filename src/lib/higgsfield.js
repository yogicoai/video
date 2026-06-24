import { createHiggsfieldClient } from '@higgsfield/client/v2';

// Higgsfield DoP image-to-video — 역동적 카메라 모션 프리셋이 강점.
const BASE = 'https://platform.higgsfield.ai';
// 비용 안전: 기본은 최저가 dop-lite. 품질 더 원하면 .env로 dop-turbo/dop-standard.
const HF_MODEL = process.env.HIGGSFIELD_MODEL || 'dop-lite'; // dop-lite < dop-turbo < dop-standard

function creds() {
  const id = process.env.HIGGSFIELD_KEY_ID;
  const secret = process.env.HIGGSFIELD_KEY_SECRET;
  if (!id || !secret) throw new Error('HIGGSFIELD_KEY_ID/SECRET가 설정되지 않았습니다 (.env.local).');
  return `${id}:${secret}`;
}

let _client = null;
function getClient() {
  if (!_client) _client = createHiggsfieldClient({ credentials: creds() });
  return _client;
}

// 모션 프리셋 목록 (크레딧 소모 없음) — UI 드롭다운용. 메모리 캐시.
let _motions = null;
export async function getMotions() {
  if (_motions) return _motions;
  const r = await fetch(`${BASE}/v1/motions`, { headers: { Authorization: `Key ${creds()}` } });
  if (!r.ok) throw new Error(`모션 목록 조회 실패: ${r.status}`);
  const data = await r.json();
  const list = Array.isArray(data) ? data : data.motions || data.data || data.items || [];
  _motions = list
    .map((m) => ({ id: m.id, name: m.name || m.title || m.id }))
    .filter((m) => m.id)
    .sort((a, b) => a.name.localeCompare(b.name));
  return _motions;
}

/**
 * Higgsfield DoP로 image-to-video 렌더 (모션 프리셋 적용).
 * @returns {Promise<{videoUrl:string, model:string}>} videoUrl = Higgsfield CDN URL
 */
export async function renderHiggsfield({ prompt, imageUrl, motionId, strength = 0.8 }) {
  if (!imageUrl) throw new Error('Higgsfield는 참조 이미지(image-to-video)가 필요합니다.');
  const client = getClient();

  const params = {
    model: HF_MODEL,
    prompt: prompt || 'cinematic product video',
    input_images: [{ type: 'image_url', image_url: imageUrl }],
  };
  if (motionId) params.motions = [{ id: motionId, strength: Number(strength) || 0.8 }];

  // 현재 API는 본문을 { params: {...} }로 감싸야 함 (SDK 0.2.1은 미반영)
  const res = await client.subscribe('/v1/image2video/dop', { input: { params }, withPolling: true });

  if (res.status === 'nsfw') throw new Error('콘텐츠가 안전필터(NSFW)로 차단됐습니다.');
  if (res.status !== 'completed') throw new Error(`Higgsfield 생성 실패 (status: ${res.status}).`);

  const url = res.video?.url;
  if (!url) throw new Error('Higgsfield 응답에 영상 URL이 없습니다.');
  return { videoUrl: url, model: HF_MODEL };
}

export { HF_MODEL };
