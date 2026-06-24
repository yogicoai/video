import { NextResponse } from 'next/server';
import { getMotions } from '@/lib/higgsfield';

export const dynamic = 'force-dynamic';

// GET /api/motions — Higgsfield 모션 프리셋 목록 (UI 드롭다운용)
export async function GET() {
  try {
    const motions = await getMotions();
    return NextResponse.json({ motions });
  } catch (err) {
    return NextResponse.json({ error: err.message, motions: [] }, { status: 502 });
  }
}
