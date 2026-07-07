'use client';

const HF = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// cafe24 FTP에 .jpg로 위장 업로드된 영상 → /api/video 프록시가 video/mp4로 서빙
const V = (name, ver = 1) => `/api/video/maxcolor/${name}.jpg?v=${ver}`;

// 스와이프 확정 라인업 — 사용자 선택 9색 (2026-07-07 컨펌) · 색상값 = 사이트 360 실측
// 순서는 색 흐름 최적화 시안: 쿨 시작 → 웜 펀치 → 그린 → 퍼플 → 딥 웜 → 딥 쿨 마무리 (변경 가능)
const SEQ = [
  { key: 'aqua', name: '아쿠아블루', hex: '#0075BD', group: '시작 (C1 훅)' },
  { key: 'orange', name: '스위트오렌지', hex: '#EE780C', group: '웜 펀치 · 실측 대기' },
  { key: 'olive', name: '올리브그린', hex: '#668B01', group: '그린' },
  { key: 'avocado', name: '아보카도그린', hex: '#88BCA4', group: '그린(파스텔)' },
  { key: 'lavender', name: '라벤더퍼플', hex: '#CDA7DB', group: '퍼플(파스텔)' },
  { key: 'dpurple', name: '딥퍼플', hex: '#5F2A38', group: '딥' },
  { key: 'wine', name: '와인버건디', hex: '#7A031F', group: '딥' },
  { key: 'choco', name: '초코브라운', hex: '#5D4131', group: '딥' },
  { key: 'navy', name: '네이비블루', hex: '#1D395D', group: '딥 마무리' },
];
// 후보였던 나머지 색 (검수 완료 · 미사용 — 라인업 교체 시 즉시 투입 가능)
const PASTEL = [
  { key: 'cherry', name: '체리레드', hex: '#980224' },
  { key: 'yellow', name: '브라이트옐로우', hex: '#EBCD00' },
  { key: 'rose', name: '로즈핑크', hex: '#EF0066' },
  { key: 'brpurple', name: '브라이트퍼플', hex: '#644D9A' },
  { key: 'blossom', name: '블라썸핑크', hex: '#E2A8BE' },
  { key: 'pblue', name: '파스텔블루', hex: '#BEDDEF' },
  { key: 'coral', name: '리빙코랄', hex: '#EA3D19' },
  { key: 'mint', name: '프레시민트', hex: '#B0EEE7' },
];
const RETURN_CHIP = { key: 'aqua', name: '아쿠아블루 (복귀)', hex: '#0075BD', group: '클라이맥스 (C3)' };

// 파트(섹션) 구성 — 15초 = 360f @24fps
const PARTS = [
  {
    id: 'C1', t: '0–2.5s', title: '훅 — 아쿠아에서 시작',
    how: 'kling pro 영상 1컷 (5.25cr)',
    desc: '하이앵글 부감 — 부인이 눕힌 아쿠아 맥스에 전신으로 누워 눈 감은 편안한 미소. 베이스 스틸(v2)을 그대로 영상화 — 스와이프 전체의 구도 기준.',
    status: '🟡 베이스 v2 검토 대기',
  },
  {
    id: 'C2', t: '2.5–11s', title: '컬러 스와이프 — 확정 9색 비트 교체',
    how: '스틸 리컬러(무료) + 무료 Ken Burns',
    desc: '같은 구도에서 맥스 색상만 교체 — 확정 9색(아쿠아→오렌지→올리브→아보카도→라벤더→딥퍼플→와인→초코→네이비), 색당 ~0.9s 여유 템포. 각 색은 베이스 스틸의 cv2 리컬러(사이트 실측색 목표), 전부 무료.',
    status: '⬜ 대기 (베이스 통과 후)',
  },
  {
    id: 'C3', t: '11–13s', title: '클라이맥스 — 아쿠아 복귀 + 푹',
    how: 'kling pro 영상 1컷 (5.25cr)',
    desc: '아쿠아로 되돌아오며 부인이 미소로 눈을 뜨고 기지개 켜듯 몸을 살짝 뒤척— 패브릭이 푹 눌리는 모션 (제품 USP). 스와이프의 정지 에너지를 모션으로 해소.',
    status: '⬜ 대기',
  },
  {
    id: 'C4', t: '13–15s', title: '엔딩 — "너의 컬러를 골라봐"',
    how: '무료 합성 (타이포+로고)',
    desc: '태그라인 "너의 컬러를 골라봐" (Pretendard) + 요기보 로고 페이드인. 배경은 C3 마지막 프레임 홀드 or 화이트 카드.',
    status: '⬜ 대기',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '15s · 9:16 · 맥스 18색 · 태그라인 "너의 컬러를 골라봐"' },
  { stage: 'STAGE 1 · 에셋 락', s: '✅ 완료', note: '부인 wife-c3 + 맥스 아쿠아 Element 재사용 (신규 락 불필요)' },
  { stage: 'STAGE 2 · 스토리보드', s: '✅ 이 페이지', note: '4파트 구성 확정 — 아래 보드' },
  { stage: 'STAGE 3 · 스틸', s: '🟡 진행중', note: '베이스 v3(앉은 구도·리얼 하우스) 생성 — 검토 대기 · 통과 시 kling 앉기모션(8.75cr) → 동작 중 색교체' },
  { stage: 'STAGE 4 · 영상화', s: '⬜', note: 'C1·C3만 kling pro (10.5cr) — 스틸 승인 후' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: '비트 리타이밍 + Ken Burns + 타이포/로고 (무료)' },
];

export default function Storyboard6Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎨 맥스 컬러 스와이프 — 15초 CF "너의 컬러를 골라봐"</h1>
          <p className="page-desc">
            6차 · IG 릴스 테스트 광고 · 9:16 · 15초(360f) · <b>같은 구도에서 맥스 색상만 비트 교체</b> — 베이스 프레임 락 + 컬러칩 레지스트리 실전 투입 · 캐스트 = 가족 CF 부인 재사용
          </p>
        </div>
      </div>

      {/* 게이트 진행 상태 */}
      <div className="note" style={{ marginBottom: 18, padding: 14 }}>
        <b style={{ fontSize: 13.5 }}>🚦 게이트 파이프라인</b>
        <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
          {GATES.map((g) => (
            <div key={g.stage} style={{ display: 'flex', gap: 10, fontSize: 12.5, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 150px', fontWeight: 700 }}>{g.stage}</span>
              <span style={{ flex: '0 0 90px' }}>{g.s}</span>
              <span style={{ color: 'var(--text-dim)' }}>{g.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 캐스트 & 제품 락 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 캐스트 · 제품 락 (재사용 — 신규 비용 0)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div className="note" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', flex: '1 1 300px', maxWidth: 420 }}>
          <img src="/ref_family/cut03_ours.png?v=5" alt="부인" style={{ width: 74, height: 74, objectFit: 'cover', borderRadius: 10, objectPosition: 'top' }} />
          <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
            <b>부인 (가족 CF 동일 인물)</b> — Element <code style={{ fontSize: 11 }}>yogibo-wife-c3</code>
            <br /><span style={{ color: 'var(--text-dim)' }}>3중 락: CUT3 스틸 얼굴 레퍼런스 동봉 · 의상 = 크림/베이지 니트 (리컬러 마스크 간섭 방지)</span>
          </div>
        </div>
        <div className="note" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', flex: '1 1 300px', maxWidth: 420 }}>
          <img src={`${HF}/8fee6dcd-cf4d-4ee8-9440-214fa54f9cd1.png`} alt="맥스 아쿠아" style={{ width: 74, height: 74, objectFit: 'contain', borderRadius: 10, background: '#fff' }} />
          <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
            <b>Yogibo Max 아쿠아블루</b> — Element <code style={{ fontSize: 11 }}>yogibo-max-aqua</code>
            <br /><span style={{ color: 'var(--text-dim)' }}>베이스 색상 · 나머지 17색은 컬러칩 HEX 목표로 cv2 리컬러 (레지스트리 실전 투입)</span>
          </div>
        </div>
      </div>

      {/* 컬러 시퀀스 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 컬러 시퀀스 — 확정 9색 + 복귀 (사용자 선택 · 사이트 실측색)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[...SEQ, RETURN_CHIP].map((c, i) => (
            <div key={i} title={`${c.name} ${c.hex} · ${c.group}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 9px 4px 5px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-dim)', width: 16, textAlign: 'right' }}>{i + 1}</span>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.hex, border: '1px solid rgba(128,128,128,.35)' }} />
              <span style={{ fontSize: 11.5 }}>{c.name}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.6 }}>
          리듬 설계(9색): 8번의 색 교체 × ~0.9s — 딥·뮤트 팔레트에 맞는 여유 있는 프리미엄 템포 → <b>네이비에서 딱 멈춤</b> → 아쿠아 복귀와 함께 모션(C3).
          색상값은 컬러칩 CSS값이 아니라 <b>사이트 360 제품사진 수광면 실측</b> — 고객 체감색 기준. 파스텔 6색은 검수 후 선택 투입 가능.
        </div>
      </div>

      {/* 파트 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 섹션 보드 (4파트)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {PARTS.map((p) => (
          <div key={p.id} className="note" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14 }}>{p.id} · {p.title}</b>
              <span className="badge badge-review" style={{ fontSize: 11 }}>{p.t}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{p.how}</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11.5 }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* 베이스 스틸 슬롯 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 베이스 스틸 (STAGE 3 — 다음 게이트)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 300px' }}>
          <img src="/maxcolor/base_v3.png?v=1" alt="베이스 스틸 v3"
            style={{ width: 300, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 12, border: '3px solid #42A5F5' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>v3 (검토 대상 · 앉은 구도 확정안)</b> · 지퍼 반대면 ✓ · 리얼 하우스(커튼 역광·액자·테이블·잡지·머그·바닥 반사) ✓ · 필름 톤 ✓<br />
            아쿠아 톤은 리컬러 정규화로 #0075BD 통일 · 이 포즈가 &quot;앉기 모션&quot;의 종착 프레임이 됨
          </div>
        </div>
        <div style={{ flex: '0 0 150px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <img src="/maxcolor/base_v2.png?v=1" alt="v2 누움 (보관)"
              style={{ width: 150, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .55 }} />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v2 누움 — B안 보관</div>
          </div>
          <div>
            <img src="/maxcolor/base_v1.png?v=1" alt="v1 (폐기)"
              style={{ width: 150, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .4 }} />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v1 — 폐기(지퍼 정면)</div>
          </div>
        </div>
        <div className="note" style={{ flex: '1 1 300px', padding: 14, fontSize: 12.5, lineHeight: 1.7, alignSelf: 'flex-start' }}>
          <b>구도 설계 (리컬러 최적화)</b>
          <br />· 미드와이드 9:16 — 맥스 아쿠아가 중앙~우측에 크고 또렷하게 (비스듬히 세워 기댄 각도)
          <br />· 부인이 맥스에 등을 기대 앉아 자연스러운 미소 · 크림/베이지 니트
          <br />· 배경 뉴트럴(화이트 벽+우드) · 파란 계열 소품 배제 → 아쿠아 마스크가 깨끗하게
          <br />· 따뜻한 자연광, 부드러운 그림자 — 리컬러 시 음영 유지 조건
          <br />· <b>지퍼·시임 면은 카메라 반대쪽</b> (브랜드 촬영 규칙 — v2부터 적용)
          <br />· <b>스케일 앵커: 모델 신장 ≈160cm</b> — 맥스(170) 세우면 모델 머리보다 ~10cm 높아야 정상
        </div>
      </div>

      {/* 테스트 러프컷 (무료) */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4.5 테스트 러프컷 — 9색 스와이프 느낌 확인 (무료 · 9.75s)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        {/* A(누움 하드컷)·B(누움 휩) — 숨김 (사용자 요청 2026-07-07 · FTP 보존: swipe_test_v2 / swipe_whip_v1) */}
        {false && (<>
        <div>
          <video src={V('swipe_test_v2')} autoPlay loop muted playsInline controls
            style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #AB47BC' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, textAlign: 'center' }}>A. 하드컷 (착·착)</div>
        </div>
        <div>
          <video src={V('swipe_whip_v1')} loop muted playsInline controls
            style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #26A69A' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, textAlign: 'center' }}>B. 휩 액센트 (3·6·9번째 색에서 휙—)</div>
        </div>
        </>)}
        <div>
          <video src={V('swipe_v1seated')} autoPlay loop muted playsInline controls
            style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #FFB300' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, textAlign: 'center' }}>C. v1 앉은 구도 · 하드컷 (9색)</div>
        </div>
        <div className="note" style={{ flex: '1 1 300px', padding: 14, fontSize: 12.5, lineHeight: 1.7, alignSelf: 'flex-start' }}>
          <b>구성 (색감 테스트용 — 최종 아님)</b>
          <br />· 아쿠아 1.5s → 8색 × ~0.9s (오렌지→올리브→아보카도→라벤더→딥퍼플→와인→초코→네이비) → 아쿠아 복귀 1.1s
          <br />· 전 구간 1.00→1.05 슬로우 줌 (정지 방지)
          <br />· v2 베이스 리컬러 · 사이트 실측색 · 전부 무료
          <br />· 최종본에서는 앞뒤에 kling 영상(안착/깨어남)이 붙고 색 전환이 음악 비트에 싱크됨
        </div>
      </div>

      {/* 컬러 리컬러 시안 검수 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 컬러 리컬러 시안 — 검수 (사이트 실측색 · 무료 리컬러 · 클릭하면 풀사이즈)</h2>
      <div className="note" style={{ padding: 12, marginBottom: 10, fontSize: 12.5, lineHeight: 1.6 }}>
        음영·주름·인물·배경은 전부 동일, <b>맥스 색만 사이트 360 실측색으로 교체</b>됨. 괜찮은 컬러 이름만 골라서 알려주면 <b>그 컬러들만 스와이프에 사용</b>합니다.
        스위트오렌지는 360이 없어 공식 칩값 임시 적용 — 실물 컷 주면 교정.
      </div>
      {[['✅ 확정 라인업 9색', SEQ], ['후보 8색 (검수 완료 · 미사용)', PASTEL]].map(([label, list]) => (
        <div key={label}>
          <div style={{ fontSize: 13, fontWeight: 700, margin: '12px 0 8px' }}>{label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12, marginBottom: 8 }}>
            {list.map((c) => (
              <a key={c.key} href={`/maxcolor/site_${c.key}.png`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={`/maxcolor/site_${c.key}_thumb.jpg?v=1`} alt={c.name}
                  style={{ width: '100%', aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: c.hex, border: '1px solid rgba(128,128,128,.35)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{c.hex}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>6. 비용 플랜 (경로 1 — 하이브리드)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        베이스 스틸 2K <b>2cr</b> → 17색 cv2 리컬러 <b>무료</b> (품질 미달 색만 개별 생성 +2cr/장) → kling pro 2컷(C1·C3) <b>10.5cr</b> → 조립·타이포·로고 <b>무료</b>
        <br />예상 <b>~15cr</b> (전량 생성 대비 1/3) · 실측 비용은 진행하며 기록 · 잔액 2,100cr
      </div>
    </>
  );
}
