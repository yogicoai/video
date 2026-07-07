import { listChips, saveChips } from '@/lib/colorChips';

export const dynamic = 'force-dynamic';

// GET /api/colorchips — 팔레트 전체
export async function GET() {
  try {
    const chips = await listChips();
    return Response.json({ chips });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/colorchips — 팔레트 통째 교체 (소량 고정 데이터)
export async function PUT(req) {
  try {
    const body = await req.json();
    const chips = await saveChips(body.chips ?? body);
    return Response.json({ chips });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
