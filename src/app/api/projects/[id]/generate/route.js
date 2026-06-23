import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS, BRAND_DOC_ID, DEFAULT_BRAND, PROJECT_STATUS } from '@/lib/models';
import { generateShots } from '@/lib/anthropic';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Claude 생성에 시간이 걸릴 수 있음

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// POST /api/projects/:id/generate — 브랜드+시나리오+이미지+스토리보드 → 샷별 Veo3 프롬프트 생성
export async function POST(_req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  // 1. 데이터 모으기
  const projects = await collection(COLLECTIONS.projects);
  const project = await projects.findOne({ _id });
  if (!project) return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });

  const settings = await collection(COLLECTIONS.settings);
  const brandDoc = await settings.findOne({ _id: BRAND_DOC_ID });
  const brand = brandDoc || DEFAULT_BRAND;

  const assetsCol = await collection(COLLECTIONS.assets);
  const assets = await assetsCol.find({ projectId: id }).sort({ createdAt: 1 }).toArray();

  const storyboard = project.storyboard || [];

  // 2. Claude 호출
  let shots;
  try {
    shots = await generateShots({ project, brand, assets, storyboard });
  } catch (err) {
    console.error('[generate] Claude 오류:', err);
    return NextResponse.json(
      { error: `프롬프트 생성 실패: ${err.message}` },
      { status: 502 }
    );
  }

  if (!shots.length) {
    return NextResponse.json({ error: '생성된 샷이 없습니다.' }, { status: 502 });
  }

  // 3. 기존 샷 교체 후 저장
  const shotsCol = await collection(COLLECTIONS.shots);
  await shotsCol.deleteMany({ projectId: id });
  const now = new Date();
  const docs = shots.map((s) => ({ projectId: id, ...s, approved: false, createdAt: now }));
  await shotsCol.insertMany(docs);

  // 4. 프로젝트 상태 갱신
  await projects.updateOne(
    { _id },
    { $set: { status: PROJECT_STATUS.review, updatedAt: now } }
  );

  const saved = await shotsCol.find({ projectId: id }).sort({ order: 1 }).toArray();
  return NextResponse.json({ shots: saved });
}

// GET /api/projects/:id/generate — 저장된 샷 목록
export async function GET(_req, { params }) {
  const { id } = await params;
  if (!toId(id)) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const shotsCol = await collection(COLLECTIONS.shots);
  const shots = await shotsCol.find({ projectId: id }).sort({ order: 1 }).toArray();
  return NextResponse.json({ shots });
}
