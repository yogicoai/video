'use client';

import { useMemo, useState } from 'react';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// 시작프레임(미디어 인풋) 버킷 — 영상 포스터용
const UP = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
// 컷분할 스토리보드 시트 (서버 FTP 업로드본)
const SHEET_URL = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/storyboard_final8.png';

// ── STEP 1: 대표 모델(탤런트) 후보 — 선택한 인물로 전 컷을 동일하게 제작한다.
const MODELS = [
  { key: 'A', label: '모델 A', img: `${CDN}/hf_20260629_034659_f80d6ea9-143a-41ff-953e-c48e99e58d4c.png`, note: '긴 머리 · 부드러운 인상' },
  { key: 'B', label: '모델 B', img: `${CDN}/hf_20260629_034659_f8cf2884-aec2-4162-afe7-74d3042637eb.png`, note: '상큼 · 밝은 미소' },
  { key: 'C', label: '모델 C', img: `${CDN}/hf_20260629_034700_78b17fa7-2697-4aac-a0b0-850728f4258a.png`, note: '또렷 · 자신감' },
];

// ── STEP 2: 컷 스토리보드 — "지친 직장인 → 요기보 휴식" 20초 CF (모델 A · 아보카도 그린 Pod · 낮→밤 톤).
//    각 컷은 Kling 3.0(std·720p·무음·9:16)로 생성한 3초 소스 영상. (durationSec = 최종 편집 목표 길이)
const CUTS = [
  {
    n: 1, title: '깨어남', durationSec: 2,
    poster: `${CDN}/hf_20260630_031345_1531ca85-2c8f-4d39-9e85-b33b4a8eef21.png`,
    video: `${CDN}/hf_20260630_031541_b0c7761e-ebba-49fe-a6a8-5737d3ab1e3d.mp4`,
    desc: 'video.mp4 0~1초 구도 — 빈백이 화면을 채우는 친밀한 측면 클로즈업. 눈을 감고 자다가 → 고개를 살짝 들며 깨어난다(CUT2 폰 확인으로 자연 연결). 줄무늬 소매가 화면 하단을 가로지른다. 색상은 CUT2 톤에 맞춰 그레이딩(밝기·웜톤 매칭) · 아보카도 그린 Pod · 모델A 얼굴·복장 유지. (러프컷엔 색보정 적용본 사용)',
    camera: '인물 클로즈업 · 측면 3/4 · 아이레벨(빈백이 화면을 채움)', caption: '음… 잘 잤다',
  },
  {
    n: 2, title: '깜짝 — 폰 확인', durationSec: 2,
    poster: `${CDN}/hf_20260630_061834_ab8bc77f-f543-445a-8a89-0097b38e36c4.png`,
    video: `${CDN}/hf_20260630_062121_7bf59e08-3b0b-45ff-b8e0-0e54872c1774.mp4`,
    desc: '기존 구도(빈백에 기대 폰 확인) 유지 — 흐름 끊기지 않게 두고, 어색하게 올라가 있던 다리만 자연스럽게 교정. 시간 확인하다 흠칫 놀람(상체 움찔 → 러프컷 ECU 펀치인 연결). 회색 줄무늬 상의 + 솔리드 차콜 바지. 모델A 얼굴 · CUT2 톤.',
    camera: '와이드 → 타이트 CU', caption: '헉, 지각!',
  },
  {
    n: 3, title: '정신없이 갈아입기', durationSec: 3,
    poster: `${CDN}/hf_20260630_060651_3429cfa6-8007-40a3-afd0-bdd6cd0c0af0.png`,
    video: `${CDN}/hf_20260630_060907_5999907d-43f0-40f5-9c47-6ac5906a6931.mp4`,
    desc: '[재생성] 잠옷에서 출근복으로 — 회색 줄무늬 상의 + 솔리드 차콜 바지(줄무늬 바지 → 차콜로 교체, CUT2와 통일) 차림으로 옷걸이에서 네이비 블레이저를 낚아챈다. 잠옷(CUT1·2) → 출근복(CUT4) 의상 연결. 모델A 얼굴 + CUT2 톤. 러프컷에선 약 3초(집기/끌어내기 2비트).',
    camera: '인물중심 미디엄 · 핸드헬드 · 빠른 동작', caption: '헉 늦었다, 빨리!',
  },
  {
    n: 4, title: '출근 준비 → 출근', durationSec: 3,
    poster: `${UP}/687c7428-3959-4f9a-9a19-d490f84ee5e5.png`,
    video: `${CDN}/hf_20260630_033101_1bd41b2d-8bc4-4b18-bb7b-81186490570b.mp4`,
    desc: 'video.mp4 출근샷 따라잡기 — 얼굴이 화면을 꽉 채우는 타이트한 3/4 클로즈업. 환하게 웃으며 빠르게 걷는 당찬 걸음 + 핸드헬드 카메라 흔들림(거리 보케가 흐르며 전진감). 러프컷에선 약 3초로 연장. CUT2 톤으로 색보정 · 모델A 얼굴·정장 유지.',
    camera: '타이트 3/4 CU · 핸드헬드 · 빠른 워킹', caption: '근데 몸은 개운해',
  },
  {
    n: 5, title: '바쁜 회사', durationSec: 2,
    poster: `${UP}/c73ae442-6097-456d-84ab-d674af7073db.png`,
    video: `${CDN}/hf_20260629_084705_b01e2bef-9c80-4061-8480-9fc67370bbea.mp4`,
    desc: '서류 보며 분주한 하루. 인물 중심 + 배경 보케 (묶은 머리 유지). 러프컷에선 풀샷+펀치인 2비트. 최종 컬러는 video.mp4 룩에 매칭.',
    camera: '인물중심 미디엄 · 보케', caption: '—',
  },
  {
    n: 6, title: '동료와 짧은 회의', durationSec: 2,
    poster: `${CDN}/hf_20260630_060653_042b70e6-13ea-4048-acc2-c8778a90c6bc.png`,
    video: `${CDN}/hf_20260630_060911_d02a8f67-9684-46fe-a591-2d4e9905bf64.mp4`,
    desc: '[신규] 서류·노트를 들고 동료(뒷모습)와 짧게 논의 — 가볍게 손짓하며 끄덕인다. 회사씬을 "이동 → 상호작용 → 소진"으로 다양화하는 상호작용 비트. 오피스 보케 · 모델A · 네이비 정장 · 포니테일 · CUT2 톤.',
    camera: '인물중심 미디엄 · 보케 · 핸드헬드', caption: '이건 이렇게요',
  },
  {
    n: 7, title: '지친 표정 (퇴근 직전)', durationSec: 3,
    poster: `${CDN}/hf_20260630_052118_3980475c-d961-463f-89c1-dc608911595a.png`,
    video: `${CDN}/hf_20260630_052303_36b70a55-7dfc-49d5-b141-19bed08a394e.mp4`,
    desc: '퇴근 직전, 책상에 앉아 관자놀이를 짚고 지친 표정. 느린 한숨 · 어깨가 툭 내려간다. 네이비 블레이저 + 묶은 머리 유지(Model A). 오피스 보케 배경. CUT2 톤으로 색보정.',
    camera: '인물중심 미디엄 · 보케', caption: '오늘도 길었다',
  },
  {
    n: 8, title: '쓰러지듯 다이브', durationSec: 1,
    poster: `${CDN}/hf_20260630_012719_2bebe909-fc52-4c1e-a299-1ba4bfe2fd7c.png`,
    video: `${CDN}/hf_20260630_013307_828039cc-b5b3-45ee-8d73-ec2db6f50e6c.mp4`,
    desc: '귀가 후 빈백 앞에 서 있다가 → 몸을 던지듯 앞으로 푹 파묻힌다(다이브 → 안착). 러프컷에선 다이브 끝에서 얼굴 쪽으로 푸시인(줌인)하며 CUT9 잠든 얼굴로 디졸브 — "풀썩 안기며 스르륵 잠든다"가 한 동작처럼 연결. CUT2 톤으로 색보정. 인물 중심 로우 앵글.',
    camera: '인물중심 로우앵글 · 다이브 → 얼굴 푸시인', caption: '역시 집이 최고',
  },
  {
    n: 9, title: '잠들며 마무리', durationSec: 3,
    poster: `${CDN}/hf_20260630_010145_fb681a9b-cb05-44f6-bd0f-a03d277ebe85.png`,
    video: `${CDN}/hf_20260630_010352_ed65ab7d-43d8-4581-b653-df759c81ba46.mp4`,
    desc: '빈백에 뺨을 대고 평온하게 잠든 얼굴 클로즈업. CUT8 다이브의 푸시인에서 디졸브로 받아 마무리. CUT2 톤으로 색보정. (화이트아웃 없이) 엔딩 로고 카드로 전환.',
    camera: '얼굴 클로즈업', caption: '내 하루의 끝, 요기보',
  },
  {
    n: 10, title: '엔딩 — 로고', durationSec: 2.2,
    poster: '/endcard_poster.png',
    video: '/endcard.mp4',
    desc: '흰 배경 엔딩 — 공식 yogibo 로고(차콜+청록 물결)가 흰 화면에서 천천히 떠오르며(슬로우 페이드인) 마무리.',
    camera: '그래픽 · 흰 배경 · 슬로우 페이드인', caption: 'yogibo',
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
  const [approved, setApproved] = useState(() => Object.fromEntries(CUTS.map((c) => [c.n, true])));
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
          <h1 className="page-title">요기보 20초 단편 CF</h1>
          <p className="page-desc">
            <strong>대표 모델 → 컷분할 스토리보드</strong> 순서로 이렇게 짜였습니다. (지친 직장인 → 요기보 휴식 · 9:16)
          </p>
        </div>
        {toast && <span className="toast">{toast}</span>}
      </div>

      <div className="note" style={{ marginBottom: 18 }}>
        🎬 <strong>지친 직장인 → 요기보 휴식</strong> · 9:16 세로 · 약 {totalSec}초 · {CUTS.length}컷 · 밝고 포근한 톤
        <br />
        ✅ <strong>전 컷 영상 생성 + 색보정(원본 video.mp4 컬러 매칭) + 회사씬 다양화(동적 이동·회의·지침) + 공식 yogibo 로고 엔딩 완료</strong> — 카드에서 바로 재생됩니다 (Kling 3.0 · 720p · 무음 · 각 3초 소스). 남은 작업: 음악.
      </div>

      {/* 러프 컷 미리보기 — A(자막 없음) / B(자막) 비교 */}
      <div className="note" style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>▶ 러프 컷 v3 (video.mp4 스타일 · 약 20초 · 무음) — A / B 비교</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <video
              src="/rough_cut_v3.mp4?v=cut5b"
              controls loop muted playsInline preload="metadata"
              style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 10, background: '#000' }}
            />
            <div className="card-meta" style={{ fontSize: 12, marginTop: 6 }}><b>버전 A</b> · 자막 없음</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <video
              src="/rough_cut_v3_textB.mp4?v=textb4"
              controls loop muted playsInline preload="metadata"
              style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 10, background: '#000' }}
            />
            <div className="card-meta" style={{ fontSize: 12, marginTop: 6 }}><b>버전 B</b> · 자막 (키네틱+에디토리얼)</div>
          </div>
          <div style={{ minWidth: 240, flex: 1 }}>
            <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.7 }}>
              순서: 기상(측면·로고) → 폰(상체 리프레임) → <b>놀람</b> → 옷갈아입기 → 출근(당찬걸음) → 바쁜 회사(데스크) → <b>회의</b> → 지친 표정 → 다이브 <b>(얼굴 줌인)</b> → 잠든 얼굴 → <b>yogibo 로고</b>.
              <br />최종 컬러는 원본 <b>video.mp4 룩에 매칭</b> · 다이브→잠 줌인 디졸브.
              <br /><b>버전 B 자막 2개</b> (출근=키네틱 키워드 · 마무리=에디토리얼 미니멀, 페이드): 출근 <i>“자, 오늘도 가볼까”</i> · 마무리 <i>“내 하루의 끝, 요기보”</i>. <span style={{ opacity: 0.7 }}>※ 문구·위치는 조정 가능.</span>
              <br />남은 단계: 자막 확정 → 음악.
              <br />
              <a href="/rough_cut_v3_textB.mp4?v=textb4" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>↗ B(자막) 크게 보기</a>
              <span style={{ opacity: 0.5 }}> · </span>
              <a href="/rough_cut_v3.mp4?v=cut5b" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', opacity: 0.8 }}>A(자막없음) 보기</a>
            </div>
          </div>
        </div>
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
              <li><strong>색보정(확정)</strong>: 1차로 전 컷을 CUT2 톤으로 통일한 뒤, <strong>최종 룩을 원본 video.mp4 컬러에 매칭</strong>(LAB 색통계 전이 — 살짝 어둡고 채도 낮은 자연스러운 필름톤)으로 한 편처럼 연결</li>
              <li><strong>제품</strong>: 아보카도 그린 Yogibo Pod (둥근 팟)</li>
              <li><strong>의상(일관)</strong>: 줄무늬 잠옷(기상) → <strong>잠옷에서 네이비 정장으로 갈아입기</strong> → 네이비 정장(출근·회사) → 줄무늬+차콜(귀가·휴식)</li>
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
                {c.video ? (
                  <video
                    src={c.video}
                    poster={c.poster}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.img} alt={`컷 ${c.n} ${c.title}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.62)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>CUT {c.n}</span>
                <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.62)', color: '#fff', fontSize: 12, padding: '3px 8px', borderRadius: 6 }}>{c.durationSec}s</span>
                {c.video && (
                  <span style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(120,210,150,.92)', color: '#08130d', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>▶ 영상</span>
                )}
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
                  {c.video ? (
                    <a className="btn btn-sm btn-primary" href={c.video} target="_blank" rel="noreferrer">
                      영상 열기 ↗
                    </a>
                  ) : (
                    <button className="btn btn-sm btn-primary" disabled={!ok} onClick={() => flash(`컷 ${c.n} 영상 생성 대기열에 추가됨 (데모)`)}>
                      영상 만들기
                    </button>
                  )}
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
          전체 {CUTS.length}컷(엔딩 카드 포함)을 한 장으로 정리한 기획 시트 — 각 컷의 시작/끝 프레임·카메라·연출·나레이션·SFX. FTP 서버에 업로드되어 링크로 공유 가능합니다.
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
            ? `모델 ${model} · 전 컷 영상 생성 완료 — 최종 편집(트랜지션·컬러그레이드·흰배경+로고 엔딩) 단계만 남았습니다.`
            : `모델 ${model} · 컷을 확정하면 영상 단계로 넘어갑니다. (${approvedCount}/${CUTS.length} 승인)`}
        </div>
        <a className="btn btn-primary" href={SHEET_URL} target="_blank" rel="noreferrer">
          ▶ 스토리보드 시트 열기
        </a>
      </div>
    </>
  );
}
