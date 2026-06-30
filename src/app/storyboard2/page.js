export const metadata = { title: '티렉스 × 요기보 9초 단편 CF — 진행상황' };

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';

const CUT1_CANDIDATES = [
  { k: 'B (추천)', img: `${CDN}/hf_20260630_081740_3b4bf5ec-99ce-4571-a5fb-6d852156aa58.png`, note: '바다·물보라 점프 — 밝고 다이내믹' },
  { k: 'A', img: `${CDN}/hf_20260630_081738_bf5a40bb-44a3-4ee3-8ed8-a831119aa493.png`, note: '해변·노을 — 따뜻·포근' },
];

const CUTS = [
  { n: 1, title: '등장 — 에너지', dur: '~3s', action: '티렉스가 신나게 운동(점프/덤벨) — 활달한 성격 폭발', cam: '정면 미디엄 · 통통 바운스 · 살짝 줌인', copy: '오늘도 풀파워!' },
  { n: 2, title: '핵심 — 다이브', dur: '~3s', action: '한바탕 놀고 "후—" → 요기보(아보카도 그린)에 풀썩 다이브', cam: '로우앵글 · 다이브 따라 흔들 → 안착', copy: '(효과음 "풀썩")' },
  { n: 3, title: '마무리 — 안착·로고', dur: '~3s', action: '요기보에 폭 파묻혀 만족 → yogibo 로고 페이드인', cam: '얼굴 클로즈업 → 로고', copy: '역시, 요기보' },
];

const LESSONS = [
  '시작부터 캐릭터 토큰 고정 (디자인 일관성)',
  '스틸 먼저 승인 → 영상 (크레딧·시간 절약)',
  '컬러 매칭은 스트리밍 색측정 (대용량 버그 회피)',
  '로고/오버레이 -loop+-shortest (멈춤 버그 회피)',
  '배포 캐시버스트 + gitignore mp4 예외',
];

const card = { borderRadius: 10, border: '1px solid var(--border)', display: 'block', width: '100%' };
const port = { ...card, aspectRatio: '9 / 16', objectFit: 'cover' };

export default function Storyboard2Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🦖 티렉스 × 요기보 — 9초 캐릭터 단편 CF</h1>
          <p className="page-desc">
            <strong>2차 테스트 제작</strong> · 캐릭터(티렉스) 기반 · 9:16 · 3컷 ~9초 · <code>cf-video-production</code> 방식.
            지난 프로젝트의 시행착오를 처음부터 차단하고 속도까지 테스트합니다.
          </p>
        </div>
      </div>

      <div className="note" style={{ marginBottom: 18 }}>
        🎬 <strong>컨셉</strong> — 운동·게임으로 에너지 넘치는 티렉스가 → 요기보에 풀썩 안겨 "여기가 최고". 활달한 성격 + 제품 휴식 메시지를 9초에 압축.
        <br />🦖 캐릭터: 티렉스(활달·사교적, 운동/게임) · 제품: 요기보 Pod(아보카도 그린)
      </div>

      {/* 진행상황 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>진행상황</h2>
      <div className="flow" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ 컨셉·스토리보드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>🔄 CUT1 캐릭터 스틸(후보)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">CUT2·3 스틸</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">영상화</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">컬러·편집·로고</span>
      </div>

      {/* CUT1 후보 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>CUT1 캐릭터 스틸 — 후보 (힉스필드 생성)</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>활달한 운동 등장 컷. 채택한 디자인을 캐릭터 토큰으로 잡아 CUT2·3에 동일하게 씁니다.</p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {CUT1_CANDIDATES.map((c) => (
          <div key={c.k} style={{ width: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={c.k} style={{ ...port, borderColor: c.k.includes('추천') ? 'var(--accent)' : 'var(--border)' }} />
            <div className="card-meta" style={{ fontSize: 12, marginTop: 6 }}><b>{c.k}</b> · {c.note}</div>
          </div>
        ))}
      </div>

      {/* 스토리보드 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>3컷 스토리보드 (~9초)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {CUTS.map((c) => (
          <div className="step" key={c.n}>
            <div className="step-num">{c.n}</div>
            <div>
              <span className="where">{c.title} · {c.dur}</span>
              <h3 style={{ margin: '2px 0 6px' }}>{c.action}</h3>
              <p style={{ fontSize: 13 }}>🎥 {c.cam}　·　💬 {c.copy}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 적용한 교훈 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>이번엔 처음부터 적용 (1차 시행착오 차단)</h2>
      <ul style={{ lineHeight: 1.9, paddingLeft: 18, marginBottom: 8 }}>
        {LESSONS.map((l) => (<li key={l} className="card-meta">{l}</li>))}
      </ul>
    </>
  );
}
