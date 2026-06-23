import { randomUUID } from 'crypto';
import path from 'path';
import { uploadBuffer, deleteRemote } from '@/lib/ftp';

// 이미지·영상은 로컬 디스크가 아니라 Cafe24 FTP(/web/img/ai/<projectId>)에 저장한다.
// → 서버리스(Vercel)·지속형 서버 어디서든 동작.

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

/**
 * File(웹 표준) 객체를 FTP에 저장하고 메타데이터를 반환한다.
 * @returns { filename, url, size, mimeType, originalName }
 */
export async function saveImageFile(projectId, file) {
  const ext = EXT_BY_MIME[file.type] || path.extname(file.name) || '.bin';
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadBuffer(projectId, filename, buffer);

  return {
    filename,
    url, // FTP 공개 URL (절대경로)
    size: buffer.length,
    mimeType: file.type,
    originalName: file.name,
  };
}

/** FTP에 저장된 이미지 삭제 */
export async function deleteImageFile(projectId, filename) {
  await deleteRemote(projectId, path.basename(filename || ''));
}
