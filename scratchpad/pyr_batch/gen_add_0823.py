import json, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import gen_prompts as G
G.COLOR['cherry'] = dict(id='9c0a20c9-f430-4a66-bc12-af701b5028e1', name='cherry red', hex='#790619', desc='deep dark cherry red - a rich, slightly burgundy-leaning red', avoid='bright scarlet, orange-red, pink, wine-purple or brown', kor='체리레드 #790619')
ROUND = ("COMPRESSION / ROUNDNESS OVERRIDE (highest priority - see reference #7, a real photo of a child sitting on the same Yogibo Pyramid): the Pyramid is a SOFT bead-filled cushion. When someone sits or leans on it, it SQUASHES: its faces bulge OUTWARD in smooth convex rounded curves, the bottom edges spread and round off against the floor, the apex softens into a rounded point, and the whole silhouette reads as a plump, rounded triangular blob - NOT a crisp geometric pyramid with sharp straight edges and flat faces. Copy the soft rounded bulging look of #7 exactly (the same degree of roundness and squash), only the colour, the person and the scene differ. Keep the true compact size: 66 cm tall upright, 75 x 75 cm base - it never towers over the person.\n\n")
KBSIZE = ("SIZE LOCK: Child KB is 150 cm tall and the Pyramid is only 66 cm tall / 75 cm wide - when she leans or sits on it the apex reaches about her head/ear level at most and the base is only a little wider than her body; never oversized.\n\n")
PRESS = '07b2e755-407e-4802-bf09-5ef565381d8b'
# adult adaptations of the child poses
P2_ADULT = "the Pyramid lies TIPPED ON ITS SIDE so that its sloped face becomes a low backrest and its base becomes the seat; the woman sits on it like a low lounger, back against the slope, legs extended forward with ankles relaxed, holding a plain mug with both hands near her chest and smiling toward the camera; front three-quarter view at eye level."
P3_ADULT = "the Pyramid stands UPRIGHT on the floor (apex pointing up) behind the woman; she sits on the floor in front of it leaning back against its sloped face, legs straight out toward the camera crossed at the ankles, an open plain book resting on her lap held with both hands, looking up toward the camera with a soft smile; seen almost frontally at eye level."
P5_KID = "the Pyramid lies TIPPED ON ITS SIDE so that its sloped face becomes a low backrest and its base becomes the seat; the child sits on it like a low lounger holding a plain unbranded tablet with both hands in front of her chest, one fist raised beside the head in a cheerful 'yes!' gesture is NOT needed - instead she looks at the tablet with a happy smile and then toward the camera; legs extended forward with ankles crossed; front three-quarter view at eye level."
cuts = [
  dict(cut_id='pyr_kb_cherry_p1', file='cand_pyramid_cherry_kb_p1', group=dict(id='KB_cherry', model='KB', color='cherry', outfit='KID_B_01'), pose=1, ovr=ROUND+KBSIZE, ptext=None, kor='아동B(10~12세·150cm) · Pyramid 포즈1(세운 피라미드 기대 앉기·어깨너머 시선·pyramid_01 on/off 각도락)'),
  dict(cut_id='pyr_kb_cherry_p5', file='cand_pyramid_cherry_kb_p5', group=dict(id='KB_cherry', model='KB', color='cherry', outfit='KID_B_01'), pose=5, ovr=ROUND+KBSIZE, ptext=P5_KID, kor='아동B(10~12세·150cm) · Pyramid 포즈5(눕힌 피라미드 착석·태블릿·pyramid_05 on/off 각도락)'),
  dict(cut_id='pyr_b_blossompink_p2', file='cand_pyramid_blossompink_b_p2', group=dict(id='B_blossompink', model='B', color='blossompink', outfit='B_W_C_01'), pose=2, ovr=ROUND, ptext=P2_ADULT, kor='여성B(172cm) · Pyramid 포즈2(눕힌 피라미드 착석·머그·¾정면·pyramid_02 on/off 각도락)'),
  dict(cut_id='pyr_b_blossompink_p3', file='cand_pyramid_blossompink_b_p3', group=dict(id='B_blossompink', model='B', color='blossompink', outfit='B_W_C_01'), pose=3, ovr=ROUND, ptext=P3_ADULT, kor='여성B(172cm) · Pyramid 포즈3(세운 피라미드 앞 바닥 착석·독서·정면·pyramid_03 on/off 각도락)'),
]
out=[]
for c in cuts:
    orig = G.POSE[c['pose']]['text']
    if c['ptext']: G.POSE[c['pose']]['text'] = c['ptext']
    medias, prompt = G.build(c['group'], dict(pose=c['pose']))
    G.POSE[c['pose']]['text'] = orig
    medias = list(medias) + [dict(role='image_references', value=PRESS)]
    prompt = c['ovr'] + prompt.replace('#6 = colour swatch.', '#6 = colour swatch. #7 = compression / roundness reference (real photo - copy how softly the cushion squashes and rounds; ignore its person, colour and room).')
    out.append(dict(cut_id=c['cut_id'], file=c['file'], kor=c['kor'], color_kor=G.COLOR[c['group']['color']]['kor'], outfit=c['group']['outfit'], medias=medias, prompt=prompt))
json.dump(out, open('add_0823.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
for x in out: print(x['cut_id'], len(x['medias']), len(x['prompt']), '#7' in x['prompt'])
