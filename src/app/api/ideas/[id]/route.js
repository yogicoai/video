import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';

export const dynamic = 'force-dynamic';

// DELETE /api/ideas/:id — 아이디어 삭제
export async function DELETE(_req, { params }) {
  const { id } = await params;
  let _id;
  try {
    _id = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });
  }
  const col = await collection(COLLECTIONS.ideas);
  const { deletedCount } = await col.deleteOne({ _id });
  if (!deletedCount) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
