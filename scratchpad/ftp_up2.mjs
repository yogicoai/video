// 재사용 FTP 업로드 (이 프로젝트의 .env.local 사용) — node scratchpad/ftp_up2.mjs <localPath> <remoteFilename> [remoteDir=web/img/api/modal]
import { Client } from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const [localPath, remoteFilename, remoteDirArg] = process.argv.slice(2);
if (!localPath || !remoteFilename) {
  console.error('usage: node ftp_up2.mjs <localPath> <remoteFilename> [remoteDir]');
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
const client = new Client(60000);
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
