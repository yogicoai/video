import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { collection } from '@/lib/db';
import { COLLECTIONS, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/models';
import { saveImageFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

function toId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// GET /api/projects/:id/assets — 프로젝트의 이미지 에셋 목록
export async function GET(_req, { params }) {
  const { id } = await params;
  if (!toId(id)) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  const col = await collection(COLLECTIONS.assets);
  const assets = await col.find({ projectId: id }).sort({ createdAt: 1 }).toArray();
  return NextResponse.json({ assets });
}

// POST /api/projects/:id/assets — 이미지 업로드(여러 장 가능, multipart/form-data, 필드명 "files")
export async function POST(req, { params }) {
  const { id } = await params;
  const _id = toId(id);
  if (!_id) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

  // 프로젝트 존재 확인
  const projects = await collection(COLLECTIONS.projects);
  const project = await projects.findOne({ _id });
  if (!project) return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });

  const form = await req.formData();
  const files = form.getAll('files').filter((f) => typeof f === 'object' && f.size !== undefined);
  if (!files.length) {
    return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
  }

  const assetsCol = await collection(COLLECTIONS.assets);
  const saved = [];
  const errors = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push(`${file.name}: 지원하지 않는 형식(${file.type || '알수없음'})`);
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(`${file.name}: 용량 초과(최대 15MB)`);
      continue;
    }
    const meta = await saveImageFile(id, file);
    const doc = {
      projectId: id,
      type: 'image',
      ...meta,
      createdAt: new Date(),
    };
    const { insertedId } = await assetsCol.insertOne(doc);
    saved.push({ _id: insertedId, ...doc });
  }

  return NextResponse.json({ assets: saved, errors }, { status: saved.length ? 201 : 400 });
}
