'use client';

import { useMemo, useState } from 'react';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// 컷분할 스토리보드 시트 (서버 FTP 업로드본)
const SHEET_URL = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/storyboard_final5.png';

// ── STEP 1: 대표 모델(탤런트) 후보 — 선택한 인물로 전 컷을 동일하게 제작한다.
const MODELS = [
  { key: 'A', label: '모델 A', img: `${CDN}/hf_20260629_034659_f80d6ea9-143a-41ff-953e-c48e99e58d4c.png`, note: '긴 머리 · 부드러운 인상' },
  { key: 'B', label: '모델 B', img: `${CDN}/hf_20260629_034659_f8cf2884-aec2-4162-afe7-74d3042637eb.png`, note: '상큼 · 밝은 미소' },
  { key: 'C', label: '모델 C', img: `${CDN}/hf_20260629_034700_78b17fa7-2697-4aac-a0b0-850728f4258a.png`, note: '또렷 · 자신감' },
];

// ── STEP 2: 컷 스토리보드 — "지친 직장인 → 요기보 휴식" 15초 CF (모델 A · 아보카도 Max · 낮→밤 톤).
const CUTS = [
  {
    n: 1, title: '깨어남', durationSec: 3,
    img: `${CDN}/hf_20260629_064258_6b13fb09-a8ac-4b48-9d63-62b988d51ad0.png`,
    desc: '햇살 속, 아보카도 빈백에서 잠을 깬다.',
    camera: '하이앵글 클로즈업', caption: '음… 잘 잤다',
  },
  {
    n: 2, title: '깜짝 — 폰 확인', durationSec: 3,
    img: `${CDN}/hf_20260629_064756_f03540f7-f080-4f4d-8cec-ca4f3e6531dc.png`,
    desc: '폰을 집어 시간을 확인하다 깜짝 놀란다. (놀란 얼굴 ECU로 연결)',
    camera: '와이드 → 타이트 CU', caption: '헉, 지각!',
  },
  {
    n: 3, title: '출근 준비 → 출근', durationSec: 3,
    img: `${CDN}/hf_20260629_075102_477c33a5-eda2-4f76-b2f8-c354d3161174.png`,
    desc: '머리·가방·신발 빠른 동작(옷 갈아입기 ❌) → 묶은 머리로 개운하게 출근.',
    camera: '디테일컷 → 측면 트래킹', caption: '근데 몸은 개운해',
  },
  {
    n: 4, title: '바쁜 회사', durationSec: 3,
    img: `${CDN}/hf_20260629_075248_7e39b30d-8259-4ebb-9f45-6bd7121512c2.png`,
    desc: '서류 들고 분주한 하루. 인물 중심 + 배경 보케 (묶은 머리 유지).',
    camera: '인물중심 미디엄 · 보케', caption: '—',
  },
  {
    n: 5, title: '쓰러지듯 잠듦', durationSec: 2,
    img: `${CDN}/hf_20260629_082302_cb20af6f-0764-46bc-84ad-07e930344239.png`,
    desc: '아보카도 빈백에 파묻혀 포근히 잠든다. 인물+빈백만, 어두운 저녁 톤(배경 최소).',
    camera: '인물+빈백 · 어둡게', caption: '역시 집이 최고',
  },
  {
    n: 6, title: '잠들며 마무리', durationSec: 1,
    img: `${CDN}/hf_20260629_072008_85830b7b-185d-4645-a640-3261697df87a.png`,
    desc: '빈백 위에서 얼굴 클로즈업으로 평온하게 잠들며 마무리. (엔딩 + 로고)',
    camera: '얼굴 클로즈업', caption: '내 하루의 끝, 요기보',
  },
];

const WORKFLOW = [
  { key: 'cast', label: '① 대표 모델 선정' },
  { key: 'board', label: '② 컷 스토리보드' },
  { key: 'approve', label: '③ 컷 승인' },
  { key: 'video', label: '④ 영상 생성' },
];

export default function StoryboardPage() {
  const [model] = useState('A'); // 선정된 대표 모델 (이 CF는 모델 A 확정)
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
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">요기보 15초 단편 CF</h1>
          <p className="page-desc">
            <strong>대표 모델 → 컷분할 스토리보드</strong> 순서로 이렇게 짜였습니다. (지친 직장인 → 요기보 휴식 · 9:16)
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

      {/* STEP 1 — 대표 모델(확정) + 톤 */}
      <div className="section">
        <div className="section-head">
          <h2 className="section-title">STEP 1 · 대표 모델 &amp; 톤</h2>
          <p className="section-hint">이 CF의 확정 모델과 화면 톤(LOOK) 기준입니다.</p>
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* 확정 모델 */}
          <div style={{ width: 150 }}>
            <div style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: 12, overflow: 'hidden', border: '2px solid var(--accent)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MODELS[0].img} alt="대표 모델" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--accent)', color: '#08130d', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 999 }}>✓ 확정</span>
            </div>
            <div style={{ padding: '8px 2px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>대표 모델</div>
              <div className="card-meta" style={{ fontSize: 12 }}>20대 초반 한국 여성 · 전 컷 동일 인물 고정 (Higgsfield Element)</div>
            </div>
          </div>
          {/* 톤·룩 설명 */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>🎨 톤·룩(LOOK) — 이렇게 잡았어요</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 13.5, color: 'var(--text)' }}>
              <li><strong>필름 질감</strong>: 부드러운 헤이즈 + 미세 그레인 + 소프트 포커스 (과하게 쨍하지 않게)</li>
              <li><strong>색감</strong>: 따뜻한 파스텔 톤, 낮은 대비</li>
              <li><strong>밝기 아크</strong>: 낮(아침·출근·회사)은 밝게 → 밤(귀가·휴식)은 어둡게. 단 <strong>필름 프레임 톤은 일정</strong>하게 유지</li>
              <li><strong>제품</strong>: 아보카도 그린 Yogibo Max (눕힌 라운저)</li>
              <li><strong>의상</strong>: 줄무늬 잠옷 → 네이비 정장 → 줄무늬+차콜 운동복 (장면별 일관)</li>
            </ul>
          </div>
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
