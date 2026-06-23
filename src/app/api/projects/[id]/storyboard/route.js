import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS, normalizeStoryboard } from '@/lib/models';

export const dynamic = 'force-dynamic';

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// PUT /api/projects/:id/storyboard — 스토리보드 전체 교체
// body: { storyboard: [{ id, order, text, imageId }] }
export async function PUT(req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const storyboard = normalizeStoryboard(body.storyboard);

  const projects = await collection(COLLECTIONS.projects);
  const result = await projects.findOneAndUpdate(
    { _id },
    { $set: { storyboard, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  if (!result) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });

  return NextResponse.json({ storyboard: result.storyboard });
}
