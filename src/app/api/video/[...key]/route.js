import { ftpUrlFromKey } from '@/lib/ftp';

export const dynamic = 'force-dynamic';

// GET /api/video/<projectId>/renders/<file>.jpg
// cafe24에 .jpg로 위장 저장된 영상을 받아 video/mp4로 변환해 서빙한다.
// (cafe24가 .mp4 업로드를 막아서, 저장은 .jpg / 재생은 여기서 mp4로)
export async function GET(req, { params }) {
  const { key } = await params;
  const path = (Array.isArray(key) ? key.join('/') : String(key || '')).replace(/^\/+/, '');
  if (!path) return new Response('not found', { status: 404 });

  const src = ftpUrlFromKey(path);

  // Range 요청 전달(영상 탐색 지원)
  const range = req.headers.get('range');
  const upstream = await fetch(src, { headers: range ? { range } : {} });
  if (!upstream.ok && upstream.status !== 206) {
    return new Response('upstream error', { status: 502 });
  }

  const headers = new Headers();
  headers.set('Content-Type', 'video/mp4');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=86400');
  const len = upstream.headers.get('content-length');
  if (len) headers.set('Content-Length', len);
  const cr = upstream.headers.get('content-range');
  if (cr) headers.set('Content-Range', cr);

  return new Response(upstream.body, { status: upstream.status, headers });
}
