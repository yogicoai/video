import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';

export const dynamic = 'force-dynamic';

const COL = 'products';

// 최초 조회 시 자동 시드 — 가족 CF에서 검증·락 완료된 4종
const SEED = [
  {
    name: 'Yogibo Max',
    category: '빈백 소파',
    colors: [{ color: '아쿠아블루', hex: '#0081CC', sprite360: '', elementId: 'c329fc5b-5283-4821-99e6-ddba2bd741c8', elementName: 'yogibo-max-aqua' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a large bean bag sofa long enough for an adult to lie down on (about 170cm)',
    notes: '메인 라운지. 가족 CF: 임신기 쉼 → 아기 라운저 → 엔딩. 10주년 아쿠아 색상.',
    usedIn: ['가족 CF CUT1-4', 'CUT7', 'CUT11'],
  },
  {
    name: 'Yogibo Support',
    category: '서포트 쿠션',
    colors: [{ color: '그린', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/suport/%EC%9A%94%EA%B8%B0%EB%B3%B4_%EC%84%9C%ED%8F%AC%ED%8A%B8_29_green.jpg', elementId: 'fd32ee39-f00e-491c-857b-d132cbb87481', elementName: 'yogibo-support-green' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a U-shaped armrest cushion that wraps around an adult\'s lower back, armrests about hip-height when seated',
    notes: 'U자 팔걸이. 육아 서포트 — 엄마가 안에 앉아 아기 안는 구도(가족 CF CUT6). 360 스프라이트 44프레임.',
    usedIn: ['가족 CF CUT6'],
  },
  {
    name: '메가 문필로우',
    category: '필로우',
    colors: [{ color: '올리브 그린(리컬러)', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/pillow/%EB%A9%94%EA%B0%80%EB%AC%B8%ED%95%84%EB%A1%9C%EC%9A%B0_30.jpg', elementId: '432687a2-bec1-487d-8482-5f522d250fa0', elementName: 'yogibo-moonpillow-olive' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a crescent moon-shaped pillow large enough to cradle a baby\'s head in its curve',
    notes: '초승달 수유/목베개. 원본 스프라이트는 아쿠아블루 — 올리브로 HSV 리컬러 후 락. 색상 9종 라인업.',
    usedIn: ['가족 CF CUT7'],
  },
  {
    name: '메이트 옐리',
    category: '메이트(인형)',
    colors: [{ color: '베이지+오렌지', hex: '', sprite360: 'https://yogibo.openhost.cafe24.com/web/img/360/mate/%EC%98%90%EB%A6%AC_28.jpg', elementId: 'cd0310ab-4858-4aff-b523-d1cfcca12dfe', elementName: 'yogibo-mate-yelly' }],
    spec: { w: '', h: '', d: '', weight: '' },
    scalePrompt: 'a plush elephant toy about the size a baby can hug (roughly 30-40cm)',
    notes: '코끼리 플러시. 오렌지 귀 안감·다크그레이 발바닥. 아기 장난감 컷(가족 CF CUT7 전경·CUT8).',
    usedIn: ['가족 CF CUT7', 'CUT8'],
  },
];

export async function GET() {
  const col = await collection(COL);
  const count = await col.countDocuments();
  if (count === 0) {
    const now = new Date();
    await col.insertMany(SEED.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
  }
  const products = await col.find({}).sort({ createdAt: 1 }).toArray();
  return NextResponse.json({ products });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: '제품명은 필수입니다.' }, { status: 400 });
  const now = new Date();
  const doc = {
    name: String(body.name),
    category: String(body.category || ''),
    colors: Array.isArray(body.colors) ? body.colors : [],
    spec: body.spec || { w: '', h: '', d: '', weight: '' },
    scalePrompt: String(body.scalePrompt || ''),
    notes: String(body.notes || ''),
    usedIn: Array.isArray(body.usedIn) ? body.usedIn : [],
    createdAt: now,
    updatedAt: now,
  };
  const col = await collection(COL);
  const { insertedId } = await col.insertOne(doc);
  return NextResponse.json({ product: { _id: insertedId, ...doc } }, { status: 201 });
}
