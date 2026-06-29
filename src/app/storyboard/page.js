'use client';

import { useMemo, useState } from 'react';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// 컷분할 스토리보드 시트 (서버 FTP 업로드본)
const SHEET_URL = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/storyboard_sheet_v2.png';

// ── STEP 1: 대표 모델(탤런트) 후보 — 선택한 인물로 전 컷을 동일하게 제작한다.
const MODELS = [
  { key: 'A', label: '모델 A', img: `${CDN}/hf_20260629_034659_f80d6ea9-143a-41ff-953e-c48e99e58d4c.png`, note: '긴 머리 · 부드러운 인상' },
  { key: 'B', label: '모델 B', img: `${CDN}/hf_20260629_034659_f8cf2884-aec2-4162-afe7-74d3042637eb.png`, note: '상큼 · 밝은 미소' },
  { key: 'C', label: '모델 C', img: `${CDN}/hf_20260629_034700_78b17fa7-2697-4aac-a0b0-850728f4258a.png`, note: '또렷 · 자신감' },
];

// ── STEP 2: 컷 스토리보드 — "지친 일상 → 요기보 휴식" 15초 광고 (눕힌 아보카도 Max · 밝은 톤).
const CUTS = [
  {
    n: 1, title: '훅 — 파묻힘', durationSec: 2,
    img: `${CDN}/hf_20260629_031637_7a4d1269-ff37-4ddc-bfe4-2bea6cbeee56.png`,
    desc: '지친 얼굴이 아보카도 Max에 푹 파묻히며 눈을 감는다. 휴식의 결과를 먼저 보여주는 훅.',
    camera: '얼굴 클로즈업 · 얕은 심도', caption: '하루의 끝에…',
  },
  {
    n: 2, title: '핸드폰 보다 깜짝', durationSec: 2,
    img: `${CDN}/hf_20260629_034426_a7734439-e476-4787-aa47-937257b47323.png`,
    desc: '요기보에 누워 핸드폰을 보다 갑자기 깜짝 놀란다. 이야기의 시작.',
    camera: '미디엄 · 정면', caption: '어, 벌써?',
  },
  {
    n: 3, title: '출근 — 만원 지하철', durationSec: 2.5,
    img: `${CDN}/hf_20260629_032044_6fb06d15-7efd-4f04-abc1-35b6fb3df959.png`,
    desc: '사람 꽉 찬 지하철, 손잡이를 잡고 지친 표정. 밝지만 분주한 톤.',
    camera: '미디엄 · 핸드헬드', caption: '버티는 하루',
  },
  {
    n: 4, title: '귀가 — 집 도착', durationSec: 2,
    img: `${CDN}/hf_20260629_032046_fc88c9e2-f596-434d-bd5b-fa821b63bef4.png`,
    desc: '밝고 따뜻한 한국 아파트 현관에 들어선다. 가방을 툭.',
    camera: '와이드 · 정면', caption: '드디어, 집',
  },
  {
    n: 5, title: '다가감', durationSec: 2,
    img: `${CDN}/hf_20260629_033242_22fdaedb-9916-4521-8178-f2e676157b8d.png`,
    desc: '카디건 차림으로 거실에 눕혀진 요기보 Max로 향한다.',
    camera: '와이드 3/4 · 방 넓게', caption: '(무자막)',
  },
  {
    n: 6, title: '휴식 — 페이오프', durationSec: 3,
    img: `${CDN}/hf_20260629_033244_1d157a06-03b5-40bc-85ba-f7139aceb620.png`,
    desc: '눕혀진 요기보에 포근히 누워 몸이 감싸진다. 편안한 미소. 핵심 컷.',
    camera: '미디엄 → 푸시인', caption: '내 몸에 딱, 요기보',
  },
  {
    n: 7, title: '브랜드', durationSec: 1.5,
    img: `${CDN}/hf_20260629_033251_bd353d71-7a30-4a6b-95b4-33a703f6258c.png`,
    desc: '눕혀진 제품 단독 컷 + 로고·캠페인 문구.',
    camera: '정적 와이드', caption: 'Yogibo · 신학기 캠페인',
  },
];

const WORKFLOW = [
  { key: 'cast', label: '① 대표 모델 선정' },
  { key: 'board', label: '② 컷 스토리보드' },
  { key: 'approve', label: '③ 컷 승인' },
  { key: 'video', label: '④ 영상 생성' },
];

export default function StoryboardPage() {
  const [model, setModel] = useState(null); // 선택된 대표 모델 key
  const [approved, setApproved] = useState(() => Object.fromEntries(CUTS.map((c) => [c.n, false])));
  const [toast, setToast] = useState('');

  const approvedCount = useMemo(() => Object.values(approved).filter(Boolean).length, [approved]);
  const totalSec = useMemo(() => CUTS.reduce((s, c) => s + c.durationSec, 0), []);
  const allApproved = approvedCount === CUTS.length;
  // 현재 단계: 모델 미선정 → ①, 선정 후 승인 진행에 따라 ②~④
  const activeStep = !model ? 'cast' : allApproved ? 'video' : approvedCount > 0 ? 'approve' : 'board';

  function flash(m) {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  }
  function toggle(n) {
    if (!model) return flash('먼저 대표 모델을 선정하세요');
    setApproved((p) => ({ ...p, [n]: !p[n] }));
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">스토리보드 스튜디오</h1>
          <p className="page-desc">
            <strong>대표 모델을 먼저 정하고</strong>, 그 인물로 광고를 <strong>컷(cut)으로 분할</strong>해 그려본 뒤, 컷을 확정하면 영상을 만듭니다.
          </p>
        </div>
        {toast && <span className="toast">{toast}</span>}
      </div>

      <div className="note" style={{ marginBottom: 18 }}>
        🎬 <strong>지친 직장인 → 요기보 휴식</strong> · 9:16 세로 · 약 {totalSec}초 · {CUTS.length}컷 · 밝고 포근한 톤
      </div>

      {/* 워크플로우 */}
      <div className="flow" style={{ marginBottom: 10 }}>
        {WORKFLOW.map((w, i) => (
          <span key={w.key} style={{ display: 'contents' }}>
            <span
              className="flow-step"
              style={w.key === activeStep ? { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 700 } : undefined}
            >
              {w.label}
            </span>
            {i < WORKFLOW.length - 1 && <span className="flow-arrow">→</span>}
          </span>
        ))}
      </div>
      <p className="card-meta" style={{ marginBottom: 18 }}>
        현재 단계: <strong style={{ color: 'var(--accent)' }}>{WORKFLOW.find((w) => w.key === activeStep)?.label}</strong>
        {model ? ` · 모델 ${model} · 승인 ${approvedCount}/${CUTS.length}컷` : ' · 모델 미선정'}
      </p>

      {/* STEP 1 — 대표 모델 선정 */}
      <div className="section">
        <div className="section-head">
          <h2 className="section-title">STEP 1 · 대표 모델 선정</h2>
          <p className="section-hint">{model ? `선택됨: 모델 ${model} — 전 컷에 동일 인물로 적용됩니다.` : '한 명을 선택하면 모든 컷이 그 인물로 만들어집니다.'}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {MODELS.map((m) => {
            const sel = model === m.key;
            return (
              <button
                key={m.key}
                onClick={() => { setModel(m.key); flash(`대표 모델 ${m.key} 선정됨`); }}
                style={{
                  textAlign: 'left', padding: 0, cursor: 'pointer', background: 'var(--bg)',
                  border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '3 / 4', background: 'var(--bg-elev)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {sel && (
                    <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--accent)', color: '#08130d', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 999 }}>
                      ✓ 선택
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sel ? 'var(--accent)' : 'var(--text)' }}>{m.label}</div>
                  <div className="card-meta" style={{ fontSize: 12 }}>{m.note}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2 — 컷 스토리보드 */}
      <div className="section-head" style={{ marginTop: 4, marginBottom: 12 }}>
        <h2 className="section-title">STEP 2 · 컷 스토리보드 ({CUTS.length}컷)</h2>
        <p className="section-hint">{model ? `모델 ${model} 기준` : '모델 선정 후 진행'}</p>
      </div>
      <div className="grid" style={{ opacity: model ? 1 : 0.55, transition: 'opacity .2s' }}>
        {CUTS.map((c) => {
          const ok = approved[c.n];
          return (
            <div className="card" key={c.n} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '9 / 16', background: 'var(--bg-elev)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={`컷 ${c.n} ${c.title}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.62)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>CUT {c.n}</span>
                <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.62)', color: '#fff', fontSize: 12, padding: '3px 8px', borderRadius: 6 }}>{c.durationSec}s</span>
                <span style={{ position: 'absolute', bottom: 8, left: 8, background: ok ? 'var(--accent)' : 'rgba(0,0,0,.62)', color: ok ? '#08130d' : '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{ok ? '✓ 승인됨' : '검토 중'}</span>
              </div>
              <div style={{ padding: 12 }}>
                <div className="card-title" style={{ fontSize: 15 }}>{c.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, margin: '6px 0', color: 'var(--text)' }}>{c.desc}</div>
                <div className="card-meta" style={{ fontSize: 12 }}>🎥 {c.camera}</div>
                <div className="card-meta" style={{ fontSize: 12, marginTop: 2 }}>💬 자막: {c.caption}</div>
                <div className="card-foot" style={{ marginTop: 10 }}>
                  <button className={ok ? 'btn btn-sm btn-ghost' : 'btn btn-sm btn-approve'} onClick={() => toggle(c.n)}>
                    {ok ? '승인 취소' : '이 컷 승인'}
                  </button>
                  <button className="btn btn-sm btn-primary" disabled={!ok} onClick={() => flash(`컷 ${c.n} 영상 생성 대기열에 추가됨 (데모)`)}>
                    영상 만들기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 스토리보드 시트 (서버 업로드본) */}
      <div className="section" style={{ marginTop: 18 }}>
        <div className="section-head">
          <h2 className="section-title">컷분할 스토리보드 시트</h2>
          <a className="section-hint" href={SHEET_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
            서버 원본 열기 ↗
          </a>
        </div>
        <p className="card-meta" style={{ marginBottom: 12 }}>
          전체 컷을 한 장으로 정리한 기획 시트 (설명 칸은 후작업용으로 비움). FTP 서버에 업로드되어 링크로 공유 가능합니다.
        </p>
        <a href={SHEET_URL} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SHEET_URL}
            alt="컷분할 스토리보드 시트"
            style={{ width: '100%', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }}
          />
        </a>
      </div>

      {/* 하단 액션 */}
      <div className="section" style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div className="card-meta">
          {!model
            ? 'STEP 1에서 대표 모델을 먼저 선정하세요.'
            : allApproved
            ? `모델 ${model} · 모든 컷 승인 완료. 이제 영상을 생성할 수 있어요.`
            : `모델 ${model} · 컷을 확정하면 영상 단계로 넘어갑니다. (${approvedCount}/${CUTS.length} 승인)`}
        </div>
        <button className="btn btn-primary" disabled={!allApproved} onClick={() => flash('전체 컷 영상화 시작 (데모) — 컷당 비용 확인 후 진행')}>
          ▶ 확정 컷 전체 영상화
        </button>
      </div>
    </>
  );
}
