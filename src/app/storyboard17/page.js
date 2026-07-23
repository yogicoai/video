'use client';

import { useState } from 'react';

// 17차 프로젝트 — 가족 요기보 3탄 "비교" (Seedance 30초 풀리메이크)
// 2026-07-22 힉스필드(Seedance 2.0)로 제작 완료 → 클라우드 프로젝트 유실 → 로컬 자산으로 복원(2026-07-23)
// 원작 = 10차 가족 3탄 "노는 자리"(Kling). 동일 캐스팅(엄마+딸)으로 하루 아크를 Seedance 5컷×6초=30초로 리메이크.

// ── Element 락 (힉스필드 · 단일 워크스페이스) ─────────────────────
const EL = {
  mom:     'f761df4a-63b7-4197-93ab-8e7d20f83b4a', // 한국인 엄마 (가족 3탄 캐스팅)
  dau:     'b4eaaa37-584b-44cd-969a-0f5dce24af04', // 2–3세 딸
  maxNavy: 'eeddd2d7-32c2-42b7-884e-724f44e3df8d', // 맥스 네이비
  podOlive:'8f120498-f4b5-4c18-90d5-fe54a3d7a015', // 팟 올리브 그린
  squeez:  '4bc58f63-c49d-4235-9e84-694fa45a54d0', // 스퀴지보 캐릭터 쿠션
  trex:    '70e77c1d-13c5-4670-b85a-d8b12e0a28a9', // 빨간 티렉스 인형
};

const ELEMENTS = [
  ['엄마 (한국인, 20대)', EL.mom, '가족 3탄 캐스팅 재사용 — 전 컷 동일 인물'],
  ['딸 (2–3세 유아)', EL.dau, '전 컷 동일 인물 · 얼굴 락'],
  ['맥스 네이비', EL.maxNavy, 'S1·S2·S5 바닥 빈백 (170cm 매트리스형)'],
  ['피라미드(올리브)', EL.podOlive, 'S4 창가 까꿍 놀이 — 영상에서 피라미드 형태로 보임'],
  ['스퀴지보 캐릭터 쿠션', EL.squeez, 'S3 쌓기 탑 (몬스터·강아지·여우·유니콘)'],
  ['빨간 티렉스 인형', EL.trex, 'S2 놀이 · S5 취침 소품'],
];

// ── 힉스필드 원본 생성물 (CloudFront) — 유실 대비 소스 보관 ──────────
const HF = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';

// ── 5컷 (하루 아크: 아침 기상 → 낮 놀이 ×3 → 저녁 취침) ─────────────
const CUTS = [
  {
    id: 'S1', t: '0–6s', title: '아침 — 함께 기상',
    local: '/fam3s/s1_v1.mp4', still: '/fam3s/s1_still_v1.png',
    hfId: '5b83ea1b-6ae2-415d-923f-a69faa76879c',
    hf: `${HF}/hf_20260722_145141_5b83ea1b-6ae2-415d-923f-a69faa76879c.mp4`,
    els: ['mom', 'dau'],
    desc: '네이비 맥스에서 함께 자던 모녀 → 딸이 먼저 깨 엄마 볼을 톡톡 → 엄마도 깨어 따뜻한 미소 → 볼 비비기. 부드러운 아침 햇살.',
    prompt: `One continuous unbroken 6-second take, cinematic 16:9, INTIMATE warm handheld, CHARACTER-FOCUSED close on the people — a tender close character moment, NOT a distant wide observer shot. Start from the provided start image: a young Korean mother <<<${EL.mom}>>> and her 2-3 year old toddler daughter <<<${EL.dau}>>> napping cuddled together, nestled in a deep NAVY BLUE Yogibo Max floor bean bag, cozy Korean apartment living room, soft morning light — but the camera immediately moves IN toward them and stays close. Keep BOTH the mother and the daughter the SAME people as in the start image the whole time. 0-1.5s: they are still asleep, peaceful, gentle breathing; camera drifts slowly IN toward their faces in the soft morning glow. 1.5-3s: the little girl wakes first, opens her eyes and gently pats her sleeping mother's cheek with her small hand, a playful little tap - camera now CLOSE on the two of them, their faces filling the frame. 3-5s: the mother wakes with a warm loving smile, opens her eyes and looks tenderly at her daughter; the child giggles - intimate close two-shot, camera softly following their faces and expressions. 5-6s: still cuddled in the navy bean bag, the mother nuzzles her daughter's cheek, a warm happy family morning, held close and tender. Camera: intimate character-centered handheld that MOVES WITH the mother and child and stays close on their faces - never pulling back to a detached wide observer view. The navy bean bag stays deep navy under them, a low floor cushion. Family-friendly warm bright commercial tone, photorealistic, natural anatomy, consistent identity. ABSOLUTELY NO text, NO subtitles, NO logos, NO captions, NO graphics anywhere.`,
  },
  {
    id: 'S2', t: '6–12s', title: '낮 — 티렉스 놀이',
    local: '/fam3s/s2_v1.mp4', still: '/fam3s/s2_still_v1.png',
    hfId: '67b0fa2d-441d-450c-951b-f4d57ff39f52',
    hf: `${HF}/hf_20260722_150145_67b0fa2d-441d-450c-951b-f4d57ff39f52.mp4`,
    els: ['mom', 'dau', 'trex'],
    desc: '네이비 맥스에서 딸이 빨간 티렉스를 "으르렁" 하며 엄마에게 → 엄마 놀란 척 간지럽히기 → 함께 까르르 웃으며 맥스에 다시 파묻힘.',
    prompt: `One continuous unbroken 6-second take, cinematic 16:9, INTIMATE warm handheld, CHARACTER-FOCUSED close on the people — a joyful close play moment, NOT a distant wide observer shot. Start from the provided start image: the SAME young Korean mother <<<${EL.mom}>>> in a grey top and her 2-3 year old toddler daughter <<<${EL.dau}>>> awake and playing, sitting cuddled in the deep NAVY BLUE Yogibo Max floor bean bag in the same cozy Korean living room, the little girl holding up a small RED T-rex plush <<<${EL.trex}>>>. Keep BOTH the mother and the daughter the SAME people the whole time. 0-2s: the little girl playfully makes the red T-rex plush 'roar' and bounces it toward her mother, giggling - camera close on the two of them, faces filling frame. 2-4s: the mother playfully acts surprised and gently nuzzles and tickles her daughter, the T-rex bumping softly between them; both burst into warm rolling waves of laughter. 4-6s: they cuddle back into the navy bean bag together, warm and happy, the little girl hugging the T-rex to her chest. Camera: intimate character-centered handheld staying close on their faces and playful gestures, moving with them - never pulling back to a detached wide observer view. The navy bean bag stays deep navy, a low floor cushion. Natural wave-like laughter that rises and settles, not a frozen grin. Family-friendly warm bright commercial tone, photorealistic, natural anatomy, consistent identity, both faces always the same people. ABSOLUTELY NO text, NO subtitles, NO logos, NO captions, NO graphics anywhere.`,
  },
  {
    id: 'S3', t: '12–18s', title: '낮 — 쿠션 탑 쌓기',
    local: '/fam3s/s3_v1.mp4', still: '/fam3s/s3_still_v1.png',
    hfId: '44038688-d362-4ba1-80f8-dd552b9ea5a1',
    hf: `${HF}/hf_20260722_151711_44038688-d362-4ba1-80f8-dd552b9ea5a1.mp4`,
    els: ['mom', 'dau', 'squeez'],
    fix: '🎥 러프2 처리 — 쓰러진 스퀴지보가 어색해서, 토플 후(~3s) 아이·엄마 쪽으로 자연스러운 카메라 무빙(펀치인 줌)을 걸어 바닥 토이를 화면 밖으로 크롭. 그래서 끝까지(6s) 사용. (근본 교정=큐브 재생성은 별도 대기)',
    desc: '알파벳 매트에서 초소형 스퀴지보(5.5cm 손바닥 크기, 골프공·마카롱 정도)를 손가락 끝으로 흔들흔들 탑 쌓기 → 와르르 → 모녀 폭소, 딸 박수, 엄마가 안아줌.',
    prompt: `Steady handheld 8-second take, cinematic 16:9, warm and intimate, close on the mother and toddler and the tiny toy tower. Start from the corrected start image. Keep the SAME young Korean mother and her 2-3 year old toddler daughter the whole time. The Squeezibo stay TINY — palm-sized 5.5 cm squishy character toys (golf-ball / macaron sized, each fits inside the toddler's hand, pinched with her fingertips), a small low stack about 25-30 cm tall, NEVER large cushions or blocks. Characters: green T-rex, cream puppy, orange fox, purple unicorn, small blue one. 0-3s: the little girl carefully balances one more tiny Squeezibo on top of the small wobbly tower with her fingertips, tongue out in concentration; the mother watches with a proud loving smile. 3-4.5s: the little tower wobbles and topples, the tiny soft toys tumbling onto the play mat. 4.5-8s: the mother and daughter burst into warm rolling laughter, the girl clapping, the mother pulling her into a hug. Slow, tender, unhurried pacing, gentle natural handheld with no big zoom. Photorealistic, natural anatomy, correct real-world scale. NO text, NO subtitles, NO logos.`,
  },
  {
    id: 'S4', t: '18–24s', title: '낮 — 피라미드 까꿍 놀이',
    local: '/fam3s/s4_v1.mp4', still: '/fam3s/s4_still_v1.png',
    hfId: 'fef76ead-2d0c-499b-97c0-6320b09fc317',
    hf: `${HF}/hf_20260722_152019_fef76ead-2d0c-499b-97c0-6320b09fc317.mp4`,
    els: ['mom', 'dau', 'podOlive'],
    desc: '창가에서 올리브 그린 피라미드에 딸이 폭 파묻히며 까꿍 → 웃음. 러프2에선 파묻히는 앞 4초를 살려서 사용(사용자 컴펌).',
    prompt: `Start from the provided start image. Steady handheld 8-second take, cinematic 16:9, warm and intimate. Keep the SAME mother and toddler daughter and the olive green Yogibo Pod. CRITICAL: the toddler's full body and BOTH legs stay clearly visible and complete the ENTIRE time — natural complete anatomy, never any missing, merged, or vanishing limbs; her legs drape over the front of the pod. 0-3s: the little girl ducks down behind the front of the pod hiding her face, then POPS UP peeking over the edge with a big giggle as the mother playfully says peekaboo. 3-5s: the mother gently rocks the soft pod side to side; the girl giggles and wriggles cozily, legs still visible. 5-8s: the girl flops back happily into the soft pod, the mother laughing warmly and stroking her hair, both legs visible. Slow, tender, gentle handheld, no big zoom. Photorealistic, natural anatomy, correct real-world scale. NO text, NO subtitles, NO logos.`,
  },
  {
    id: 'S5', t: '24–30s', title: '저녁 — 취침 (마무리)',
    local: '/fam3s/s5_v1.mp4', still: '/fam3s/s5_still_v1.png',
    hfId: '43feeeb1-35ef-4cd1-a6df-7e8e6101fbc3',
    hf: `${HF}/hf_20260722_152029_43feeeb1-35ef-4cd1-a6df-7e8e6101fbc3.mp4`,
    els: ['mom', 'dau', 'maxNavy', 'trex'],
    desc: '네이비 맥스에서 티렉스를 안고 잠든 딸 → 엄마가 니트 담요를 덮어주고 머리 쓰다듬기 → 옆에 나란히 눕는 하루의 조용한 마무리. 따뜻한 저녁 앰버.',
    prompt: `One continuous unbroken 6-second take, cinematic 16:9, INTIMATE warm TENDER handheld, CHARACTER-FOCUSED close on the people — NOT a distant wide observer shot. Start from the provided start image: the SAME young Korean mother <<<${EL.mom}>>> and her fast-asleep 2-3 year old toddler daughter <<<${EL.dau}>>> nestled together in the deep NAVY BLUE Yogibo Max <<<${EL.maxNavy}>>> floor bean bag, the little girl hugging a small RED T-rex plush <<<${EL.trex}>>>, warm amber evening light. Keep BOTH the mother and the daughter the SAME people the whole time. 0-2.5s: the little girl sleeps peacefully hugging her red T-rex, breathing softly; the mother gently tucks the soft knit blanket around her and lightly smooths her hair - camera close and tender on the sleeping child's face. 2.5-4.5s: the mother gazes lovingly at her sleeping daughter, then softly lowers her own head to rest beside her, cozy in the navy Max. 4.5-6s: they lie together peacefully in the warm evening glow, a calm quiet end-of-day moment. Camera: intimate character-centered handheld, slow and tender, staying close on their faces - never pulling back to a detached wide observer view. The navy bean bag stays deep navy, a low floor cushion. Calm peaceful soft mood. Family-friendly warm tender commercial tone, photorealistic, natural anatomy, consistent identity, both faces always the same people. ABSOLUTELY NO text, NO subtitles, NO logos, NO captions, NO added graphics.`,
  },
];

const ROUGH = [
  { file: '/fam3s/rough2_music.mp4', label: 'rough2_music', dur: '34.5s', res: '1920×1080', note: '★ 러프2 — 로고 인트로(깨끗한 브랜드로고, 볼 만질 때 사라짐) · S1 슬로우 · S2 전체 · S3 전체(펀치인:토플후 아이엄마쪽 줌인) · S4 0~4s · S5 전체 · 엔딩 화이트페이드→로고 리빌 + 음원', primary: true },
  { file: '/fam3s/rough2.mp4', label: 'rough2', dur: '34.5s', res: '1920×1080', note: '러프2 무음' },
  { file: '/fam3s/rough_v3_final_v2_clean_music.mp4', label: 'rough_v3_final_v2_clean_music', dur: '30.7s', res: '1920×1080', note: '2차본(AI 클린 · 슬로우 실험 · 보존)' },
  { file: '/fam3s/rough_v3_final_v2_music.mp4', label: 'rough_v3_final_v2_music', dur: '31.8s', res: '1920×1080', note: '2차 (클린 전 · 보존)' },
  { file: '/fam3s/rough_v3_final_music.mp4', label: 'rough_v3_final_music', dur: '33.9s', res: '1920×1080', note: '1차 보존 (음원 믹스)' },
  { file: '/fam3s/rough_v3_final.mp4', label: 'rough_v3_final', dur: '33.9s', res: '1920×1080', note: '1차 무음원본(원본 앰비언트)' },
  { file: '/fam3s/rough_v2.mp4', label: 'rough_v2', dur: '30.4s', res: '1920×1080', note: '중간본' },
  { file: '/fam3s/rough_v1.mp4', label: 'rough_v1', dur: '12.1s', res: '1920×1080', note: '초기 컷' },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: '가족 3탄 리메이크 · 16:9 · 30초 · 5컷×6초 · Seedance 2.0 · 하루 아크(기상→놀이×3→취침)' },
  { stage: 'STAGE 1 · 에셋', s: '✅ 확보', note: '엄마·딸 Element(3탄 캐스팅 재사용) + 맥스 네이비·피라미드(팟올리브)·스퀴지보·티렉스 Element 락' },
  { stage: 'STAGE 2 · 스토리보드', s: '✅ 확정', note: '5컷 서사 확정 — 이 페이지' },
  { stage: 'STAGE 3 · 스틸', s: '✅ 완료', note: 's1~s5 시작 스틸 5장 (Seedance start_image)' },
  { stage: 'STAGE 4 · 영상화', s: '✅ 완료', note: '5컷 각 6초 원테이크 (Seedance 2.0 · 캐릭터포커스 핸드헬드)' },
  { stage: 'STAGE 5 · 조립', s: '✅ 완료', note: '러프컷 v1→v2→v3_final(33.9s) + 4K 업스케일 + BGM(heartwarming)' },
];

function Copy({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); }}
      style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #444', background: ok ? '#2E7D32' : '#222', color: '#eee', cursor: 'pointer' }}
    >
      {ok ? '복사됨 ✓' : '프롬프트 복사'}
    </button>
  );
}

export default function Storyboard17() {
  const elName = (k) => ({ mom: '엄마', dau: '딸', maxNavy: '맥스 네이비', podOlive: '피라미드', squeez: '스퀴지보', trex: '티렉스' }[k] || k);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 20px 80px', color: '#e8e8e8', fontFamily: 'system-ui, "Malgun Gothic", sans-serif' }}>
      <a href="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← 홈</a>

      <h1 style={{ fontSize: 26, margin: '14px 0 6px' }}>🆚 가족 요기보 3탄 <span style={{ color: '#66BB6A' }}>비교</span> — Seedance 30초 리메이크</h1>
      <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>
        17차 · 16:9 · 30초 · 5컷×6초 · <b>Seedance 2.0</b> · 원작 = <a href="/storyboard10" style={{ color: '#66BB6A' }}>10차 가족 3탄 &quot;노는 자리&quot;(Kling)</a>.
        동일 캐스팅(엄마+딸)으로 <b>하루 아크</b>(아침 기상 → 낮 놀이 ×3 → 저녁 취침)를 Seedance로 풀리메이크한 <b>엔진 비교 완성본</b>.
      </p>

      {/* 복원 배너 */}
      <div style={{ background: '#1b2e1b', border: '1px solid #2E7D32', borderRadius: 10, padding: '14px 16px', margin: '16px 0 24px', fontSize: 13.5, lineHeight: 1.7 }}>
        ♻️ <b>복원 완료 (2026-07-23)</b> — 힉스필드 클라우드 프로젝트는 유실됐지만, <b>결과물은 로컬에 전부 보존</b>돼 있었습니다.
        러프컷(v1·v2·v3_final·4K) · 5컷 원본 · 시작 스틸 5장 · BGM 모두 <code style={{ color: '#9CCC65' }}>public/fam3s/</code>에 존재.
        힉스필드 원본 생성물 URL(CloudFront)도 각 컷에 함께 보관해 재유실에 대비했습니다.
      </div>

      {/* 최종 러프컷 */}
      <h2 style={{ fontSize: 19, margin: '28px 0 12px', borderLeft: '3px solid #66BB6A', paddingLeft: 10 }}>최종 러프컷</h2>
      <video controls src="/fam3s/rough2_music.mp4?v=r2j" poster="/fam3s/s1_still_v1.png"
        style={{ width: '100%', borderRadius: 12, background: '#000', aspectRatio: '16/9' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0 8px' }}>
        {ROUGH.map((r) => (
          <a key={r.file} href={`${r.file}?v=recover`} target="_blank" rel="noreferrer"
            style={{ fontSize: 12.5, padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
              border: `1px solid ${r.primary ? '#2E7D32' : '#444'}`, background: r.primary ? '#1e3a1e' : '#1a1a1a', color: '#ddd' }}>
            <b>{r.label}</b> · {r.dur} · {r.res} — {r.note}
          </a>
        ))}
      </div>
      <p style={{ color: '#888', fontSize: 12.5 }}>🎵 BGM: <code>bgm_heartwarming.mp3</code> (무료 소싱) — 음악 베드 + Seedance 원본 앰비언트(웃음소리) 낮게 믹스 · loudnorm -16 LUFS · 인/아웃 페이드</p>

      {/* 게이트 상태 */}
      <h2 style={{ fontSize: 19, margin: '32px 0 12px', borderLeft: '3px solid #66BB6A', paddingLeft: 10 }}>파이프라인 상태</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {GATES.map((g) => (
          <div key={g.stage} style={{ display: 'grid', gridTemplateColumns: '150px 66px 1fr', gap: 10, alignItems: 'center', fontSize: 13, padding: '8px 10px', background: '#161616', borderRadius: 8 }}>
            <b>{g.stage}</b><span>{g.s}</span><span style={{ color: '#aaa' }}>{g.note}</span>
          </div>
        ))}
      </div>

      {/* 5컷 */}
      <h2 style={{ fontSize: 19, margin: '32px 0 12px', borderLeft: '3px solid #66BB6A', paddingLeft: 10 }}>5컷 · 하루 아크</h2>
      <div style={{ display: 'grid', gap: 22 }}>
        {CUTS.map((c) => (
          <div key={c.id} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden' }}>
            <video controls src={`${c.local}?v=recover`} poster={c.still}
              style={{ width: '100%', display: 'block', background: '#000', aspectRatio: '16/9' }} />
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#66BB6A', background: '#1e3a1e', padding: '2px 8px', borderRadius: 6 }}>{c.id} · {c.t}</span>
                <b style={{ fontSize: 16 }}>{c.title}</b>
              </div>
              {c.fix && (
                <div style={{ background: '#2e2513', border: '1px solid #7a5c1e', borderRadius: 8, padding: '9px 12px', margin: '10px 0', fontSize: 12.5, lineHeight: 1.6, color: '#e6c86a' }}>{c.fix}</div>
              )}
              <p style={{ color: '#bbb', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0' }}>{c.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
                {c.els.map((k) => (
                  <span key={k} style={{ fontSize: 11.5, color: '#9CCC65', border: '1px solid #33502a', borderRadius: 5, padding: '2px 7px' }}>{elName(k)}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <Copy text={c.prompt} />
                <a href={c.hf} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #444', background: '#222', color: '#9CCC65', textDecoration: 'none' }}>힉스필드 원본 ↗</a>
                <span style={{ fontSize: 11, color: '#666', alignSelf: 'center' }}>gen: {c.hfId.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Element 레지스트리 */}
      <h2 style={{ fontSize: 19, margin: '32px 0 12px', borderLeft: '3px solid #66BB6A', paddingLeft: 10 }}>Element 락 (재생성용)</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {ELEMENTS.map(([name, id, note]) => (
          <div key={id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, fontSize: 12.5, padding: '8px 10px', background: '#161616', borderRadius: 8 }}>
            <b>{name}</b>
            <span style={{ color: '#aaa' }}><code style={{ color: '#9CCC65' }}>{id}</code><br />{note}</span>
          </div>
        ))}
      </div>

      <p style={{ color: '#666', fontSize: 12, marginTop: 28, lineHeight: 1.7 }}>
        제작 2026-07-22 (Seedance 2.0, 힉스필드) · 복원 2026-07-23 · 로컬 자산 <code>public/fam3s/</code> ·
        엔진 비교 대상 = 10차 Kling 버전. 두 엔진을 나란히 두고 연출 충실도·캐스팅 일관성·비용을 대조하는 것이 이 프로젝트의 목적.
      </p>
    </div>
  );
}
