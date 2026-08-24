const meta = {
  name: 'pod-thumbs-batch',
  description: 'Generate 16 Yogibo Pod thumbnails (5 model/colour groups) via Higgsfield nano_banana_pro with identity/hair lock, fixed-size rule (kids), self-check, group verification and regen loop',
  phases: [
    { title: 'Generate', detail: 'one agent per cut: submit, wait, download, self-check, retry up to 3' },
    { title: 'Verify', detail: 'one strict verifier per model/colour group: shape, size, identity+hair, colour, pose, background' },
    { title: 'Regen', detail: 'failed cuts regenerated with verifier feedback' },
    { title: 'Re-verify', detail: 'per-cut re-check of regenerated images' },
  ],
}

const OUT = 'd:/next/video-main (1)/video-main/scratchpad/pod_batch'
const PODDIR = 'd:/next/video-main (1)/video-main/scratchpad/pod_c'
const REFDIR = 'd:/next/video-main (1)/video-main/scratchpad/lounger_c'

const POSE = {
  1: { base: '97d66dcf-bb4c-4e9b-a8f1-891935cf2a8a', shape: '2a61f705-7936-4ba9-b11e-ef2382c21257', baseFile: 'pod_on_01.jpg', shapeFile: 'pod_off_01.png',
       text: 'the person sits sunk into the Pod seen from a front three-quarter angle (from their left side) at eye level; legs stretched forward and relaxed with ankles crossed; a compact plain unbranded laptop open on the lap, both hands resting on it; torso leaning back into the high rounded back of the Pod which rises behind the shoulders; head turned slightly toward the camera with a gentle natural smile.',
       props: 'the compact plain unbranded laptop', cam: 'same front three-quarter view and eye level as the pose reference', label: '포즈1(착석·랩탑·¾정면)' },
  2: { base: 'a2f74061-b993-4272-8cb5-0bb049c44676', shape: '441732e5-ee32-4277-bf6d-2727b1bffeaa', baseFile: 'pod_on_02.jpg', shapeFile: 'pod_off_02.png',
       text: 'the person reclines sideways in the Pod seen from a three-quarter side angle; upper body leaning back against the high rounded back of the Pod, holding a plain unbranded tablet with both hands at chest height and looking at it with a relaxed smile; one knee bent up with the foot on the floor, the other leg extended forward along the floor.',
       props: 'the plain unbranded tablet', cam: 'same three-quarter side view and eye level as the pose reference', label: '포즈2(옆으로 기대 태블릿·¾측면)' },
  3: { base: '484f923b-6476-4c14-93ea-9080bf8a9113', shape: '5573a525-8328-4d71-bb7b-c340b8ada738', baseFile: 'pod_on_03.jpg', shapeFile: 'pod_off_03.png',
       text: 'the person sits deep in the Pod seen almost frontally at eye level; both arms raised and spread wide open in a joyful welcoming gesture with open palms, knees bent with both feet flat on the floor in front, back and shoulders enveloped by the high rounded back of the Pod; head toward the camera with a bright happy smile.',
       props: 'nothing', cam: 'same near-frontal view and eye level as the pose reference', label: '포즈3(정면 착석·양팔 활짝·밝은 미소)' },
  4: { base: '4c1805ab-db82-473b-a816-589194e057a2', shape: '8c658b7b-586c-4cb2-977a-64546bb17953', baseFile: 'pod_on_04.jpg', shapeFile: 'pod_off_04.png',
       text: 'the person sits deep in the Pod seen from a front three-quarter angle; knees bent with feet on the floor, one hand pointing playfully toward the camera, the other hand raised relaxed near the shoulder, back enveloped by the high rounded back of the Pod; head toward the camera with a bright happy smile.',
       props: 'nothing', cam: 'same front three-quarter view and eye level as the pose reference', label: '포즈4(착석·손가락 포인팅·밝은 미소·¾정면)' },
  5: { base: 'a4d38048-0ce0-431d-868c-fbdebcdff9e2', shape: '02f76c22-3a6f-4207-8920-6dda85e36b01', baseFile: 'pod_on_05.png', shapeFile: 'pod_off_05.png',
       text: 'the person reclines in the Pod seen from a three-quarter side angle (from their right side); back and head resting against the high rounded back of the Pod, holding an open plain book with both hands and reading it with a soft smile, legs extended forward along the floor with ankles relaxed.',
       props: 'the open plain book (no readable text)', cam: 'same three-quarter side view and eye level as the pose reference', label: '포즈5(기대어 독서·¾측면)' },
  6: { base: 'c6b61c59-a929-4e0a-bc63-bb9817a3e901', shape: '1bd0e304-ad6b-4d02-ac96-69a2554ec85b', baseFile: 'pod_on_06.png', shapeFile: 'pod_off_06.png',
       text: 'the person sits reclined in the Pod seen from the side (profile to slight three-quarter); back resting against the high rounded back of the Pod, holding a plain white unbranded game controller with both hands at chest height, legs extended straight forward along the floor with ankles together, head turned slightly toward the camera with a gentle natural smile (relaxed gaming pose).',
       props: 'the plain white game controller', cam: 'same side / slight three-quarter view and eye level as the pose reference', label: '포즈6(옆모습 기대 게임패드·다리 뻗기)' },
}

const MODEL = {
  C:  { rep: 'b44666ed-4e0d-45ef-b584-42edd99305e1', expr: 'ae2fad6a-3eb3-47b3-8158-9930526016d5', repFile: REFDIR + '/B_C_rep.jpg', exprFile: REFDIR + '/B_C_expr.png', name: 'Model C (woman)', short: 'Model C', height: 169, kid: false,
        desc: 'European woman in her early-to-mid 20s, soft oval face, light grey-green eyes, natural no-makeup look, 169 cm slim build, cool minimal vibe.',
        hair: 'golden-blonde shoulder-length layered lob, centre-parted soft curtain bangs framing the face, ends curling slightly inward; no other hairstyle',
        expr_text: 'natural soft smile (never neutral or blank, never an exaggerated laugh)', panel: "panel 2 'soft smile' (panel 3 'bright smile' for the joyful poses)", kor: '여성C(169cm)' },
  B:  { rep: 'c0f9c804-38cf-44da-9a1b-459fb0d67c1e', expr: 'ef827b0e-4cf0-4d4a-b0d8-1287d1fdee16', repFile: REFDIR + '/B_B_rep.jpg', exprFile: REFDIR + '/B_B_expr.png', name: 'Model B (woman)', short: 'Model B', height: 172, kid: false,
        desc: 'European woman in her early 20s, soft oval face, light calm eyes, faint freckles across the nose and cheeks, natural no-makeup look, 172 cm slim long-limbed build, fresh natural vibe.',
        hair: 'long light-chestnut-brown hair falling below the shoulders in soft loose waves, centre parting, NO bangs/fringe; hair colour is light chestnut brown (not auburn, not red, not blonde, not dark brown)',
        expr_text: 'natural soft smile (never neutral or blank)', panel: "panel 2 'soft smile' (panel 3 'bright smile' for the joyful poses)", kor: 'B(172cm)' },
  MA: { rep: 'e062cc45-1c4d-4d82-ab98-66b5266c2ef8', expr: '5c37144b-39b8-49ed-9d55-7f27400cc9fb', repFile: REFDIR + '/M_A_rep.jpg', exprFile: REFDIR + '/M_A_expr.png', name: 'Model MA (man)', short: 'Model MA', height: 180, kid: false,
        desc: 'European man in his late 20s, clean-cut athletic build, 180 cm, clean-shaven, defined jaw, warm natural smile.',
        hair: 'medium-length dark-brown tousled wavy hair with natural volume, swept loosely back/sideways off the forehead, covering the tops of the ears; no other hairstyle, not short-cropped, not blonde',
        expr_text: 'natural soft smile (never neutral or blank)', panel: "panel 2 'soft smile' (panel 3 'bright smile' for the joyful poses)", kor: '남성A(180cm)' },
  KA: { rep: 'dfb3d915-7d77-42b4-85ac-51424d6709ca', expr: '5532fe27-7fbb-44a6-8c09-8f37a5d59524', repFile: REFDIR + '/K_A_rep_new.png', exprFile: REFDIR + '/K_A_expr.png', name: 'Child KA (girl 6-7)', short: 'Child KA', height: 120, kid: true,
        desc: 'European girl aged 6-7, about 120 cm tall, round cheerful face, big bright smile; a small young child (NOT a pre-teen, NOT an adult).',
        hair: 'light-brown hair in two braided pigtails (the braids start behind the ears and hang forward over the shoulders), a small blue hair clip on one side of the head, soft wispy baby hairs; no other hairstyle',
        expr_text: 'bright happy natural smile', panel: "panel 3 'bright smile'", kor: '아동A(6~7세·120cm)' },
  KB: { rep: '29a122b6-18b2-40a7-b772-9388d8c5dae1', expr: '5d663461-c1e6-460c-84c0-d3b7bdf55682', repFile: REFDIR + '/K_B_rep_new.png', exprFile: REFDIR + '/K_B_expr.png', name: 'Child KB (girl 10-12)', short: 'Child KB', height: 150, kid: true,
        desc: 'European girl aged 10-12, about 150 cm tall, freckles across the nose and cheeks, slim pre-teen build, natural friendly smile (NOT an adult).',
        hair: 'long straight auburn (red-brown) hair reaching below the shoulders, centre parting, NO bangs/fringe; no other hairstyle, not wavy, not braided',
        expr_text: 'natural friendly smile (never neutral or blank)', panel: "panel 3 'bright smile' or panel 2 'soft smile'", kor: '아동B(12세·150cm)' },
}

const OUTFIT = {
  C_W_C_01: { id: 'bd1bb025-1b7d-4a53-968b-a2f423003308', file: REFDIR + '/C_W_C_01.jpg', desc: 'plain white short-sleeve fitted crop T-shirt (crew neck, cropped at the waist) + navy wide-leg trousers with fine pinstripes (high-waisted, full length, relaxed straight wide leg).', feet: 'Bare feet - no socks, no shoes.', kor: '화이트티+네이비 슬랙스(C_W_C_01)' },
  B_W_C_01: { id: '864239fa-0954-4417-82f5-ef1f9f2b5a1c', file: REFDIR + '/B_W_C_01.jpg', desc: 'heather light-grey short-sleeve fitted crop T-shirt + light-wash blue denim Bermuda shorts (knee length, relaxed fit, elastic waistband).', feet: 'Bare feet - no socks, no shoes.', kor: '그레이티+데님쇼츠(B_W_C_01)' },
  A_M_C_02: { id: 'bfe9ae41-01f9-4fdf-b6a0-d0564b0108af', file: PODDIR + '/A_M_C_02.jpg', desc: 'plain white short-sleeve crew-neck T-shirt (regular fit) + black wide-leg slacks (full length, relaxed straight leg).', feet: 'Bare feet - no socks, no shoes.', kor: '화이트티+블랙슬랙스(A_M_C_02)' },
  KID_A_01: { id: 'a9e59427-7f9f-442e-9e90-5f2574f3f241', file: REFDIR + '/KID_A_01.jpg', desc: 'light-grey short-sleeve T-shirt with a small pastel palm-tree beach graphic on the chest + cream cotton shorts.', feet: 'White ankle socks, no shoes.', kor: 'KID_A_01 고정의상(그레이 프린트티+크림 반바지)' },
  KID_B_01: { id: 'b0cb42a5-5091-44a6-9d99-c0f074b6659e', file: REFDIR + '/KID_B_01.jpg', desc: "ivory ringer T-shirt with grey collar and sleeve trims and a red 'LITTLE DEPT' chest print + heather-grey shorts with white piping trim.", feet: 'Cream ankle socks, no shoes.', kor: 'KID_B_01 고정의상(아이보리 링거티+그레이 숏팬츠)' },
}

const COLOR = {
  pastelblue: { id: '65a5a62a-1365-4870-b358-5b1fd4bb193d', name: 'pastel blue', hex: '#BEDDEF', desc: 'soft pastel sky-blue', avoid: 'aqua, mint, navy, grey or lavender', kor: '파스텔블루 #BEDDEF', key: 'pastelblue' },
  freshmint:  { id: '5ebdd121-397e-459a-8c04-68dcb52b9090', name: 'fresh mint', hex: '#B0EEE7', desc: 'soft pale mint - a light pastel aqua-green', avoid: 'turquoise, teal, sky-blue, pastel blue, grey or white', kor: '프레시민트 #B0EEE7', key: 'freshmint' },
  darkgrey:   { id: 'e6e0f4eb-5e07-4f7c-bfec-89b95bb5424c', name: 'dark grey', hex: '#353B3E', desc: 'deep charcoal dark grey with a faint cool-blue undertone', avoid: 'pure black, navy, brown-grey, light grey or silver', kor: '다크그레이 #353B3E', key: 'darkgrey' },
}

function scaleText(m) {
  if (!m.kid) return `ABSOLUTE SIZE RULE: the Pod is a fixed-size object (95 cm tall, 85 cm wide, 85 cm deep, 4.7 kg) - about waist-height of a standing adult and as wide as an adult shoulder span plus margin. When the ${m.height} cm adult sinks into it, the rear of the Pod rises to about head / ear height behind them and the sides wrap around the hips; the person sits deep INSIDE it. It is a big egg-shaped bean bag, NOT a small pouf.`
  if (m.height >= 140) return `ABSOLUTE SIZE RULE - VERY IMPORTANT: the Pod is a fixed-size object (95 cm tall, 85 cm wide, 85 cm deep); it does NOT shrink to fit a child. Child KB is only 150 cm tall, so relative to her the Pod is BIG: standing, it would reach her chest; seated in it, the rounded back rises clearly ABOVE the top of her head, the sides wrap around her shoulders, and the bag is about twice as wide as her shoulders. She is visibly small inside it. A Pod that looks like a child-sized chair is WRONG.`
  return `ABSOLUTE SIZE RULE - VERY IMPORTANT: the Pod is a fixed-size object (95 cm tall, 85 cm wide, 85 cm deep); it does NOT shrink to fit a child. Child KA is only 120 cm tall - the Pod is almost as tall as she is. Seated in it, the rounded back towers well above her head, the sides wrap around her whole upper body, she occupies only the middle of the seat and the bag is more than twice as wide as her shoulders; her feet reach only just past the front edge. She is clearly small inside a big bean bag. A Pod that looks like a child-sized chair is WRONG.`
}

function refList(group, cut) {
  const m = MODEL[group.model], o = OUTFIT[group.outfit], c = COLOR[group.color], p = POSE[cut.pose]
  const medias = [
    { role: 'image_references', value: p.shape }, { role: 'image_references', value: p.base },
    { role: 'image_references', value: m.rep }, { role: 'image_references', value: m.expr },
    { role: 'image_references', value: o.id }, { role: 'image_references', value: c.id } ]
  const text = `#1 = the product EMPTY (SHAPE reference - the bean bag must look exactly like this, only recoloured). #2 = pose reference with a model (POSE/ANGLE BASE only - ignore its room/background, its colour and its person). #3 = ${m.name} face reference. #4 = ${m.name} expression sheet (8 panels: 1 neutral, 2 soft smile, 3 bright smile, 4 surprised, 5 sad, 6 frown, 7 serious, 8 side-glance smile). #5 = outfit reference ${group.outfit}. #6 = colour swatch.`
  return { medias, text }
}

function buildPrompt(group, cut) {
  const p = POSE[cut.pose], m = MODEL[group.model], o = OUTFIT[group.outfit], c = COLOR[group.color]
  const refs = refList(group, cut)
  return `Photorealistic e-commerce lifestyle thumbnail, square 1:1, 2048px.

REFERENCES: ${refs.text}

TASK: Place ${m.short} into the ${c.name} Yogibo Pod bean bag of shape reference #1, in the exact pose and camera angle of #2, in a clean studio.

PRODUCT - Yogibo Pod (${c.name}): a big ROUND egg / teardrop-shaped SOFT BEAN BAG with a smooth seamless stretch cover. Silhouette exactly as #1: one continuous rounded bead-filled form; when someone sits in it the rear bulges up into a high rounded back and the front compresses into a low seat, the sides wrap around the sitter. Soft rounded everywhere. STRICTLY NO piping, NO seams, NO zipper, NO armrests, NO chair shape, NO flat panels, NO box cushions, NO visible brand tag or label, NO wrinkled deflated heap.
EXACT SIZE: 95 cm tall x 85 cm wide x 85 cm deep (4.7 kg). ${scaleText(m)}
COLOR: ${c.name} ${c.hex} - see colour swatch #6: the exact same ${c.desc} over the whole cover, never shifting toward ${c.avoid}. FABRIC: soft matte stretch cotton-spandex cover, smooth, seamless.

POSE LOCK (from #2 - pose and camera only): ${p.text}

PERSON - IDENTITY LOCK (${m.name} - face reference #3 and expression sheet #4, ${m.panel}): ${m.desc} HAIR: ${m.hair}. The face must be IDENTICAL to #3/#4 in every detail - same face shape, eyes, nose, mouth, skin, freckles, age and gender; do not beautify, age, or restyle. Expression: ${m.expr_text}.

OUTFIT (reference #5 - ${group.outfit}): ${o.desc} ${o.feet} No accessories, no logos other than the print described.

SCENE / LIGHT: clean studio, seamless background and floor in very light grey #f2f2f4 (NOT pure white; no room, no wooden deck or floor, no rug, no furniture, no window, no plants), soft diffused daylight from the front-left, natural soft contact shadow under the bean bag, no props except ${p.props}, no text, no watermark, no logo.

CAMERA: 50 mm look, ${p.cam}, the whole bean bag and the person fully in frame with comfortable margin, centered, square crop.`
}

const GROUPS = [
  { id: 'B_freshmint', model: 'B', color: 'freshmint', outfit: 'B_W_C_01', cuts: [
    { id: 'pod_b_freshmint_p1', pose: 1, file: 'cand_pod_freshmint_b_p1' },
    { id: 'pod_b_freshmint_p2', pose: 2, file: 'cand_pod_freshmint_b_p2' },
    { id: 'pod_b_freshmint_p3', pose: 3, file: 'cand_pod_freshmint_b_p3' },
    { id: 'pod_b_freshmint_p5', pose: 5, file: 'cand_pod_freshmint_b_p5' },
  ] },
  { id: 'C_darkgrey', model: 'C', color: 'darkgrey', outfit: 'C_W_C_01', cuts: [
    { id: 'pod_c_darkgrey_p5', pose: 5, file: 'cand_pod_darkgrey_c_p5' },
    { id: 'pod_c_darkgrey_p6', pose: 6, file: 'cand_pod_darkgrey_c_p6' },
    { id: 'pod_c_darkgrey_p1', pose: 1, file: 'cand_pod_darkgrey_c_p1' },
  ] },
  { id: 'KA_pastelblue', model: 'KA', color: 'pastelblue', outfit: 'KID_A_01', cuts: [
    { id: 'pod_ka_pastelblue_p1', pose: 1, file: 'cand_pod_pastelblue_ka_p1' },
    { id: 'pod_ka_pastelblue_p3', pose: 3, file: 'cand_pod_pastelblue_ka_p3' },
    { id: 'pod_ka_pastelblue_p4', pose: 4, file: 'cand_pod_pastelblue_ka_p4' },
  ] },
  { id: 'KB_freshmint', model: 'KB', color: 'freshmint', outfit: 'KID_B_01', cuts: [
    { id: 'pod_kb_freshmint_p3', pose: 3, file: 'cand_pod_freshmint_kb_p3' },
    { id: 'pod_kb_freshmint_p4', pose: 4, file: 'cand_pod_freshmint_kb_p4' },
    { id: 'pod_kb_freshmint_p6', pose: 6, file: 'cand_pod_freshmint_kb_p6' },
  ] },
  { id: 'MA_darkgrey', model: 'MA', color: 'darkgrey', outfit: 'A_M_C_02', cuts: [
    { id: 'pod_ma_darkgrey_p2', pose: 2, file: 'cand_pod_darkgrey_ma_p2' },
    { id: 'pod_ma_darkgrey_p4', pose: 4, file: 'cand_pod_darkgrey_ma_p4' },
    { id: 'pod_ma_darkgrey_p6', pose: 6, file: 'cand_pod_darkgrey_ma_p6' },
  ] },
]


const outList = []
for (const g of GROUPS) for (const cut of g.cuts) {
  const refs = refList(g, cut)
  outList.push({ cut_id: cut.id, file: cut.file, group: g.id, model: g.model, color: g.color, outfit: g.outfit, pose: cut.pose, pose_label: POSE[cut.pose].label, model_kor: MODEL[g.model].kor, outfit_kor: OUTFIT[g.outfit].kor, color_kor: COLOR[g.color].kor, medias: refs.medias, prompt: buildPrompt(g, cut) })
}
console.log(JSON.stringify(outList, null, 1))
