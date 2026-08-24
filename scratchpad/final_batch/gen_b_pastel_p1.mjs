const meta = {
  name: 'lounger-thumbs-batch-v2',
  description: 'Regenerate 17 Yogibo Lounger thumbnails with black piping, identity/hair lock and absolute kid-size rule; self-check, group verification, regen loop',
  phases: [
    { title: 'Generate', detail: 'one agent per cut: submit, wait, download, self-check, retry up to 3' },
    { title: 'Verify', detail: 'one strict verifier per model/colour group: piping, identity+hair, kid size, shape, colour, pose, background' },
    { title: 'Regen', detail: 'failed cuts regenerated with verifier feedback' },
    { title: 'Re-verify', detail: 'per-cut re-check of regenerated images' },
  ],
}

const OUT = 'd:/next/video-main (1)/video-main/scratchpad/lounger_batch_v2'
const REFDIR = 'd:/next/video-main (1)/video-main/scratchpad/lounger_c'

const PIPING_REF = { pastelblue: '38092728-5db4-4ffa-98e7-3a40bd4595e3', freshmint: '99b7c512-0f56-43f3-a1ce-823ac4985f16', olive: '99b7c512-0f56-43f3-a1ce-823ac4985f16' }
const PIPING_FILE = { pastelblue: 'lounger_on_06.png', freshmint: 'lounger_off_02.png', olive: 'lounger_off_02.png' }
const KID_SIZE_REF = { id: 'e599d7f6-4d04-42d7-874d-3b7afc7556a4', file: 'lounger_on_03.jpg' }

const POSE = {
  1: { base: '24755b47-8ed4-4ebe-8ee8-8ac027772d10', shape: 'dc832a98-f410-453a-8dae-e51ea5786133', baseFile: 'lounger_on_01.png', shapeFile: 'lounger_off_01.png',
       text: 'the person sits into the low Lounger seen from a front three-quarter angle at a slightly low eye level; legs stretched forward and relaxed with ankles crossed; both hands holding a small plain ceramic mug at chest height; torso resting back against the sloped backrest; head turned slightly toward the camera with a gentle natural smile.',
       props: 'the small plain ceramic mug', cam: 'same front three-quarter view and slightly low eye level as the pose reference', label: '포즈1(착석·머그·¾정면)' },
  2: { base: '38cb4f83-579d-4d85-8286-e45563ff4618', shape: '99b7c512-0f56-43f3-a1ce-823ac4985f16', baseFile: 'lounger_on_02.png', shapeFile: 'lounger_off_02.png',
       text: 'the person sits relaxed and slightly sideways in the Lounger, front three-quarter view; the right elbow propped on the rounded top of the sloped backrest with the right hand resting under the chin, the left hand resting on the thigh, legs crossed at the ankles and stretched out toward the front-left, torso leaning into the backrest which bulges softly around the body, head turned toward the camera with a gentle natural smile.',
       props: 'nothing', cam: 'same front three-quarter view and eye level as the pose reference', label: '포즈2(등받이 팔꿈치·턱괴고 다리교차·¾정면)' },
  3: { base: 'e599d7f6-4d04-42d7-874d-3b7afc7556a4', shape: 'ec1bc1fa-6c49-4e46-aed4-170bb68d8d05', baseFile: 'lounger_on_03.jpg', shapeFile: 'lounger_off_03.png',
       text: 'the child sits upright and centred in the Lounger, seen almost frontally (slight three-quarter) at eye level; arms folded across the chest, legs extended forward with ankles crossed, back resting against the sloped backrest, head straight toward the camera with a cheerful natural smile.',
       props: 'nothing', cam: 'same near-frontal view and eye level as the pose reference', label: '포즈3(정면 착석·팔짱·다리 뻗기)' },
  4: { base: '3d733bd7-66a2-43ac-9146-aa1be243c261', shape: 'f9a259bb-7ff9-4dfc-a744-6aba98d5be4d', baseFile: 'lounger_on_04.jpg', shapeFile: 'lounger_off_04.png',
       text: 'the person sits upright in the Lounger, front three-quarter view; holding a plain white unbranded game controller with both hands at chest height, elbows relaxed, legs stretched out toward the front-right with ankles crossed, back resting against the sloped backrest, head turned slightly toward the camera with a gentle natural smile (relaxed gaming pose).',
       props: 'the plain white game controller', cam: 'same front three-quarter view and eye level as the pose reference', label: '포즈4(업라이트 착석·화이트 게임패드·다리 뻗기·¾정면)' },
  5: { base: '064017e5-0ec1-4c19-9ab6-18543b5ad72d', shape: '8dcee552-d431-4f0a-b3ca-fac7adf89d7d', baseFile: 'lounger_off_05.jpg', shapeFile: 'lounger_on_05.png',
       text: 'the person sits deep in the Lounger, front three-quarter view at a slightly low eye level; knees pulled up toward the chest, both arms wrapped around the shins hugging the knees, feet resting on the front edge of the seat, back sunk into the sloped backrest, head turned toward the camera with a gentle natural smile (cosy curled-up pose).',
       props: 'nothing', cam: 'same front three-quarter view and slightly low eye level as the pose reference', label: '포즈5(무릎 안고 깊게 착석·¾정면)' },
  7: { base: '4fde6721-b054-4879-ba30-89a7b196a137', shape: 'e5e326e7-734c-4b3a-a122-791ea42857cc', baseFile: 'lounger_on_07.jpg', shapeFile: 'lounger_off_07.png',
       text: 'the child sits in the Lounger seen from a front three-quarter angle; legs extended forward with ankles crossed, back against the sloped backrest; one hand holds up a small plain cream plush animal toy at shoulder height, the other hand open in a playful gesture; head toward the camera with a happy natural smile.',
       props: 'the small plain cream plush toy', cam: 'same front three-quarter view and eye level as the pose reference', label: '포즈7(착석·인형 들고 놀이·¾정면)' },
}

const MODEL = {
  C:  { rep: 'b44666ed-4e0d-45ef-b584-42edd99305e1', expr: 'ae2fad6a-3eb3-47b3-8158-9930526016d5', repFile: 'B_C_rep.jpg', exprFile: 'B_C_expr.png', name: 'Model C (woman)', short: 'Model C', height: 169, kid: false,
        desc: 'European woman in her early-to-mid 20s, soft oval face, light grey-green eyes, natural no-makeup look, 169 cm slim build, cool minimal vibe.',
        hair: 'golden-blonde shoulder-length layered lob, centre-parted soft curtain bangs framing the face, ends curling slightly inward; no other hairstyle',
        expr_text: 'natural soft smile (never neutral or blank, never an exaggerated laugh)', panel: "panel 2 'soft smile'", kor: '여성C(169cm)' },
  B:  { rep: 'c0f9c804-38cf-44da-9a1b-459fb0d67c1e', expr: 'ef827b0e-4cf0-4d4a-b0d8-1287d1fdee16', repFile: 'B_B_rep.jpg', exprFile: 'B_B_expr.png', name: 'Model B (woman)', short: 'Model B', height: 172, kid: false,
        desc: 'European woman in her early 20s, soft oval face, light calm eyes, faint freckles across the nose and cheeks, natural no-makeup look, 172 cm slim long-limbed build, fresh natural vibe.',
        hair: 'long light-chestnut-brown hair falling below the shoulders in soft loose waves, centre parting, NO bangs/fringe; hair colour is light chestnut brown (not auburn, not red, not blonde, not dark brown)',
        expr_text: 'natural soft smile (never neutral or blank)', panel: "panel 2 'soft smile'", kor: 'B(172cm)' },
  MA: { rep: 'e062cc45-1c4d-4d82-ab98-66b5266c2ef8', expr: '5c37144b-39b8-49ed-9d55-7f27400cc9fb', repFile: 'M_A_rep.jpg', exprFile: 'M_A_expr.png', name: 'Model MA (man)', short: 'Model MA', height: 180, kid: false,
        desc: 'European man in his late 20s, clean-cut athletic build, 180 cm, clean-shaven, defined jaw, warm natural smile.',
        hair: 'medium-length dark-brown tousled wavy hair with natural volume, swept loosely back/sideways off the forehead, covering the tops of the ears; no other hairstyle, not short-cropped, not blonde',
        expr_text: 'natural soft smile (never neutral or blank)', panel: "panel 2 'soft smile'", kor: '남성A(180cm)' },
  KA: { rep: 'dfb3d915-7d77-42b4-85ac-51424d6709ca', expr: '5532fe27-7fbb-44a6-8c09-8f37a5d59524', repFile: 'K_A_rep_new.png', exprFile: 'K_A_expr.png', name: 'Child KA (girl 6-7)', short: 'Child KA', height: 120, kid: true,
        desc: 'European girl aged 6-7, about 120 cm tall, round cheerful face, big bright smile; a small young child (NOT a pre-teen, NOT an adult).',
        hair: 'light-brown hair in two braided pigtails (the braids start behind the ears and hang forward over the shoulders), a small blue hair clip on one side of the head, soft wispy baby hairs; no other hairstyle',
        expr_text: 'bright happy natural smile', panel: "panel 3 'bright smile'", kor: '아동A(6~7세·120cm)' },
  KB: { rep: '29a122b6-18b2-40a7-b772-9388d8c5dae1', expr: '5d663461-c1e6-460c-84c0-d3b7bdf55682', repFile: 'K_B_rep_new.png', exprFile: 'K_B_expr.png', name: 'Child KB (girl 10-12)', short: 'Child KB', height: 150, kid: true,
        desc: 'European girl aged 10-12, about 150 cm tall, freckles across the nose and cheeks, slim pre-teen build, natural friendly smile (NOT an adult).',
        hair: 'long straight auburn (red-brown) hair reaching below the shoulders, centre parting, NO bangs/fringe; no other hairstyle, not wavy, not braided',
        expr_text: 'natural friendly smile (never neutral or blank)', panel: "panel 3 'bright smile' or panel 2 'soft smile'", kor: '아동B(12세·150cm)' },
}

const OUTFIT = {
  C_W_C_01: { id: 'bd1bb025-1b7d-4a53-968b-a2f423003308', file: 'C_W_C_01.jpg', desc: 'plain white short-sleeve fitted crop T-shirt (crew neck, cropped at the waist) + navy wide-leg trousers with fine pinstripes (high-waisted, full length, relaxed straight wide leg).', feet: 'Bare feet - no socks, no shoes.', kor: '화이트티+네이비 슬랙스(C_W_C_01)' },
  B_W_C_01: { id: '864239fa-0954-4417-82f5-ef1f9f2b5a1c', file: 'B_W_C_01.jpg', desc: 'heather light-grey short-sleeve fitted crop T-shirt + light-wash blue denim Bermuda shorts (knee length, relaxed fit, elastic waistband).', feet: 'Bare feet - no socks, no shoes.', kor: '그레이티+데님쇼츠(B_W_C_01)' },
  A_M_C_03: { id: 'a7c6c566-ccf1-4cef-8414-c50fc383f9d9', file: 'A_M_C_03.jpg', desc: 'dark olive-green relaxed-fit pullover hoodie (hood down, plain, no print) + charcoal-grey wide-leg sweat trousers. Note: the hoodie is a much darker, muted olive than the bright olive-green bean bag - keep the two clearly distinct in tone.', feet: 'Bare feet - no socks, no shoes.', kor: '올리브후디+차콜와이드(A_M_C_03)' },
  KID_A_01: { id: 'a9e59427-7f9f-442e-9e90-5f2574f3f241', file: 'KID_A_01.jpg', desc: 'light-grey short-sleeve T-shirt with a small pastel palm-tree beach graphic on the chest + cream cotton shorts.', feet: 'White ankle socks, no shoes.', kor: 'KID_A_01 고정의상(그레이 프린트티+크림 반바지)' },
  KID_B_01: { id: 'b0cb42a5-5091-44a6-9d99-c0f074b6659e', file: 'KID_B_01.jpg', desc: "ivory ringer T-shirt with grey collar and sleeve trims and a red 'LITTLE DEPT' chest print + heather-grey shorts with white piping trim.", feet: 'Cream ankle socks, no shoes.', kor: 'KID_B_01 고정의상(아이보리 링거티+그레이 숏팬츠)' },
}

const COLOR = {
  pastelblue: { id: '65a5a62a-1365-4870-b358-5b1fd4bb193d', name: 'pastel blue', hex: '#BEDDEF', desc: 'soft pastel sky-blue', avoid: 'aqua, mint, navy, grey or lavender', kor: '파스텔블루 #BEDDEF', key: 'pastelblue' },
  freshmint:  { id: '5ebdd121-397e-459a-8c04-68dcb52b9090', name: 'fresh mint', hex: '#B0EEE7', desc: 'soft pale mint - a light pastel aqua-green', avoid: 'turquoise, teal, sky-blue, pastel blue, grey or white', kor: '프레시민트 #B0EEE7', key: 'freshmint' },
  olive:      { id: '05441877-3ce2-4f88-b736-d21d5f187f16', name: 'olive green', hex: '#668B01', desc: 'saturated yellow-green olive', avoid: 'khaki-brown, dark forest green, neon lime, grey-green or teal', kor: '올리브그린 #668B01', key: 'olive' },
}

function scaleText(m, extra) {
  let s
  if (!m.kid) s = `ABSOLUTE SIZE RULE: the Lounger is a fixed-size object (65 cm wide, 80 cm deep, 60 cm tall). For the seated ${m.height} cm adult: the top of the backrest reaches the shoulder blades / mid-back, the bag is about 1.5x wider than the shoulders and extends beyond the hips on both sides, the 80 cm deep seat supports the whole thigh. The person sits INTO the bag, not on top of a small pouf.`
  else if (m.height >= 140) s = `ABSOLUTE SIZE RULE - VERY IMPORTANT: the Lounger is a fixed-size object (65 cm wide, 80 cm deep, 60 cm tall); it does NOT shrink to fit a child. Child KB is only 150 cm tall, so relative to her the bag is BIG: when she sits in it the top of the backrest is level with her shoulders / the base of her neck, the bag is at least TWICE as wide as her shoulders and extends far beyond her hips on both sides, the seat is so deep that only her lower legs (from the knees down) extend past the front edge. Use the SIZE reference image (a girl of similar age sitting in the same Lounger) as the proportion guide - the bag must look at least as large relative to her as it does there. A bag that looks like a small child-sized chair is WRONG.`
  else s = `ABSOLUTE SIZE RULE - VERY IMPORTANT: the Lounger is a fixed-size object (65 cm wide, 80 cm deep, 60 cm tall); it does NOT shrink to fit a child. Child KA is only 120 cm tall, so relative to her the bag is LARGE: when she sits in it the top of the backrest reaches her shoulders/neck, the bag is more than TWICE as wide as her shoulders (she occupies only the middle of the seat), the 80 cm deep seat swallows her whole body so that only her lower legs and feet reach past the front edge. Use the SIZE reference image (an older, bigger girl sitting in the same Lounger) as the proportion guide - relative to this smaller child the bag must look even LARGER than it does there. A bag that looks like a small child-sized chair is WRONG.`
  return s + (extra ? ' ' + extra : '')
}

function refList(group, cut) {
  const m = MODEL[group.model], o = OUTFIT[group.outfit], c = COLOR[group.color], p = POSE[cut.pose]
  const medias = [
    { role: 'image_references', value: p.shape }, { role: 'image_references', value: p.base },
    { role: 'image_references', value: m.rep }, { role: 'image_references', value: m.expr },
    { role: 'image_references', value: o.id }, { role: 'image_references', value: c.id },
    { role: 'image_references', value: PIPING_REF[group.color] } ]
  let text = `#1 = the product EMPTY (SHAPE reference - the bean bag must look exactly like this, only recoloured). #2 = pose reference with a model (POSE/ANGLE BASE only - ignore its room, its colour and its person). #3 = ${m.name} face reference. #4 = ${m.name} expression sheet (8 panels: 1 neutral, 2 soft smile, 3 bright smile, 4 surprised, 5 sad, 6 frown, 7 serious, 8 side-glance smile). #5 = outfit reference ${group.outfit}. #6 = colour swatch. #7 = PIPING reference: the same Lounger product showing its thin BLACK piping line along the seam${group.color === 'pastelblue' ? ' (this one is the real pastel-blue product - copy its colour and piping; ignore the room and the notebook)' : ' (copy only the black piping line; ignore its colour)'}.`
  if (m.kid) { medias.push({ role: 'image_references', value: KID_SIZE_REF.id }); text += ` #8 = SIZE reference: a girl of about 10-12 sitting in the same Lounger, showing the correct child-to-bag proportion.` }
  return { medias, text }
}

function buildPrompt(group, cut) {
  const p = POSE[cut.pose], m = MODEL[group.model], o = OUTFIT[group.outfit], c = COLOR[group.color]
  const refs = refList(group, cut)
  return `Photorealistic e-commerce lifestyle thumbnail, square 1:1, 2048px.

REFERENCES: ${refs.text}

TASK: Place ${m.short} into the ${c.name} Yogibo Lounger bean bag of shape reference #1, in the exact pose and camera angle of #2, in a clean studio.

PRODUCT - Yogibo Lounger (${c.name}): a SOFT BEAN BAG, not furniture. Silhouette exactly as #1: one continuous soft rounded bead-filled form - a low rounded seat flowing into a single sloped, rounded backrest lobe, soft puffy rounded edges. STRICTLY NO box cushions, NO flat planes, NO straight edges, NO armrests, NO separate seat cushion, NO sofa or foam-chair look, NO zipper, NO visible stitching. It visibly sinks, dents and bulges under the sitter's weight.
PIPING (must be visible): a single continuous thin BLACK piping cord (about 1 cm) runs along the product's seam exactly where the seam runs in #1 and #7 - over the top of the backrest, down both sides and around the front edge of the seat; crisp and clearly visible against the ${c.name} fabric. NOT tone-on-tone, NOT grey, NOT white, NOT missing.
EXACT SIZE: 65 cm wide x 80 cm deep x 60 cm tall (4.4 kg). ${scaleText(m, cut.scaleExtra)} The bag must read as a real full-size lounge bean bag - NOT a small pouf or footstool, and NOT an oversized sofa.
COLOR: ${c.name} ${c.hex} - see colour swatch #6: the exact same ${c.desc} over the whole cover, never shifting toward ${c.avoid}. FABRIC: soft matte stretch cotton-spandex cover.

POSE LOCK (from #2 - pose and camera only): ${p.text}

PERSON - IDENTITY LOCK (${m.name} - face reference #3 and expression sheet #4, ${m.panel}): ${m.desc} HAIR: ${m.hair}. The face must be IDENTICAL to #3/#4 in every detail - same face shape, eyes, nose, mouth, skin, freckles, age and gender; do not beautify, age, or restyle. Expression: ${m.expr_text}.

OUTFIT (reference #5 - ${group.outfit}): ${o.desc} ${o.feet} No accessories, no logos other than the print described.

SCENE / LIGHT: clean studio, seamless background and floor in very light grey #f2f2f4 (NOT pure white; no room, no wooden floor, no furniture, no window, no plants), soft diffused daylight from the front-left, natural soft contact shadow under the bean bag, no props except ${p.props}, no text, no watermark, no logo.

CAMERA: 50 mm look, ${p.cam}, the whole bean bag and the person fully in frame with comfortable margin, centered, square crop.`
}

const GROUPS = [
  { id: 'C_pastelblue', model: 'C', color: 'pastelblue', outfit: 'C_W_C_01', cuts: [
    { id: 'c_pastelblue_p5', pose: 5, file: 'cand_lounger_pastelblue_c_p5', scaleExtra: 'NOTE: an earlier attempt rendered the bag far too small (pouf-like) - the curled-up woman must fit entirely inside the seat with room to spare on both sides and the backrest rising to her shoulder blades.' },
    { id: 'c_pastelblue_p2', pose: 2, file: 'cand_lounger_pastelblue_c_p2' },
    { id: 'c_pastelblue_p4', pose: 4, file: 'cand_lounger_pastelblue_c_p4' },
    { id: 'c_pastelblue_p2_alt', pose: 2, file: 'cand_lounger_pastelblue_c_p2_alt', variant: 'second take of the same pose: same pose and framing, slightly different natural micro-expression/head tilt so it reads as an alternate shot' },
  ] },
  { id: 'B_freshmint', model: 'B', color: 'freshmint', outfit: 'B_W_C_01', cuts: [
    { id: 'b_freshmint_p5', pose: 5, file: 'cand_lounger_freshmint_b_p5' },
    { id: 'b_freshmint_p1', pose: 1, file: 'cand_lounger_freshmint_b_p1' },
    { id: 'b_freshmint_p2', pose: 2, file: 'cand_lounger_freshmint_b_p2' },
    { id: 'b_freshmint_p1_alt', pose: 1, file: 'cand_lounger_freshmint_b_p1_alt', variant: 'second take of the same pose: same pose and framing, slightly different natural micro-expression/head tilt so it reads as an alternate shot' },
  ] },
  { id: 'KB_olive', model: 'KB', color: 'olive', outfit: 'KID_B_01', cuts: [
    { id: 'kb_olive_p7', pose: 7, file: 'cand_lounger_olive_kb_p7' },
    { id: 'kb_olive_p4', pose: 4, file: 'cand_lounger_olive_kb_p4' },
    { id: 'kb_olive_p3', pose: 3, file: 'cand_lounger_olive_kb_p3' },
  ] },
  { id: 'MA_olive', model: 'MA', color: 'olive', outfit: 'A_M_C_03', cuts: [
    { id: 'ma_olive_p5', pose: 5, file: 'cand_lounger_olive_ma_p5' },
    { id: 'ma_olive_p1', pose: 1, file: 'cand_lounger_olive_ma_p1' },
    { id: 'ma_olive_p2', pose: 2, file: 'cand_lounger_olive_ma_p2' },
  ] },
  { id: 'KA_pastelblue', model: 'KA', color: 'pastelblue', outfit: 'KID_A_01', cuts: [
    { id: 'ka_pastelblue_p4', pose: 4, file: 'cand_lounger_pastelblue_ka_p4' },
    { id: 'ka_pastelblue_p7', pose: 7, file: 'cand_lounger_pastelblue_ka_p7' },
    { id: 'ka_pastelblue_p3', pose: 3, file: 'cand_lounger_pastelblue_ka_p3' },
  ] },
]


COLOR.navy = { id: '2b25af2b-97ce-4ec8-96fe-4e6844e7d73a', name: 'navy blue', hex: '#1D395D', desc: 'deep navy blue', avoid: 'black, royal blue, teal, purple or grey', kor: '네이비블루 #1D395D', key: 'navy' }
PIPING_REF.navy = 'dc832a98-f410-453a-8dae-e51ea5786133'
PIPING_FILE.navy = 'lounger_off_01.png'
OUTFIT.A_M_C_02 = { id: 'bfe9ae41-01f9-4fdf-b6a0-d0564b0108af', file: 'A_M_C_02.jpg', desc: 'plain white short-sleeve crew-neck T-shirt (regular fit) + black wide-leg slacks (full length, relaxed straight leg).', feet: 'Bare feet - no socks, no shoes.', kor: '화이트티+블랙슬랙스(A_M_C_02)' }
const G2 = [
  { id: 'B_pastelblue', model: 'B', color: 'pastelblue', outfit: 'B_W_C_01', cuts: [
    { id: 'lg_b_pastelblue_p1', pose: 1, file: 'cand_lounger_pastelblue_b_p1' } ] },
]
const outList = []
for (const g of G2) for (const cut of g.cuts) {
  const refs = refList(g, cut)
  let prompt = buildPrompt(g, cut)
  let medias = refs.medias
  if (g.color === 'navy') {
    prompt = prompt.split('thin BLACK piping cord').join('thin LIGHT GREY piping cord')
      .split('NOT tone-on-tone, NOT grey, NOT white, NOT missing').join('NOT tone-on-tone, NOT black, NOT white, NOT missing')
      .split('showing its thin BLACK piping line along the seam (copy only the black piping line; ignore its colour)').join('showing its thin LIGHT GREY piping line along the seam (this is the real navy product - copy its colour and its light-grey piping)')
      .split('PIPING (must be visible)').join('PIPING (must be visible - the navy Lounger has a LIGHT GREY piping line like the pose-1 reference)')
  }
  outList.push({ cut_id: cut.id, file: cut.file, group: g.id, model: g.model, color: g.color, outfit: g.outfit, pose: cut.pose, pose_label: POSE[cut.pose].label, model_kor: MODEL[g.model].kor, outfit_kor: OUTFIT[g.outfit].kor, color_kor: COLOR[g.color].kor, medias, prompt })
}
console.log(JSON.stringify(outList))
