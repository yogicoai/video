import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// 전역 컬러칩 팔레트 — 요기보 패브릭 컬러의 단일 소스.
// 제품 색상행은 여기서 칩을 선택해 name/hex를 받아간다(제품 문서에는 스냅샷으로 저장).
// productsStore와 동일한 이중모드: Mongo 설정 시 Mongo, 아니면 data/colorchips.json 파일.

const FILE = path.join(process.cwd(), 'data', 'colorchips.json');

// 빌드 타임 스냅샷 — Vercel 서버리스 번들 포함 보장 (fs 동적 읽기 실패 시 폴백)
import CHIPS_SNAPSHOT from '../../data/colorchips.json';

// 시드 = 요기보 공식 컬러칩 — hex는 사이트 360 실측값 기준 (2026-07 캘리브레이션, 스위트오렌지·그레이 2종·줄라는 CSS값 유지)
const SEED = [
  { id: 'cherry_red', name: '체리레드', hex: '#980224', note: '스탠다드' },
  { id: 'wine_burgundy', name: '와인버건디', hex: '#7A031F', note: '스탠다드' },
  { id: 'sweet_orange', name: '스위트오렌지', hex: '#EE780C', note: '스탠다드' },
  { id: 'rose_pink', name: '로즈핑크', hex: '#EF0066', note: '스탠다드' },
  { id: 'olive_green', name: '올리브그린', hex: '#668B01', note: '스탠다드' },
  { id: 'aqua_blue', name: '아쿠아블루', hex: '#0075BD', note: '스탠다드 · Max 10주년' },
  { id: 'navy_blue', name: '네이비블루', hex: '#1D395D', note: '스탠다드' },
  { id: 'bright_purple', name: '브라이트퍼플', hex: '#644D9A', note: '스탠다드' },
  { id: 'deep_purple', name: '딥퍼플', hex: '#5F2A38', note: '스탠다드' },
  { id: 'choco_brown', name: '초코브라운', hex: '#5D4131', note: '스탠다드' },
  { id: 'light_gray', name: '라이트그레이', hex: '#E5DED3', note: '스탠다드' },
  { id: 'dark_gray', name: '다크그레이', hex: '#615F5F', note: '스탠다드' },
  { id: 'living_coral', name: '리빙코랄', hex: '#EA3D19', note: '스탠다드' },
  { id: 'blossom_pink', name: '블라썸핑크', hex: '#E2A8BE', note: '스탠다드' },
  { id: 'bright_yellow', name: '브라이트옐로우', hex: '#EBCD00', note: '스탠다드' },
  { id: 'lavender_purple', name: '라벤더퍼플', hex: '#CDA7DB', note: '스탠다드' },
  { id: 'fresh_mint', name: '프레시민트', hex: '#B0EEE7', note: '스탠다드' },
  { id: 'pastel_blue', name: '파스텔블루', hex: '#BEDDEF', note: '스탠다드' },
  { id: 'avocado_green', name: '아보카도그린', hex: '#88BCA4', note: '스탠다드' },
  { id: 'stone', name: '스톤', hex: '#98ABB6', note: '줄라(아웃도어)' },
  { id: 'sky', name: '스카이', hex: '#2BB3E2', note: '줄라(아웃도어)' },
  { id: 'grass', name: '그래스', hex: '#BED12B', note: '줄라(아웃도어)' },
  { id: 'citrus', name: '시트러스', hex: '#FB6D21', note: '줄라(아웃도어)' },
  { id: 'ocean', name: '오션', hex: '#164690', note: '줄라(아웃도어)' },
  { id: 'onyx', name: '오닉스', hex: '#3A5657', note: '줄라(아웃도어)' },
];

function mongoConfigured() {
  const uri = process.env.MONGODB_URI || '';
  return /^mongodb(\+srv)?:\/\//.test(uri) && !uri.includes('<');
}

function readFileStore() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    // Vercel 등 파일 미접근 환경 → 커밋 스냅샷 폴백
    if (Array.isArray(CHIPS_SNAPSHOT) && CHIPS_SNAPSHOT.length) return structuredClone(CHIPS_SNAPSHOT);
    writeFileStore(SEED);
    return [...SEED];
  }
}

function writeFileStore(chips) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(chips, null, 2), 'utf8');
  } catch (e) {
    console.warn('colorChips: file write skipped (read-only fs?)', e.message);
  }
}

async function mongoCol() {
  const { collection } = await import('@/lib/db');
  return collection('colorchips');
}

function normalize(body) {
  return (Array.isArray(body) ? body : [])
    .filter((c) => c && String(c.name || '').trim())
    .map((c) => ({
      id: c.id || randomUUID().slice(0, 8),
      name: String(c.name).trim(),
      hex: String(c.hex || '').trim(),
      note: String(c.note || '').trim(),
    }));
}

export async function listChips() {
  if (mongoConfigured()) {
    const col = await mongoCol();
    if ((await col.countDocuments()) === 0) await col.insertMany(SEED.map((c) => ({ ...c })));
    const docs = await col.find({}).toArray();
    return docs.map((d) => ({ id: d.id, name: d.name, hex: d.hex || '', note: d.note || '' }));
  }
  return readFileStore();
}

// 팔레트는 소량 고정 데이터 → 통째로 교체 저장이 가장 단순·안전
export async function saveChips(body) {
  const chips = normalize(body);
  if (mongoConfigured()) {
    const col = await mongoCol();
    await col.deleteMany({});
    if (chips.length) await col.insertMany(chips.map((c) => ({ ...c })));
    return chips;
  }
  writeFileStore(chips);
  return chips;
}
