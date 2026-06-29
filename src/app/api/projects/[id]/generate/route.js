import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS, BRAND_DOC_ID, DEFAULT_BRAND, PROJECT_STATUS } from '@/lib/models';
import { generateShots } from '@/lib/anthropic';
import { getMotions, resolveMotionId } from '@/lib/higgsfield';
import { getBrandInsights } from '@/lib/brandInsights';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Claude 생성에 시간이 걸릴 수 있음

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// 수동 입력 샷 정규화 (Claude 없이 직접 저장할 때). 모션 이름→id 매핑 + 이미지 검증.
function normalizeManualShots(rawShots, assets, motions) {
  const validIds = new Set(assets.map((a) => String(a._id)));
  return rawShots
    .map((s, i) => {
      const recName = String(s.recommendedMotion || '');
      return {
        order: Number(s.order ?? i + 1),
        title: String(s.title || `샷 ${i + 1}`),
        description: String(s.description || ''),
        cameraMovement: String(s.cameraMovement || ''),
        veoPrompt: String(s.veoPrompt || ''),
        higgsfieldPrompt: String(s.higgsfieldPrompt || ''),
        recommendedMotion: recName,
        recommendedMotionId: s.recommendedMotionId || resolveMotionId(recName, motions),
        negativePrompt: String(s.negativePrompt || ''),
        durationSec: Number(s.durationSec) || 5,
        referenceImageId: validIds.has(String(s.referenceImageId)) ? String(s.referenceImageId) : null,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
}

// POST /api/projects/:id/generate
//  - body.shots 배열이 있으면: Claude 없이 그 샷을 그대로 저장(수동 입력)
//  - 없으면: 브랜드+시나리오+이미지+스토리보드 → Claude로 생성
export async function POST(req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const manualShots = Array.isArray(body.shots) && body.shots.length ? body.shots : null;

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

  // Higgsfield 모션 프리셋 목록 (모션 이름→id 매핑용). 실패해도 진행.
  let motions = [];
  try {
    motions = await getMotions();
  } catch {
    motions = [];
  }

  // 2. 샷 확보 — 수동 입력 우선, 없으면 Claude
  let shots;
  if (manualShots) {
    shots = normalizeManualShots(manualShots, assets, motions);
  } else {
    // yogibo.kr/.jp 라이브 브랜드 인사이트 (캐시). 수동 입력일 땐 불필요하므로 Claude 분기에서만.
    const insights = await getBrandInsights().catch(() => null);
    try {
      shots = await generateShots({ project, brand, assets, storyboard, motions, insights });
    } catch (err) {
      console.error('[generate] Claude 오류:', err);
      return NextResponse.json({ error: `프롬프트 생성 실패: ${err.message}` }, { status: 502 });
    }
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
