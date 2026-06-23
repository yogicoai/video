import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS, pickProjectPatch } from '@/lib/models';

export const dynamic = 'force-dynamic';

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// GET /api/projects/:id — 단일 프로젝트
export async function GET(_req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 });

  const col = await collection(COLLECTIONS.projects);
  const project = await col.findOne({ _id });
  if (!project) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ project });
}

// PATCH /api/projects/:id — 수정
export async function PATCH(req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const patch = pickProjectPatch(body);
  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: '변경할 내용이 없습니다.' }, { status: 400 });
  }

  const col = await collection(COLLECTIONS.projects);
  const result = await col.findOneAndUpdate(
    { _id },
    { $set: patch },
    { returnDocument: 'after' }
  );
  if (!result) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ project: result });
}

// DELETE /api/projects/:id — 삭제 (연결된 에셋·샷·프롬프트도 함께 정리)
export async function DELETE(_req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 });

  const projectId = id;
  const projects = await collection(COLLECTIONS.projects);
  const { deletedCount } = await projects.deleteOne({ _id });
  if (!deletedCount) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });

  // 하위 데이터 정리 (Phase 1+ 에서 채워질 컬렉션)
  for (const name of [COLLECTIONS.assets, COLLECTIONS.shots, COLLECTIONS.prompts, COLLECTIONS.renderJobs]) {
    const col = await collection(name);
    await col.deleteMany({ projectId });
  }

  return NextResponse.json({ ok: true });
}
