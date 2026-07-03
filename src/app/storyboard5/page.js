'use client';

const ASSETS = [
  { src: '/pat/cu2.jpg', label: '커튼 (닫힘·스포트라이트)' },
  { src: '/pat/ka.png', label: '10th 케이크' },
];

const STEPS = [
  { k: '에셋 확보', v: '블루 커튼(cu2) · 10th 케이크(ka) 업로드', done: true },
  { k: '등장 스틸', v: '닫힌 커튼(start) + 커튼 열려 케이크 등장(end) 프레임 생성', done: true },
  { k: '영상화', v: 'kling start→end 5초 · 커튼 오픈 리빌 + 골드 컨페티/빵빠레 — 완료', done: true },
];

export default function Storyboard5Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎉 요기보 10주년 축하 — 커튼 리빌 (5초)</h1>
          <p className="page-desc">
            리프레시용 짧은 축하 영상 · 9:16 · ~5초 · 커튼이 열리며 10주년 케이크 등장 + 골드 컨페티·빵빠레
          </p>
        </div>
      </div>

      {/* 완성 영상 */}
      <div className="note" style={{ marginBottom: 22, display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <video src="/pat/reveal.mp4?v=2" autoPlay loop muted playsInline controls preload="metadata"
          style={{ width: 220, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', flexShrink: 0 }} />
        <div style={{ minWidth: 240, flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>▶ 완성 — 스포트라이트 리빌 (3초 · 무음)</div>
          <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.8 }}>
            어둠 속 스포트라이트가 커튼을 훑으며 이동 → 중앙을 가리킴 → 축포 터지며 10주년 케이크 등장 ✨<br />
            <span style={{ opacity: 0.7 }}>제공 커튼(cu2) 그대로 · 어둡고 시네마틱 · kling start→end 보간(3.04s) · 무음. 음악/효과음은 최종에 별도.</span>
          </div>
        </div>
      </div>

      {/* 연출 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>🎬 연출</div>
        <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.8 }}>
          <b>어둠 속 스포트라이트가 커튼을 훑으며 이동 → 커튼 한가운데를 가리킴 → 축포 터지며 10주년 케이크 등장</b><br />
          방식: kling3_0 <b>start(어두운 커튼) → end(중앙 축포+케이크)</b> 보간 · 어둡고 시네마틱(유치 X).<br />
          <span style={{ opacity: 0.7 }}>※ "10th" 글자 선명 유지 위해 리빌 짧게·끝프레임 고정. 케이크는 제공 에셋 그대로.</span>
        </div>
      </div>

      {/* 에셋 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>에셋 (제공)</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {ASSETS.map((a) => (
            <div key={a.src} style={{ width: 150 }}>
              <img src={a.src} alt={a.label} style={{ width: '100%', borderRadius: 10, border: '1px solid var(--border)', background: '#000', display: 'block' }} />
              <div className="card-meta" style={{ fontSize: 12, marginTop: 6, textAlign: 'center' }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 진행 현황 */}
      <div className="note">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>진행 현황</div>
        {STEPS.map((s) => (
          <div key={s.k} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, minWidth: 84 }}>{s.k}</div>
            <div className="card-meta" style={{ fontSize: 13, flex: 1 }}>{s.v}</div>
            <span className="badge" style={{ fontSize: 11, background: s.done ? 'var(--accent)' : 'var(--bg-elev)', color: s.done ? '#fff' : 'var(--text-dim)', padding: '2px 8px', borderRadius: 6 }}>{s.done ? '완료' : '대기'}</span>
          </div>
        ))}
      </div>
    </>
  );
}
