'use client';

// 11차 프로젝트 — 가족 요기보 4탄 "저녁의 자리" (무비나잇 · 2026-07-11 A안 확정)
// 시리즈 4번째 장: 시작(1탄) → 성장(2탄) → 놀이(3탄) → 쉼(4탄)
// 시리즈 최초 저녁/밤 룩 — 웜 램프광 + 스크린 플리커 · 엔진 = Kling 3.0 (3탄 검증 문법 계승)

const CUTS = [
  {
    id: 'C1', energy: '🌙 훅', t: '0–3.0s',
    title: '불이 꺼지고 — 담요 안고 맥스로 폴짝 (로고 인트로)',
    motion: '거실 메인등이 딸깍 어두워지고 램프 웜광만 남음 → 딸이 담요를 안고 맥스로 폴짝 파묻힘 + 까르르 (3탄 다이브 문법 재사용)',
    desc: '시리즈 최초 저녁 장면 — 조명 전환(딸깍)이 그 자체로 훅. 딸(2~3살, 3탄 캐스팅 그대로)이 아이보리 담요를 안고 네이비 맥스로 뛰어들며 무비나잇 시작을 선언. 로고는 첫 프레임부터 화이트+섀도 정중앙(3탄 확정 문법) → 착지 후 페이드아웃. 이동·점프 궤적은 시키지 않고 "착지 순간" 스틸 고정 + 반동 모션만 (3탄 원칙).',
    img: '/fam4/c1_flop_v1.png?v=1',
    vid: '/fam4/c1_v1.mp4?v=1',
    status: '🟢 스틸 v1 (2cr) — 저조도 게이트 통과: 얼굴 선명·네이비 발색 유지·담요 질감 ✓ · 파자마 전환 ✓ · 배경에 3탄 메이트들(연속성 보너스). 전체 룩 앵커 확정. 🎬 영상 v1 완료(5.25cr) — 파묻힘 덴트+반동+까르르, 러프컷 v1 반영',
    prompt: '[C1 스틸 초안] Cozy evening living room, vertical 9:16, camera at child height. The same living room from this campaign but at NIGHT: main lights off, one warm table lamp glowing amber, soft shadows, curtains closed. A 2-3 year old Korean girl <<<yogibo-daughter>>> (chubby cheeks, black bob with bangs, cream pajamas) captured mid-flop belly-first onto the deep navy blue Yogibo Max bean bag <<<yogibo-max-navy>>> (170cm pill, NO armrests), hugging an ivory knit blanket, laughing - the plump cushion denting softly under her. Warm intimate lamp light, photorealistic warm family film photograph, cinematic evening mood. [참조: ①3탄 C1(구도·다이브 문법) ②3탄 C5(담요·저녁 무드 힌트)]',
  },
  {
    id: 'C2', energy: '🏗 셋업 (제외)', t: '미사용',
    title: '아지트 만들기 — 팟·서포트 조합 (제품 비트)',
    motion: '엄마와 딸이 함께 서포트를 맥스에 꾹꾹 패팅해 기대 자리 완성 — 마주보며 뿌듯한 웃음 (팟은 배경 소품)',
    desc: '요기보 조합 놀이 = 제품 노출 비트: 맥스(베이스) + 팟(사이드) + 서포트(등받이)로 홈시어터 아지트를 만드는 과정. 제품 배치는 스틸 게이트에서 실측 스케일 락(팟 95cm·서포트 실측). 이동 모션 금지 — "끌어다 놓는 마지막 순간 + 하이파이브"만 생성 (3탄 컷 생략 원칙).',
    img: '/fam4/c2_fort_v8.png?v=1',
    status: '❌ 본편 제외 (2026-07-11 사용자 결정 · 스틸 8회 18cr 소요) — 팟(돔형)·서포트(U자 스케일)·문필로우 등 소프트 가구 정밀 재현이 생성 모델 한계로 반복 실패 → 셋업 비트를 컷 생략으로 처리, 본편 = 4컷(C1→C3→C4→C5). 교훈: 정밀 재현 안 되는 소프트 가구는 전경 배치 금지(맥스·스퀴지보·메이트는 안전). 스틸 v1~v8·공식 레퍼런스 시트(cf4_pod_ref·cf4_support_ref) 보관',
    prompt: '[C2 스틸 초안] Same evening living room, warm lamp light, vertical 9:16, wide shot. The MOTHER <<<yogibo-wife-c3>>> (slim oval face, wispy see-through bangs, chin-length black bob, beige knit top) places the olive green Yogibo Pod (teardrop 95cm) beside the navy Max <<<yogibo-max-navy>>>, while the girl <<<yogibo-daughter>>> (cream pajamas) pats the olive green Yogibo Support cushion into place - a cozy home-theater fort taking shape; both smiling at each other proudly. Popcorn bowl and ivory blanket waiting on the mat. Cinematic warm evening mood, photorealistic. [참조: ①C1 확정 스틸(장면 연속) ②제품 360(팟·서포트 실측)]',
  },
  {
    id: 'C3', energy: '💥 절정', t: '3.0–5.8s',
    title: '영화 보다 빵 터짐 — 스크린 플리커 (클라이맥스)',
    motion: '스크린 불빛이 두 얼굴에 어른어른 → 팝콘 하나 집다가 둘이 동시에 빵 터짐, 딸이 뒤로 넘어가며 맥스가 출렁',
    desc: '무비나잇의 절정 — 오프스크린 TV의 플리커 라이트가 얼굴에 일렁이는 시네마틱 룩(시리즈 최초). 딸+엄마가 아지트에 폭 파묻혀 팝콘 먹다 동시에 폭소. 웃음 리액션은 3탄 검증 마이크로 모션 문법. 저조도+플리커는 Kling 리스크 구간 — 스틸에서 플리커 방향·강도 확정 후 영상화.',
    img: '/fam4/c3_laugh_v1.png?v=1',
    vid: '/fam4/c3_v1.mp4?v=1',
    status: '🟢 스틸 v1 (2cr) — 아지트 파묻힘+팝콘 폭소 ✓ · 3종 제품 한 프레임 ✓ · TV 플리커는 약함. 🎬 영상 v1 완료(5.25cr) — 폭소 아크+팝콘+플리커 보강, 러프컷 v1 반영(f6 컷온액션 트림)',
    prompt: '[C3 스틸 초안] Same evening fort, vertical 9:16, medium close shot. The girl <<<yogibo-daughter>>> and MOTHER <<<yogibo-wife-c3>>> nestled together in the navy Max + olive Pod fort under the ivory blanket, a popcorn bowl between them - both BURSTING into laughter at an offscreen movie, soft blue-white TV light flickering on their faces mixed with warm lamp glow, popcorn piece mid-air. Cozy cinematic evening, photorealistic warm family film. [참조: ①C2 확정 스틸(아지트 연속) ②3탄 C2(폭소 표정 앵커)]',
  },
  {
    id: 'C4', energy: '😌 이완', t: '5.8–8.3s',
    title: '스르르 — 엄마 어깨에 기댐',
    motion: '웃음이 잦아들고 딸이 엄마 어깨에 머리를 스르르 기댐 → 눈꺼풀이 무거워짐 → 엄마가 담요를 살짝 올려줌',
    desc: '절정에서 이완으로 — 3탄 C4(누워 인형놀이)와 같은 역할의 감속 비트. 딸의 눈이 감기기 직전까지만 (잠듦 완성은 C5). 엄마의 여며주는 손길 = 3탄 C5 검증 모션 재사용.',
    img: '/fam4/c4_drowsy_v1.png?v=1',
    vid: '/fam4/c4_v1.mp4?v=1',
    status: '🟢 스틸 v1 (2cr) — 어깨 기댐+눈꺼풀 무거움+담요 올려주는 손길 ✓ · C3에서 자연스러운 감속. 🎬 영상 v1 완료(5.25cr) — 눈꺼풀 감김+담요 여며주기+폭 안김, 러프컷 v1 반영(f12 트림)',
    prompt: '[C4 스틸 초안] Same fort, vertical 9:16, intimate close shot. The girl\'s head resting on her mother\'s shoulder, eyelids heavy, tiny yawn, still loosely holding the blanket edge; the MOTHER <<<yogibo-wife-c3>>> gently pulling the ivory blanket up over her, warm tender smile, TV light dimmer now, lamp glow dominant. Quiet drowsy evening mood, photorealistic. [참조: ①C3 확정 스틸(연속) ②3탄 C5(여며주기 앵커)]',
  },
  {
    id: 'C5', energy: '😴 피날레', t: '8.3–11.0s',
    title: '리모컨 딸깍 — 어둠 속 로고 (수미상관)',
    motion: '잠든 딸 → 엄마가 리모컨으로 TV를 끄면 플리커가 사라지고 램프 웜광만 → 엄마 미소 → 로고 정중앙 페이드인',
    desc: 'C1의 "불이 꺼지며 시작" ↔ C5의 "TV가 꺼지며 끝" 조명 수미상관. 딸은 맥스+엄마 품에서 잠들어 있고(3탄 잠듦 문법), TV 끄는 순간의 조명 변화가 엔딩 신호. 화이트+섀도 로고 정중앙 페이드인(시리즈 통일). 4탄 엔딩이자 시리즈 "하루의 끝" 무드 완결.',
    img: '/fam4/c5_remote_v1.png?v=1',
    vid: '/fam4/c5_v1.mp4?v=1',
    status: '🟢 스틸 v1 (2cr) — 잠든 딸+리모컨 든 엄마 ✓ · TV 글로우 제거(램프만) = 조명 수미상관 성립. 🎬 영상 v1 완료(5.25cr) — 리모컨 딸깍+내려놓기+토닥토닥+안아주기, 러프컷 v1 반영(f8 트림)',
    prompt: '[C5 스틸 초안] Same fort, vertical 9:16, calm wide-ish shot. The girl fast asleep against her mother on the navy Max under the ivory blanket; the MOTHER <<<yogibo-wife-c3>>> pointing a small remote toward the offscreen TV, the flicker light just gone - only the warm amber lamp remains, her tender smile looking down at the sleeping girl. Hushed warm darkness, cinematic evening finale, photorealistic. [참조: ①C4 확정 스틸(연속) ②3탄 C5(잠듦 앵커)]',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: 'A안 "저녁의 자리"(무비나잇) 2026-07-11 사용자 확정 · 9:16 · ~13s · 시리즈 최초 저녁 룩 · 엄마+딸(3탄 검증 조합) · Kling 3.0' },
  { stage: 'STAGE 1 · 에셋 락', s: '🟡 재사용', note: '딸 yogibo-daughter ✅ · 엄마 wife-c3 ✅ (신규 락 불필요) · 제품: 맥스 네이비 ✅ · 팟 올리브(360) · 서포트 올리브 · 소품 = 아이보리 담요(3탄 C5 연속)·팝콘 · 아빠 제외 유지(원하면 실루엣 카메오만)' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '5컷 — 조명 수미상관(불 꺼짐으로 시작 ↔ TV 꺼짐으로 끝) · 에너지: 훅→셋업→절정→이완→잠듦' },
  { stage: 'STAGE 3 · 스틸', s: '✅ 완료', note: 'C1~C5 전 컷 스틸 완료(10cr) — C1 저조도 게이트 통과 후 체인 생성(각 컷이 직전 승인 컷 참조). 2026-07-11' },
  { stage: 'STAGE 4 · 영상화', s: '✅ 완료', note: 'Kling 3.0 3s pro 무음 × 4컷(C2 제외) 21cr — 전 컷 QC 통과, 얼굴·저녁 톤 유지' },
  { stage: 'STAGE 5 · 조립', s: '🟡 v1+4K', note: '러프컷 v1(11.0s) + 4K 업스케일 완료(2160×3840 · 14Mbps · 18.5MB · 무료) — 남은 것: 음원(최종 컨펌 후)' },
];

const CAST = [
  { role: '아이 (주연) — 딸 ✅ 재사용', el: 'yogibo-daughter · b4eaaa37', img: '/fam3/_daughter_face.png?v=1', imgNote: '3탄 확정 캐스팅 그대로', note: '2~3살 여아 — 의상만 변경: 크림 파자마(저녁 신호). 3중 락(Element+얼굴참조+프로즈) 유지' },
  { role: '엄마 ✅ 재사용', el: 'yogibo-wife-c3 · f761df4a', img: '/fam2/_c2_face_ref.png?v=1', imgNote: '확정 룩 앵커 = 2탄 C2 웃는 프레임', note: '프로즈: slim oval face · wispy see-through bangs (도톰한 볼 표현 금지 — 드리프트 교훈). 의상 = 베이지 니트 유지(3탄 연속)' },
  { role: '제품', el: '레지스트리 단일 소스', note: '맥스 네이비(eeddd2d7) = 아지트 베이스 · 팟 올리브(ff505175) = 사이드 · 서포트 올리브 = 등받이 · 소품: 아이보리 니트 담요(3탄 C5 연속)·팝콘 볼. 저조도에서 네이비 발색 = C1 스틸 게이트 검증 항목' },
];

export default function Storyboard11Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🌙 가족 요기보 4탄 — &quot;저녁의 자리&quot; (무비나잇)</h1>
          <p className="page-desc">
            11차 · 시리즈 4번째 장(시작→성장→놀이→<b>쉼</b>) · 9:16 · ~13초 · <b>시리즈 최초 저녁 룩 — 램프 웜광 + 스크린 플리커 · 요기보 조합 아지트(맥스+팟+서포트)</b> · Kling 3.0
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

      {/* 연출 설계 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 연출 설계 — 저녁 룩 + 3탄 검증 문법 계승</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8 }}>
        <b>조명이 이 작품의 문법</b> — C1 &quot;메인등 딸깍 꺼짐&quot;으로 시작해 C5 &quot;TV 딸깍 꺼짐&quot;으로 끝나는 조명 수미상관. 램프 웜광(앰버) + 오프스크린 TV 플리커(블루화이트)의 투톤 라이팅.
        <br />· <b>3탄에서 확립된 원칙 전부 적용</b>: 이동 모션 금지(컷 생략으로 처리) · 컷온액션 트림 · 스틸 게이트(승인 스틸만 영상화) · 로고 = 화이트+섀도 정중앙(첫 프레임부터 + 피날레)
        <br />· <b>저조도 리스크 관리</b>: 어두운 장면은 Kling 노이즈·발색 저하 위험 → C1 스틸에서 얼굴·네이비 맥스 발색·담요 질감 검증 후 전체 룩 앵커로 사용
        <br />· <b>담요 릴레이</b>: 3탄 C5의 아이보리 담요가 4탄의 주인공 소품으로 — 시리즈 간 소품 연속성
        <br />· 필요시 멀티샷+양끝 승인스틸 기법(3탄 검증) 가용 · 톤 앵커 = C1 확정 스틸 · 4K 업스케일(무료) · 음원은 최종
      </div>

      {/* 캐스팅 시트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 캐스팅 시트 (전원 재사용 — 신규 락 비용 0)</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {CAST.map((c) => (
          <div key={c.role} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.6, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {c.img && (
              <div style={{ flex: '0 0 110px' }}>
                <img src={c.img} alt={`${c.role} 기준 컷`}
                  style={{ width: 110, aspectRatio: '3 / 4', objectFit: 'cover', objectPosition: 'top', borderRadius: 10, border: '2px solid #5C6BC0' }} />
                <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.4 }}>{c.imgNote}</div>
              </div>
            )}
            <div>
              <b>{c.role}</b> — <code style={{ fontSize: 11 }}>{c.el}</code>
              <br /><span style={{ color: 'var(--text-dim)' }}>{c.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 비주얼 스토리보드 — 한눈에 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 비주얼 스토리보드 (한눈에 · 2026-07-11 스틸 확정)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
          {CUTS.map((c, i) => (
            <div key={c.id} style={{ flex: '0 0 150px', position: 'relative' }}>
              {c.img && (
                <img src={c.img} alt={`${c.id} 스틸`}
                  style={{ width: 150, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '2px solid #5C6BC0', display: 'block' }} />
              )}
              <span style={{
                position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.65)', color: '#fff',
                fontWeight: 700, fontSize: 12, padding: '2px 8px', borderRadius: 6,
              }}>{c.id}</span>
              <span style={{
                position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,0,0,0.55)', color: '#fff',
                fontSize: 10.5, padding: '3px 6px', borderRadius: 6, textAlign: 'center', lineHeight: 1.3,
              }}>{c.t} · {c.energy}</span>
              {i < CUTS.length - 1 && (
                <span style={{ position: 'absolute', right: -9, top: '46%', fontSize: 14, color: 'var(--text-dim)', zIndex: 2 }}>→</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
          불이 꺼지고 폴짝(훅) → 아지트 셋업 → 팝콘 폭소(절정) → 어깨에 스르르(이완) → 리모컨 딸깍+잠듦(피날레) — 조명 수미상관 · 담요 릴레이 · 맥스+팟+서포트 조합
        </div>
      </div>

      {/* 컷 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 컷 보드 (5컷 · ~13s)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {CUTS.map((c) => (
          <div key={c.id} className="note" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14 }}>{c.id} {c.energy} · {c.title}</b>
              <span className="badge badge-review" style={{ fontSize: 11 }}>{c.t}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>🎬 {c.motion}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.6 }}>{c.desc}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{c.status}</div>
            {c.prompt && (
              <details style={{ marginTop: 8 }}>
                <summary style={{ fontSize: 11.5, color: 'var(--accent)', cursor: 'pointer' }}>📝 생성 프롬프트 초안 보기</summary>
                <pre style={{ fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,.15)', padding: 10, borderRadius: 8, marginTop: 6, color: 'var(--text-dim)' }}>{c.prompt}</pre>
              </details>
            )}
            {(c.vid || c.img) && (
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'flex-start' }}>
                {c.vid && (
                  <video src={c.vid} controls loop muted playsInline
                    style={{ width: 180, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '2px solid #FFB300' }} />
                )}
                {!c.vid && c.img && (
                  <img src={c.img} alt={`${c.id} 확정 스틸`}
                    style={{ width: 180, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '2px solid #5C6BC0' }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 러프컷 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 러프컷 (무료 조립)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <video src="/fam4/rough_v1.mp4?v=1" controls loop muted playsInline
            style={{ width: 260, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #5C6BC0' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>러프컷 v1 (4컷 · 11.0s) — 2026-07-11</b> · 폴짝+파묻힘(로고 첫 프레임부터) → 팝콘 폭소(f6 컷온액션) → 스르르+여며주기(f12) → 리모컨 딸깍+토닥+로고 피날레(f8) · 프리즈 0 전수검사 · 전 컷 앰버 저녁 톤 일관<br />
            <a href="/fam4/rough_v1_4k.mp4" download style={{ color: 'var(--accent)' }}>⬇ 4K 마스터 다운로드 (2160×3840 · 11.0s · LANCZOS4+디더링+디노이즈 무료 업스케일)</a> · 남은 후반: 음원(최종)
          </div>
        </div>
      </div>

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>6. 비용 플랜 (실측 단가 기준 · 매 호출 전 개별 승인)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        스틸: C1~C5 <b>각 2cr</b>(10cr + 리터치 여유) → Kling 3.0 3s pro 무음 <b>5.25cr × 5컷 = 26.25cr</b> → 조립·톤·화질·4K <b>무료</b>
        <br />예상 합계 <b>~37cr + 재시도 여유 = 가드 60cr</b>
        <br /><b>규칙: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 실행 · 1장씩 · get_cost 프리플라이트 실측</b>
      </div>

      <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        <a href="/storyboard10" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← 3탄 보기</a>
        {' | '}
        <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>프로젝트 목록</a>
      </div>
    </>
  );
}
