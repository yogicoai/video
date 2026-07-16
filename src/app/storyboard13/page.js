'use client';

// 13차 프로젝트 — 클레이 미니어처 "바다 팝업스토어 메이킹" (2026-07-16 시작)
// 컨셉: 미니어처 사람들이 요기보 제품을 배치해 바다 컨셉 팝업스토어를 완성하는 과정
// 엔진 = Kling 3.0 (start_image + end_image 지원) · 사용자 제공 완성 키비주얼 = 끝 프레임

const KEYVISUAL = '/clay/base.png';

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ A안 확정', note: '4초 원컷 · 스틸 2cr + 영상 7cr = 9cr (2026-07-16 사용자 확정)' },
  { stage: 'STAGE 1 · 에셋', s: '✅ 끝 프레임 확보', note: '완성 디오라마 키비주얼(사용자 제공) = end_image로 확정 · 첫 프레임은 이 이미지를 편집해 생성' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '첫/끝 프레임 설계 + 그 사이 4~5초에 담을 동작' },
  { stage: 'STAGE 3 · 첫 프레임 스틸', s: '✅ v1 완료', note: 'nano_banana_2 2K 편집 2cr 사용 · 구도·질감·바다 요소 전부 보존, 인부 4명 배치 성공 — 컨펌 대기' },
  { stage: 'STAGE 4 · 영상화', s: '🟡 승인 대기', note: 'Kling 3.0 start_image(start_v1) → end_image(완성본) · 4s pro 무음 7cr — 첫 프레임 컨펌 후 실행' },
  { stage: 'STAGE 5 · 후반', s: '⬜', note: '로고·음원(선택) · 필요 시 업스케일(무료)' },
];

// 첫/끝 프레임 설계 — 이 방식의 핵심은 A→B가 명확할 것
const FRAMES = [
  {
    k: 'START (첫 프레임)', color: '#FF7043',
    title: '텅 빈 바다 팝업스토어 — 공사 시작',
    desc: '같은 아이소메트릭 앵글·같은 클레이 룩·같은 배치도. 단 풀데크 위에 요기보 제품이 아직 없다(바닥 타일과 yogibo 로고만). 주변 바다·모래·야자수·서프보드·튜브는 그대로. 미니어처 인부 여러 명이 제품을 옮기려 서 있거나 들고 있는 상태 — 팟을 굴리려 손을 얹고, 맥스를 둘러메고, 돗자리를 펴려 모서리를 잡고.',
    made: '🔧 제작 방법: 끝 프레임(키비주얼)을 nano_banana_2로 편집 — "제품만 비우고 인부 배치, 나머지 100% 동일" (2cr · 구도 픽셀 유지)',
  },
  {
    k: 'END (끝 프레임)', color: '#4CAF50',
    title: '완성된 팝업스토어 = 사용자 제공 키비주얼',
    desc: '맥스(네이비)·롤(브라운)·라운저(크림)·팟(블루/퍼플/레드)·피라미드(퍼플)가 제자리에 놓이고, 돗자리 위에 티렉스·유니콘 메이트와 미니 피규어·간식이 세팅된 완성 상태. 야자수·서프보드·튜브·바다 그대로.',
    made: '✅ 확보 완료 — 사용자 제공 원본을 그대로 end_image로 사용 (편집 없음 = 완성본 픽셀 보존)',
  },
];

// 그 사이 4~5초에 담을 동작
const BEATS = [
  { t: '0–1.5s', title: '운반 시작', desc: '미니어처 인부들이 제품을 밀고 끌고 들어 나른다 — 팟이 데구루루 구르고, 맥스를 둘이서 둘러메 옮기고, 돗자리를 착 편다. 클레이 특유의 통통 튀는 스톱모션 질감.' },
  { t: '1.5–3s', title: '배치', desc: '제품이 하나씩 제자리에 툭툭 내려앉는다 — 라운저 → 맥스 → 팟 순서로 자리를 잡고, 인부들이 위치를 미세 조정(발로 툭 밀기).' },
  { t: '3–4s', title: '완성 & 퇴장', desc: '마지막 메이트 인형(티렉스·유니콘)을 돗자리에 앉히고, 인부들이 프레임 밖으로 빠지며 완성된 팝업스토어만 남는다 = 끝 프레임 안착. 야자수 잎·물결은 전 구간 은은히 흔들림.' },
];

// 구조 시안 — STAGE 0 컨펌 대상
const OPTIONS = [
  {
    id: 'A', title: '4초 원컷 (추천)', cost: '스틸 2cr + 영상 7cr = 9cr',
    desc: '빈 팝업 → 완성까지를 4초 한 컷에. Kling이 start/end 사이를 채우므로 가장 단순·저비용. 릴스·인스타 스토리 길이로 딱.',
    risk: '4초에 "운반→배치→완성" 3비트를 다 넣어 급해 보일 수 있음',
  },
  {
    id: 'B', title: '5초 원컷', cost: '스틸 2cr + 영상 8.75cr = 10.75cr',
    desc: '동일 구조에 1초 여유 — 배치 동작이 또렷해지고 완성 후 홀드가 생김.',
    risk: '거의 없음 · A보다 1.75cr 비쌈',
  },
  {
    id: 'C', title: '10초 · 2컷 분할', cost: '스틸 3~4장 + 영상 2회 ≈ 25~30cr',
    desc: '① 빈 팝업 → 절반 배치 ② 절반 → 완성. 각 구간 동작이 여유롭고, 중간 프레임을 게이트로 검수 가능.',
    risk: '중간 프레임 스틸을 추가로 만들어야 함 · 컷 경계 톤 매칭 필요',
  },
];

const COST = [
  { k: 'Kling 3.0 · 4s · pro · 무음', v: '7cr', note: 'A안 기준 · 실측 2026-07-16' },
  { k: 'Kling 3.0 · 5s · pro · 무음', v: '8.75cr', note: 'B안 기준' },
  { k: 'Kling 3.0 · 5s · std · 무음', v: '7.5cr', note: 'pro 대비 1.25cr 절약 — 품질 차이 있음' },
  { k: 'Kling 3.0 · 4s · pro · 오디오 on', v: '10cr', note: '파도·클레이 통통 사운드가 필요하면' },
  { k: 'Kling 3.0 · 10s · pro · 오디오 on', v: '25cr', note: 'C안 참고' },
  { k: 'nano_banana_2 · 2K 편집', v: '2cr', note: '첫 프레임 1장' },
];

export default function Storyboard13Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🏖 클레이 미니어처 — 바다 팝업스토어 메이킹</h1>
          <p className="page-desc">
            13차 · 9:16 · <b>4~5초</b> · Kling 3.0 <b>첫/끝 프레임</b> 방식 · 미니어처 인부들이 요기보 제품을 배치해 바다 컨셉 팝업스토어를 완성하는 과정
          </p>
        </div>
      </div>

      {/* 게이트 */}
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
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 컨셉 (2026-07-16 사용자 정의)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8, borderLeft: '3px solid #FF7043' }}>
        <b>&quot;미니어처들이 바다 팝업스토어를 짓는다&quot;</b> — 사용자 제공 키비주얼이 <b>완성된 결과물</b>이므로, 그 <b>생성 과정</b>을 영상화한다.<br />
        · <b>배경</b>: 바다 컨셉 팝업스토어 — 주변에 바다·모래사장·야자수·서프보드·튜브<br />
        · <b>주인공</b>: 미니어처 인부들 (인물 얼굴 클로즈업 없음 → 정체성 락 불필요, 캐스팅 부담 0)<br />
        · <b>동작</b>: 요기보 제품을 나르고 배치하고 완성<br />
        · <b>룩</b>: 클레이/폴리머 점토 아이소메트릭 디오라마 — 키비주얼 그대로 승계 (질감·색·앵글 일치가 성패)
      </div>

      {/* 첫/끝 프레임 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 첫 / 끝 프레임 설계 ★ 이 방식의 핵심</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.6, marginBottom: 8, color: 'var(--text-dim)' }}>
        Kling 3.0은 <b>start_image + end_image</b>를 동시에 받는다. 양끝을 픽셀로 못박으면 모델은 <b>&quot;그 사이를 어떻게 채울까&quot;</b>만 풀면 된다 — 완성본이 이미 있는 이 프로젝트에 최적. 두 프레임은 <b>같은 앵글·같은 조명·같은 클레이 질감</b>이어야 하며, 이는 끝 프레임을 <b>편집</b>해 첫 프레임을 만들어 자동 보장한다.
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 240px' }}>
          <img src="/clay/start_v1.png?v=1" alt="첫 프레임 v1 (생성)"
            style={{ width: 240, borderRadius: 12, border: '3px solid #FF7043', display: 'block' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, lineHeight: 1.5 }}>
            <b style={{ color: '#FF7043' }}>▶ START v1 — 생성 완료 (2cr · 07-16)</b><br />
            빈 데크(로고 유지) + 인부 4명: 맥스 둘러메기·팟 굴리기·돗자리 안기·대기 중 제품 더미 · 바다/야자수/서프보드/튜브·클레이 질감·앵글 전부 보존 ✓
          </div>
        </div>
        <div style={{ flex: '0 0 240px' }}>
          <img src={KEYVISUAL} alt="완성 키비주얼 (끝 프레임)"
            style={{ width: 240, borderRadius: 12, border: '3px solid #4CAF50', display: 'block' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, lineHeight: 1.5 }}>
            <b style={{ color: '#4CAF50' }}>END — 완성본 (사용자 제공)</b><br />1792×2400 · 그대로 end_image로 사용
          </div>
        </div>
        <div style={{ flex: '1 1 300px', display: 'grid', gap: 10 }}>
          {FRAMES.map((f) => (
            <div key={f.k} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.7, borderLeft: `3px solid ${f.color}` }}>
              <b style={{ color: f.color }}>{f.k}</b> — <b>{f.title}</b>
              <div style={{ color: 'var(--text-dim)', marginTop: 4 }}>{f.desc}</div>
              <div style={{ marginTop: 4, fontSize: 11.5 }}>{f.made}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 비트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 그 사이 4초에 담을 동작</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {BEATS.map((b) => (
          <div key={b.t} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.7, display: 'flex', gap: 12 }}>
            <span className="badge badge-review" style={{ fontSize: 11, flex: '0 0 auto', height: 'fit-content' }}>{b.t}</span>
            <div>
              <b>{b.title}</b>
              <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 구조 시안 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 구조 시안 — ★ 컨펌 대상</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {OPTIONS.map((o) => (
          <div key={o.id} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.7, borderLeft: o.id === 'A' ? '3px solid #4CAF50' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14, color: o.id === 'A' ? '#4CAF50' : 'var(--text)' }}>{o.id}안 · {o.title}</b>
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>{o.cost}</span>
            </div>
            <div style={{ color: 'var(--text-dim)', marginTop: 3 }}>{o.desc}</div>
            <div style={{ color: '#FFB300', marginTop: 3, fontSize: 11.5 }}>⚠ {o.risk}</div>
          </div>
        ))}
      </div>

      {/* 비용 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 실측 단가 (get_cost 프리플라이트 · 2026-07-16)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'grid', gap: 5 }}>
          {COST.map((c) => (
            <div key={c.k} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 240px' }}>{c.k}</span>
              <b style={{ flex: '0 0 60px', color: 'var(--accent)' }}>{c.v}</b>
              <span style={{ color: 'var(--text-dim)' }}>{c.note}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.6 }}>
          <b>규칙</b>: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 1건씩 실행.<br />
          <b>왜 Kling인가</b>: 이 컷은 카메라가 고정(아이소메트릭 픽스)이고 <b>시작·끝 픽셀 보존</b>이 승부처 → Kling의 start/end 프레임 락이 정확히 그 일. Seedance는 카메라 안무가 주인공일 때 유리.
        </div>
      </div>

      {/* 프롬프트 초안 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>6. 프롬프트 초안</h2>
      <details className="note" style={{ padding: 14, fontSize: 12, marginBottom: 30 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 12.5 }}>① 첫 프레임 편집 프롬프트 (nano_banana_2) 펼치기</summary>
        <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, marginTop: 10, fontFamily: 'inherit', color: 'var(--text-dim)' }}>{`Edit this isometric clay diorama. Keep EVERYTHING identical — same camera angle, same lighting, same clay/polymer-clay texture, same pool deck tiles, same "yogibo" logo on the deck, same sea, sand, palm tree, surfboard, and life ring.

CHANGE ONLY THIS: remove all the bean bag products from the pool deck so the deck is EMPTY — no Max, no rolls, no lounger, no pods, no pyramid, no picnic mats, no plush toys. The deck shows only its clean tiled surface and the logo.

ADD: several tiny clay worker figures around the empty deck, in the middle of moving the products in — two workers carrying a long navy bean bag together, one rolling a round blue pod, one holding a folded picnic mat, a few products still stacked at the edge of the deck waiting to be placed.

Same miniature clay art style, same soft studio lighting, same isometric perspective. No text, no logos other than the existing deck logo.`}</pre>
        <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 12.5, marginTop: 12 }}>② 영상 프롬프트 (Kling 3.0 · start→end) 펼치기</summary>
        <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, marginTop: 10, fontFamily: 'inherit', color: 'var(--text-dim)' }}>{`Stop-motion style clay animation, fixed isometric camera, no camera movement.

Tiny clay worker figures build a seaside Yogibo pop-up store: they carry, roll and drag the bean bag products onto the empty pool deck and set them down one by one — two workers hauling the long navy bean bag, one rolling a round pod into place, one unfolding the picnic mat with a snap, workers nudging pieces into their final positions. Finally they place the small dinosaur and unicorn plush toys onto the mat and step out of frame, leaving the finished pop-up store exactly as shown in the final frame.

The palm leaves sway gently and the sea ripples softly throughout. Charming bouncy stop-motion timing, handmade clay texture, soft studio light. No text.`}</pre>
      </details>
    </>
  );
}
