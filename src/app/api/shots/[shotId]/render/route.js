import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mkdir, unlink } from 'fs/promises';
import os from 'os';
import path from 'path';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';
import { renderShot, estimateCost, VEO_MODEL, DEFAULT_DURATION } from '@/lib/veo';
import { renderHiggsfield, HF_MODEL } from '@/lib/higgsfield';
import { uploadFile, uploadBuffer, videoProxyUrl } from '@/lib/ftp';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 렌더는 수 분 소요 (Vercel Hobby 최대 300초)

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

async function getRefAsset(shot) {
  if (!shot.referenceImageId) return null;
  const assets = await collection(COLLECTIONS.assets);
  return assets.findOne({ _id: new ObjectId(shot.referenceImageId) }).catch(() => null);
}

// GET — 예상 비용(Veo) + 기존 렌더 결과
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
    engine: shot.engine || null,
  });
}

// POST — 이 샷을 렌더링. body: { engine: 'veo'|'higgsfield', motionId, strength }
export async function POST(req, { params }) {
  const { shotId } = await params;
  const _id = toId(shotId);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const engine = body.engine === 'higgsfield' ? 'higgsfield' : 'veo';

  const shots = await collection(COLLECTIONS.shots);
  const shot = await shots.findOne({ _id });
  if (!shot) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });
  if (!shot.approved) {
    return NextResponse.json({ error: '승인된 샷만 렌더할 수 있습니다.' }, { status: 400 });
  }

  const projects = await collection(COLLECTIONS.projects);
  const project = await projects.findOne({ _id: new ObjectId(shot.projectId) });
  const aspectRatio = project?.aspectRatio === '9:16' ? '9:16' : '16:9';

  const asset = await getRefAsset(shot);
  const subpath = `${shot.projectId}/renders`;
  const fileName = `${shotId}-${Date.now()}.jpg`; // cafe24 우회용 .jpg 위장
  const tmpDir = path.join(os.tmpdir(), 'videogen');

  const jobs = await collection(COLLECTIONS.renderJobs);
  const now = new Date();
  const meta =
    engine === 'higgsfield'
      ? { model: HF_MODEL, motionId: body.motionId || null }
      : { model: VEO_MODEL, estimate: estimateCost(DEFAULT_DURATION) };
  const { insertedId: jobId } = await jobs.insertOne({
    projectId: shot.projectId,
    shotId,
    engine,
    status: 'processing',
    ...meta,
    createdAt: now,
  });

  let videoUrl;
  try {
    if (engine === 'higgsfield') {
      // Higgsfield: 공개 이미지 URL 필요(image-to-video)
      if (!asset?.url) throw new Error('Higgsfield는 샷에 연결된 이미지가 필요합니다. 스토리보드에서 이미지를 연결하세요.');
      const { videoUrl: hfUrl } = await renderHiggsfield({
        prompt: shot.veoPrompt,
        imageUrl: asset.url,
        motionId: body.motionId,
        strength: body.strength,
      });
      // 결과 영상을 받아 cafe24에 .jpg로 재호스팅
      const r = await fetch(hfUrl);
      if (!r.ok) throw new Error(`결과 영상 다운로드 실패: ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      await uploadBuffer(subpath, fileName, buf);
      videoUrl = videoProxyUrl(subpath, fileName);
    } else {
      // Veo: 이미지 바이트를 받아 image-to-video, mp4를 /tmp에 렌더 후 cafe24 업로드
      let imageBuffer, imageMime;
      if (asset?.url) {
        try {
          const ir = await fetch(asset.url);
          if (ir.ok) {
            imageBuffer = Buffer.from(await ir.arrayBuffer());
            imageMime = asset.mimeType || 'image/jpeg';
          }
        } catch {
          /* 못 받으면 text-to-video */
        }
      }
      await mkdir(tmpDir, { recursive: true });
      const tmpPath = path.join(tmpDir, fileName);
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
        await uploadFile(subpath, fileName, tmpPath);
        videoUrl = videoProxyUrl(subpath, fileName);
      } finally {
        await unlink(tmpPath).catch(() => {});
      }
    }
  } catch (err) {
    console.error('[render] 오류:', err);
    await jobs.updateOne({ _id: jobId }, { $set: { status: 'failed', error: err.message, finishedAt: new Date() } });
    return NextResponse.json({ error: `렌더 실패: ${err.message}` }, { status: 502 });
  }

  await jobs.updateOne({ _id: jobId }, { $set: { status: 'done', videoUrl, finishedAt: new Date() } });
  await shots.updateOne({ _id }, { $set: { videoUrl, engine, renderedAt: new Date() } });

  return NextResponse.json({ videoUrl, engine });
}
