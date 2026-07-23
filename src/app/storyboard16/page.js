'use client';

import { useState } from 'react';

// 16차 프로젝트 — 팍스 홈캉스 (2026-07-16)
// 모토: "집에서 즐기는 홈캉스 — 맥스 네이비 + 서포트와 함께하는 편안한 라이프스타일"
// 엔진 = Kling 3.0 · 9초 · 9:16 · 팍스 Element(yogibo-fox-3view)

const FOX_EL = 'b16db188-8273-4c0f-94da-cf65b9832919';
const MAX_NAVY_EL = 'eeddd2d7-32c2-42b7-884e-724f44e3df8d';
const SUPPORT_EL = 'df13043f-ea98-453e-8353-c159bd56c4ae'; // v2 — 치수(76×94cm) 포함 재생성본


// ★ 확보 자산 — 14차에서 생성된 제품 조합컷 (웹 UI Unlimited · 무료). 홈캉스 키프레임 재료로 재사용
const CA = 'https://yogibo.kr/web/img/video/ca';
const caUrl = (n) => `${CA}/${encodeURIComponent(n)}.png`;

const HAVE = [
  ['팍스_맥스_네이비', '맥스 네이비에 파묻혀 잠든 팍스', '★ 홈캉스 본편 — K1/K2 베이스로 바로 사용 가능'],
  ['팍스_서포트_그린', 'U자 서포트 안에 쏙 앉은 팍스', '★ 서포트 조합 — 제품 사용법이 한눈에'],
  ['팍스_맥스_아쿠아', '아쿠아 맥스에 늘어진 팍스', '색 대비용 · 여름 무드에 잘 맞음'],
  ['팍스_문필로우_올리브', '문필로우를 껴안은 팍스', '목 받침 — 홈캉스 소품으로 추가 가능'],
  ['팍스_메이트_엘리', '메이트 옐리·옥토푸스와 함께', '친구들과 함께 — 마지막 컷 후보'],
  ['팍스_라운드필로우', '라운드필로우 위에 선 팍스', '오프닝 후보(높은 곳에서 뛰어내리는 시작)'],
];

const POSES = [
  ['환영', '두 팔 벌려 환영'], ['오른쪽_가리키기', '오른쪽 가리키기'], ['왼쪽_가리키기', '왼쪽 가리키기'],
  ['위_가리키기', '위 가리키기'], ['아래_가리키기', '아래 가리키기'], ['엄지척_윙크', '엄지척·윙크'],
  ['박수', '박수'], ['확성기', '확성기 손'], ['하트_손', '하트 손'],
  ['놀람', '놀람(꼬리 부풂)'], ['졸림', '졸림(꼬리 처짐)'], ['뿌듯', '뿌듯'], ['실망', '실망'],
  ['손_흔들기', '손 흔들기'], ['걷기', '걷기'], ['앉기', '앉기'], ['밀기', '밀기'], ['들기', '들기'],
  ['좌측배치_우측여백', '좌측배치·우측여백'], ['상단배치', '상단배치·하단여백'],
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: '홈캉스 · 10초 · 9:16 · 2컷 × 5초 · K1 공유로 이음매 락 (2026-07-20 확정)' },
  { stage: 'STAGE 1 · 에셋', s: '✅ 확보', note: '팍스 Element(3면) · 맥스 네이비 Element · 서포트 그린 Element — 전부 락 완료' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '컷별 첫/끝 프레임 + 프롬프트' },
  { stage: 'STAGE 3 · 키프레임', s: '⬜ K0부터', note: '3장 전부 신규 — K0(세계 정의) → K1(K0 파생) → K2(K1 파생) · Seedream 4.5 1cr씩' },
  { stage: 'STAGE 4 · 영상화', s: '✅ v1 완성', note: '9초 원컷 15.75cr — 스틸 NSFW 오탐 회피 위해 K0 start_image로 직행. 서사·정체성·세계 유지' },
  { stage: 'STAGE 5 · 후반', s: '🟡 선택', note: '음원·로고·4K 업스케일 — 전부 무료 · 컴펌 후 진행' },
];

const COST = [
  ['Kling 3.0 · 9s · pro · 무음', '15.75cr', 'A안 원컷 기준'],
  ['Kling 3.0 · 5s · pro · 무음', '8.75cr', 'B안 컷당'],
  ['Kling 3.0 · 4s · pro · 무음', '7cr', 'B안 컷당(짧은 컷)'],
  ['Kling 3.0 · 9s · pro · 오디오 on', '22.5cr', '파도·매미·에어컨 사운드가 필요하면'],
  ['이미지 (웹 UI Unlimited)', '0cr', '키프레임 몇 장이든 무료'],
];

// A안 — 9초 원컷 (첫/끝 프레임)
const PLAN_A = [
  { t: '0–3s', title: '도착', desc: '팍스가 맥스 네이비 앞에 서서 기대에 찬 표정 — 뒤로 커튼 사이 여름 햇살, 옆에 서포트가 놓여 있다. 꼬리가 신나게 흔들린다.' },
  { t: '3–6s', title: '다이브', desc: '몸을 던져 맥스에 풀썩 파묻힌다. 패브릭이 몸무게에 눌리며 가장자리가 몸을 감싼다. 서포트에 팔을 걸친다.' },
  { t: '6–9s', title: '홈캉스', desc: '완전히 늘어져 만족스러운 표정. 꼬리가 느리게 살랑, 눈이 스르륵 감긴다. 창밖 햇살이 방을 천천히 훑는다.' },
];

// ★ 최종 구조 (2026-07-20 사용자 확정) — 2컷 × 5초 = 10초
// 핵심: K1을 C1의 끝 / C2의 첫으로 공유 → 이음매가 픽셀 단위로 맞음 (13차 검증)
// 그리고 모든 키프레임을 하나의 거실에서 파생 → 세계가 튀지 않음
const PLAN_B = [
  { c: 'C1', t: '0–5s', title: '더위 → 발견 → 다이브', start: 'K0 · 더위에 지쳐 들어옴', end: 'K1 · 서포트에 등 기대고 안착',
    act: '축 처진 꼬리로 들어온 팍스가 거실의 맥스+서포트를 발견 → 귀가 쫑긋, 꼬리가 살아나고 → 달려가 몸을 던진다. 서포트 U자에 등이 안기고 팔이 팔걸이에 걸린다', cost: '8.75cr' },
  { c: 'C2', t: '5–10s', title: '홈캉스 완성', start: 'K1 · 안착 (C1과 동일 프레임)', end: 'K2 · 음료 들고 늘어짐',
    act: '더 깊이 가라앉으며 시원한 음료를 홀짝. 선풍기 바람에 꼬리털이 날리고, 눈이 스르륵 감기며 만족스러운 미소. 창밖 더위와 실내의 시원함이 대비된다', cost: '8.75cr' },
];

// 키프레임 3장 — 전부 신규, 하나의 거실에서 파생
const KF_B = [
  { id: 'K0', file: null, have: false, title: '더위에 지쳐 들어옴', note: '🆕 세계 정의 — 이 방·조명·소품이 전 컷의 기준' },
  { id: 'K1', file: null, have: false, title: '다이브 안착 (공유 프레임)', note: '🆕 K0 레퍼런스로 파생 — C1 끝 = C2 첫' },
  { id: 'K2', file: null, have: false, title: '홈캉스 완성', note: '🆕 K1 레퍼런스로 파생 — C2 끝' },
];

const KEYFRAMES = [
  {
    id: 'K0', title: '더위에 지쳐 들어옴 — 세계 정의 (신규)',
    p: `A cosy Korean living room on a hot summer afternoon. Bright harsh sunlight outside the window, sheer curtains glowing, a fan in the corner, a woven rug, a small side table with a tall iced drink beading with condensation. Warm cinematic light, shallow depth of field.

On the rug lies <<<${MAX_NAVY_EL}>>> the deep navy Yogibo Max, laid out FLAT like a long low mattress — 170cm long, nearly twice the fox's height.

<<<${SUPPORT_EL}>>> the lime green U-shaped Yogibo Support sits ON TOP of the Max near its head end, used as a big backrest: the U opens toward the camera, its two thick arms spanning almost the full width of the Max and curving forward like armrests. Its arms are as thick as the fox's torso — it is a large piece of soft furniture, not a small cushion.

<<<${FOX_EL}>>> the fox character has just walked in and stands at the edge of the room, worn out by the heat — shoulders drooping, mouth slightly open, TAIL HANGING LIMP behind him. He has not noticed the Max yet.

Wide shot showing the whole room, the whole Max and the whole Support. 9:16 vertical. No text, no lettering, no logos.

FILE: 홈캉스_K0.png`,
  },
  {
    id: 'K1', title: '다이브 안착 — 공유 프레임 (K0 레퍼런스로)',
    p: `Same room as the reference image — identical living room, identical window and curtains, identical light, identical rug, fan and side table with the iced drink, the same navy Yogibo Max lying flat with the same lime green U-shaped Support on top of it as a backrest.

THE ONLY CHANGE: the fox has thrown himself onto the Max and landed. He is now reclining on it with his BACK NESTLED INTO THE CURVE OF THE U-SHAPED SUPPORT, both arms resting on top of the Support's thick arms. The Max's stretch fabric dents under his weight and rises around his body. His tail is up and alive again, curled happily beside him. Delighted, relieved expression.

Same camera angle, slightly closer. 9:16 vertical. No text, no logos.

REFERENCE: 홈캉스_K0.png 첨부
FILE: 홈캉스_K1.png`,
  },
  {
    id: 'K2', title: '홈캉스 완성 — 끝 프레임 (K1 레퍼런스로)',
    p: `Same room and same pose as the reference image — identical living room, identical light, the fox reclining on the navy Max with his back in the U-shaped green Support, arms on its arms.

THE ONLY CHANGE: he has sunk deeper and is now completely at ease — one paw holding the tall iced drink, taking a sip through a straw, eyes closed in blissful contentment with a small happy smile. His tail is draped loosely and swaying gently in the breeze from the fan. The afternoon light has warmed and lengthened across the room.

Same camera angle. 9:16 vertical. No text, no logos.

REFERENCE: 홈캉스_K1.png 첨부
FILE: 홈캉스_K2.png`,
  },
];

const VIDEO_PROMPTS = [
  { c: 'C1', label: 'C1 · 더위 → 발견 → 다이브 (start=K0, end=K1) · 5s · 8.75cr', p: `<<<${FOX_EL}>>> the fox character comes home worn out by the summer heat and throws himself onto <<<${MAX_NAVY_EL}>>> the navy Yogibo Max.

He stands at the edge of the room with his shoulders drooping and his tail hanging limp. Then he spots the Max with the green Support on it — his ears prick up, his eyes brighten and his tail springs back to life. He rushes over and LETS HIMSELF FALL onto it, landing with his back nestled into the curve of the U-shaped Support, both arms coming to rest on top of its arms. The stretch fabric dents deeply and rises around his body.

Camera LOCKED OFF — no zoom, no pan. Same cosy Korean living room throughout, hot summer afternoon light through sheer curtains. Soft cinematic look. No text, no logos.` },
  { c: 'C2', label: 'C2 · 홈캉스 완성 (start=K1, end=K2) · 5s · 8.75cr', p: `<<<${FOX_EL}>>> the fox character settling into a perfect staycation on <<<${MAX_NAVY_EL}>>> the navy Yogibo Max with the green U-shaped Support as his backrest.

Reclining with his back in the curve of the Support, he wriggles down and sinks deeper into the bean bag. He reaches over, picks up the tall iced drink from the side table and takes a long sip through the straw. His tail sways gently in the breeze from the fan. Then he lets the drink rest, closes his eyes and melts into the seat with a small blissful smile.

Camera LOCKED OFF — no zoom, no pan. Same room, same warm afternoon light slowly deepening. Soft cinematic look. No text, no logos.` },
];

function Copy({ label, text, accent = '#FF7043' }) {
  const [c, setC] = useState(false);
  async function go() {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setC(true); setTimeout(() => setC(false), 1600);
  }
  return (
    <div style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`, borderRadius: 8, padding: 10, background: 'var(--bg-elev)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <b style={{ fontSize: 12.5, flex: 1 }}>{label}</b>
        <button onClick={go}
          style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${c ? '#4CAF50' : 'var(--border)'}`, background: c ? '#4CAF50' : 'none', color: c ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
          {c ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>
      <pre style={{ margin: 0, fontSize: 10, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: 'var(--text-dim)', maxHeight: 200, overflow: 'auto' }}>{text}</pre>
    </div>
  );
}

export default function Storyboard16Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🏖 팍스 홈캉스 — 집에서 즐기는 여름휴가</h1>
          <p className="page-desc">
            16차 · 9:16 · <b>10초 (2컷 × 5초)</b> · Kling 3.0 · 팍스가 <b>맥스 네이비 + 서포트</b>에서 즐기는 홈캉스 ·
            모토: <b>&quot;집에서 즐기는 편안한 라이프스타일&quot;</b>
          </p>
        </div>
      </div>

      <div className="note" style={{ marginBottom: 18, padding: 14 }}>
        <b style={{ fontSize: 13.5 }}>🚦 게이트 파이프라인</b>
        <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
          {GATES.map((g) => (
            <div key={g.stage} style={{ display: 'flex', gap: 10, fontSize: 12.5, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 150px', fontWeight: 700 }}>{g.stage}</span>
              <span style={{ flex: '0 0 110px' }}>{g.s}</span>
              <span style={{ color: 'var(--text-dim)' }}>{g.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 컨셉 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 컨셉</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8, borderLeft: '3px solid #FF7043' }}>
        <b>&quot;홈캉스&quot;</b> — 멀리 안 가도, 집에서 맥스와 서포트만 있으면 그게 휴가다.<br />
        · <b>주인공</b>: 팍스 (Element 락 · 90cm · 꼬리가 감정을 말함)<br />
        · <b>제품</b>: <b>맥스 네이비</b>(눕는 자리) + <b>서포트 그린</b>(머리·팔 받침) — 두 제품의 <b>조합 사용</b>이 메시지<br />
        · <b>무드</b>: 여름 오후, 커튼 사이 햇살, 시원한 음료, 늘어짐<br />
        · <b>메시지 라인</b>: 서 있음(기대) → 다이브(해방) → 늘어짐(만족) — <b>대사 없이 몸으로</b>
      </div>

      {/* 확보 자산 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ 확보 자산 — 14차 조합컷 6종 (무료 · 재사용)</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.7, marginBottom: 10, borderLeft: '3px solid #4CAF50' }}>
        <b style={{ color: '#FFB300' }}>키프레임으로는 쓰지 않습니다</b> — 4장이 각각 다른 방·앵글·조명이라 이어붙이면 컷마다 세계가 튑니다(2026-07-20 판단).
        대신 <b>팍스가 각 제품을 어떻게 쓰는지의 자세 참고</b>와 <b>이벤트 배너 소재</b>로 활용합니다.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 14 }}>
        {HAVE.map(([f, t, note]) => (
          <a key={f} href={caUrl(f)} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
            <img src={caUrl(f)} alt={t}
              style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 8, border: note.startsWith('★') ? '2px solid #4CAF50' : '1px solid var(--border)', display: 'block' }} />
            <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.45 }}>
              <b>{t}</b>
              <div style={{ color: note.startsWith('★') ? '#4CAF50' : 'var(--text-dim)', fontSize: 10.5 }}>{note}</div>
            </div>
          </a>
        ))}
      </div>

      {/* 포즈 라이브러리 */}
      <details className="note" style={{ padding: 12, marginBottom: 14 }}>
        <summary style={{ cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>
          🦊 팍스 포즈 라이브러리 20종 — 후속 컷·이벤트 배너용 (펼치기)
        </summary>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8, marginTop: 10 }}>
          {POSES.map(([f, t]) => (
            <a key={f} href={caUrl(f)} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
              <img src={caUrl(f)} alt={t}
                style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', display: 'block' }} />
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, textAlign: 'center' }}>{t}</div>
            </a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
          프롬프트 전문은 <a href="/storyboard14" style={{ color: 'var(--accent)' }}>14차 페이지</a>에 복사 버튼과 함께 있습니다.
        </div>
      </details>

      {/* ★ 완성 영상 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ 완성 영상 — 홈캉스 v1 (9초 · Kling 3.0 · 2026-07-21)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, borderLeft: '4px solid #4CAF50', background: 'rgba(76,175,80,.06)' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4CAF50', marginBottom: 4 }}>▶ 1.3배 크롭 (확정)</div>
            <video src="/homecance/homecance_v1_crop.mp4?v=1" controls loop autoPlay muted playsInline
              style={{ width: 240, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '4px solid #4CAF50', display: 'block' }} />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>원본 (여백 많음)</div>
            <video src="/homecance/homecance_v1.mp4?v=1" controls loop muted playsInline
              style={{ width: 150, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '1px solid var(--border)', opacity: .6, display: 'block' }} />
          </div>
          <div style={{ flex: '1 1 320px', fontSize: 12.5, lineHeight: 1.9, color: 'var(--text-dim)' }}>
            <b style={{ color: '#4CAF50', fontSize: 13.5 }}>✅ 9초 원컷 완성 (15.75cr)</b><br />
            지쳐 귀가 → 맥스+서포트 발견(귀 쫑긋) → 다이브 → 음료 집어 마시며 늘어짐 = 홈캉스 완성. <b>K0 v3를 start_image로</b> Kling이 전 서사를 애니메이션.<br />
            <b style={{ color: 'var(--text)' }}>QC</b>: 스토리 아크 ✅ · 캐릭터 정체성 전 구간 유지 ✅ · 세계(여름 거실·선풍기·아이스 음료) 유지 ✅ · <b>서포트가 등받이로 제 역할</b> ✅(영상에선 크기 문제 완화) · 카메라 고정 ✅<br />
            <b style={{ color: '#FFB300' }}>제작 노트</b>: K1·K2 스틸이 <b>NSFW 오탐 3회</b>(전부 환불)로 막힘 → <b>스틸 대신 K0에서 영상으로 직행</b>이 정답. 빈백에 기댄 포즈+캐릭터 조합이 이미지 분류기 오탐을 부름.<br />
            <b style={{ color: 'var(--text)' }}>비용 정산</b>: 스틸 K0 6cr(5시도, NSFW 환불 제외) + 영상 15.75cr = <b>~21.75cr</b><br />
            <b style={{ color: '#4CAF50' }}>1.3배 크롭 확정</b>(2026-07-21): 맥스가 화면 대비 커서 여백이 많던 원본을 crop=830x1477+punch-in으로 재프레이밍 → 팍스+제품이 프레임을 채우고 여름 방 분위기 유지 · 무료(ffmpeg)<br /><b style={{ color: 'var(--text)' }}>다음(선택)</b>: 음원(Pixabay 무료 여름 트랙) · 로고 엔딩 · 4K 업스케일 — 전부 0원
          </div>
        </div>
      </div>

      {/* K0 생성 이력 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ K0 생성 이력 — 서포트 스케일 문제 (2026-07-20)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, borderLeft: '3px solid #E53935' }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 200px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E53935', marginBottom: 4 }}>v1 · Seedream 4.5 (1cr)</div>
            <a href="/homecance/k0_v1.png" target="_blank" rel="noreferrer">
              <img src="/homecance/k0_v1.png?v=1" alt="K0 v1"
                style={{ width: '100%', borderRadius: 10, border: '2px solid #E53935', display: 'block' }} />
            </a>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.5 }}>
              🔴 <b>서포트가 목베개 크기</b>로 렌더 · 원인 = 서포트 Element에 <b>치수 정보가 없었음</b>(팍스 90cm·맥스 170cm는 있는데 서포트만 없음)
            </div>
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FFB300', marginBottom: 4 }}>v2 · 스케일 앵커 적용 (1cr)</div>
            <a href="/homecance/k0_v2.png" target="_blank" rel="noreferrer">
              <img src="/homecance/k0_v2.png?v=1" alt="K0 v2"
                style={{ width: '100%', borderRadius: 10, border: '2px solid #FFB300', display: 'block' }} />
            </a>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.5 }}>
              🟡 서포트 Element를 <b>치수 포함(76×94cm)으로 재생성</b> + 프롬프트에 인체 대비 앵커 이중 투입 → <b>소폭 개선되었으나 여전히 작음</b>
            </div>
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FFB300', marginBottom: 4 }}>v3 · 새 스토리·맥스 위 배치 (1cr)</div>
            <a href="/homecance/k0_v3.png" target="_blank" rel="noreferrer">
              <img src="/homecance/k0_v3.png?v=1" alt="K0 v3"
                style={{ width: '100%', borderRadius: 10, border: '2px solid #FFB300', display: 'block' }} />
            </a>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.5 }}>
              🟢 <b>세계는 완벽</b>(여름 거실·선풍기·아이스 음료·매트리스형 맥스·팍스 정체성) / 🔴 서포트 여전히 목베개 크기 — <b>U자 형태의 사전관념이 텍스트로는 안 깨짐</b>
            </div>
          </div>
          <div style={{ flex: '1 1 280px', fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-dim)' }}>
            <b style={{ color: 'var(--text)' }}>진단</b> — 서포트 <b>실측 76W × 94H × 30D cm</b>. 맥스 폭(70cm)보다 넓고, <b>팍스 키(90cm)와 거의 같은 높이</b>입니다.
            두 버전 모두 목베개 수준으로 축소 렌더 — 12차 맥스 &quot;공 모양/침대급&quot; 전투와 동일한 구조의 문제.<br />
            <b style={{ color: 'var(--text)' }}>결론 (v1~v3 모두 서포트 축소)</b>: U자 형태가 &quot;목베개&quot; 사전관념이 너무 강해 <b>Element+텍스트 앵커로는 안 잡힘</b>. 12차 팟 로켓 교정처럼 <b>실물 사진을 image_reference로 직접 첨부</b>해야 함.<br />
            <b style={{ color: '#4CAF50' }}>다음 액션</b>: 사용자가 서포트 실사(사람이 기대 앉은 컷)를 <code>/ca/support_ref.png</code>로 업로드 → 그걸 참조로 K0 재생성(1cr)
          </div>
        </div>
      </div>

      {/* B안 확정 컷보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ 확정 구조 — 2컷 × 5초 = 10초 (총 20.5cr)</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.7, marginBottom: 10, borderLeft: '3px solid #4CAF50' }}>
        <b style={{ color: '#4CAF50' }}>왜 2컷인가</b> — <b>K1을 C1의 끝이자 C2의 첫으로 공유</b>하면 이음매가 픽셀 단위로 맞아 두 컷이 한 호흡으로 읽힙니다(13차 검증).
        컷이 적을수록 세계가 튈 지점도 줄고, 3컷안(25cr)보다 쌉니다.<br />
        <b style={{ color: '#E53935' }}>14차 조합컷 재사용은 폐기</b> — 4장이 각각 다른 방·다른 앵글·다른 조명이라 이어붙이면 스토리가 성립하지 않음(2026-07-20 사용자 지적).
        <b>모든 키프레임을 K0의 거실에서 파생</b>시켜 하나의 세계로 통일합니다.
      </div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {PLAN_B.map((b) => (
          <div key={b.c} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.7 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14, color: '#4CAF50' }}>{b.c}</b>
              <span className="badge badge-review" style={{ fontSize: 10.5 }}>{b.t}</span>
              <b>{b.title}</b>
              <div style={{ flex: 1 }} />
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 11.5 }}>{b.cost}</span>
            </div>
            <div style={{ color: 'var(--text-dim)', marginTop: 4 }}>{b.act}</div>
            <div style={{ fontSize: 11.5, marginTop: 4 }}>
              <b style={{ color: '#FF7043' }}>START</b> {b.start} <span style={{ color: 'var(--text-dim)' }}>→</span> <b style={{ color: '#4CAF50' }}>END</b> {b.end}
            </div>
          </div>
        ))}
      </div>

      {/* 키프레임 4장 상태 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>키프레임 3장 — 전부 신규 (하나의 거실에서 파생)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 12 }}>
        {KF_B.map((k) => (
          <div key={k.id}>
            {k.have ? (
              <a href={caUrl(k.file)} target="_blank" rel="noreferrer">
                <img src={caUrl(k.file)} alt={k.title}
                  style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 8, border: '2px solid #4CAF50', display: 'block' }} />
              </a>
            ) : (
              <div style={{ width: '100%', aspectRatio: '3 / 4', borderRadius: 8, border: '2px dashed #FF7043', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7043', fontSize: 26 }}>＋</div>
            )}
            <div style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.45 }}>
              <b>{k.id} · {k.title}</b>
              <div style={{ color: k.have ? '#4CAF50' : '#FF7043', fontSize: 10.5 }}>{k.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 키프레임 프롬프트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 키프레임 프롬프트 (웹 UI · 무료)</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.7, marginBottom: 10, color: 'var(--text-dim)' }}>
        <b style={{ color: 'var(--text)' }}>K0만 새로 생성</b>하고, K1·K2는 <b>K0를 레퍼런스로 첨부</b>해 &quot;여기서 이어서&quot; 방식으로 뽑습니다(13차 검증). Element 토큰 3개(팍스·맥스·서포트)가 들어가 있어 제품 형태·색이 자동으로 잡힙니다.<br />
        A안이면 <b>K0·K2</b>만, B안이면 <b>K0·K1·K2</b> 전부 필요합니다. 파일명은 <code>홈캉스_K0.png</code> 식으로 <code>/ca/</code>에 올려주세요.
      </div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {KEYFRAMES.map((k) => (
          <Copy key={k.id} label={`${k.id} — ${k.title}`} text={k.p} />
        ))}
      </div>

      {/* 영상 프롬프트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 컷별 영상 프롬프트 (Kling 3.0 · 5초 · pro · 무음)</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {VIDEO_PROMPTS.map((v) => (
          <Copy key={v.c} label={v.label} text={v.p} accent="#4CAF50" />
        ))}
      </div>

      {/* 비용 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 실측 단가 (2026-07-16 프리플라이트)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 30 }}>
        <div style={{ display: 'grid', gap: 5 }}>
          {COST.map(([k, v, n]) => (
            <div key={k} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 240px' }}>{k}</span>
              <b style={{ flex: '0 0 70px', color: 'var(--accent)' }}>{v}</b>
              <span style={{ color: 'var(--text-dim)' }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.6 }}>
          <b>규칙</b>: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 1건씩 실행.<br />
          <b>왜 Kling인가</b>: 다이브·파묻힘 같은 <b>몸의 물리</b>가 승부처이고 카메라는 고정 → start/end 프레임 락이 정확히 그 일. 캐릭터라 얼굴 재해석 리스크도 낮음.
        </div>
      </div>
    </>
  );
}
