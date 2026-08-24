# Pyramid 8-cut prompt builder -> batch_requests.json (+ prompts.json with metadata)
import json

POSE = {
  1: dict(base='fcf20caf-b5a0-42d6-b669-92b992fa06f6', shape='05b30efb-12c7-4002-8224-8a45cb3b83c0',
          text="the Pyramid stands UPRIGHT on the floor (apex pointing up) and the person sits on the floor in front of it, leaning their back against its sloped face; knees bent up with the feet flat on the floor, one hand resting on the floor beside the hip, the other arm relaxed on a knee; head turned to look back over the shoulder toward the camera with a gentle natural smile; seen from a three-quarter side angle at eye level.",
          props='nothing', cam='same three-quarter side view and eye level as the pose reference', label='포즈1(바닥 착석·세운 피라미드에 기대기·¾측면)', orient='upright'),
  2: dict(base='8dc69f92-6cd6-4bdb-8ee1-05d57bf6b2c8', shape='11f98b6c-dcd0-410c-b3dd-8d5f92048591',
          text="the Pyramid lies TIPPED ON ITS SIDE so that its sloped face becomes a low backrest and its base becomes the seat; the child sits on it like a low lounger, back against the slope, legs extended forward with ankles relaxed, hugging a small plain plush animal toy against the chest with both arms; head toward the camera with a happy natural smile; front three-quarter view at eye level.",
          props='the small plain plush toy', cam='same front three-quarter view and eye level as the pose reference', label='포즈2(눕힌 피라미드에 착석·인형 안기·¾정면)', orient='tipped'),
  3: dict(base='94010b61-98dc-4196-b27f-779b760c6d0a', shape='5fbf5a0e-c0b7-4418-bcb1-af4c7994b643',
          text="the Pyramid stands UPRIGHT on the floor (apex pointing up) behind the child; the child sits on the floor in front of it leaning back against its sloped face, legs straight out toward the camera, a small plain plush animal toy held between the knees with both hands; seen almost frontally at eye level; head toward the camera with a cheerful natural smile.",
          props='the small plain plush toy', cam='same near-frontal view and eye level as the pose reference', label='포즈3(세운 피라미드 앞 바닥 착석·인형·정면)', orient='upright'),
  5: dict(base='e5503a1c-5720-4b78-b1b8-ecceb93121aa', shape='1da75fb2-79a2-4733-af52-e2c7e81cf38c',
          text="the Pyramid lies TIPPED ON ITS SIDE so that its sloped face becomes a low backrest and its base becomes the seat; the person sits on it like a low lounger with a compact plain unbranded laptop open on the lap, one hand on the laptop, the other fist raised beside the head in a cheerful 'yes!' gesture, legs extended forward with ankles crossed; front three-quarter view at eye level; head toward the camera with a bright happy smile.",
          props='the compact plain unbranded laptop', cam='same front three-quarter view and eye level as the pose reference', label='포즈5(눕힌 피라미드에 착석·랩탑·환호·¾정면)', orient='tipped'),
}

MODEL = {
  'B':  dict(rep='c0f9c804-38cf-44da-9a1b-459fb0d67c1e', expr='ef827b0e-4cf0-4d4a-b0d8-1287d1fdee16', name='Model B (woman)', short='Model B', height=172, kid=False,
             desc='European woman in her early 20s, soft oval face, light calm eyes, faint freckles across the nose and cheeks, natural no-makeup look, 172 cm slim long-limbed build, fresh natural vibe.',
             hair='long light-chestnut-brown hair falling below the shoulders in soft loose waves, centre parting, NO bangs/fringe; hair colour is light chestnut brown (not auburn, not red, not blonde, not dark brown)',
             expr_text='natural soft smile (bright smile for the cheering pose; never neutral or blank)', panel="panel 2 'soft smile' / panel 3 'bright smile'", kor='B(172cm)'),
  'MA': dict(rep='e062cc45-1c4d-4d82-ab98-66b5266c2ef8', expr='5c37144b-39b8-49ed-9d55-7f27400cc9fb', name='Model MA (man)', short='Model MA', height=180, kid=False,
             desc='European man in his late 20s, clean-cut athletic build, 180 cm, clean-shaven, defined jaw, warm natural smile.',
             hair='medium-length dark-brown tousled wavy hair with natural volume, swept loosely back/sideways off the forehead, covering the tops of the ears; no other hairstyle, not short-cropped, not blonde',
             expr_text='natural soft smile (bright smile for the cheering pose; never neutral or blank)', panel="panel 2 'soft smile' / panel 3 'bright smile'", kor='남성A(180cm)'),
  'KA': dict(rep='dfb3d915-7d77-42b4-85ac-51424d6709ca', expr='5532fe27-7fbb-44a6-8c09-8f37a5d59524', name='Child KA (girl 6-7)', short='Child KA', height=120, kid=True,
             desc='European girl aged 6-7, about 120 cm tall, round cheerful face, big bright smile; a small young child (NOT a pre-teen, NOT an adult).',
             hair='light-brown hair in two braided pigtails (the braids start behind the ears and hang forward over the shoulders), a small blue hair clip on one side of the head, soft wispy baby hairs; no other hairstyle',
             expr_text='bright happy natural smile', panel="panel 3 'bright smile'", kor='아동A(6~7세·120cm)'),
  'KB': dict(rep='29a122b6-18b2-40a7-b772-9388d8c5dae1', expr='5d663461-c1e6-460c-84c0-d3b7bdf55682', name='Child KB (girl 10-12)', short='Child KB', height=150, kid=True,
             desc='European girl aged 10-12, about 150 cm tall, freckles across the nose and cheeks, slim pre-teen build, natural friendly smile (NOT an adult).',
             hair='long straight auburn (red-brown) hair reaching below the shoulders, centre parting, NO bangs/fringe; no other hairstyle, not wavy, not braided',
             expr_text='natural friendly smile (never neutral or blank)', panel="panel 3 'bright smile' or panel 2 'soft smile'", kor='아동B(12세·150cm)'),
}

OUTFIT = {
  'B_W_C_01': dict(id='864239fa-0954-4417-82f5-ef1f9f2b5a1c', desc='heather light-grey short-sleeve fitted crop T-shirt + light-wash blue denim Bermuda shorts (knee length, relaxed fit, elastic waistband).', feet='Bare feet - no socks, no shoes.', kor='그레이티+데님쇼츠(B_W_C_01)'),
  'A_M_C_02': dict(id='bfe9ae41-01f9-4fdf-b6a0-d0564b0108af', desc='plain white short-sleeve crew-neck T-shirt (regular fit) + black wide-leg slacks (full length, relaxed straight leg).', feet='Bare feet - no socks, no shoes.', kor='화이트티+블랙슬랙스(A_M_C_02)'),
  'KID_A_01': dict(id='a9e59427-7f9f-442e-9e90-5f2574f3f241', desc='light-grey short-sleeve T-shirt with a small pastel palm-tree beach graphic on the chest + cream cotton shorts.', feet='White ankle socks, no shoes.', kor='KID_A_01 고정의상'),
  'KID_B_01': dict(id='b0cb42a5-5091-44a6-9d99-c0f074b6659e', desc="ivory ringer T-shirt with grey collar and sleeve trims and a red 'LITTLE DEPT' chest print + heather-grey shorts with white piping trim.", feet='Cream ankle socks, no shoes.', kor='KID_B_01 고정의상'),
}

COLOR = {
  'blossompink': dict(id='8958ea24-4593-4bb8-9dc6-ece89dcda025', name='blossom pink', hex='#E5B9C8', desc='soft dusty blossom pink (a muted light rose)', avoid='hot pink, coral, peach, lavender, red or white', kor='블라썸핑크 #E5B9C8'),
  'pastelblue':  dict(id='65a5a62a-1365-4870-b358-5b1fd4bb193d', name='pastel blue', hex='#BEDDEF', desc='soft pastel sky-blue', avoid='aqua, mint, navy, grey or lavender', kor='파스텔블루 #BEDDEF'),
  'lightgrey':   dict(id='ea1c25a1-eb67-47bb-a889-4f20c0f8e7a1', name='light grey (warm greige)', hex='#E5DED3', desc='warm light grey / greige with a faint beige undertone - clearly a warm fabric tone, visibly darker and warmer than the cool #f2f2f4 studio background', avoid='pure white, cool silver grey, beige-brown, taupe or cream-yellow', kor='라이트그레이 #E5DED3'),
}

def scale_text(m, orient):
    if not m['kid']:
        s = f"ABSOLUTE SIZE RULE: the Pyramid is a fixed-size object (66 cm tall when standing upright, 75 x 75 cm base, 2.2 kg) - about knee-height of a standing adult. "
        if orient == 'upright': s += f"For the {m['height']} cm adult sitting on the floor in front of it, the apex reaches about the shoulder / base of the neck; the base is about as wide as the adult's shoulders plus a margin. It is a compact floor cushion, not a sofa."
        else: s += f"When tipped on its side the sloped face makes a low backrest about 75 cm long that reaches the seated {m['height']} cm adult's mid-back; the adult's legs extend well past it onto the floor. It is a compact floor cushion, not a sofa."
        return s
    if m['height'] >= 140:
        s = "ABSOLUTE SIZE RULE - VERY IMPORTANT: the Pyramid is a fixed-size object (66 cm tall upright, 75 x 75 cm base); it does NOT shrink for a child. "
        if orient == 'upright': s += "For child KB (150 cm) sitting on the floor in front of it, the apex reaches about the top of her head / ears; the base is clearly wider than her shoulders."
        else: s += "Tipped on its side it is a low lounger whose slope supports child KB (150 cm) up to her shoulder blades; her lower legs extend past the front edge."
        return s
    s = "ABSOLUTE SIZE RULE - VERY IMPORTANT: the Pyramid is a fixed-size object (66 cm tall upright, 75 x 75 cm base); it does NOT shrink for a child. "
    if orient == 'upright': s += "For child KA (120 cm) sitting on the floor in front of it, the apex rises clearly ABOVE her head and the base is much wider than her shoulders - she looks small in front of it."
    else: s += "Tipped on its side it is a low lounger whose slope supports child KA (120 cm) up to her shoulders / neck; she occupies only the middle of the seat and her feet reach just past the front edge - she looks small on it."
    return s

def build(group, cut):
    p = POSE[cut['pose']]; m = MODEL[group['model']]; o = OUTFIT[group['outfit']]; c = COLOR[group['color']]
    medias = [dict(role='image_references', value=p['shape']), dict(role='image_references', value=p['base']),
              dict(role='image_references', value=m['rep']), dict(role='image_references', value=m['expr']),
              dict(role='image_references', value=o['id']), dict(role='image_references', value=c['id'])]
    prompt = f"""Photorealistic e-commerce lifestyle thumbnail, square 1:1, 2048px.

REFERENCES: #1 = the product EMPTY (SHAPE reference - the cushion must look exactly like this, only recoloured). #2 = pose reference with a model (POSE/ANGLE BASE only - ignore its room/background, its colour and its person). #3 = {m['name']} face reference. #4 = {m['name']} expression sheet (8 panels: 1 neutral, 2 soft smile, 3 bright smile, 4 surprised, 5 sad, 6 frown, 7 serious, 8 side-glance smile). #5 = outfit reference {group['outfit']}. #6 = colour swatch.

TASK: Place {m['short']} with the {c['name']} Yogibo Pyramid floor cushion of shape reference #1, in the exact pose, cushion orientation and camera angle of #2, in a clean studio.

PRODUCT - Yogibo Pyramid ({c['name']}): a TRIANGULAR (tetrahedral) SOFT bead-filled FLOOR CUSHION - three sloped triangular faces meeting at a soft rounded apex, a flat triangular base; soft rounded edges, a smooth stretch cover, it dents and bulges softly where the person leans on it. Silhouette and orientation exactly as #1/#2 ({'standing upright, apex up' if p['orient']=='upright' else 'lying on its side, slope as backrest, base as seat'}). STRICTLY NO chair shape, NO round bean bag, NO armrests, NO piping, NO zipper, NO visible brand tag, NO square cube.
EXACT SIZE: 66 cm tall (upright) x 75 x 75 cm base, 2.2 kg. {scale_text(m, p['orient'])}
COLOR: {c['name']} {c['hex']} - see colour swatch #6: the exact same {c['desc']} over the whole cover, never shifting toward {c['avoid']}. FABRIC: soft matte stretch cotton-spandex cover.

POSE LOCK (from #2 - pose, cushion orientation and camera only): {p['text']}

PERSON - IDENTITY LOCK ({m['name']} - face reference #3 and expression sheet #4, {m['panel']}): {m['desc']} HAIR: {m['hair']}. The face must be IDENTICAL to #3/#4 in every detail - same face shape, eyes, nose, mouth, skin, freckles, age and gender; do not beautify, age, or restyle. Expression: {m['expr_text']}.

OUTFIT (reference #5 - {group['outfit']}): {o['desc']} {o['feet']} No accessories, no logos other than the print described.

SCENE / LIGHT: clean studio, seamless background and floor in very light grey #f2f2f4 (NOT pure white; no room, no coloured wall, no carpet, no furniture, no window, no plants), soft diffused daylight from the front-left, natural soft contact shadow under the cushion and the person, no props except {p['props']}, no text, no watermark, no logo.

CAMERA: 50 mm look, {p['cam']}, the whole cushion and the person fully in frame with comfortable margin, centered, square crop."""
    return medias, prompt

GROUPS = [
  dict(id='B_blossompink', model='B', color='blossompink', outfit='B_W_C_01', cuts=[dict(id='pyr_b_blossompink_p1', pose=1, file='cand_pyramid_blossompink_b_p1'), dict(id='pyr_b_blossompink_p5', pose=5, file='cand_pyramid_blossompink_b_p5')]),
  dict(id='KA_pastelblue', model='KA', color='pastelblue', outfit='KID_A_01', cuts=[dict(id='pyr_ka_pastelblue_p2', pose=2, file='cand_pyramid_pastelblue_ka_p2'), dict(id='pyr_ka_pastelblue_p3', pose=3, file='cand_pyramid_pastelblue_ka_p3')]),
  dict(id='MA_lightgrey', model='MA', color='lightgrey', outfit='A_M_C_02', cuts=[dict(id='pyr_ma_lightgrey_p1', pose=1, file='cand_pyramid_lightgrey_ma_p1'), dict(id='pyr_ma_lightgrey_p5', pose=5, file='cand_pyramid_lightgrey_ma_p5')]),
  dict(id='KB_blossompink', model='KB', color='blossompink', outfit='KID_B_01', cuts=[dict(id='pyr_kb_blossompink_p2', pose=2, file='cand_pyramid_blossompink_kb_p2'), dict(id='pyr_kb_blossompink_p3', pose=3, file='cand_pyramid_blossompink_kb_p3')]),
]

reqs, meta = [], []
i = 0
for g in GROUPS:
    for cut in g['cuts']:
        i += 1
        medias, prompt = build(g, cut)
        reqs.append(dict(index=i, params=dict(model='nano_banana_pro', aspect_ratio='1:1', resolution='2k', count=1, medias=medias, prompt=prompt)))
        meta.append(dict(index=i, cut_id=cut['id'], file=cut['file'], group=g['id'], model=g['model'], color=g['color'], outfit=g['outfit'], pose=cut['pose'], pose_label=POSE[cut['pose']]['label'], model_kor=MODEL[g['model']]['kor'], outfit_kor=OUTFIT[g['outfit']]['kor'], color_kor=COLOR[g['color']]['kor']))
json.dump(reqs, open('batch_requests.json', 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(meta, open('prompts_meta.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for m_ in meta: print(m_['index'], m_['cut_id'], m_['file'])
print('prompt chars', [len(r['params']['prompt']) for r in reqs])
