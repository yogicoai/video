import { NextResponse } from 'next/server';
import { listProducts, createProduct } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

// GET /api/products — 제품 레지스트리 목록 (비어 있으면 검증된 4종 자동 시드)
export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// POST /api/products — 제품 추가
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!body.name) return NextResponse.json({ error: '제품명은 필수입니다.' }, { status: 400 });
    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
