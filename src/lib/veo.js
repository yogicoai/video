import { GoogleGenAI } from '@google/genai';

// 모델: Veo 3.0은 2026-06-30 종료 예정 → 기본 3.1 Fast(최소 비용, image-to-video 지원).
// .env.local의 GEMINI_VEO_MODEL로 교체 가능 (예: veo-3.1-lite-generate-preview = 더 저렴).
const MODEL = process.env.GEMINI_VEO_MODEL || 'veo-3.1-fast-generate-preview';

// 최소 비용 기본값
const DEFAULT_DURATION = Number(process.env.GEMINI_VEO_DURATION || 4); // 4 | 6 | 8
const DEFAULT_RESOLUTION = process.env.GEMINI_VEO_RESOLUTION || '720p';

// 초당 단가(USD) — 비용 표시용 추정치. 모델/해상도에 따라 다름(공식 가격 페이지 기준).
const PRICE_PER_SEC = {
  'veo-3.1-lite-generate-preview': 0.05,
  'veo-3.1-fast-generate-preview': 0.1,
  'veo-3.1-generate-preview': 0.4,
  'veo-3.0-fast-generate-001': 0.1,
  'veo-3.0-generate-001': 0.4,
};

export function estimateCost(durationSeconds = DEFAULT_DURATION, model = MODEL) {
  const per = PRICE_PER_SEC[model] ?? 0.1;
  return { usd: +(per * durationSeconds).toFixed(2), perSec: per, durationSeconds, model };
}

let ai = null;
function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY가 설정되지 않았습니다 (.env.local).');
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// durationSec → Veo 허용값(4/6/8) 중 가장 가까운 값
function snapDuration(sec) {
  const allowed = [4, 6, 8];
  return allowed.reduce((a, b) => (Math.abs(b - sec) < Math.abs(a - sec) ? b : a), 4);
}

/**
 * 샷 하나를 Veo로 렌더링하고 mp4를 outPath에 저장한다.
 * @param {object} p
 * @param {string} p.prompt
 * @param {string} [p.negativePrompt]
 * @param {Buffer} [p.imageBuffer] 참조 이미지 바이트(image-to-video). 없으면 text-to-video.
 * @param {string} [p.imageMime]
 * @param {string} [p.aspectRatio] '16:9' | '9:16'
 * @param {number} [p.durationSeconds]
 * @param {string} p.outPath 임시로 저장할 mp4 경로(이후 FTP 업로드)
 * @param {(msg:string)=>void} [p.onProgress]
 */
export async function renderShot({
  prompt,
  negativePrompt,
  imageBuffer,
  imageMime,
  aspectRatio = '16:9',
  durationSeconds = DEFAULT_DURATION,
  outPath,
  onProgress = () => {},
}) {
  const client = getAI();
  const duration = snapDuration(durationSeconds);

  const config = {
    aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    resolution: DEFAULT_RESOLUTION,
    durationSeconds: duration,
  };
  if (negativePrompt) config.negativePrompt = negativePrompt;

  const req = { model: MODEL, prompt, config };

  // image-to-video: 참조 이미지 바이트가 있으면 base64로 첨부
  if (imageBuffer) {
    req.image = { imageBytes: imageBuffer.toString('base64'), mimeType: imageMime || 'image/jpeg' };
  }

  onProgress('Veo에 생성 요청 전송…');
  let operation = await client.models.generateVideos(req);

  // 폴링 (보통 1~3분)
  let waited = 0;
  while (!operation.done) {
    await new Promise((r) => setTimeout(r, 10000));
    waited += 10;
    onProgress(`생성 중… (${waited}s 경과)`);
    operation = await client.operations.getVideosOperation({ operation });
    if (waited > 270) throw new Error('렌더 시간이 너무 오래 걸립니다(4.5분 초과). 나중에 다시 시도하세요.');
  }

  const video = operation.response?.generatedVideos?.[0]?.video;
  if (!video) throw new Error('Veo 응답에 영상이 없습니다.');

  onProgress('영상 다운로드 중…');
  await client.files.download({ file: video, downloadPath: outPath });

  return { outPath, durationSeconds: duration, model: MODEL };
}

export { MODEL as VEO_MODEL, DEFAULT_DURATION };
