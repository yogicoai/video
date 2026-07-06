import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';

export const dynamic = 'force-dynamic';

const COL = 'products';

// PUT /api/products/:id — 제품 정보 수정 (프론트에서 채워나가기)
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const allowed = ['name', 'category', 'colors', 'spec', 'scalePrompt', 'notes', 'usedIn'];
  const $set = { updatedAt: new Date() };
  for (const k of allowed) if (k in body) $set[k] = body[k];

  const col = await collection(COL);
  await col.updateOne({ _id: new ObjectId(id) }, { $set });
  const product = await col.findOne({ _id: new ObjectId(id) });
  return NextResponse.json({ product });
}

// DELETE /api/products/:id
export async function DELETE(req, { params }) {
  const { id } = await params;
  const col = await collection(COL);
  await col.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
