import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';

export const dynamic = 'force-dynamic';

// PATCH /api/shots/:shotId — 프롬프트 편집 / 승인 토글
export async function PATCH(req, { params }) {
  const { shotId } = await params;
  let _id;
  try {
    _id = new ObjectId(shotId);
  } catch {
    return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const patch = {};
  for (const f of ['title', 'description', 'cameraMovement', 'veoPrompt', 'higgsfieldPrompt', 'negativePrompt', 'referenceImageId']) {
    if (typeof body[f] === 'string') patch[f] = body[f];
  }
  if (body.durationSec !== undefined) patch.durationSec = Number(body.durationSec) || 5;
  if (typeof body.approved === 'boolean') patch.approved = body.approved;
  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: '변경할 내용이 없습니다.' }, { status: 400 });
  }

  const shots = await collection(COLLECTIONS.shots);
  const result = await shots.findOneAndUpdate(
    { _id },
    { $set: patch },
    { returnDocument: 'after' }
  );
  if (!result) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ shot: result });
}
