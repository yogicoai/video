import { Client } from 'basic-ftp';
import { Readable } from 'stream';

// yogiChat과 동일한 Cafe24 FTP 패턴. 업로드 루트는 /web/img/ai (FTP_REMOTE_DIR로 변경 가능).
const {
  YOGIBO_FTP,
  YOGIBO_FTP_ID,
  YOGIBO_FTP_PW,
  FTP_PUBLIC_BASE,
  FTP_REMOTE_DIR = 'web/img/ai',
} = process.env;

function cleanHost(h) {
  return (h || '').replace(/^(https?:\/\/|ftp:\/\/)/, '').replace(/\/$/, '');
}

const ROOT_DIR = FTP_REMOTE_DIR.replace(/^\/|\/$/g, ''); // web/img/ai

function normSub(subpath) {
  return subpath ? subpath.replace(/^\/|\/$/g, '') : '';
}

// 공개 URL 생성: https://yogibo.openhost.cafe24.com/web/img/ai/<subpath>/<filename>
export function publicUrl(subpath, filename) {
  const base = (FTP_PUBLIC_BASE || `http://${cleanHost(YOGIBO_FTP)}/`).replace(/\/$/, '');
  const sub = normSub(subpath);
  const dir = sub ? `${ROOT_DIR}/${sub}` : ROOT_DIR;
  return `${base}/${dir}/${filename}`;
}

function remoteDir(subpath) {
  const sub = normSub(subpath);
  return sub ? `${ROOT_DIR}/${sub}` : ROOT_DIR;
}

// cafe24는 .mp4를 막고 .jpg만 허용 → 영상은 .jpg로 위장 저장한다.
// key("<subpath>/<filename.jpg>")로 실제 cafe24 공개 URL을 복원 (프록시가 사용).
export function ftpUrlFromKey(key) {
  const base = (FTP_PUBLIC_BASE || `http://${cleanHost(YOGIBO_FTP)}/`).replace(/\/$/, '');
  const clean = String(key || '').replace(/^\/+/, '');
  return `${base}/${ROOT_DIR}/${clean}`;
}

// 앱 프록시 경로 (브라우저는 이걸로 영상을 본다 → video/mp4로 변환 서빙)
export function videoProxyUrl(subpath, filename) {
  const sub = normSub(subpath);
  return `/api/video/${sub ? sub + '/' : ''}${filename}`;
}

async function withClient(fn) {
  if (!YOGIBO_FTP || !YOGIBO_FTP_ID || !YOGIBO_FTP_PW) {
    throw new Error('FTP 설정(YOGIBO_FTP/ID/PW)이 없습니다 (.env.local).');
  }
  const client = new Client(30000);
  try {
    await client.access({
      host: cleanHost(YOGIBO_FTP),
      user: YOGIBO_FTP_ID,
      password: YOGIBO_FTP_PW,
      secure: false,
    });
    return await fn(client);
  } finally {
    client.close();
  }
}

/** 버퍼를 FTP에 업로드하고 공개 URL을 반환. (이미지용) */
export async function uploadBuffer(subpath, filename, buffer) {
  await withClient(async (client) => {
    await client.ensureDir(remoteDir(subpath)); // 디렉토리 생성 + 이동
    await client.uploadFrom(Readable.from(buffer), filename);
  });
  return publicUrl(subpath, filename);
}

/** 로컬 파일을 FTP에 업로드하고 공개 URL을 반환. (렌더 mp4용) */
export async function uploadFile(subpath, filename, localPath) {
  await withClient(async (client) => {
    await client.ensureDir(remoteDir(subpath));
    await client.uploadFrom(localPath, filename);
  });
  return publicUrl(subpath, filename);
}

/** FTP에서 파일 삭제 (없으면 무시) */
export async function deleteRemote(subpath, filename) {
  if (!filename) return;
  try {
    await withClient(async (client) => {
      await client.remove(`${remoteDir(subpath)}/${filename}`);
    });
  } catch {
    // 이미 없거나 접근 불가 — 무시
  }
}
