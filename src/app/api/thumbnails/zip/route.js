import { createZipStream } from '@/lib/zip';

export const runtime = 'nodejs';
export const maxDuration = 300;

// 이미지 1장 받아오기(일시 오류 대비 재시도)
async function fetchImage(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function POST(req) {
  let items;
  try {
    ({ items } = await req.json());
  } catch {
    return new Response('bad json', { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return new Response('items required', { status: 400 });
  }

  const failed = [];
  const manifest = ['경로\t컬러\t설명\t원본URL'];

  async function* entries() {
    const used = new Set();
    for (const it of items) {
      // 같은 경로가 겹치면 _2, _3 … 으로 분리
      let path = it.path;
      if (used.has(path)) {
        const dot = path.lastIndexOf('.');
        const base = dot > 0 ? path.slice(0, dot) : path;
        const ext = dot > 0 ? path.slice(dot) : '';
        let n = 2;
        while (used.has(`${base}_${n}${ext}`)) n++;
        path = `${base}_${n}${ext}`;
      }
      used.add(path);

      try {
        const data = await fetchImage(it.url);
        manifest.push([path, it.color || '', it.spec || '', it.url].join('\t'));
        yield { path, data };
      } catch (e) {
        failed.push(`${path} — ${it.url} (${e.message})`);
      }
    }

    // 목록/실패 내역을 텍스트로 동봉
    const lines = [
      `요기보 자사몰 썸네일 이미지 모음`,
      `생성 시각: ${new Date().toLocaleString('ko-KR')}`,
      `총 ${manifest.length - 1}장${failed.length ? ` (실패 ${failed.length}장)` : ''}`,
      '',
      ...manifest,
    ];
    if (failed.length) lines.push('', '[다운로드 실패]', ...failed);
    yield { path: '목록.txt', data: Buffer.from('﻿' + lines.join('\r\n'), 'utf8') };
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `yogibo_thumbnails_${stamp}.zip`;

  return new Response(createZipStream(entries()), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
    },
  });
}
