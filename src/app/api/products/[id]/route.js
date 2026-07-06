import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

// PUT /api/products/:id — 제품 정보 수정 (프론트에서 채워나가기)
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const product = await updateProduct(id, body);
    if (!product) return NextResponse.json({ error: '제품을 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// DELETE /api/products/:id
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
