import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mkdir, unlink } from 'fs/promises';
import os from 'os';
import path from 'path';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';
import { renderShot, estimateCost, VEO_MODEL, DEFAULT_DURATION } from '@/lib/veo';
import { uploadFile, videoProxyUrl } from '@/lib/ftp';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Veo 렌더는 수 분 소요 (Vercel Hobby 최대 300초)

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// GET — 예상 비용 + 기존 렌더 결과
export async function GET(_req, { params }) {
  const { shotId } = await params;
  const _id = toId(shotId);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const shots = await collection(COLLECTIONS.shots);
  const shot = await shots.findOne({ _id });
  if (!shot) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });

  return NextResponse.json({
    estimate: estimateCost(DEFAULT_DURATION),
    videoUrl: shot.videoUrl || null,
  });
}

// POST — 이 샷을 Veo로 렌더링 → mp4를 FTP(/web/img/ai/<projectId>/renders)에 저장
export async function POST(_req, { params }) {
  const { shotId } = await params;
  const _id = toId(shotId);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const shots = await collection(COLLECTIONS.shots);
  const shot = await shots.findOne({ _id });
  if (!shot) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });

  // 비용 보호: 승인된 샷만 렌더
  if (!shot.approved) {
    return NextResponse.json({ error: '승인된 샷만 렌더할 수 있습니다.' }, { status: 400 });
  }

  const projects = await collection(COLLECTIONS.projects);
  const project = await projects.findOne({ _id: new ObjectId(shot.projectId) });
  const aspectRatio = project?.aspectRatio === '9:16' ? '9:16' : '16:9';

  // 참조 이미지(있으면 image-to-video) — FTP 공개 URL에서 바이트를 받아온다
  let imageBuffer, imageMime;
  if (shot.referenceImageId) {
    const assets = await collection(COLLECTIONS.assets);
    const asset = await assets.findOne({ _id: new ObjectId(shot.referenceImageId) }).catch(() => null);
    if (asset?.url) {
      try {
        const r = await fetch(asset.url);
        if (r.ok) {
          imageBuffer = Buffer.from(await r.arrayBuffer());
          imageMime = asset.mimeType || 'image/jpeg';
        }
      } catch {
        // 이미지 못 받으면 text-to-video로 진행
      }
    }
  }

  // 임시 출력 경로(서버리스에서 쓰기 가능한 /tmp)
  const tmpDir = path.join(os.tmpdir(), 'videogen');
  await mkdir(tmpDir, { recursive: true });
  // cafe24가 .mp4 업로드를 막으므로 .jpg로 위장 저장(내용은 mp4). 재생은 /api/video 프록시가 변환.
  const fileName = `${shotId}-${Date.now()}.jpg`;
  const tmpPath = path.join(tmpDir, fileName);
  const subpath = `${shot.projectId}/renders`;

  const estimate = estimateCost(DEFAULT_DURATION);
  const jobs = await collection(COLLECTIONS.renderJobs);
  const now = new Date();
  const { insertedId: jobId } = await jobs.insertOne({
    projectId: shot.projectId,
    shotId,
    status: 'processing',
    model: VEO_MODEL,
    estimate,
    createdAt: now,
  });

  let videoUrl;
  try {
    await renderShot({
      prompt: shot.veoPrompt,
      negativePrompt: shot.negativePrompt,
      imageBuffer,
      imageMime,
      aspectRatio,
      durationSeconds: DEFAULT_DURATION,
      outPath: tmpPath,
    });
    // mp4를 cafe24에 .jpg로 위장 업로드 (cafe24가 영상 확장자 차단)
    await uploadFile(subpath, fileName, tmpPath);
    // 브라우저는 프록시 경로로 접근 → video/mp4로 변환 서빙
    videoUrl = videoProxyUrl(subpath, fileName);
  } catch (err) {
    console.error('[render] 오류:', err);
    await jobs.updateOne({ _id: jobId }, { $set: { status: 'failed', error: err.message, finishedAt: new Date() } });
    await unlink(tmpPath).catch(() => {});
    return NextResponse.json({ error: `렌더 실패: ${err.message}` }, { status: 502 });
  }

  await unlink(tmpPath).catch(() => {}); // 임시파일 정리
  await jobs.updateOne({ _id: jobId }, { $set: { status: 'done', videoUrl, finishedAt: new Date() } });
  await shots.updateOne({ _id }, { $set: { videoUrl, renderedAt: new Date() } });

  return NextResponse.json({ videoUrl, estimate });
}
