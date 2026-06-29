import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { COLLECTIONS, BRAND_DOC_ID, DEFAULT_BRAND } from '@/lib/models';
import { generateIdeas } from '@/lib/anthropic';
import { getMotions } from '@/lib/higgsfield';
import { getBrandInsights } from '@/lib/brandInsights';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// GET /api/ideas — 저장된 아이디어 목록 (최신순)
export async function GET() {
  const col = await collection(COLLECTIONS.ideas);
  const ideas = await col.find({}).sort({ createdAt: -1 }).limit(60).toArray();
  return NextResponse.json({ ideas });
}

// POST /api/ideas — 브랜드+트렌드 기반 쇼츠 아이디어 생성·저장. body: { count, season, vibe, focus }
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const count = Math.min(Math.max(Number(body.count) || 5, 1), 8);

  const settings = await collection(COLLECTIONS.settings);
  const brandDoc = await settings.findOne({ _id: BRAND_DOC_ID });
  const brand = brandDoc || DEFAULT_BRAND;

  let motions = [];
  try {
    motions = await getMotions();
  } catch {
    motions = [];
  }

  // yogibo.kr/.jp 라이브 브랜드 인사이트 (캐시 사용, TTL 지나면 자동 갱신). 실패해도 진행.
  const insights = await getBrandInsights().catch(() => null);

  let ideas;
  try {
    ideas = await generateIdeas({
      brand,
      motions,
      count,
      season: String(body.season || ''),
      vibe: String(body.vibe || ''),
      focus: String(body.focus || ''),
      insights,
    });
  } catch (err) {
    console.error('[ideas] 오류:', err);
    return NextResponse.json({ error: `아이디어 생성 실패: ${err.message}` }, { status: 502 });
  }

  if (!ideas.length) {
    return NextResponse.json({ error: '생성된 아이디어가 없습니다.' }, { status: 502 });
  }

  const col = await collection(COLLECTIONS.ideas);
  const now = new Date();
  const docs = ideas.map((it) => ({ ...it, createdAt: now }));
  const result = await col.insertMany(docs);
  const saved = docs.map((d, i) => ({ _id: result.insertedIds[i], ...d }));

  return NextResponse.json({ ideas: saved });
}
