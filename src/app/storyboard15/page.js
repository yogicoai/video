'use client';

// 15차 프로젝트 — Seedance 2.0 제작 (2026-07-13 시작)
// 컨셉 확정(07-14): "서 있다가, 눕는다" — 맥스 네이비 원테이크 10초
// 엔진 = Seedance 2.0: 카메라 안무·원테이크 특화 — video_references로 레퍼런스 영상의 동선을 그대로 복사하는 유일한 엔진
// 원테이크 = 편집 없음 → 스토리보드(구간 설계)가 곧 최종 편집본. 여기서 확정하고 생성 들어간다.

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '🟢 확정', note: '컨셉·제품·캐스트·길이·오디오 확정 (07-14) — 아래 정의서 참조' },
  { stage: 'STAGE 1 · 에셋 락', s: '🟡 진행 중', note: '맥스 네이비 Element ✅ 락 완료 · 레퍼런스 영상(동선) ⬜ 미확보 — 유일한 잔여 숙제' },
  { stage: 'STAGE 2 · 스토리보드', s: '🟡 v1 컨펌 대기', note: '아래 "원테이크 스토리보드 v1" — 4비트 구간 설계 + 프롬프트 초안 완료' },
  { stage: 'STAGE 3 · 스타트 스틸', s: '⬜', note: '"서 있는 네이비 맥스 + 오후 거실" 스틸 (nano banana 2cr) — 인물 없는 순수 제품 컷(재시도에도 재사용 가능)' },
  { stage: 'STAGE 4 · 통짜 생성', s: '⬜', note: 'Seedance 720p 검증(45cr) → 통과 시 1080p 마스터(90cr) · 매 호출 get_cost 프리플라이트' },
  { stage: 'STAGE 5 · 후반', s: '⬜', note: '로고 오버레이(후반 합성 — 생성으로 그리지 않음) · 4K 업스케일(무료 Real-ESRGAN) · 네이티브 오디오라 별도 BGM 불필요 예상' },
];

// STAGE 0 정의서 — 2026-07-14 확정
const BRIEF = [
  { k: '컨셉 / 스토리', v: '✅ "서 있다가, 눕는다" — 세로로 꽉 찬 스탠딩 맥스(170cm 세로형 × 9:16 비율 일치)에 사람이 털썩 → 맥스가 함께 넘어가 라운저로 변신 → 부감 엔딩. 제품의 형태 변환을 카메라가 한 호흡으로 따라가는 원테이크' },
  { k: '레퍼런스 영상 (동선)', v: '⬜ 미확보 — 필요 동선: 돌리인 → 오빗(아크) → 크레인업 탑다운. 가구/라이프스타일 광고의 표준 무빙이라 소싱 난도 낮음' },
  { k: '키비주얼 (미술)', v: '✅ 스탠딩 네이비 맥스 + 웜 미니멀 거실(오후 창가 사광·우드 플로어) — 딥 네이비는 생성 단계에서 확정(사후 리컬러 금지)' },
  { k: '길이 / 해상도', v: '✅ 10초 · 720p 검증 45cr → 1080p 마스터 90cr (실측 단가) · 스틸 2cr 포함 총 ~137cr + 재시도 버퍼' },
  { k: '제품', v: '✅ 맥스 네이비블루 — Element 락 완료 · 360 스프라이트 확보 · scalePrompt: "성인 키만큼 긴(170cm)" 레지스트리 문구 사용' },
  { k: '캐스트', v: '✅ 익명 모델 (여성, 편한 니트웨어) — 시리즈물 아님 = 얼굴 재해석 리스크 무의미(테이크 내 일관성만 필요, Seedance가 유지). 와이드 문법 유지로 클로즈업 자체가 없음' },
  { k: '오디오', v: '✅ Seedance 네이티브(무료) — "털썩" 패브릭 사운드와 화면 싱크가 이 기획의 절반. 룸톤→풋스텝→whoomp→릴랙스 그루브→리졸브' },
];

// 원테이크 스토리보드 v1 — 4비트 구간 설계 (원테이크는 편집이 없으므로 이 표가 곧 최종 편집본)
const BEATS = [
  {
    t: '0 – 2.5s', name: 'B1 리빌 (정적)',
    screen: '오후 사광이 드는 미니멀 거실, 네이비 맥스가 혼자 꼿꼿이 서 있음 — 부드러운 모놀리스처럼 세로 프레임의 ~70%를 채움. 인물 없음.',
    cam: '아이레벨 · 슬로우 돌리인(eased) — 정면에서 서서히 다가감',
    audio: '조용한 룸톤 · 음악 인트로(미니멀)',
    why: '스타트 스틸과 동일 프레임 = 앵커 최강 구간. 제품 형태·색을 여기서 확립',
  },
  {
    t: '2.5 – 5s', name: 'B2 낙하 (운동)',
    screen: '프레임 우측에서 니트웨어 여성이 걸어 들어와 스탠딩 맥스에 옆으로 털썩 — 맥스가 사람과 함께 한 동작으로 뒤로 넘어가며 눕는다(공중 부양 없음, 단일 연속 모션). 낙하 방향은 카메라 반대쪽.',
    cam: '돌리인에서 아크(오빗)로 전환 — 넘어가는 방향을 따라 도는 무빙',
    audio: '풋스텝 → 푹—(패브릭 whoomp) → 안도의 숨',
    why: '큰 동작 = kling이 못 하고 Seedance가 잘하는 구간. 이 기획의 존재 이유',
  },
  {
    t: '5 – 7.5s', name: 'B3 정착 (이완)',
    screen: '맥스는 전신 라운저로 완전히 눕고, 사람이 자세를 잡으며 가라앉음 — 스트레치 패브릭이 몸무게에 눌리는 디테일.',
    cam: '오빗 유지하며 크레인업 시작 — 수평 문법에서 부감 문법으로 전환',
    audio: '음악이 릴랙스 그루브로 열림',
    why: '"몸이 가라앉는" 제품 셀링 포인트가 화면에 보이는 구간',
  },
  {
    t: '7.5 – 10s', name: 'B4 부감 엔딩',
    screen: '수직 탑다운 갓샷 — 누운 사람 + 가로로 누운 네이비 맥스 + 우드 플로어 여백. 잔잔한 호흡 모션. 상단 15% 여백 = 로고 자리(후반 합성).',
    cam: '크레인업 완료 → 정수리 위 고정(미세 드리프트만)',
    audio: '음악 리졸브 · 로고 스팅(후반)',
    why: '세로→가로 구도 반전의 완성. 로고는 생성으로 그리지 않고 후반 오버레이',
  },
];

// Seedance 타임라인 프롬프트 초안 (영문 — 생성 시 이 골격 사용)
const PROMPT_DRAFT = `One continuous unbroken take, vertical 9:16. Warm minimalist living room, soft afternoon window light from the left, wooden floor.

0-2.5s: A deep navy blue Yogibo Max bean bag sofa — as long as an adult is tall (170cm) — stands upright alone in the center like a soft monolith, filling most of the vertical frame. Slow eased dolly-in at eye level. Quiet room tone, minimal music intro.

2.5-5s: A woman in cozy knitwear walks in from the right and flops sideways onto the standing Max — the bean bag tips backward WITH her in one single continuous motion, away from camera, landing flat as a full-body lounger. No floating, no airborne fabric. Camera transitions from dolly-in to a smooth arc following the fall. Footsteps, a soft heavy fabric whoomp, her relieved exhale.

5-7.5s: She sinks and settles as the soft stretch fabric compresses under her body. Camera keeps orbiting and begins a smooth crane-up. Relaxed lo-fi groove enters.

7.5-10s: Camera rises into a perfect top-down overhead shot — she lies fully stretched on the flat navy Max, calm breathing, generous negative space of wooden floor around, upper area of frame kept clear. Music resolves warmly.

Camera movement smoother and more eased than the reference video, cinematic steadicam quality.`;

// 리스크 대응 — 이전 프로젝트 실측 교훈 대입
const RISKS = [
  { r: '낙하 물리 (3탄 담요 3연속 실패 교훈)', a: '공중 패브릭 원천 금지 — "tips backward WITH her in one single continuous motion, no floating" 명시. 낙하 방향 = 카메라 반대쪽(얼굴 클로즈업·원근 왜곡 동시 회피)' },
  { r: '제품 형태·크기 드리프트', a: 'image_references에 맥스 네이비 360 스프라이트 동봉(2장 이하 준수) + 레지스트리 scalePrompt("성인 키만큼 긴") 원문 사용' },
  { r: '색 = 생성 단계 확정 (2탄 리컬러 실패 교훈)', a: '"deep navy blue" + 오후 사광 조명까지 프롬프트에 고정 — 사후 HSV/LAB 리컬러에 기대지 않음' },
  { r: '얼굴 재해석', a: '익명 모델이라 기준 자체가 없음(테이크 내 일관성은 Seedance가 유지). 와이드 문법 유지로 클로즈업 미발생 — 시리즈 캐스트 투입 시에만 start_image 포함+얼굴 참조 필요' },
  { r: '로고', a: '생성으로 그리지 않음 — B4 상단 여백만 확보하고 후반 오버레이(기존 로고 합성 파이프라인 재사용)' },
];

// Seedance 검증 레시피 (7·8차 실전) — 제작 시 그대로 적용
const RECIPE = [
  '① start_image: 승인된 시작 스틸 = B1 프레임(스탠딩 맥스 + 거실, 인물 없음 — 재시도에도 재사용)',
  '② video_references: 돌리인→오빗→크레인업 레퍼런스 영상 — 카메라 동선·페이싱이 그대로 복사됨 (Seedance 유일 기능)',
  '③ image_references: 맥스 네이비 360 스프라이트 (형태·색 락) — 이미지 참조 총 2장 이하 준수',
  '④ 타임라인식 프롬프트: 위 초안 골격 (구간별 화면 + 오디오 아크 서술)',
  '⑤ 레퍼런스 초월 지시: "smoother eased steadicam than the reference" — 동선은 따르되 질은 업그레이드',
  '⑥ 운영: get_cost 프리플라이트(무료) → 720p 검증 1회(45cr) → 통과 시 1080p 마스터(90cr)',
];

export default function Storyboard15Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎥 15차 — 맥스 네이비 "서 있다가, 눕는다" (Seedance 원테이크)</h1>
          <p className="page-desc">
            Seedance 2.0 · 9:16 · 10초 원테이크 · 익명 모델 · 네이티브 오디오 · <b>원테이크 = 편집 없음 → 이 스토리보드가 곧 최종 편집본</b>
          </p>
        </div>
      </div>

      {/* 게이트 진행 상태 */}
      <div className="note" style={{ marginBottom: 18, padding: 14 }}>
        <b style={{ fontSize: 13.5 }}>🚦 게이트 파이프라인 (Seedance 버전)</b>
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

      {/* STAGE 0 정의서 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. STAGE 0 정의서 — 07-14 확정</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {BRIEF.map((b) => (
          <div key={b.k} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.6, display: 'flex', gap: 12 }}>
            <b style={{ flex: '0 0 150px' }}>{b.k}</b>
            <span style={{ color: 'var(--text-dim)' }}>{b.v}</span>
          </div>
        ))}
      </div>

      {/* 스토리보드 v1 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 원테이크 스토리보드 v1 — 4비트 구간 설계 ★ 컨펌 대기</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.6, marginBottom: 8, color: 'var(--text-dim)' }}>
        핵심 설계: 맥스 스탠딩(170cm 세로형)이 9:16 프레임과 비율 일치 → <b>"세로로 꽉 찬 맥스 → 가로로 눕는 맥스"의 구도 반전</b>을 카메라(아이레벨 돌리인 → 오빗 → 탑다운 크레인)가 한 호흡으로 따라간다.
      </div>
      <div style={{ display: 'grid', gap: 10, marginBottom: 8 }}>
        {BEATS.map((b) => (
          <div key={b.name} className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
              <b style={{ fontSize: 13.5 }}>{b.name}</b>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{b.t}</span>
            </div>
            <div><b>화면</b> — {b.screen}</div>
            <div><b>카메라</b> — {b.cam}</div>
            <div><b>오디오</b> — {b.audio}</div>
            <div style={{ color: 'var(--text-dim)' }}><b>설계 의도</b> — {b.why}</div>
          </div>
        ))}
      </div>

      {/* 프롬프트 초안 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. Seedance 타임라인 프롬프트 초안 (영문)</h2>
      <details className="note" style={{ padding: 14, fontSize: 12, marginBottom: 8 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 12.5 }}>프롬프트 전문 펼치기</summary>
        <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, marginTop: 10, fontFamily: 'inherit' }}>{PROMPT_DRAFT}</pre>
      </details>

      {/* 리스크 대응 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 리스크 대응 — 이전 프로젝트 실측 교훈 대입</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {RISKS.map((x) => (
          <div key={x.r} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.6, display: 'flex', gap: 12 }}>
            <b style={{ flex: '0 0 240px' }}>{x.r}</b>
            <span style={{ color: 'var(--text-dim)' }}>{x.a}</span>
          </div>
        ))}
      </div>

      {/* 검증 레시피 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 원테이크 레시피 (7·8차 검증 — 이 프로젝트 대입 완료)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.9, marginBottom: 30 }}>
        {RECIPE.map((r) => (<div key={r}>{r}</div>))}
      </div>
    </>
  );
}
