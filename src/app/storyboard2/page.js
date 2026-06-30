export const metadata = { title: '티렉스 × 요기보 9초 단편 CF — 진행상황' };

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
const SHEET = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/trex_sheet.png';
const ELEMENT_REF = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/0db962dd-e855-4a22-8098-dd5108314bf6.png';

// CUT1 후보 — Element('trex-summer') 락으로 생성한 모래 달리기
const CUT1_CANDIDATES = [
  { k: 'B (채택)', img: `${CDN}/hf_20260630_090355_f8c23f77-0370-4baa-80be-210b77bd010f.png`, note: '모래 위 역동적 달리기 (발자국·sun)' },
  { k: 'A', img: `${CDN}/hf_20260630_085357_8e895a5c-b9cc-44b8-9072-b88ad53a78dc.png`, note: '모래 위 달리기 (다른 포즈)' },
];

const CUTS = [
  { n: 1, title: '등장 — 달리기', dur: '~3s', img: `${CDN}/hf_20260630_090355_f8c23f77-0370-4baa-80be-210b77bd010f.png`, action: '티렉스가 해변 모래 위를 신나게 달림 (브이포즈·발자국)', cam: '정면 · 핸드헬드 줌', copy: '오늘도 신난다!' },
  { n: 2, title: '핵심 — 휴식', dur: '~3s', img: `${CDN}/hf_20260630_085402_5f222ff4-56fc-41aa-aac2-3a0090a86bb8.png`, action: '오렌지 Yogibo Max에 풀썩 누워 편안하게 휴식', cam: '미디엄 → 슬로우 줌', copy: '여기 진짜 편해' },
  { n: 3, title: '마무리 — 로고', dur: '~3s', img: '/endcard_poster.png', action: '흰 배경으로 전환 → yogibo 로고 슬로우 페이드인', cam: '그래픽 · 페이드', copy: 'yogibo' },
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
        🎬 <strong>컨셉</strong> — 여름·물놀이로 에너지 넘치는 티렉스가 → 오렌지 Yogibo Max에 풀썩 안겨 "여기가 최고". 활달한 성격 + 제품 휴식 메시지를 9초에 압축.
        <br />🦖 캐릭터: 티렉스(활달·사교적·여름) · 제품: <strong>Yogibo Max (오렌지)</strong>
      </div>

      {/* 진행상황 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>진행상황</h2>
      <div className="flow" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ 컨셉·스토리보드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>🔄 CUT1 캐릭터 스틸(후보)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ CUT2·3 스틸(오렌지 Max)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ 러프컷(모션)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">(선택) 음악</span>
      </div>

      {/* 러프컷 애니매틱 미리보기 */}
      <div className="note" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <video
          src="/trex_rough.mp4?v=real1"
          controls loop muted playsInline preload="metadata"
          style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', flexShrink: 0 }}
        />
        <div style={{ minWidth: 240, flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>▶ 러프컷 (힉스필드 실모션 · 약 7초 · 무음)</div>
          <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.7 }}>
            힉스필드 <b>kling 실제 모션 클립</b> 3개를 크로스페이드로 이어붙인 러프컷입니다 (모래 달리기 → Yogibo Max에 풀썩 안착 → yogibo 로고).
            <br />캐릭터는 Element 락으로 컷 간 디자인을 유지했습니다.
            <br /><span style={{ opacity: 0.7 }}>테스트 러프컷 완료. (선택) 음악만 추가하면 마무리.</span>
            <br />
            <a href="/trex_rough.mp4?v=real1" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>↗ 크게 보기</a>
          </div>
        </div>
      </div>

      {/* 캐릭터 Element 락 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>캐릭터 고정 — Element 락</h2>
      <div className="note" style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ELEMENT_REF} alt="trex element" style={{ width: 96, borderRadius: 10, border: '2px solid var(--accent)', flexShrink: 0, background: '#fff' }} />
        <div style={{ minWidth: 220, flex: 1 }} className="card-meta">
          회원님 캐릭터 원본을 힉스필드 <b>Element(<code>trex-summer</code>)</b>로 등록해, 모든 컷 생성에 토큰을 넣어 <b>디자인이 컷마다 흔들리지 않게 고정</b>했습니다. (2D 캐릭터 일관성 핵심)
        </div>
      </div>

      {/* CUT1 후보 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>CUT1 캐릭터 스틸 — 후보 (Element 락)</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>모래 위 달리기 등장 컷. 채택(B)을 CUT1로 사용합니다.</p>
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
          <div key={c.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={c.title} style={{ width: 90, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="card-meta" style={{ fontSize: 12, marginBottom: 4 }}>
                <b style={{ color: 'var(--accent)' }}>CUT{c.n}</b> · {c.title} · {c.dur}
              </div>
              <div style={{ fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{c.action}</div>
              <div className="card-meta" style={{ fontSize: 13 }}>🎥 {c.cam}　·　💬 {c.copy}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 컷분할 스토리보드 시트 */}
      <div className="section-head" style={{ marginBottom: 6 }}>
        <h2 className="section-title">컷분할 스토리보드 시트</h2>
        <a className="section-hint" href={SHEET} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>서버 원본 열기 ↗</a>
      </div>
      <p className="card-meta" style={{ marginBottom: 12 }}>3컷(달리기 → Yogibo Max 휴식 → 로고)을 한 장으로 정리한 시트 — 프레임·액션·카메라·대사·제작 사양.</p>
      <a href={SHEET} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SHEET}?v=trex1`} alt="티렉스 스토리보드 시트" style={{ ...card, marginBottom: 24 }} />
      </a>

      {/* 적용한 교훈 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>이번엔 처음부터 적용 (1차 시행착오 차단)</h2>
      <ul style={{ lineHeight: 1.9, paddingLeft: 18, marginBottom: 8 }}>
        {LESSONS.map((l) => (<li key={l} className="card-meta">{l}</li>))}
      </ul>
    </>
  );
}
