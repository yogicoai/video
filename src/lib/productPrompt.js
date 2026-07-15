// 제품 레지스트리 → 생성용 영문 프롬프트 블록 자동 조립 (2026-07-15)
// 12차 실측으로 확립된 4종 세트를 코드로 고정한다:
//   ① 카테고리 단어 대신 기하 서술  ② 치수 명시  ③ NOT 네거티브  ④ 인체 대비 앵커
//   (+ 사용 자세 = usage 연출컷이 가르치는 부분 → 프롬프트에도 문장으로)
import { BRAND } from '@/lib/sizeChart';

// 제품군별 기하 서술 / 네거티브 — 카테고리 전형(빈백=공 모양)을 깨기 위한 핵심
const GEOMETRY = {
  MAX: {
    shape: 'a LONG SOFT PILL shape — like a giant body pillow or a long sausage cushion, rounded at both ends, NO armrests, NO backrest frame',
    negative: 'NOT a ball, NOT a round beanbag, NOT a bed, NOT a mattress, NOT a wedge',
    modes: 'four modes: stand it upright as a CHAIR, lean it back as a RECLINER, lay it FLAT on the floor as a BED, or use it lengthwise as a SOFA',
  },
  DOUBLE: {
    shape: 'an EXTRA-LARGE LONG SOFT PILL shape, wide enough for two people side by side, NO armrests',
    negative: 'NOT a ball, NOT a round beanbag, NOT a rigid sofa',
    modes: 'lies flat as a two-person lounger or stands upright as a wide backrest',
  },
  POD: {
    shape: 'a NEARLY SPHERICAL egg-shaped bean bag, width almost equal to height, softly rounded all over',
    negative: 'NOT a teardrop, NOT a rocket, NOT a cone, NOT tall and narrow',
    modes: 'one person sinks deeply into it as if hugged',
  },
  SUPPORT: {
    shape: 'a U-SHAPED armrest cushion that wraps around a seated person’s lower back and sides',
    negative: 'NOT a ring, NOT a donut, NOT a neck pillow',
    modes: 'used alone as a floor backrest or paired with a bean bag sofa',
  },
  LOUNGER: {
    shape: 'a LOW CHAIR-SHAPED bean bag with a built-in sloped backrest',
    negative: 'NOT a ball, NOT a flat cushion',
    modes: 'sit into it like a low armchair, legs stretched forward',
  },
  SQUEEZIBO: {
    shape: 'a PALM-SIZED squishy character cushion, a soft rounded CYLINDER with a printed face, NO legs, NO limbs',
    negative: 'NOT a plush animal with legs, NOT a large toy, NOT a Mate plush',
    modes: 'held and squeezed in one hand, or placed as a small accent on a desk or sofa',
  },
  MATE: {
    shape: 'a soft plush animal character toy with a simple rounded body',
    negative: 'NOT a Squeezibo, NOT palm-sized, NOT a rigid figurine',
    modes: 'hugged by a child, or placed as a companion prop on a sofa or floor',
  },
  MOONPILLOW: {
    shape: 'a CRESCENT MOON shaped pillow',
    negative: 'NOT a full circle, NOT a ring',
    modes: 'hugged while lying down, or used to prop up a baby’s head',
  },
  DEFAULT: {
    shape: 'a soft stretch-fabric cushion',
    negative: 'NOT rigid, NOT boxy',
    modes: 'used as a soft resting surface',
  },
};

// 제품군 키 추론 — 반드시 "제품명" 기준. notes 본문으로 판정하면 안 된다:
// 맥스 노트의 "full-body lounger" 같은 서술어가 LOUNGER로 오판되어 기하가 뒤바뀐다 (2026-07-15 실측 버그).
export function familyOf(p) {
  const name = (p.name || '').toUpperCase();
  const pick = (kws) => kws.some((k) => name.includes(k));

  if (pick(['SQUEEZIBO', '스퀴지보'])) return 'SQUEEZIBO';
  if (pick(['더블', 'DOUBLE'])) return 'DOUBLE';
  if (pick(['문필로우', 'MOONPILLOW'])) return 'MOONPILLOW';
  if (pick(['서포트', 'SUPPORT'])) return 'SUPPORT';
  if (pick(['라운저', 'LOUNGER'])) return 'LOUNGER';
  if (pick(['팟', 'POD'])) return 'POD';
  if (pick(['맥스', 'MAX'])) return 'MAX';
  if (pick(['메이트', 'MATE'])) return 'MATE';

  // 이름으로 못 잡으면 notes의 선두 제품코드(예: "MAX · 겉커버…")만 신뢰
  const code = ((p.notes || '').trim().split(/[·\s]/)[0] || '').toUpperCase();
  if (GEOMETRY[code]) return code;
  return 'DEFAULT';
}

// 노트에 이미 적혀 있는 "연출: ..." 영어 문장을 추출 (사람이 직접 쓴 것 우선)
function stagingFromNotes(notes) {
  if (!notes) return '';
  const m = notes.match(/연출:\s*([^·]+)/);
  return m ? m[1].trim() : '';
}

const USAGE_LABEL_EN = {
  sitting_recliner: 'sitting in recliner mode',
  sitting_on_top: 'sitting on it laid flat',
  modes4: 'the four usage modes (chair / sofa / recliner / bed)',
  sleeping: 'lying down asleep on it',
  cover_gif: 'cover stretch physics',
  howto: 'usage guide sheet',
};

/**
 * 제품 1종(+색상 1개)에 대한 생성용 영문 프롬프트 블록을 조립한다.
 * @param {object} p  레지스트리 제품 객체
 * @param {number} ci 색상 인덱스
 * @returns {{text: string, refs: string[]}}
 */
export function buildProductPrompt(p, ci = 0) {
  const c = (p.colors || [])[ci] || {};
  const fam = familyOf(p);
  const g = GEOMETRY[fam] || GEOMETRY.DEFAULT;
  const s = p.spec || {};
  const colorName = (c.color || '').trim();
  const hex = (c.hex || '').trim();

  const L = [];

  L.push(`### PRODUCT — Yogibo ${p.name}${colorName ? ` (${colorName})` : ''}`);
  L.push('');

  // ① 기하 서술 (카테고리 단어에 기대지 않는다)
  L.push(`SHAPE: ${g.shape}.`);

  // ② 치수
  const dims = [s.w && `${s.w}cm wide`, s.d && `${s.d}cm deep`, s.h && `${s.h}cm tall/long`]
    .filter(Boolean).join(' x ');
  if (dims) L.push(`EXACT SIZE: ${dims}${s.weight ? `, ${s.weight}kg` : ''}.`);

  // ③ 인체 대비 앵커 (모델은 cm를 못 읽는다)
  if (p.scalePrompt) L.push(`SCALE ANCHOR: ${p.scalePrompt}.`);

  // ④ NOT 네거티브
  L.push(`NEGATIVE: ${g.negative}.`);

  // 색
  if (colorName) {
    L.push(`COLOR: deep ${colorName.toLowerCase()}${hex ? ` (${hex})` : ''} — the exact same color in EVERY frame, it must never shift or change.`);
  }

  // 사용 방식 / 자세
  const staging = stagingFromNotes(p.notes);
  L.push(`USE: ${staging || g.modes}.`);
  if (fam === 'MAX' || fam === 'DOUBLE') {
    L.push(`STATE THE MODE EXPLICITLY in the scene (e.g. "lying COMPLETELY FLAT on the floor in BED mode, like a low soft mattress") — if the mode is not stated the model renders an ambiguous wedge.`);
  }

  // 패브릭 물리
  L.push(`FABRIC: soft stretch cover that visibly compresses and dents under body weight; edges rise around the body as a person sinks in.`);

  // 브랜드 로고 태그 (클로즈업)
  if (BRAND?.logoTagPrompt) L.push(`LOGO TAG (close-ups only): ${BRAND.logoTagPrompt}`);

  // 참조 이미지
  const refs = [];
  const views = c.views || {};
  if (views.front) refs.push(`front view: ${views.front}`);
  if (views.side) refs.push(`side view: ${views.side}`);
  if (views.back) refs.push(`back view: ${views.back}`);
  const usage = p.usage || {};
  for (const [k, url] of Object.entries(usage)) {
    if (k === 'sleeping' || k === 'modes4' || k === 'sitting_recliner') {
      refs.push(`${USAGE_LABEL_EN[k] || k}: ${url}`);
    }
  }

  L.push('');
  L.push(`REFERENCE IMAGES — attach the angle that matches your camera, plus a usage shot for the pose:`);
  if (refs.length) refs.forEach((r) => L.push(`  - ${r}`));
  else L.push('  - (none registered — add a 360 sprite URL to generate views)');
  if (c.elementId) L.push(`ELEMENT TOKEN (Higgsfield): <<<${c.elementId}>>>`);

  L.push('');
  L.push(`RULE: never pass the raw 360 sprite sheet as an image reference — it downscales into an unreadable "many tiny objects" pattern. Use the single matching angle above.`);

  return { text: L.join('\n'), refs };
}
