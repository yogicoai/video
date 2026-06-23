import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// 업로드 루트: public/uploads/<projectId>/<uuid.ext>
// public 아래에 두면 /uploads/... 정적 경로로 바로 서빙된다.
const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

/**
 * File(웹 표준) 객체를 디스크에 저장하고 메타데이터를 반환한다.
 * @returns { filename, url, size, mimeType, originalName }
 */
export async function saveImageFile(projectId, file) {
  const dir = path.join(UPLOAD_ROOT, projectId);
  await mkdir(dir, { recursive: true });

  const ext = EXT_BY_MIME[file.type] || path.extname(file.name) || '.bin';
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    filename,
    url: `/uploads/${projectId}/${filename}`,
    size: buffer.length,
    mimeType: file.type,
    originalName: file.name,
  };
}

/** 저장된 파일을 삭제한다. url 또는 projectId+filename으로. */
export async function deleteImageFile(projectId, filename) {
  if (!projectId || !filename) return;
  // 경로 탈출 방지
  const safe = path.basename(filename);
  try {
    await unlink(path.join(UPLOAD_ROOT, projectId, safe));
  } catch {
    // 이미 없으면 무시
  }
}
