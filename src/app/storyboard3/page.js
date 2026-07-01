export const metadata = { title: '요기보 10주년 12초 CF — 진행상황' };

const FORM_REF = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/4165a8f0-bd3e-40b8-a63e-9453c18d2465.png';

// 실제 판매 색상 (정확 HEX)
const COLORS = [
  ['블라썸핑크', '#FFD3C5'], ['아보카도그린', '#C6D59B'], ['파스텔블루', '#D6E0EC'], ['체리레드', '#D80C1E'],
  ['네이비블루', '#10376C'], ['아쿠아블루', '#0081CC'], ['시트러스', '#FB6D21'], ['오닉스', '#3A5657'],
  ['올리브그린', '#79A02F'], ['브라이트옐로우', '#FFE100'], ['브라이트퍼플', '#754095'], ['와인버건디', '#A22327'],
];

// 레퍼런스 10.mp4 1초 단위 분석
const REF = [
  ['0s', '어두운 레드 + yogibo 로고', '인트로'],
  ['1s', '포토그래퍼 플래시 취재', '이벤트 열기'],
  ['2s', '파란 요기보 무대 등장', '제품=주인공'],
  ['3–4s', '핑크 요기보 레드카펫 입장', '제품 의인화(셀럽)'],
  ['5s', '관중 환호·손 흔들기', '팬덤'],
  ['6s', '초록 요기보 로우앵글 CU', '히어로샷'],
  ['7s', 'yogibo STADIUM·10th', '스케일 공개'],
  ['8–9s', '관중 환호→감동 CU', '감정 피크'],
  ['10s', 'yogibo 비행선', '규모·축제'],
  ['11s', '금색 컨페티', '클라이맥스'],
  ['12–13s', '컬러 비즈 "10" + 불꽃', '숫자 리빌'],
  ['14–15s', '흰 배경 10th 로고', '엔딩'],
];

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';

// 스토리보드 A (프리미엄 진화판) · 12초 · 8컷
const CUTS = [
  { n: 1, t: '0–1.2s', title: '드라마틱 등장', desc: '암전 → 스포트라이트로 딥한 아쿠아블루 요기보 Max가 어둠에서 드러남, 골드 스파클·바닥 반사 (받침 없이 제품만)', cam: '로우앵글·스포트라이트', img: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/50eef433-cc2d-43c6-b3bd-7d6bbdba9acc.png', video: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/6d6ff396-22e4-4641-87d1-0b731a5608c2.mp4', status: '영상 완료' },
  { n: 2, t: '1.2–2.6s', title: '레드카펫 진입', desc: '딥 아쿠아블루 Max가 레드카펫 위로, 뒤로 파파라치 플래시+골드 스파클, 레드 벨벳 로프 (셀럽 등장)', cam: '트래킹·슬로우모션', img: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/hf_20260701_032352_ecabce3f-c85c-46db-a9ed-083f747e98ad.png', video: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/6be6bda8-06dd-4e36-999a-be939430e664.mp4', status: '영상 완료' },
  { n: 3, t: '2.6–4.0s', title: '무대 합류 (확장)', desc: '스포트라이트가 하나둘 더 켜지며 요기보들이 무대에 드러남 (한 대 → 여러 대), 크레인 백/업으로 스케일 확장 (아쿠아블루 스타 색 락)', cam: '크레인 BACK/UP', img: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/hf_20260701_053248_b6545008-a6f3-43e7-8c6b-7d8b56126610.png', video: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0/c3332f6f-8377-4a1b-ad0b-c3ba8cfef0d3.mp4', status: '영상 완료' },
  { n: 4, t: '4.0–5.6s', title: '컬러 퍼레이드', desc: '12색 요기보가 조명 아래 라인업으로 슬라이드 (브랜드 컬러 확산)', cam: 'SLIDE FAST' },
  { n: 5, t: '5.6–7.0s', title: '사람과 함께 (가치)', desc: '사람이 풀썩 안겨 편안한 미소 (10년간의 편안함 = 제품 가치)', cam: 'CLOSE-UP' },
  { n: 6, t: '7.0–8.6s', title: '컬러 웨이브 (축제)', desc: '색색 요기보가 무대/스타디움을 가득 채우고, 파도타기처럼 컬러가 물결치며 번짐 (스케일 정점)', cam: '크레인 하이앵글 풀백' },
  { n: 7, t: '8.6–10.4s', title: '"10" 리빌 (정점)', desc: '빛·요기보가 모여 우아하게 "10" 형성 → 골드 스파클', cam: '와이드·스테디캠' },
  { n: 8, t: '10.4–12s', title: '로고 엔딩 (브랜드)', desc: '기존 yogibo 로고 슬로우 페이드인 + 태그라인 "편안함의 과학, 행복의 가치"', cam: '그래픽·로고와이프' },
];

const card = { borderRadius: 10, border: '1px solid var(--border)', display: 'block', width: '100%' };

export default function Storyboard3Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎉 요기보 10주년 — 12초 CF (시네마틱)</h1>
          <p className="page-desc">
            <strong>3번째 테스트</strong> · 9:16 · 12초 · 제품 중심 · <code>cf-video-production</code> 게이트 방식.
            2년 전 <code>10.mp4</code> 컨셉을 <strong>프리미엄 브랜드 필름</strong>으로 격상.
          </p>
        </div>
      </div>

      {/* 진행상황 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>진행상황 (게이트)</h2>
      <div className="flow" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ 0 정의</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>✅ 1 에셋 락(Element)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step" style={{ borderColor: 'var(--accent)' }}>🔄 2 스토리보드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">3 스틸(컷당 1.5cr)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">4 영상(컷당 4.5cr)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">5 조립</span>
      </div>
      <div className="note" style={{ marginBottom: 20, fontSize: 13 }}>
        💳 <b>비용 규칙</b>: 모든 이미지·영상은 <b>생성 직전 비용 고지 + 컴펌</b>, <b>한 컷씩 순차</b> 진행 (배치 금지).
      </div>

      {/* STAGE 1 — 제품 형태 락 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 1 · 제품 형태 락 (Element)</h2>
      <div className="note" style={{ marginBottom: 14, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FORM_REF} alt="yogibo max form" style={{ width: 110, borderRadius: 10, border: '2px solid var(--accent)', flexShrink: 0, background: '#fff' }} />
        <div style={{ minWidth: 220, flex: 1 }} className="card-meta">
          회원님 실물 <b>요기보 Max 360도(27컷)</b> 중 대표 각도에서 <b>촬영 받침·배경을 제거</b>하고 제품만 남겨 힉스필드 <b>Element(<code>yogibo-max-clean</code>)</b>로 락 → 전 컷에서 <b>제품 형태가 정확히 동일</b>하게 유지됩니다. 색상은 컷별로 실제 판매 색 적용.
        </div>
      </div>

      {/* 컬러 팔레트 */}
      <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>🎨 실제 판매 색상</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
        {COLORS.map(([n, c]) => (
          <div key={n} style={{ textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: c, border: '1px solid var(--border)' }} />
            <div className="card-meta" style={{ fontSize: 11, marginTop: 4 }}>{n}</div>
          </div>
        ))}
      </div>

      {/* 제작 사양 */}
      <div className="note" style={{ marginBottom: 22, fontSize: 13 }}>
        <b>제작 사양 (확정)</b>
        <br />📦 제품: 요기보 <b>Max</b> · 스펙 <b>W65 × D45 × H170 cm</b> (길쭉한 업라이트) · 받침 제외 · Element <code>yogibo-max-clean</code>
        <br />🎨 대표색: <b>아쿠아블루 <span style={{ color: '#0081CC' }}>#0081CC</span></b> (CUT1 히어로 · CUT3 매크로)
        <br />🌊 컬러 웨이브/퍼레이드 6색: 체리레드 · 아쿠아블루 · 시트러스 · 올리브그린 · 브라이트퍼플 · 블라썸핑크
      </div>

      {/* 러프컷 (3컷 연결) */}
      <div className="note" style={{ marginBottom: 22, display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <video src="/anniv_rough.mp4?v=3" autoPlay loop muted playsInline controls preload="metadata"
          style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', flexShrink: 0 }} />
        <div style={{ minWidth: 240, flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>▶ 러프컷 (CUT1–3 연결 · 약 8초 · 무음)</div>
          <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.7 }}>
            지금까지 만든 <b>CUT1(리빌) → CUT2(레드카펫) → CUT3(무대 합류)</b>를 크로스페이드로 이어 <b>연결성</b>을 확인하는 러프컷입니다. (편집 = 크레딧 0)
            <br /><span style={{ opacity: 0.7 }}>※ CUT1·2·3 모두 실제 영상. CUT3는 형태 유지 + 아쿠아 스타 색 락 반영.</span>
          </div>
        </div>
      </div>

      {/* 스토리보드 A */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>STAGE 2 · 스토리보드 A (프리미엄) · 12초 · 8컷</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14, marginBottom: 22 }}>
        {CUTS.map((c) => (
          <div key={c.n} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-card)' }}>
            <div style={{ position: 'relative', aspectRatio: '9 / 16', background: '#0c0f16' }}>
              {c.video
                ? <video src={c.video} autoPlay loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : c.img
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-dim)', fontSize: 13 }}>스틸 대기<br /><span style={{ fontSize: 11 }}>(생성 예정)</span></div>}
              {c.video && <span style={{ position: 'absolute', top: 8, right: 62, background: 'rgba(120,210,150,.9)', color: '#08160c', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>▶ 영상</span>}
              <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 12, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>CUT{c.n}</span>
              <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>{c.t}</span>
              {c.status && <span style={{ position: 'absolute', bottom: 8, left: 8, background: c.status === '승인' ? 'var(--accent)' : 'rgba(210,180,80,.9)', color: '#08160c', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>{c.status === '승인' ? '✓ 승인' : c.status}</span>}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
              <div className="card-meta" style={{ fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div>
              <div className="card-meta" style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>🎥 {c.cam}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 레퍼런스 분석 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>레퍼런스 분석 — 10.mp4 (1초 단위)</h2>
      <p className="card-meta" style={{ marginBottom: 10 }}>2년 전 버전. 컨셉(제품=주인공·대형 이벤트)은 계승, 톤은 프리미엄으로 격상.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 8 }}>
        {REF.map(([s, what, role]) => (
          <div key={s} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 12 }}>{s}</div>
            <div className="card-meta" style={{ fontSize: 12 }}>{what}</div>
            <div className="card-meta" style={{ fontSize: 11, opacity: 0.7 }}>{role}</div>
          </div>
        ))}
      </div>
    </>
  );
}
