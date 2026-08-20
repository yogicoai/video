// 재사용 FTP 업로드 — node ftp_up.mjs <localPath> <remoteFilename> [remoteDir]
// 기본 remoteDir = web/img/api/modal
import { Client } from 'basic-ftp';
import fs from 'fs';
import path from 'path';

const ROOT = 'C:/Users/Yogibo Design/Desktop/youtube';
const [localPath, remoteFilename, remoteDirArg] = process.argv.slice(2);
if (!localPath || !remoteFilename) {
  console.error('사용법: node ftp_up.mjs <localPath> <remoteFilename> [remoteDir=web/img/api/modal]');
  process.exit(1);
}
const REMOTE = (remoteDirArg || 'web/img/api/modal').replace(/^\/|\/$/g, '');

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
const host = (env.YOGIBO_FTP || '').replace(/^(https?:\/\/|ftp:\/\/)/, '').replace(/\/$/, '');
const base = (env.FTP_PUBLIC_BASE || `http://${host}/`).replace(/\/$/, '');

const client = new Client(30000);
try {
  await client.access({ host, user: env.YOGIBO_FTP_ID, password: env.YOGIBO_FTP_PW, secure: false });
  await client.ensureDir(REMOTE);
  await client.uploadFrom(localPath, remoteFilename);
  console.log(`${base}/${REMOTE}/${remoteFilename}`);
} catch (e) {
  console.error('FTP_ERROR:', e.message);
  process.exitCode = 1;
} finally {
  client.close();
}
