import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mkdir } from 'fs/promises';
import path from 'path';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';
import { renderShot, estimateCost, VEO_MODEL, DEFAULT_DURATION } from '@/lib/veo';

export const dynamic = 'force-dynamic';
export const maxDuration = 600; // Veo 렌더는 수 분 소요

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

// POST — 이 샷을 Veo로 렌더링
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

  // 참조 이미지 경로(있으면 image-to-video)
  let imageAbsPath, imageMime;
  if (shot.referenceImageId) {
    const assets = await collection(COLLECTIONS.assets);
    const asset = await assets.findOne({ _id: new ObjectId(shot.referenceImageId) }).catch(() => null);
    if (asset) {
      imageAbsPath = path.join(process.cwd(), 'public', 'uploads', shot.projectId, asset.filename);
      imageMime = asset.mimeType;
    }
  }

  // 출력 경로
  const renderDir = path.join(process.cwd(), 'public', 'uploads', shot.projectId, 'renders');
  await mkdir(renderDir, { recursive: true });
  const fileName = `${shotId}-${Date.now()}.mp4`;
  const outPath = path.join(renderDir, fileName);
  const videoUrl = `/uploads/${shot.projectId}/renders/${fileName}`;

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

  try {
    await renderShot({
      prompt: shot.veoPrompt,
      negativePrompt: shot.negativePrompt,
      imageAbsPath,
      imageMime,
      aspectRatio,
      durationSeconds: DEFAULT_DURATION,
      outPath,
    });
  } catch (err) {
    console.error('[render] Veo 오류:', err);
    await jobs.updateOne({ _id: jobId }, { $set: { status: 'failed', error: err.message, finishedAt: new Date() } });
    return NextResponse.json({ error: `렌더 실패: ${err.message}` }, { status: 502 });
  }

  await jobs.updateOne({ _id: jobId }, { $set: { status: 'done', videoUrl, finishedAt: new Date() } });
  await shots.updateOne({ _id }, { $set: { videoUrl, renderedAt: new Date() } });

  return NextResponse.json({ videoUrl, estimate });
}
