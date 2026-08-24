import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { COLLECTIONS, BRAND_DOC_ID, DEFAULT_BRAND, normalizeBrand } from '@/lib/models';

export const dynamic = 'force-dynamic';

// GET /api/brand — 저장된 브랜드 프로필 (없으면 요기보 초안 + isDefault 플래그)
export async function GET() {
  let doc = null;
  try {
    const col = await collection(COLLECTIONS.settings);
    doc = await col.findOne({ _id: BRAND_DOC_ID });
  } catch (err) {
    // DB 미설정/연결 실패 — 기본 프로필로 화면은 뜨게 하고 error로 알린다 (저장은 불가).
    console.error('[brand] DB 오류:', err.message);
    return NextResponse.json({ brand: DEFAULT_BRAND, isDefault: true, error: err.message });
  }
  if (!doc) {
    return NextResponse.json({ brand: DEFAULT_BRAND, isDefault: true });
  }
  const { _id, ...brand } = doc;
  return NextResponse.json({ brand, isDefault: false });
}

// PUT /api/brand — 브랜드 프로필 저장(업서트)
export async function PUT(req) {
  const body = await req.json().catch(() => ({}));
  const brand = normalizeBrand(body);

  const col = await collection(COLLECTIONS.settings);
  await col.updateOne(
    { _id: BRAND_DOC_ID },
    { $set: brand },
    { upsert: true }
  );
  return NextResponse.json({ brand, isDefault: false });
}
