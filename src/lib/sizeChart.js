// 요기보 공식 제품 차트 — 사용자 제공 고정값 (2026-07).
// 카테고리 · 한글/영문명 · 소재 · 사이즈(cm, 세움 기준 W=가로 D=깊이 H=높이) · 무게(kg) · 연출(dir) · 사이즈 비교 프롬프트(scale).
// 제품 추가 시 이름을 인식해 카테고리·스펙·소재·연출·사이즈 프롬프트를 자동 입력한다.
// dir/scale = 힉스필드 프롬프트에 그대로 투입되도록 영어로 저장 (scale은 치수를 인물 대비 비율 언어로 번역한 것 — 생성 모델은 cm를 못 읽는다).
// (누움 기준 표기 L×W×T는 같은 숫자의 축 순서 차이: 맥스 170×70×45 = W70 D45 H170)

const MATERIALS = '겉커버 면 89%/스판덱스 11% · 이너 폴리에스터 87%/스판덱스 13% · 충전재 EPS·HRF·Mixed Foam';

// 브랜드 공통 정보 — 모든 제품 생성에 적용되는 브랜드 아이덴티티
const BRAND = {
  name: 'Yogibo',
  ko: '요기보',
  lines: '스탠다드(Yogibo) · 줄라(Zoola, 아웃도어)',
  // 프롬프트 투입용(영어): 패브릭 제품 공통의 로고 태그 표기
  logoTagPrompt: "a small white 'yogibo' wordmark logo tag on the side seam of the fabric",
  // 촬영 규칙(영어, 프롬프트 투입용): 지퍼·시임 면은 카메라 반대쪽 — 매끈한 정면 패브릭만 보이게 (2026-07-07 사용자 지시)
  shootRulePrompt: "the zipper and seam line of the fabric face away from the camera — only the clean smooth fabric face is visible to the viewer",
  // 메인 모델(가족 CF 부인) 신장 ≈160cm — 제품 스케일 검수 앵커 (맥스 170cm 세우면 모델보다 머리 하나 큼)
  modelHeightNote: '메인 모델(부인) 신장 ≈160cm',
  modelHeightPrompt: "the female model is about 160cm tall",
  logoAsset: 'public/logo_brand.png (CF 인트로/엔딩 로고 — 흰배경 키잉 오버레이 검증됨)',
};

const SIZE_CHART = [
  { key: '카터필러 롤 맥스', en: 'CATERPILLAR ROLL MAX', category: '바디필로우/스툴', aliases: ['카터필러롤맥스', 'caterpillarrollmax'], w: 240, d: 20, h: 20, kg: 1.4,
    dir: "연출: 240cm extra-long wavy body pillow; winds along a lying person's body for an enveloping silhouette; bed or wide lounge scenes",
    scale: "an extra-long wavy body pillow much longer than an adult is tall (240cm — about 1.4x a person's height), arm-thick in diameter" },
  { key: '카터필러 롤 미디', en: 'CATERPILLAR ROLL MIDI', category: '바디필로우/스툴', aliases: ['카터필러롤미디', 'caterpillarrollmidi'], w: 125, d: 20, h: 20, kg: 0.8,
    scale: "a wavy body pillow spanning from an adult's shoulder to knee (125cm), arm-thick in diameter" },
  { key: '롤메이트', en: 'ROLL MATE', category: '바디필로우/스툴', aliases: ['롤메이트', 'rollmate'], w: 118, d: 16, h: 16, kg: 0.7,
    scale: "a slim roll pillow about the length of an adult's leg (118cm), forearm-thick in diameter" },
  { key: '롤맥스', en: 'ROLL MAX', category: '바디필로우/스툴', aliases: ['롤맥스', 'rollmax'], w: 152, d: 25, h: 25, kg: 1.9,
    dir: "연출: 152cm long cylindrical body pillow; hugged while lying on a bed or sofa, or laid alongside the body",
    scale: "a long cylindrical body pillow nearly as tall as an adult's shoulder height (152cm), thigh-thick in diameter" },
  { key: '롤미디', en: 'ROLL MIDI', category: '바디필로우/스툴', aliases: ['롤미디', 'rollmidi'], w: 125, d: 20, h: 20,
    dir: "연출: medium cylindrical body pillow; hugging or leaning support on bed, sofa, or floor",
    scale: "a cylindrical body pillow spanning from an adult's shoulder to knee (125cm), arm-thick in diameter" },
  { key: '롤미니', en: 'ROLL MINI', category: '바디필로우/스툴', aliases: ['롤미니', 'rollmini'], w: 80, d: 20, h: 20, kg: 0.6,
    scale: "a short roll pillow about the length of an adult's arm (80cm), arm-thick in diameter" },
  { key: '라운저', en: 'LOUNGER', category: '빈백', aliases: ['라운저', 'lounger'], w: 65, d: 80, h: 60, kg: 4.4,
    dir: "연출: low chair-style bean bag with built-in backrest; supports back and waist for seated scenes (reading, watching TV, chatting); NOT for lying flat",
    scale: "a low lounge chair bean bag about knee-height of a standing adult (60cm); a one-person seat whose backrest reaches a seated adult's mid-back" },
  { key: '피라미드', en: 'PYRAMID', category: '빈백', aliases: ['피라미드', 'pyramid'], w: 75, d: 75, h: 66, kg: 2.2,
    dir: "연출: triangular floor bean bag; casual sitting or leaning with a natural recline angle; suits scenes with children and small spaces",
    scale: "a triangular floor cushion about knee-height of a standing adult (66cm); one adult sits against its slope, a child can climb onto it" },
  { key: '서포트', en: 'SUPPORT', category: '바디필로우/스툴', aliases: ['서포트', 'support'], w: 76, d: 30, h: 94, kg: 1.7,
    dir: "연출: U-shaped body pillow wrapping around a seated person's lower back, sides and arms; used alone or paired with a bean bag sofa; proven for parenting scenes (nursing, holding a baby)",
    scale: "a U-shaped armrest cushion that wraps around an adult's lower back; its armrests reach about hip-height when the person is seated (94cm tall when upright)" },
  { key: '허기보', en: 'HUGIBO', category: '빈백', aliases: ['허기보', 'hugibo'], w: 60, d: 50, h: 110,
    scale: "a huggable pillar-shaped bean bag about chest-height of a standing adult (110cm) — roughly the size of a person you can wrap both arms around" },
  { key: '오토만', en: 'OTTOMAN', category: '바디필로우/스툴', aliases: ['오토만', 'ottoman'], w: 65, d: 55, h: 35,
    scale: "a footstool bean bag about shin-height of a standing adult (35cm); fits under an adult's stretched-out legs" },
  { key: '더블', en: 'DOUBLE', category: '빈백', aliases: ['더블', 'double'], w: 120, d: 45, h: 170, kg: 13.2,
    dir: "연출: extra-large bean bag for two or more; family sitting side by side or lounging widely; living room centerpiece; can be split like two Max units",
    scale: "an extra-large bean bag sofa as long as an adult is tall (170cm) and nearly twice the width of a single-person bean bag — two adults can lie or sit side by side" },
  { key: '드롭', en: 'DROP', category: '빈백', aliases: ['드롭', 'drop'], w: 85, d: 85, h: 75, kg: 3.7,
    dir: "연출: round droplet-shaped bean bag, lower than Pod; stable low sitting close to the floor; corner of living room or personal space",
    scale: "a round droplet-shaped bean bag about the height of a seated adult's shoulders (75cm); one adult sinks into it with knees bent" },
  { key: '슬림', en: 'SLIM', category: '빈백', aliases: ['슬림', 'slim'], w: 65, d: 45, h: 120, kg: 4.4,
    dir: "연출: narrow vertical bean bag sofa; sitting or leaning solo rest in tight spaces and room corners",
    scale: "a narrow vertical bean bag about waist-to-chest height of a standing adult (120cm); one adult reclines against it with legs extended" },
  { key: '맥스', en: 'MAX', category: '빈백', aliases: ['맥스', 'max'], w: 70, d: 45, h: 170, kg: 6.6,
    dir: "연출: stands upright as a backrest chair or lies flat as a full-body lounger; a person can sit on, lean against, or lie across it; soft stretch fabric compresses under body weight",
    scale: "a large bean bag sofa as long as an adult is tall (170cm) — long enough for a grown-up to lie down on fully; stood upright it stands taller than a 160cm woman, topping her head by about 10cm" },
  { key: '미디', en: 'MIDI', category: '빈백', aliases: ['미디', 'midi'], w: 70, d: 45, h: 125, kg: 4.8,
    dir: "연출: mid-size vertical bean bag sofa (smaller than Max, larger than Mini); solo relaxation with balanced sitting, leaning and lying",
    scale: "a mid-size bean bag reaching an adult's chest when stood upright (125cm); one adult can curl up on it lying down, or sit with full back support" },
  { key: '미니', en: 'MINI', category: '빈백', aliases: ['미니', 'mini'], w: 70, d: 45, h: 85, kg: 3.2,
    dir: "연출: compact single-person bean bag; sitting or leaning poses close to the floor; fits small rooms and corners",
    scale: "a compact bean bag about hip-height of a standing adult (85cm); a single seat where an adult sits with knees bent, child-friendly size" },
  { key: '팟', en: 'POD', category: '빈백', aliases: ['팟', 'pod'], w: 85, d: 85, h: 95, kg: 4.7,
    dir: "연출: round egg-shaped bean bag; deep enveloping seat, one person sinks in as if hugged; living room or bedroom",
    scale: "a round egg-shaped bean bag about waist-height of a standing adult (95cm), as wide as an adult's shoulder span — one person sinks deeply into it" },
  { key: '메가 문필로우', en: 'MEGA MOON PILLOW', category: '필로우', aliases: ['문필로우', 'moonpillow'], w: 52, d: 21, h: 15, materials: '',
    dir: "연출: crescent moon-shaped pillow; hugged or tucked under an arm or side; cradles a baby's head (proven in parenting cuts); sofa, bed, or floor",
    scale: "a crescent moon-shaped pillow about the width of an adult's shoulders (52cm), thick as a forearm — large enough to cradle a baby's head and shoulders in its curve" },
  { key: '메이트 옐리(엘리펀트)', en: 'MATE ELEPHANT (YELLY)', category: '메이트(인형)', aliases: ['옐리펀트', '엘리펀트', '옐리', 'elephant', 'yelly'], w: 35, d: 13, h: 20, materials: '',
    dir: "연출: animal character plush; hugged by a child or placed nearby; works as a foreground prop or bokeh accent",
    scale: "a plush elephant toy about the size a baby can hug (35cm wide, 20cm tall) — fits between a baby's arms, smaller than a house cat" },
  { key: '스퀴지보', en: 'SQUEEZIBO', category: '악세서리', aliases: ['스퀴지보', 'squeezibo'], w: 5.5, d: 5.5, h: 4.5,
    materials: '겉커버 면 89%/스판덱스 11% · 충전재 플라스틱 고무 99%/폴리에틸렌 1%',
    dir: "연출: palm-sized squishy character cushion (plant, animal, solid designs); held and squeezed in one hand, or placed as a cute accent on a desk, sofa, or bedside; soft stretch fabric over a squishy malleable core",
    scale: "a tiny palm-sized squishy toy (5.5cm — about the size of a golf ball or a macaron); fits entirely inside one closed hand" },
];

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/yogibo|요기보/g, '')
    .replace(/[\s\-_·]/g, '');
}

// 제품명에서 차트 행 매칭 — 별칭이 긴 항목부터(롤맥스가 맥스보다 먼저) 검사
export function matchProduct(name) {
  const n = normalize(name);
  if (!n) return null;
  for (const row of SIZE_CHART) {
    if (row.aliases.some((a) => n.includes(a))) return row;
  }
  return null;
}

export function matchSize(name) {
  const row = matchProduct(name);
  return row ? { w: String(row.w), d: String(row.d), h: String(row.h), weight: row.kg != null ? String(row.kg) : '' } : null;
}

// 항목별 소재 (materials: '' 지정 시 빈백 공통 소재를 쓰지 않음 — 필로우/메이트 등)
export function materialsFor(row) {
  if (!row) return '';
  return row.materials !== undefined ? row.materials : MATERIALS;
}

export { SIZE_CHART, MATERIALS, BRAND };
