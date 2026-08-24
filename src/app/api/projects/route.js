import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { COLLECTIONS, normalizeProjectInput } from '@/lib/models';

export const dynamic = 'force-dynamic';

// GET /api/projects — 프로젝트 목록 (최신순)
export async function GET() {
  try {
    const col = await collection(COLLECTIONS.projects);
    const projects = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ projects });
  } catch (err) {
    // DB 미설정(MONGODB_URI 견본값)·연결 실패 — 화면에서 안내할 수 있게 JSON으로 돌려준다.
    console.error('[projects] DB 오류:', err.message);
    return NextResponse.json({ projects: [], error: err.message }, { status: 503 });
  }
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
