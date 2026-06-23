import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { COLLECTIONS, normalizeProjectInput } from '@/lib/models';

export const dynamic = 'force-dynamic';

// GET /api/projects — 프로젝트 목록 (최신순)
export async function GET() {
  const col = await collection(COLLECTIONS.projects);
  const projects = await col.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ projects });
}

// POST /api/projects — 새 프로젝트 생성
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const doc = normalizeProjectInput(body);

  if (!doc.title) {
    return NextResponse.json({ error: '프로젝트 제목은 필수입니다.' }, { status: 400 });
  }

  const col = await collection(COLLECTIONS.projects);
  const { insertedId } = await col.insertOne(doc);
  return NextResponse.json({ project: { _id: insertedId, ...doc } }, { status: 201 });
}
