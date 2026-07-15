import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { matchProduct, materialsFor } from '@/lib/sizeChart';

// 제품 레지스트리 저장소 — Mongo가 설정돼 있으면 Mongo, 아니면 로컬 JSON 파일.
// (.env.local의 MONGODB_URI가 플레이스홀더인 환경 대응. Vercel에서 쓰기가 필요해지면 실제 Atlas URI만 넣으면 됨)

const FILE = path.join(process.cwd(), 'data', 'products.json');

// 빌드 타임 스냅샷 — 정적 import라서 Vercel 서버리스 번들에 반드시 포함됨.
// (fs 동적 경로 읽기는 Vercel에서 번들 누락 → ENOENT → 시드 4종 폴백되는 사고가 있었음, 2026-07-07)
import PRODUCTS_SNAPSHOT from '../../data/products.json';

const SEED = [
  {
    id: 'max',
    name: 'Yogibo Max',
    category: '빈백 소파',
    colors: [{ color: '아쿠아블루', hex: '#0081CC', sprite360: '', elementId: 'c329fc5b-5283-4821-99e6-ddba2bd741c8', elementName: 'yogibo-max-aqua' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a large bean bag sofa long enough for an adult to lie down on (about 170cm)',
    notes: '메인 라운지. 가족 CF: 임신기 쉼 → 아기 라운저 → 엔딩. 10주년 아쿠아 색상.',
    usedIn: ['가족 CF CUT1-4', 'CUT7', 'CUT11'],
  },
  {
    id: 'support',
    name: 'Yogibo Support',
    category: '서포트 쿠션',
    colors: [{ color: '그린', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/suport/%EC%9A%94%EA%B8%B0%EB%B3%B4_%EC%84%9C%ED%8F%AC%ED%8A%B8_29_green.jpg', elementId: 'fd32ee39-f00e-491c-857b-d132cbb87481', elementName: 'yogibo-support-green' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: "a U-shaped armrest cushion that wraps around an adult's lower back, armrests about hip-height when seated",
    notes: 'U자 팔걸이. 육아 서포트 — 엄마가 안에 앉아 아기 안는 구도(가족 CF CUT6). 360 스프라이트 44프레임.',
    usedIn: ['가족 CF CUT6'],
  },
  {
    id: 'moonpillow',
    name: '메가 문필로우',
    category: '필로우',
    colors: [{ color: '올리브 그린(리컬러)', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/pillow/%EB%A9%94%EA%B0%80%EB%AC%B8%ED%95%84%EB%A1%9C%EC%9A%B0_30.jpg', elementId: '432687a2-bec1-487d-8482-5f522d250fa0', elementName: 'yogibo-moonpillow-olive' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: "a crescent moon-shaped pillow large enough to cradle a baby's head in its curve",
    notes: '초승달 수유/목베개. 원본 스프라이트는 아쿠아블루 — 올리브로 HSV 리컬러 후 락. 색상 9종 라인업.',
    usedIn: ['가족 CF CUT7'],
  },
  {
    id: 'mate-yelly',
    name: '메이트 옐리',
    category: '메이트(인형)',
    colors: [{ color: '베이지+오렌지', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/mate/%EC%98%90%EB%A6%AC_28.jpg', elementId: 'cd0310ab-4858-4aff-b523-d1cfcca12dfe', elementName: 'yogibo-mate-yelly' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a plush elephant toy about the size a baby can hug (roughly 30-40cm)',
    notes: '코끼리 플러시. 오렌지 귀 안감·다크그레이 발바닥. 아기 장난감 컷(가족 CF CUT7 전경·CUT8).',
    usedIn: ['가족 CF CUT7', 'CUT8'],
  },
];

// Mongo URI가 실제 값인지 (플레이스홀더/미설정이면 파일 모드)
function mongoConfigured() {
  // 제품/컬러칩 데이터는 git 커밋 JSON이 단일 소스 (로컬 편집 → 커밋 → 배포 반영).
  // Vercel에 MONGODB_URI가 있어도 기본은 파일/스냅샷 — Mongo는 PRODUCTS_USE_MONGO=1로 명시할 때만.
  if (process.env.PRODUCTS_USE_MONGO !== '1') return false;
  const uri = process.env.MONGODB_URI || '';
  return /^mongodb(\+srv)?:\/\//.test(uri) && !uri.includes('<');
}

function readFileStore() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    // Vercel 등 파일 미접근 환경 → 빌드에 포함된 커밋 스냅샷으로 폴백 (읽기 전용 서빙)
    if (Array.isArray(PRODUCTS_SNAPSHOT) && PRODUCTS_SNAPSHOT.length) {
      return structuredClone(PRODUCTS_SNAPSHOT);
    }
    const now = new Date().toISOString();
    const seeded = SEED.map((p) => ({ ...p, createdAt: now, updatedAt: now }));
    writeFileStore(seeded);
    return seeded;
  }
}

function writeFileStore(products) {
  // Vercel 서버리스는 읽기 전용 FS — 쓰기 실패가 조회까지 500내지 않게 흡수
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (e) {
    console.warn('productsStore: file write skipped (read-only fs?)', e.message);
  }
}

async function mongoCol() {
  const { collection } = await import('@/lib/db');
  return collection('products');
}

export async function listProducts() {
  if (mongoConfigured()) {
    const col = await mongoCol();
    if ((await col.countDocuments()) === 0) {
      const now = new Date();
      await col.insertMany(SEED.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
    }
    const docs = await col.find({}).sort({ createdAt: 1 }).toArray();
    return docs.map((d) => ({ ...d, id: d.id || String(d._id), _id: undefined }));
  }
  return readFileStore();
}

export async function createProduct(body) {
  const now = new Date().toISOString();
  // 공식 차트에서 이름 인식 → 카테고리·스펙(cm)·소재 노트 자동 입력
  const chart = matchProduct(body.name);
  const specEmpty = !body.spec || !(body.spec.w || body.spec.h || body.spec.d);
  const doc = {
    id: randomUUID().slice(0, 8),
    name: String(body.name),
    category: String(body.category || (chart ? chart.category : '')),
    colors: Array.isArray(body.colors) ? body.colors : [],
    spec: specEmpty && chart
      ? { w: String(chart.w), d: String(chart.d), h: String(chart.h), weight: chart.kg != null ? String(chart.kg) : '' }
      : (body.spec || { w: '', h: '', d: '', weight: '' }),
    scalePrompt: String(body.scalePrompt || (chart && chart.scale) || ''),
    notes: String(body.notes || (chart ? [chart.en, materialsFor(chart), chart.dir].filter(Boolean).join(' · ') : '')),
    usedIn: Array.isArray(body.usedIn) ? body.usedIn : [],
    createdAt: now,
    updatedAt: now,
  };
  if (mongoConfigured()) {
    const col = await mongoCol();
    await col.insertOne({ ...doc });
    return doc;
  }
  const products = readFileStore();
  products.push(doc);
  writeFileStore(products);
  return doc;
}

export async function updateProduct(id, body) {
  const allowed = ['name', 'category', 'colors', 'spec', 'scalePrompt', 'notes', 'usedIn', 'usage'];
  if (mongoConfigured()) {
    const col = await mongoCol();
    const $set = { updatedAt: new Date().toISOString() };
    for (const k of allowed) if (k in body) $set[k] = body[k];
    await col.updateOne({ id }, { $set });
    return col.findOne({ id });
  }
  const products = readFileStore();
  const idx = products.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  for (const k of allowed) if (k in body) products[idx][k] = body[k];
  products[idx].updatedAt = new Date().toISOString();
  writeFileStore(products);
  return products[idx];
}

export async function deleteProduct(id) {
  if (mongoConfigured()) {
    const col = await mongoCol();
    await col.deleteOne({ id });
    return true;
  }
  const products = readFileStore().filter((p) => p.id !== id);
  writeFileStore(products);
  return true;
}
