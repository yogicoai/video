'use client';

import { useState } from 'react';

// 요기보 전속 모델 — 고정형 모델 베이스 (2026-08-06)
// 목적: 외국인 남/여/아동 3종의 "얼굴 아이덴티티 고정" 전속 모델을 만들어 모델 A/B/C로 지정 →
//       향후 요기보 제품·공간 스틸 컷에 반복 활용(통일성). 실존인물 복제 X, 레퍼런스의 인상만 참고.
// 방식: 인물별 "레퍼런스 시트 4종"(얼굴 턴어라운드·표정·바디 턴어라운드·포즈)으로 아이덴티티 락.
//       = Higgsfield character-sheet 워크플로우 표준. 락 후 Soul/레퍼런스로 제품컷 반복 재현.

// 레퍼런스 시트 4종 체계 (인물마다 동일 아이덴티티로 생성)
const SHEETS = [
  { key: 'face', label: '① 페이스 턴어라운드', layout: '16:9 · 5패널', panels: '정면 · 좌 3/4 · 좌 측면 · 우 3/4 · 우 측면',
    goal: '얼굴 정체성·각도 고정 — 얼굴형/이목구비 크기·간격/피부/귀/헤어라인/머리 길이 동일 유지' },
  { key: 'expr', label: '② 페이셜 익스프레션', layout: '16:9 · 2×4 (8컷)', panels: '무표정 · 옅은 미소 · 밝은 미소 · 놀람 · 슬픔 · 화남 · 집중 · 쑥스러움',
    goal: '표정만 변경, 얼굴 방향/이목구비/헤어 고정 — 감정은 눈·눈썹·입·볼 근육의 자연스러운 변화로만' },
  { key: 'body', label: '③ 바디 턴어라운드', layout: '16:9 · 5패널', panels: '정면 · 좌 3/4 · 좌 측면 · 후면 · 우 3/4 (전신)',
    goal: '체형·비율 고정 — 키/어깨너비/목 길이/몸통/허리선/골반/팔다리 비율 동일 유지' },
  { key: 'pose', label: '④ 제품 착석 연출', layout: '16:9 · 2×2 (4컷) · Max', panels: '깊게 앉기 · 리클라인(독서) · 책상다리 · 사이드 라운지',
    goal: '요기보 Max(제품 락·컬러 선택: A·B=네이비·C·D=올리브그린)에 앉은 연출 — 자세·눌림 물리 + 제품컷 프리뷰, 동일 얼굴/헤어/비율 유지' },
];

// 인물 패턴 = 고정 아이덴티티 서술 필드 (노션 형식 기반)
const IDENTITY_FIELDS = ['피부', '얼굴형·턱선', '눈', '눈썹', '코', '입술', '볼 혈색', '헤어', '체형', '신체 사이즈(키)'];

// 신체 사이즈 기준: 요기보 Max = 170cm. 모델 키를 제품 비례에 맞춰 고정(앉/섰을 때 연출용).
const FTP = 'https://yogibo.openhost.cafe24.com/web/img/api/modal';

// 카테고리별 전속 모델 (MD 지정) — 여성 A/B/C/D 4명, 남성·아동 TBD
const CATEGORIES = [
  {
    cat: '여성', emoji: '👩', spec: '성인 외국인 여성 · 20~30대 · 세련·따뜻 · 캐주얼/라운지 · 키 맥스(170) 기준 ±',
    models: [
      {
        code: 'A', name: '유럽계 · 브라운 중단발 · 차분/미니멀',
        size: '키 168cm · 슬림 (Max 170 기준 살짝 작게)',
        identity: '유럽계 성인 여성 20대 후반 · 갸름한 타원형 · 짙은 초콜릿 브라운 중단발 웨이브 · 차분·미니멀 · 자연 피부질감',
        ref: `${FTP}/B_A_rep.jpg?v=smile`,
        sheets: { face: `${FTP}/B_A_face.png?v=hairB2`, expr: `${FTP}/B_A_expr.png?v=hair`, body: `${FTP}/B_A_body.png?v=hair`, pose: `${FTP}/B_A_pose.png?v=v2` },
        soulId: null, status: '얼굴 시트 ✅ · 표정/바디/포즈 대기',
      },
      {
        code: 'B', name: '유럽계 · 롱 체스트넛 웨이브 · 청순/내추럴(주근깨)',
        size: '키 172cm · 슬림 롱라인 (Max 170 기준 살짝 크게)',
        identity: '유럽계 성인 여성 20대 초반 · 부드러운 타원형 · 밝은 체스트넛 브라운 롱 웨이브 · 옅은 주근깨 · 청순·내추럴 · 라이트 톤 차분한 눈',
        ref: `${FTP}/B_B_rep.jpg?v=e2`,
        sheets: { face: `${FTP}/B_B_face.png?v=v2`, expr: `${FTP}/B_B_expr.png?v=v2`, body: `${FTP}/B_B_body.png?v=v1`, pose: `${FTP}/B_B_pose.png?v=v1r` },
        video: '/api/video/models/B_vidtest_kling.jpg', videoPoster: `${FTP}/B_vidtest_kling_poster.jpg`, videoNote: '영상 테스트 · Kling 3.0 · 5초 (착석 미세 모션·표정 연출)',
        soulId: null, status: '얼굴 시트 ✅ · 표정/바디/포즈 대기',
      },
      {
        code: 'C', name: '유럽계 · 애쉬 숏보브 · 쿨/미니멀',
        size: '키 169cm · 슬림 (Max 170 기준 살짝 작게)',
        identity: '유럽계 성인 여성 20대 중후반 · 슬림 타원형 · 애쉬 브라운 숏 보브(턱선) · 쿨·미니멀·앤드로지너스 · 자연 피부질감',
        ref: `${FTP}/B_C_rep.jpg?v=smile`,
        sheets: { face: `${FTP}/B_C_face.png?v=hairC2`, expr: `${FTP}/B_C_expr.png?v=hair`, body: `${FTP}/B_C_body.png?v=hair`, pose: `${FTP}/B_C_pose.png?v=v3` },
        soulId: null, status: '얼굴 시트 ✅ · 표정/바디/포즈 대기',
      },
      {
        code: 'D', name: '동아시아계 · 롱 블랙 스트레이트 · 쿨/에디토리얼',
        size: '키 173cm · 슬림 장신 (Max 170 기준 살짝 크게)',
        identity: '동아시아계 성인 여성 20대 초중반 · 슬림 타원형 · 롱 블랙 스트레이트(중앙 가르마) · 쿨·에디토리얼 · 자연 피부질감',
        ref: `${FTP}/B_D_rep.jpg?v=neutral`,
        sheets: { face: `${FTP}/B_D_face.png?v=hairD3`, expr: `${FTP}/B_D_expr.png?v=hair`, body: `${FTP}/B_D_body.png?v=hair`, pose: `${FTP}/B_D_pose.png?v=v3` },
        soulId: null, status: '얼굴 시트 ✅ · 표정/바디/포즈 대기',
      },
    ],
  },
  {
    cat: '남성', emoji: '👨', spec: '성인 외국인 남성 · 30대 전후 · 편안·친근 · 캐주얼 · 키 Max(170) 이상',
    models: [
      {
        code: 'A', name: '유럽계 · 짧은 다크브라운 · 클린컷/캐주얼',
        size: '키 180cm · 슬림 애슬레틱 (Max 170 이상)',
        identity: '유럽계 성인 남성 20대 후반~30대 · 클린컷 · 짧은 다크브라운 · 정돈된 캐주얼 · 자연 피부질감',
        ref: `${FTP}/M_A_rep.jpg?v=smile`,
        sheets: { face: `${FTP}/M_A_face.png?v=hairMA2`, expr: `${FTP}/M_A_expr.png?v=hair`, body: `${FTP}/M_A_body.png?v=hair`, pose: `${FTP}/M_A_pose.png?v=v2` },
        soulId: null, status: '4종 완성 ✅ (착석=네이비 Max)',
      },
    ],
  },
  {
    cat: '아동', emoji: '🧒', spec: '외국인 아동 · 밝고 친근 · 편안한 홈웨어 · 키는 아동 비례',
    models: [
      {
        code: 'A', name: '유럽계 여아 · 금발 곱슬 · 밝음',
        size: '키 약 120cm · 유아~저학년 (아동 비례)',
        identity: '유럽계 여아 6~7세 · 금발 곱슬 중단발 · 둥근 볼 · 밝고 명랑 · 자연 피부',
        ref: `${FTP}/K_A_rep.jpg?v=40`,
        sheets: { face: `${FTP}/K_A_face.png?v=40`, expr: `${FTP}/K_A_expr.png?v=v1`, body: `${FTP}/K_A_body.png?v=v1`, pose: `${FTP}/K_A_pose.png?v=v4` },
        soulId: null, status: '4종 완성 ✅ (착석=미니 라이트그레이 85cm)',
      },
      {
        code: 'B', name: '유럽계 여아 · 레디시브라운 롱웨이브 · 청순(주근깨)',
        size: '키 약 150cm · 초등 고학년/틴 (아동 비례)',
        identity: '유럽계 여아 10~12세 · 레디시브라운 롱 웨이브 · 옅은 주근깨 · 따뜻한 미소 · 자연 피부',
        ref: `${FTP}/K_B_rep.jpg?v=40`,
        sheets: { face: `${FTP}/K_B_face.png?v=40`, expr: `${FTP}/K_B_expr.png?v=v1`, body: `${FTP}/K_B_body.png?v=v1`, pose: `${FTP}/K_B_pose.png?v=v1` },
        video: '/api/video/models/K_B_vidtest_kling.jpg', videoPoster: `${FTP}/K_B_vidtest_kling_poster.jpg`, videoNote: '영상 테스트 · Kling 3.0 · 5초 (올리브 Max 착석·미세 모션)',
        soulId: null, status: '4종 완성 ✅ (착석=올리브 Max)',
      },
    ],
  },
];

// 파이프라인
const PIPE = [
  { s: 'STAGE 0 · 브리프', st: '✅', note: '외국인 남/여/아동 3종 · 라이프스타일 톤 · 얼굴 고정형 베이스 · 모델 A/B/C' },
  { s: 'STAGE 1 · 레퍼런스', st: '🟡', note: '사용자가 유형별 레퍼런스 제공 → 인상/분위기 참고(복제 X)' },
  { s: 'STAGE 2 · 아이덴티티 서술', st: '⬜', note: '레퍼런스 기반 "고정 아이덴티티 서술"(피부·얼굴·눈·헤어·체형…) 확정' },
  { s: 'STAGE 3 · 레퍼런스 시트 4종', st: '⬜', note: '얼굴 턴어라운드 · 표정 · 바디 턴어라운드 · 포즈 생성 → 얼굴·체형·브랜드 적합성 확인' },
  { s: 'STAGE 4 · 선정 & 락', st: '⬜', note: '유형별 최종 확정 → Soul 학습(또는 시트를 레퍼런스로) → soul_id 고정' },
  { s: 'STAGE 5 · 제품컷', st: '⬜', note: '모델 A/B/C 지정 → 요기보 제품·공간 스틸 컷 반복(통일성)' },
];

const C = { accent: '#7E57C2', ok: '#66BB6A', wait: '#e6c86a', card: '#161616', line: '#2a2a2a' };

export default function ModelsPage() {
  const [zoom, setZoom] = useState(null); // 클릭 시 확대할 이미지 URL
  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 20px 80px', color: '#e8e8e8', fontFamily: 'system-ui, "Malgun Gothic", sans-serif' }}>
      <a href="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← 홈</a>

      <h1 style={{ fontSize: 26, margin: '14px 0 6px' }}>🌟 요기보 전속 모델 — 고정형 베이스</h1>
      <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>
        외국인 <b>남성·여성·아동 3종</b>을 <b>모델 A/B/C</b>로 만들어, 포즈·의상·공간이 바뀌어도 <b>동일 인물</b>로 인식되는
        <b style={{ color: C.accent }}> 얼굴 아이덴티티 고정</b> 전속 모델을 구축합니다. 선정 후엔 <b>모델 A 사용 / B 사용</b>처럼 지정해
        요기보 제품·공간 스틸 컷을 <b>통일성 있게</b> 반복 생성. (실존인물 복제 X — 레퍼런스의 인상만 참고)
      </p>

      {/* 레퍼런스 시트 체계 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>레퍼런스 시트 4종 (아이덴티티 락 방식)</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        인물마다 <b>동일 아이덴티티</b>로 이 4종을 생성 → 얼굴·체형·비율을 고정. 이후 제품컷은 이걸 레퍼런스/Soul로 재현.
        <b style={{ color: C.ok }}> (스틸 반복 사용의 표준 — Higgsfield character-sheet 워크플로우)</b>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>
        {SHEETS.map((s) => (
          <div key={s.key} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '11px 13px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.accent }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: '#e6c86a', margin: '3px 0 5px' }}>{s.layout}</div>
            <div style={{ fontSize: 12, color: '#bbb', lineHeight: 1.55 }}>{s.panels}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 6, lineHeight: 1.5 }}>{s.goal}</div>
          </div>
        ))}
      </div>

      {/* 인물 패턴 필드 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>인물 패턴 — 고정 아이덴티티 서술</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 8px' }}>레퍼런스 기반으로 아래 필드를 서술 확정 → 4종 시트·모든 제품컷에 동일하게 사용(락의 핵심).</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {IDENTITY_FIELDS.map((f) => (
          <span key={f} style={{ fontSize: 12.5, background: '#221c33', border: '1px solid #3a3350', color: '#cbb8ec', padding: '6px 11px', borderRadius: 20 }}>{f}</span>
        ))}
      </div>

      {/* 파이프라인 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 10px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>파이프라인 (게이트형)</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {PIPE.map((g) => (
          <div key={g.s} style={{ display: 'grid', gridTemplateColumns: '160px 40px 1fr', gap: 10, alignItems: 'center', fontSize: 13, padding: '8px 10px', background: C.card, borderRadius: 8 }}>
            <b>{g.s}</b><span>{g.st}</span><span style={{ color: '#aaa' }}>{g.note}</span>
          </div>
        ))}
      </div>

      {/* 카테고리별 전속 모델 */}
      <h2 style={{ fontSize: 19, margin: '28px 0 10px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>전속 모델 (카테고리별)</h2>
      {CATEGORIES.map((cg) => (
        <div key={cg.cat} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '6px 0 8px', flexWrap: 'wrap' }}>
            <b style={{ fontSize: 15.5 }}>{cg.emoji} {cg.cat}</b>
            <span style={{ fontSize: 12, color: cg.models.length ? C.ok : '#888' }}>{cg.models.length ? `${cg.models.length}명 (${cg.models.map((m) => m.code).join('/')})` : 'TBD'}</span>
            <span style={{ fontSize: 11.5, color: '#888' }}>· {cg.spec}</span>
          </div>
          {cg.models.length === 0 ? (
            <div style={{ border: '1px dashed #3a3350', borderRadius: 10, padding: '14px', color: '#666', fontSize: 12.5, textAlign: 'center' }}>레퍼런스 확정 후 등록 (여성 완료 뒤 진행)</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {cg.models.map((m) => (
                <div key={m.code} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', background: C.accent, borderRadius: 8, padding: '2px 10px' }}>{cg.cat} {m.code}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: Object.keys(m.sheets).length ? C.ok : C.wait }}>
                      {Object.keys(m.sheets).length ? `✅ 시트 ${Object.keys(m.sheets).length}/4` : `⬜ ${m.status}`}
                    </span>
                  </div>
                  {(m.size || m.identity) && (
                    <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 6, lineHeight: 1.5 }}>
                      {m.size && <b style={{ color: '#cbb8ec' }}>📏 {m.size}</b>}
                      {m.size && m.identity && ' · '}
                      {m.identity}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start', marginTop: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                      {m.ref
                        ? <img src={m.ref} alt="ref" onClick={() => setZoom(m.ref)} title="클릭하면 크게 보기" style={{ width: 118, aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8, border: '1px solid #555', cursor: 'zoom-in' }} />
                        : <div style={{ width: 118, aspectRatio: '3/4', border: '1px dashed #555', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 10.5, textAlign: 'center', lineHeight: 1.5, padding: 6 }}>원본<br />비공개<br /><span style={{ fontSize: 9, color: '#555' }}>(초상권·내부보관)</span></div>}
                      <div style={{ fontSize: 10.5, color: '#888', marginTop: 3 }}>대표 컷(AI)</div>
                    </div>
                    {SHEETS.map((s) => (
                      <div key={s.key} style={{ textAlign: 'center' }}>
                        {m.sheets[s.key]
                          ? <img src={m.sheets[s.key]} alt={s.key} onClick={() => setZoom(m.sheets[s.key])} title="클릭하면 크게 보기" style={{ width: 118, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in' }} />
                          : <div style={{ width: 118, aspectRatio: '16/9', border: '1px dashed #3a3350', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a4d78', fontSize: 10, textAlign: 'center', padding: 4 }}>{s.label.replace(/^[①②③④]\s/, '')}</div>}
                        <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>{s.label.slice(0, 2)}</div>
                      </div>
                    ))}
                  </div>
                  {m.video && (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${C.line}` }}>
                      <div style={{ fontSize: 11, color: C.ok, fontWeight: 700, marginBottom: 6 }}>🎬 {m.videoNote || '영상 테스트'}</div>
                      <video src={m.video} poster={m.videoPoster} controls playsInline loop preload="metadata"
                        style={{ width: 240, maxWidth: '100%', aspectRatio: '16/9', borderRadius: 8, border: `1px solid ${C.accent}`, background: '#000', display: 'block' }} />
                    </div>
                  )}
                  {m.soulId && <div style={{ fontSize: 11, color: C.ok, marginTop: 8 }}>🔒 Soul: {m.soulId}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <p style={{ color: '#666', fontSize: 12, marginTop: 24, lineHeight: 1.7 }}>
        정의 2026-08-06 · 모델 베이스 라인(CF/스티커와 별개) · 크레딧 사용 전 금액 확인·승인.
        레퍼런스 주시면 → 아이덴티티 서술 확정 → 시트 4종부터 생성합니다.
      </p>

      {/* 라이트박스 — 컷 클릭 시 크게 보기 */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}
        >
          <img src={zoom} alt="확대" style={{ maxWidth: '96vw', maxHeight: '92vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,.6)' }} />
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(null); }}
            style={{ position: 'fixed', top: 18, right: 22, width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
            aria-label="닫기"
          >✕</button>
        </div>
      )}
    </div>
  );
}
