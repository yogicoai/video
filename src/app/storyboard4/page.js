'use client';

import { useState } from 'react';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
const HF = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// cafe24 FTP에 .jpg로 위장 업로드된 영상 → /api/video 프록시가 video/mp4로 서빙 (Vercel 재생 보장)
const V = (name, ver = 1) => `/api/video/famvid/${name}.jpg?v=${ver}`;
// 보고용 모드: 레퍼런스(원본) 영상 숨김. 내부 비교로 되돌리려면 true.
const SHOW_REF = false;

// 부인 캐릭터 후보 (Higgsfield nano_banana_2) — 한 장씩 생성, 별로면 다음 후보 추가
const WIFE_OPTIONS = [
  { id: 'C', img: `${CDN}/hf_20260702_014420_ea0acb84-4ff6-4203-ab21-dff6c098c411.png`, note: '✅ 채택 (C · 둥근얼굴·단발·앞머리)' },
];

// 컷별 구도 타깃 (newvideo.mp4 프레임 → 우리 버전 매핑) · dur = 우리 러프컷 최종 길이
const REF_CUTS = [
  { n: 1, t: '0–1.7s', dur: '2.6s', ref: '/ref_family/cut01.jpg', refVid: V('c01_ref'), angle: '하이앵글 부감 · 대각선', ours: '임산부(부인)가 아쿠아 Max에 눈감고 누움, 손은 배에 + 중앙 로고 상시', mine: `${CDN}/hf_20260702_035204_6139132e-2f82-4864-9e75-1b7cfc61e69e.png`, vid: V('c01_ours', 4) },
  { n: 2, t: '1.7–2.7s', dur: '2.0s', ref: '/ref_family/cut02.jpg', refVid: V('c02_ref'), angle: '와이드 설정샷 · 아이레벨', ours: '임부 아내가 아쿠아 Max에 깊이 파묻혀 이완된 미소 · 남편(머스터드 니트)이 무릎 옆에서 다정히 · v10', mine: '/ref_family/cut02_ours_v10.png?v=1', vid: V('c02_ours', 4) },
  { n: 3, t: '2.7–4.0s', dur: '1.6s', ref: '/ref_family/cut03.jpg', refVid: V('c03_ref'), angle: '하이앵글 · 기대 누워 올려다봄', ours: '아내가 아쿠아 요기보에 머리 기대 누워 올려다보며 환한 미소', mine: '/ref_family/cut03_ours.png?v=5', vid: V('c03_ours', 5) },
  { n: 4, t: '4.0–6.1s', dur: '1.8s', ref: '/ref_family/cut04.jpg', refVid: V('c04_ref'), angle: '측면 프로필 클로즈업', ours: '출산 간접 컷 — 창백한 역광·민트 이불(병원 신호)에서 위를 올려다봄 · 아기 리빌 직전 비트', mine: '/ref_family/cut04_ours.png?v=3', vid: V('c04_ours', 5) },
  { n: 5, t: '6.1–7.8s', dur: '0.8s · 러프컷 제외', ref: '/ref_family/cut05.jpg', refVid: V('c05_ref'), angle: '오버숄더 · 프로필(앞을 봄)', ours: '아내(C 얼굴)가 어깨 너머 프로필로 앞을 바라봄 — 예비 컷(러프컷 미사용, 카드 보관)', mine: '/ref_family/cut05_ours.png?v=5', vid: V('c05_ours', 4) },
  { n: 6, t: '7.8–8.7s', dur: '2.8s', ref: '/ref_family/cut06.jpg', refVid: V('c06_ref'), angle: '오버숄더 미디엄CU · 고개만 돌려 카메라', ours: '아기 첫 등장 — 부인이 서포트(그린) 안에서 아기 안고 어깨너머 미소, 미소 커지는 아크 전체 사용', mine: '/ref_family/cut06_ours.png?v=2', vid: V('c06_ours', 4) },
  { n: 7, t: '8.7–10.3s', dur: '2.4s', ref: '/ref_family/cut07.jpg', refVid: V('c07_ref'), angle: '로우앵글 사이드 와이드 · 매트 높이', ours: 'Max 아쿠아 = 아기 라운저 — 문필로우(올리브)에 아기 머리, 엄마 까꿍 lean-in 원모션 · 전경 옐리 보케', mine: '/ref_family/cut07_ours.png?v=1', vid: V('c07_ours', 4) },
  { n: 8, t: '10.3–11.3s', dur: '1.8s', ref: '/ref_family/cut08.jpg', refVid: V('c08_ref'), angle: '타이트 CU · 얕은 심도 · 우측 팬', ours: '메이트 옐리 = 아기 장난감 — 엄마가 옐리 들고 놀아줌, 아기 손이 잡는 인터랙션 전체 (CUT7 옐리 연결)', mine: '/ref_family/cut08_ours.png?v=1', vid: V('c08_ours', 4) },
  { n: 9, t: '11.3–12.1s', dur: '1.6s', ref: '/ref_family/cut09.jpg', refVid: V('c09_ref'), angle: '식탁 높이 사이드 CU', ours: '이유식 컷 (원본 충실) — 엄마가 숟가락으로 먹여줌 + 미소 여운, 크림 맨투맨 연속성', mine: '/ref_family/cut09_ours.png?v=2', vid: V('c09_ours', 4) },
  { n: 10, t: '12.1–13.0s', dur: '1.5s', ref: '/ref_family/cut10.jpg', refVid: V('c10_ref'), angle: '하이키 클로즈업 · 가족 셋', ours: '가족 완성 — 아빠(머스터드 니트) 재등장, 전경 손장난 → 아기가 손가락 잡는 순간까지', mine: '/ref_family/cut10_ours.png?v=1', vid: V('c10_ours', 4) },
  { n: 11, t: '13.0–15.0s', dur: '3.0s', ref: '/ref_family/cut11.jpg', refVid: V('c11_ref'), angle: '인티밋 클로즈업 · 엔딩', ours: '부인이 아쿠아 Max에 뺨 기대고 아기를 내려다봄 — 라운징 엔딩 + 로고 중앙 페이드인(원본 동일 크기·위치)', mine: '/ref_family/cut11_ours.png?v=1', vid: V('c11_ours', 4) },
];

const CAST = [
  { key: '부인', role: '메인 주인공 · 크림 맨투맨 시그니처', status: '✅ 확정 — 얼굴 기준 = CUT3 스틸 (3중 락: 베이스+얼굴레퍼런스+Element)', done: true },
  { key: '남편', role: '임신 케어 + 가족 컷 · 머스터드 니트 시그니처', status: '✅ 확정 — 얼굴 기준 = CUT10 스틸 (CUT2 배우 룩 계승)', done: true },
  { key: '아기', role: '생후 6~8개월 · 흰 바탕+초록 트리 우주복', status: '✅ 확정 — Element 락(yogibo-baby) · 기준 = CUT6', done: true },
];

// 제품 락 — 이번 CF에 들어간 요기보 제품 전부
const PRODUCTS = [
  { name: 'Yogibo Max', color: '아쿠아블루 #0081CC', element: 'yogibo-max-aqua', img: `${HF}/8fee6dcd-cf4d-4ee8-9440-214fa54f9cd1.png`, use: '메인 라운지 · 임신기 쉼(CUT1–5) → 아기 라운저(CUT7) → 엔딩(CUT11)' },
  { name: 'Yogibo Support', color: '그린', element: 'yogibo-support-green', img: `${HF}/8126883d-4a53-4af0-8f93-4f38a2a1b399.png`, use: '육아 서포트 — 엄마가 안에 앉아 아기 안는 U자 팔걸이 (CUT6)' },
  { name: '메가 문필로우', color: '올리브 그린', element: 'yogibo-moonpillow-olive', img: `${HF}/a7997290-cd3a-4f5b-bba7-5706fbd8a26c.png`, use: '아기 머리 받침 — 초승달 홈에 아기 머리 (CUT7)' },
  { name: '메이트 옐리', color: '베이지 코끼리', element: 'yogibo-mate-yelly', img: `${HF}/b1d4d960-038d-4798-9fac-f4cdad4a1bd4.png`, use: '아기 장난감 — 전경 소품(CUT7) → 놀이템(CUT8)' },
];

export default function Storyboard4Page() {
  const [pick, setPick] = useState('C');

  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">👨‍👩‍👧 가족 요기보 Max — 라이프스타일 CF (완성형)</h1>
          <p className="page-desc">
            newvideo.mp4(요기보재팬 가족편) 기반 · 9:16 · 원본 15초/11컷 → <b>우리 러프컷 21.0초</b>(6–11 확장 · CUT5 제외 10컷 편집) · 가족 3인(부인·남편·아기) · 임신부터 육아까지 요기보와 함께
          </p>
        </div>
      </div>

      {/* 레퍼런스 분석 요약 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>🎬 레퍼런스 1차 분석 (newvideo.mp4)</div>
        <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.8 }}>
          · <b>사양</b>: 15.02초 · 9:16 · 720×1280 · 23.98fps · 11컷<br />
          · <b>촬영/화질</b>: 시네마틱 얕은 심도(배경 보케) · 따뜻한 필믹 그레이드 · 자연광 · 실사 배우<br />
          · <b>앵글</b>: 뷰티 클로즈업 + 프로필 클로즈업 중심, 설정 와이드(거실 라운지)·로우앵글 놀이 컷<br />
          · <b>캐릭터</b>: 메인 여성(주인공) · 남편 · 아기 → 우리 버전 <b>부인·남편·아기(6~8개월)</b><br />
          · <b>제품</b>: 대형 블루 요기보(라운지) → 우리 버전 <b>Yogibo Max 아쿠아블루</b> + 서포트·문필로우·옐리 확장<br />
          · <b>톤</b>: "따뜻한 자연광 × 얕은 심도 × 실제 가족의 편안한 미소"
        </div>
      </div>

      {/* Look 락 (측정 기반) */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>🎨 Look 락 (원본 측정 기반 · 전 컷 공통 적용)</div>
        <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.8 }}>
          · <b>색온도</b>: 따뜻한 WB ≈5000K (웜지수 R/B 1.11)<br />
          · <b>색감</b>: 살구빛(LAB a 131 · b 132) — 마젠타+옐로우 살짝<br />
          · <b>블랙</b>: 리프티드 매트 블랙(5%ile 35/255) — 필름 느낌<br />
          · <b>대비</b>: 소프트(하이라이트 95%ile 211/255, 안 터짐)<br />
          · <b>파이프라인</b>: 원본 raw → PNG 무손실 시퀀스(트림·웜·LAB 톤정합·로고) → <b>최종 1회 인코딩(crf16)</b> — 아쿠아 브랜드색 보호 마스킹 포함
        </div>
      </div>

      {/* STAGE 1 — 캐스트 락 */}
      <h2 className="page-title" style={{ fontSize: 20, marginBottom: 4 }}>STAGE 1 · 등장인물(Cast) 락</h2>
      <p className="page-desc" style={{ marginBottom: 14 }}>
        전 컷 얼굴 일관성 = <b>3중 락</b>(원본 베이스 프레임 + 확정 컷 얼굴 레퍼런스 + Element 토큰·정체성 프로즈).
      </p>

      {/* ① 부인 (여주인공) */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>① 부인(여주인공) — ✅ 최종 확정 (C)</div>
        <div className="card-meta" style={{ fontSize: 12.5, marginBottom: 12 }}>
          둥근 얼굴·도톰한 볼·두꺼운 일자 앞머리 · <b>얼굴 기준 = 우리 CUT3 스틸</b> (Element yogibo-wife-real + CUT3 레퍼런스 동봉 3중 락) · 의상 시그니처 = 크림/아이보리 맨투맨.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {WIFE_OPTIONS.map((o) => {
            const sel = pick === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setPick(o.id)}
                style={{
                  padding: 0, cursor: 'pointer', background: 'none', width: 150, flex: '0 0 auto',
                  border: sel ? '3px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 12, overflow: 'hidden', position: 'relative',
                  boxShadow: sel ? '0 0 0 3px rgba(0,129,204,0.25)' : 'none',
                }}
              >
                <img src={o.img} alt={`부인 후보 ${o.id}`} style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute', top: 8, left: 8, background: sel ? 'var(--accent)' : 'rgba(0,0,0,0.6)',
                  color: '#fff', fontWeight: 700, fontSize: 14, padding: '2px 10px', borderRadius: 6,
                }}>{o.id}{sel ? ' ✓' : ''}</span>
                {o.note && (
                  <span style={{
                    position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(0,0,0,0.55)',
                    color: '#fff', fontSize: 12, padding: '3px 8px', borderRadius: 6, textAlign: 'center',
                  }}>{o.note}</span>
                )}
              </button>
            );
          })}
          <div style={{ width: 150, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
            <img src="/ref_family/cut03_ours.png?v=5" alt="부인 얼굴 기준 CUT3" style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 8, left: 8, background: '#444', color: '#fff', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>얼굴 기준: CUT3</span>
          </div>
        </div>
      </div>

      {/* ② 남편 · ③ 아기 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>② 남편 · ③ 아기 — ✅ 확정</div>
        <div className="card-meta" style={{ fontSize: 12.5, marginBottom: 12 }}>
          <b>남편</b>: CUT2 배우 룩 계승 → 정면 얼굴 기준 = <b>CUT10 스틸</b> (30대 초반·깔끔·다크브라운 머리·머스터드 니트 시그니처).<br />
          <b>아기</b>: 생후 6~8개월 · 통통한 볼 · 흰 바탕+초록 트리 우주복 · <b>Element 락(yogibo-baby)</b> · 기준 = CUT6.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ width: 150, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
            <img src="/ref_family/cut02_ours_v10.png?v=1" alt="남편 스타일 기준(CUT2)" style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 8, left: 8, background: '#444', color: '#fff', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>남편 스타일: CUT2</span>
          </div>
          <div style={{ width: 150, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '3px solid var(--accent)' }}>
            <img src="/ref_family/cut10_ours.png?v=1" alt="남편 얼굴 기준(CUT10)" style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>남편 얼굴 ✓ CUT10</span>
          </div>
          <div style={{ width: 150, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '3px solid var(--accent)' }}>
            <img src="/ref_family/cut06_ours.png?v=2" alt="아기 기준(CUT6)" style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>아기 ✓ CUT6</span>
          </div>
        </div>
      </div>

      {/* 캐스트 진행 현황 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>등장인물 진행 현황</div>
        {CAST.map((c) => (
          <div key={c.key} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, minWidth: 84 }}>{c.key}</div>
            <div className="card-meta" style={{ fontSize: 13, flex: 1 }}>{c.role}</div>
            <span className="badge badge-generating" style={{ fontSize: 11 }}>{c.status}</span>
          </div>
        ))}
      </div>

      {/* 제품 락 */}
      <h2 className="page-title" style={{ fontSize: 20, marginTop: 8, marginBottom: 4 }}>제품 락 (Element)</h2>
      <p className="page-desc" style={{ marginBottom: 14 }}>이번 CF에 등장하는 요기보 제품 4종 — 전부 360 제품컷 기반 Element 락으로 형태·색 고정.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14, marginBottom: 22 }}>
        {PRODUCTS.map((p) => (
          <div key={p.element} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-elev)' }}>
            <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 130 }}>
              <img src={p.img} alt={p.name} style={{ maxWidth: '80%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '9px 11px' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>· {p.color}</span></div>
              <div style={{ fontSize: 11.5, color: 'var(--accent)', margin: '2px 0 6px' }}>Element: {p.element} ✓</div>
              <div className="card-meta" style={{ fontSize: 12, lineHeight: 1.5 }}>{p.use}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STAGE 2 — 컷별 영상 보드 (보고용: 우리 영상 단독 / SHOW_REF=true 시 비교 모드) */}
      <h2 className="page-title" style={{ fontSize: 20, marginTop: 8, marginBottom: 4 }}>STAGE 2 · 컷별 영상 (11컷)</h2>
      <p className="page-desc" style={{ marginBottom: 14 }}>
        컷별 완성 영상 — 캐스트·제품 Element 락 + 톤 정합 적용 · 영상은 cafe24 프록시로 재생(Vercel 대응)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 22 }}>
        {REF_CUTS.map((c) => (
          <div key={c.n} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-elev)' }}>
            <div style={{ display: 'flex' }}>
              {SHOW_REF && (
                <div style={{ position: 'relative', flex: 1 }}>
                  {c.refVid ? (
                    <video src={c.refVid} autoPlay loop muted playsInline style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
                  ) : (
                    <img src={c.ref} alt={`컷${c.n} 레퍼런스`} style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
                  )}
                  <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontWeight: 700, fontSize: 11, padding: '2px 7px', borderRadius: 6 }}>REF {c.n}</span>
                </div>
              )}
              <div style={{ position: 'relative', flex: 1, borderLeft: SHOW_REF ? '2px solid var(--accent)' : 'none' }}>
                {c.vid ? (
                  <video src={c.vid} autoPlay loop muted playsInline controls style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover', background: '#000' }} />
                ) : (
                  <img src={c.mine} alt={`컷${c.n}`} style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
                )}
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 11, padding: '2px 7px', borderRadius: 6 }}>CUT {c.n} ▶</span>
              </div>
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginBottom: 4 }}>CUT {c.n} · {c.dur} · 📐 {c.angle}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{c.ours}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 최종 러프컷 마스터 */}
      <div className="note" style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>▶ 최종 러프컷 마스터 (10컷 · 21.0s)</div>
        <div className="card-meta" style={{ fontSize: 12.5, marginBottom: 12 }}>
          무손실 파이프라인(최종 1회 인코딩·crf16) + 전 컷 톤 정합 + 인트로/엔딩 로고 · 편집 순서 1→2→3→4→6→…→11 (CUT5 제외) · 무음(음악은 최종 컴펌 후)
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {SHOW_REF && (
            <div style={{ flex: '1 1 200px', maxWidth: 240 }}>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>레퍼런스 러프컷 (내부 확인용)</div>
              <video src={V('ref_rough', 9)} autoPlay loop muted playsInline controls
                style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: 10, background: '#000' }} />
            </div>
          )}
          <div style={{ flex: '1 1 240px', maxWidth: 300 }}>
            <video src={V('ours_rough', 28)} autoPlay loop muted playsInline controls
              style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '2px solid var(--accent)' }} />
          </div>
        </div>
      </div>

      {/* 컷분할 스토리보드 시트 */}
      <h2 className="page-title" style={{ fontSize: 20, marginTop: 8, marginBottom: 4 }}>🎞 컷분할 스토리보드 시트 (최종)</h2>
      <p className="page-desc" style={{ marginBottom: 14 }}>우리 러프컷 기준 최종 컷 시트 — 총 11컷 · 21.2초 · 인트로 로고(CUT1 상시)·엔딩 로고(CUT11 페이드인)</p>
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 26, background: 'var(--bg-elev)' }}>
        {REF_CUTS.map((c, i) => (
          <div key={c.n} style={{ display: 'flex', gap: 12, alignItems: 'stretch', padding: 10, borderTop: i ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 84, flex: '0 0 auto', borderRadius: 8, overflow: 'hidden' }}>
              <img src={c.mine} alt={`시트 컷${c.n}`} style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>CUT {c.n}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12.5 }}>{c.dur}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 11.5 }}>📐 {c.angle}</span>
              </div>
              <div className="card-meta" style={{ fontSize: 12.5, lineHeight: 1.55, marginTop: 4 }}>{c.ours}</div>
            </div>
          </div>
        ))}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-dim)' }}>
          합계 21.0초 · 러프컷 순서 1→2→3→4→6→…→11 (CUT5 제외 · C4 = 출산 간접 컷, 아기 리빌 직전) · 감정 아크: 임신의 쉼(1–2) → 설렘(3) → 출산(4) → 아기와 육아(6–9) → 가족 완성(10) → 함께 쉼 + 로고(11) · 무음(음악은 최종 컴펌 후)
        </div>
      </div>
    </>
  );
}
