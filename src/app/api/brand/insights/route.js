import { NextResponse } from 'next/server';
import { getBrandInsights, peekBrandInsights } from '@/lib/brandInsights';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 웹검색 + 요약에 시간이 걸릴 수 있음

// GET /api/brand/insights — 캐시된 인사이트만 반환(웹검색 트리거 안 함)
export async function GET() {
  const insights = await peekBrandInsights().catch(() => null);
  return NextResponse.json({ insights });
}

// POST /api/brand/insights — yogibo.kr/.jp 강제 재검색·갱신
export async function POST() {
  try {
    const insights = await getBrandInsights({ refresh: true });
    if (!insights) {
      return NextResponse.json({ error: '브랜드 인사이트를 가져오지 못했습니다.' }, { status: 502 });
    }
    return NextResponse.json({ insights });
  } catch (err) {
    console.error('[brand/insights] 갱신 오류:', err);
    return NextResponse.json({ error: `갱신 실패: ${err.message}` }, { status: 502 });
  }
}
