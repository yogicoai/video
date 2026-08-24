# Double 올리브 · 여성B + 남성A · 포즈1/2/3 프롬프트 준비 (MCP 재연결 후 즉시 제출용)
import json
FTP = 'https://yogibo.openhost.cafe24.com/web/img/api/modal'
NONE = 'https://yogibo.openhost.cafe24.com/web/img/none'
MCP = {  # 이미 임포트된 media_id (MCP 재연결 시 그대로 유효하다고 가정; 아니면 media_import_url 재실행)
  'double_off_02': '0bc9ed4b-a7dd-4cf6-bb80-05d0b5e85151', 'double_on_02': '4ac5ab1f-9cba-4adf-a1c9-8d4e4f9a8b2a',
  'double_off_03': '8eb3cfe1-1a7f-4b43-bbf8-e5c2f9e0a5c5', 'double_on_03': 'bcfd4fdb-9dc1-42ac-9a32-3be30b7d2d74',
  'double_off_01': None, 'double_on_01': None,  # 미임포트 → `${NONE}/double/double_off_01.png`, `double_on_01.jpg`
  'B_rep': 'c0f9c804-38cf-44da-9a1b-459fb0d67c1e', 'B_expr': 'ef827b0e-4cf0-4d4a-b0d8-1287d1fdee16', 'B_W_C_01': '864239fa-0954-4417-82f5-ef1f9f2b5a1c',
  'MA_rep': 'e062cc45-1c4d-4d82-ab98-66b5266c2ef8', 'MA_expr': '5c37144b-39b8-49ed-9d55-7f27400cc9fb', 'A_M_C_02': 'bfe9ae41-01f9-4fdf-b6a0-d0564b0108af',
  'olive': '05441877-3ce2-4f88-b736-d21d5f187f16',
}
URL = {
  'double_off_01': f'{NONE}/double/double_off_01.png', 'double_on_01': f'{NONE}/double/double_on_01.jpg',
  'double_off_02': f'{NONE}/double/double_off_02.png', 'double_on_02': f'{NONE}/double/double_on_02.jpg',
  'double_off_03': f'{NONE}/double/double_off_03.png', 'double_on_03': f'{NONE}/double/double_on_03.jpg',
  'B_rep': f'{FTP}/B_B_rep.jpg?v=e2', 'B_expr': f'{FTP}/B_B_expr.png?v=v2', 'B_W_C_01': f'{NONE}/clothes/B_W_C_01.jpg',
  'MA_rep': f'{FTP}/M_A_rep.jpg?v=smile', 'MA_expr': f'{FTP}/M_A_expr.png?v=hair', 'A_M_C_02': f'{NONE}/clothes/A_M_C_02.jpg',
  'olive': f'{FTP}/swatch_olive_668B01.png',
}
POSES = {
  1: dict(orient='lying FLAT on the floor, lengthwise toward the camera, its far end bulging up into a soft headrest (exactly as #1/#2)',
          pose="the couple reclines side by side on the Double, lying back along its length with their heads at the far raised end: the man on the left with his arm around the woman, the woman on the right resting her head against his shoulder/chest, both legs extended toward the camera, both looking slightly off-camera to the side with relaxed natural smiles; seen from a front three-quarter angle slightly above eye level.",
          label='포즈1(나란히 누워 기대기·¾정면)'),
  2: dict(orient='lying FLAT on the floor like a large soft mattress (exactly as #1/#2)',
          pose="the man (left) and the woman (right) lie on their backs side by side on the Double, heads near the far edge, both laughing joyfully; the man has one arm raised with a fist and one leg lifted/bent, the woman raises one arm in a cheer with her legs extended; seen from an elevated front three-quarter angle.",
          label='포즈2(누워서 환호·¾정면 부감)'),
  3: dict(orient='propped UPRIGHT as a two-seat sofa - the back half folded up into a high soft backrest, the front half as the seat (exactly as #1/#2)',
          pose="the couple sits side by side in the sofa-shaped Double, the woman on the left leaning into the man's shoulder with her legs drawn up onto the seat, the man on the right with one arm behind her, both looking at each other with bright natural smiles; front three-quarter view at eye level.",
          label='포즈3(소파형 착석·마주보며 미소)'),
}
def prompt(p):
    P = POSES[p]
    return f"""Photorealistic e-commerce lifestyle thumbnail, square 1:1, 2048px.

REFERENCES: #1 = the product EMPTY (SHAPE reference - the Double must look exactly like this, only recoloured). #2 = pose reference with two models (POSE/ANGLE BASE only - ignore its room, colour and people). #3 = Model B (woman) face reference. #4 = Model B expression sheet. #5 = Model MA (man) face reference. #6 = Model MA expression sheet. #7 = outfit reference for the woman (B_W_C_01). #8 = outfit reference for the man (A_M_C_02). #9 = colour swatch.

TASK: Place Model B and Model MA together on the olive green Yogibo Double bean bag of shape reference #1, in the exact pose and camera angle of #2, in a clean studio.

PRODUCT - Yogibo Double (olive green): an extra-large two-person bean bag, 170 cm long x 120 cm wide x 45 cm thick (13.2 kg) - a soft bead-filled slab with a smooth stretch cover and a single lengthwise seam dividing it into two soft lobes; soft rounded edges; it dents and bulges under the people's weight. ORIENTATION: {P['orient']}. SCALE: as long as an adult is tall (170 cm) and nearly twice the width of a single bean bag - two adults fit side by side with room; it is low (45 cm thick). NO piping, NO zipper, NO armrests, NO wooden frame, NO visible brand tag.
COLOR: olive green #668B01 - see colour swatch #9: the exact same saturated yellow-green olive over the whole cover, never shifting toward khaki-brown, dark forest green, neon lime, grey-green or teal. FABRIC: soft matte stretch cotton-spandex cover.

POSE LOCK (from #2 - pose and camera only): {P['pose']}

PEOPLE - IDENTITY LOCK (faces must be IDENTICAL to the references in every detail; do not beautify, age, restyle or swap):
- WOMAN = Model B (face #3, expression sheet #4, panel 2 soft smile / panel 3 bright smile): European woman in her early 20s, soft oval face, light calm eyes, faint freckles across the nose and cheeks, natural no-makeup look, 172 cm slim long-limbed build. HAIR: long light-chestnut-brown hair below the shoulders in soft loose waves, centre parting, NO bangs (not auburn, not red, not blonde, not dark brown).
- MAN = Model MA (face #5, expression sheet #6, panel 2 soft smile / panel 3 bright smile): European man in his late 20s, clean-cut athletic build, 180 cm, clean-shaven, defined jaw. HAIR: medium-length dark-brown tousled wavy hair swept loosely back/sideways off the forehead, covering the tops of the ears (not short-cropped, not blonde).

OUTFITS: WOMAN (reference #7 - B_W_C_01): heather light-grey short-sleeve fitted T-shirt + light-wash blue denim Bermuda shorts (knee length, relaxed fit). MAN (reference #8 - A_M_C_02): plain white short-sleeve crew-neck T-shirt (regular fit) + black wide-leg slacks (full length). Both barefoot - no socks, no shoes, no accessories, no logos.

SCENE / LIGHT: clean studio, seamless background and floor in very light grey #f2f2f4 (NOT pure white; no room, no wooden floor, no rug, no furniture, no plants, no window), soft diffused daylight from the front-left, natural soft contact shadow under the Double, no props, no text, no watermark, no logo.

CAMERA: 50 mm look, same view and eye level as the pose reference, the whole Double and both people fully in frame with comfortable margin, centered, square crop."""
out = []
for p in (1, 2, 3):
    keys = [f'double_off_0{p}', f'double_on_0{p}', 'B_rep', 'B_expr', 'MA_rep', 'MA_expr', 'B_W_C_01', 'A_M_C_02', 'olive']
    out.append(dict(cut_id=f'dbl_olive_bma_p{p}', file=f'cand_double_olive_bma_p{p}', pose=p, label=POSES[p]['label'],
                    mcp_media_ids=[MCP[k] for k in keys], image_urls=[URL[k] for k in keys], prompt=prompt(p)))
json.dump(out, open('double_olive_bma.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for o in out: print(o['cut_id'], len(o['prompt']), 'missing_mcp_ids' if None in o['mcp_media_ids'] else 'mcp_ok')
