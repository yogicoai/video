import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS } from '@/lib/models';
import { deleteImageFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// DELETE /api/assets/:assetId — 이미지 에셋 삭제 (파일 + 문서, 스토리보드 연결 해제)
export async function DELETE(_req, { params }) {
  const { assetId } = await params;
  let _id;
  try {
    _id = new ObjectId(assetId);
  } catch {
    return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });
  }

  const assetsCol = await collection(COLLECTIONS.assets);
  const asset = await assetsCol.findOne({ _id });
  if (!asset) return NextResponse.json({ error: '찾을 수 없습니다.' }, { status: 404 });

  await deleteImageFile(asset.projectId, asset.filename);
  await assetsCol.deleteOne({ _id });

  // 이 이미지를 참조하던 스토리보드 컷의 imageId 해제
  const projects = await collection(COLLECTIONS.projects);
  try {
    await projects.updateOne(
      { _id: new ObjectId(asset.projectId), 'storyboard.imageId': assetId },
      { $set: { 'storyboard.$[c].imageId': null } },
      { arrayFilters: [{ 'c.imageId': assetId }] }
    );
  } catch {
    // projectId가 ObjectId 형식이 아니거나 스토리보드 없음 — 무시
  }

  return NextResponse.json({ ok: true });
}
