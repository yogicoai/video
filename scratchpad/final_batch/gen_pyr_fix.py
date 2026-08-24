# Pyramid fixes: kb_p3 (softer apex), ka_p3 (slightly smaller), fa_lightgrey_p5 (new, female model A)
import json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pyr_batch'))
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pyr_batch'))
import gen_prompts as G   # (re-writes the original 8-cut files; harmless)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

G.MODEL['FA'] = dict(rep='a0b826fd-3cf5-4695-af79-6717eae1d1fd', expr='56465048-8961-47da-b897-7262c424e530', name='Model FA (woman A)', short='Model FA', height=168, kid=False,
    desc='European woman in her mid 20s, oval face with soft defined features, dark brown eyes, fair skin, natural no-makeup look, 168 cm slim build, calm minimal vibe.',
    hair='very dark brown / near-black chin-to-jaw-length textured bob, centre parting, NO bangs/fringe, slightly tousled ends; no other hairstyle, not long, not blonde',
    expr_text='natural soft smile (bright smile for the cheering pose; never neutral or blank)', panel="panel 2 'soft smile' / panel 3 'bright smile'", kor='여성A(168cm)')
G.OUTFIT['A_W_C_01'] = dict(id='b45211d0-16d5-4048-b9d1-4f23f6230dfe', desc='fitted chocolate-brown short-sleeve crop T-shirt (crew neck) + heather-grey wide-leg sweat trousers (elastic waistband, full length).', feet='Bare feet - no socks, no shoes.', kor='브라운티+그레이스웻(A_W_C_01)')

APEX = ("SHAPE OVERRIDE (highest priority, fixes a previous attempt): the Pyramid's apex must be SOFT and ROUNDED like the empty shape reference #1 - a plump bead-filled cushion whose top is a gently rounded, slightly slumped point, with soft bulging faces; NOT a sharp, tall, thin spike or needle-like tip. Keep the true proportions: 66 cm tall, 75 x 75 cm base - roughly as wide as it is tall, squat rather than tall.\n\n")
SMALLER = ("SIZE OVERRIDE (highest priority, fixes a previous attempt that rendered the cushion too big): the Pyramid is a compact 66 cm tall x 75 x 75 cm floor cushion. For this 120 cm child sitting on the floor in front of it, the apex should reach only a little above the top of her head (not far above), and the base should be about twice her shoulder width - slightly smaller than the previous attempt, while still clearly larger than the child. Keep the soft rounded apex of reference #1 (not a sharp spike).\n\n")

cuts = [
  dict(cut_id='pyr_kb_blossompink_p3_v2', file='cand_pyramid_blossompink_kb_p3', group=dict(id='KB_blossompink', model='KB', color='blossompink', outfit='KID_B_01'), pose=3, ovr=APEX),
  dict(cut_id='pyr_ka_pastelblue_p3_v2', file='cand_pyramid_pastelblue_ka_p3', group=dict(id='KA_pastelblue', model='KA', color='pastelblue', outfit='KID_A_01'), pose=3, ovr=SMALLER),
  dict(cut_id='pyr_fa_lightgrey_p5', file='cand_pyramid_lightgrey_fa_p5', group=dict(id='FA_lightgrey', model='FA', color='lightgrey', outfit='A_W_C_01'), pose=5, ovr=''),
]
out = []
for c in cuts:
    medias, prompt = G.build(c['group'], dict(pose=c['pose']))
    out.append(dict(cut_id=c['cut_id'], file=c['file'], group=c['group']['id'], model=c['group']['model'], color=c['group']['color'], outfit=c['group']['outfit'], pose=c['pose'],
                    pose_label=G.POSE[c['pose']]['label'], model_kor=G.MODEL[c['group']['model']]['kor'], outfit_kor=G.OUTFIT[c['group']['outfit']]['kor'], color_kor=G.COLOR[c['group']['color']]['kor'],
                    medias=medias, prompt=c['ovr'] + prompt))
json.dump(out, open('pyr_cuts.json', 'w', encoding='utf-8'), ensure_ascii=False)
for x in out: print(x['cut_id'], x['file'], len(x['medias']), len(x['prompt']))
