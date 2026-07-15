'use client';

// 10차 프로젝트 — 가족 요기보 3탄 "노는 자리" (유아기 놀이 · 2026-07-10 A안 확정)
// 시리즈 3부작 완결: 시작(1탄) → 성장(2탄) → 놀이(3탄) · 엄마와 딸의 일상 (아빠는 드리프트 반복으로 제외 · 2026-07-11)
// 엔진 = Kling 3.0 (인물 마이크로 모션 — 2탄 검증 포맷 계승) · 20초 = 본편 5컷 + GIF 엔딩

const CUTS = [
  {
    id: 'C1', energy: '🏃 도입 · 훅', t: '0–2.4s',
    title: '다이브 — 티렉스를 안고 (로고 인트로: 첫 프레임부터)',
    motion: '아이가 티렉스 메이트를 안고 점프 정점 → 슈퍼맨 다이브 → 맥스에 깊이 파묻힘 → 까르르 (보간 슬로모 1.2x)',
    desc: '딸(2~3살)이 티렉스 메이트(30~40cm)를 꼭 안고 네이비 맥스로 다이브하는 오프닝 훅 — 1.25x 펀치인으로 점프 정점이 프레임을 채움. 로고는 첫 프레임부터 화이트+섀도 정중앙 표시 → 착지 후 페이드아웃(2026-07-11 사용자 확정). minterpolate 보간 슬로모로 주기 저더 제거. 2탄 거실 연속성.',
    img: '/fam3/c1_jump_v2.png?v=1',
    vid: '/fam3/c1_v2_trim.mp4?v=1',
    status: '🎬 영상 v2 완료 (kling pro · 5.25cr) — 국면 분할 전략 성공: 글라이딩·후진 없음, 트림본(2.3s): 점프→다이브→파묻힘→까르르. v13 처리: 1.25x 펀치인 + LAB 톤 재전이 + 보간 슬로모 + 로고 프레임0부터. 구버전 v1 보관',
    prompt: 'Wide living room shot, vertical 9:16, camera at child height. A 2-3 year old Korean toddler GIRL <<<yogibo-daughter>>> (chubby cheeks, black bob, cream knit dress) captured at the peak of a little jump hugging the red T-rex Mate plush (30-40cm), right above the deep navy blue Yogibo Max bean bag <<<yogibo-max-navy>>> (170cm pill, NO armrests). Warm daytime home light, photorealistic warm family film. [참조: ①2탄 C3 v3(환경·티렉스) ②2탄 C4 v3(얼굴 성장 출발점)]',
  },
  {
    id: 'C2', energy: '💥 클라이맥스', t: '2.4–4.3s',
    title: '메이트 인형놀이 — 엄마와 (공식 라인업 총출동 · 콩 임팩트 컷인)',
    motion: '지라프 스윙 하강 → 딸의 엘리펀트와 콩! 인사 → 둘 다 웃음 터짐 · 관객석 드래곤·팍스·옥토푸스는 얌전히 대기',
    desc: '엄마(wife-c3)와 메이트 인형놀이 — 공식 메이트 5종 등장: 딸=엘리펀트(베이지·오렌지 귀), 엄마=지라프(버건디·올리브 다리), 관객=드래곤(올리브·날개)·팍스(오렌지)·옥토푸스(레드·블루 촉수). 바닥엔 솔리드 스퀴지보 산개. 러프컷은 콩 임팩트 직전(f28) 컷인 — 다이브 낙하 에너지가 지라프 스윙으로 이어짐. 메이트 디자인은 yogibo.kr 공식 스와치 24종에서 추출한 5종 시트로 락.',
    img: '/fam3/c3_mateplay_v1.png?v=1',
    vid: '/fam3/c4_mateplay_v1.mp4?v=1',
    status: '🎬 영상 v2 완료 (누적 10.5cr) — v1은 지라프 자율비행+고정폭소로 AI-티 판정(사용자 지적 2026-07-11) → v2 재생성: 그립 유지 CRITICAL RULE + 파도형 웃음 지시로 해소, 확대 QC 통과(인형-손 분리 0프레임). 러프컷 v15 반영. 교훈: 인형 모션은 손 그립 유지를 명시적 RULE로 지시할 것',
    prompt: '[메이트 인형놀이 v1] Use the first image as the SCENE, COLOR and CAST reference and the second image for EXACT official Yogibo Mate designs. Play-mat height, 9:16: girl <<<yogibo-daughter>>> holds up the beige ELEPHANT Mate making it talk; MOTHER <<<yogibo-wife-c3>>> (slim oval face, wispy see-through bangs, beige knit top) holds the burgundy GIRAFFE Mate answering - plushes leaning toward each other mid doll-play, both laughing. Audience on mat: olive DRAGON, orange FOX, red-orange OCTOPUS Mates + tiny Squeezibo cylinders scattered. Navy Max <<<yogibo-max-navy>>> behind. [참조: ①인형놀이 스틸(색감) ②공식 메이트 5종 시트(cf3_mates_sheet_5)]',
  },
  {
    id: 'C3', energy: '🏗 서스펜스', t: '4.3–7.1s',
    title: '스퀴지보 쌓기 놀이 — 엄마와',
    motion: '아이가 유니콘 스퀴지보를 조심조심 꼭대기에 — 엄마가 두 손으로 받칠 준비 — 탑이 흔들 → 버팀 → 둘이 박수+까르르',
    desc: '2026-07-11 사용자 확정: 아빠 얼굴 드리프트가 신규 포즈마다 반복돼 전 컷을 "엄마와의 일상"으로 통일 — 쌓기 컷도 엄마(wife-c3)로 재제작. 스퀴지보 스케일 사용자 확정(v13 크기), 캣 스퀴지보 공식 원기둥 디자인 교정, 유니콘 메이트 보라 통일(C2·C4와 동일 개체). 톤 = LAB 영역별 보정(전역 + 하이라이트 쿨링)으로 기존 컷 실측 매칭(a 141.9 vs 기존 142.0).',
    img: '/fam3/c2_stack_v13_mom.png?v=1',
    vid: '/fam3/c2_stack_mom_v1.mp4?v=1',
    status: '🎬 엄마 버전 영상 완료 (kling pro · 5.25cr · 스틸 3장 6cr) — 유니콘 올리기→손 떼기→탑 버팀→둘이 박수+까르르, 얼굴·톤 드리프트 없음(a 141.8~142.3 안정). 러프컷 v13 반영. 구버전(아빠, v10 스틸·v2 영상)은 파일 보존',
    prompt: '[엄마 버전 v13] Use the first image as the EXACT base - keep the girl placing the purple unicorn Squeezibo on the tower, the Mates, mat, navy Max, room. Corrections: (1) REPLACE the father with the MOTHER <<<yogibo-wife-c3>>> (slim oval face, wispy see-through bangs, chin-length black bob, beige knit top) kneeling in the same spot, both hands hovering ready to catch; (2) every Squeezibo tiny golf-ball scale (5.5cm), official cylinder designs with yogibo tag (cat = cylinder, not ball); (3) tone = LAB post-grade to previous cuts. [참조: ①쌓기 v10(구도) ②스퀴지보 공식 콜라주 ③메이트놀이 스틸(엄마 얼굴·톤)]',
  },
  {
    id: 'C4', energy: '🧸 이완', t: '7.1–9.7s',
    title: '메이트 인형놀이 — 엄마와 (하이앵글 · 빈백에 누워서)',
    motion: '딸이 티렉스 메이트를 들고 어흥, 엄마가 유니콘 메이트로 화답 — 인형끼리 콩 부딪히자 둘 다 웃음 터짐',
    desc: '하이앵글 부감(시리즈 최초) — 엄마가 네이비 맥스에 비스듬히 눕고 딸이 몸 위에 폭 안겨 올라탄 채 티렉스 메이트로 어흥, 엄마는 유니콘 메이트로 방어. 맥스가 프레임을 대각으로 채우는 밀착 인형놀이. 러프컷은 1.35x 추가 펀치인(사용자 확정 프레이밍) — 얼굴·인형 밀착. 누워서 노는 이완 비트가 잠듦(C5)으로 자연스럽게 전이 + 티렉스 릴레이.',
    img: '/fam3/c3_dollplay_v2.png?v=1',
    vid: '/fam3/c3_v1.mp4?v=1',
    status: '🎬 영상 완료 (kling pro · 5.25cr) — 티렉스 어흥→유니콘 방어→인형 콩콩→둘이 웃음, 하이앵글·얼굴·맥스 출렁 유지 · 러프컷 v13 반영(펀치인 1.35x). 스틸 v2(하이앵글 재구도 4cr)',
  },
  {
    id: 'C5', energy: '😴 피날레', t: '9.7–12.5s',
    title: '잠듦 — 놀던 자리에서 (맥스 수미상관 + 로고)',
    motion: '딸이 티렉스를 안고 맥스에서 새근새근 → 엄마가 담요를 살며시 여며주고 토닥토닥 → 로고 정중앙 페이드인',
    desc: '실컷 논 딸이 티렉스 메이트를 꼭 안은 채 C1에서 뛰어들었던 그 네이비 맥스에서 잠들고, 엄마가 담요를 여며주며 지켜봄 → 화이트+섀도 로고 정중앙 페이드인. 단짝 릴레이 마무리(C4에서 안고 놀던 티렉스 그대로 품에) + 맥스 수미상관 + 놀이 에너지에서 잠으로의 점진 하강 완결.',
    img: '/fam3/c5_sleep_v5.png?v=1',
    vid: '/fam3/c5_sleep_v1.mp4?v=1',
    status: '🎬 영상 v1 완료 (kling pro · 5.25cr) — 여며주기→토닥토닥 2회→지켜보는 미소, 딸은 내내 잠든 상태 유지·티렉스 품에·담요 패브릭 자연스러움. 스틸 v5(10cr 누적) 기반. 러프컷 v13 반영',
  },
  {
    id: 'C3.5', energy: '🌉 브릿지 (보관)', t: '미사용',
    title: '티렉스 안고 엄마 품으로 — 멀티샷 브릿지 (신기법 검증)',
    motion: '샷1: 탑에서 돌아서 티렉스 메이트를 집어들고 일어섬 → 샷컷(걷기 생략) → 샷2: 하이앵글, 엄마 품 맥스로 폴짝 안착 → 인형놀이 시작',
    desc: 'Kling 3.0 멀티샷 + start/end 양끝을 승인 스틸로 고정하는 신기법 첫 검증 (2026-07-11) — 얼굴 드리프트 없이 6s 2샷 생성 성공. 다음 프로젝트 자산으로 보관.',
    vid: '/fam3/c34_bridge_v1.mp4?v=1',
    status: '📦 보관 (미사용 · 사용자 결정 2026-07-11) — kling pro 멀티샷 6s(10.5cr) 신기법 검증 성공했으나 샷2 진입부 글라이딩 이슈로 본편 제외. 교훈: 이동 모션은 프롬프트가 아니라 컷 생략으로 처리',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '9:16 · 20s · A안 "노는 자리" 확정(2026-07-10) · 유아기 놀이 에너지 · 가족 3인 완성 · Kling 3.0' },
  { stage: 'STAGE 1 · 에셋 락', s: '✅ 완료', note: '엄마 wife-c3 ✅ · 딸 yogibo-daughter ✅ · 아빠 제외(드리프트→엄마 일상 전환) · 제품: 맥스 네이비·스퀴지보·메이트 공식 라인업(레지스트리+yogibo.kr 스와치)' },
  { stage: 'STAGE 2 · 스토리보드', s: '✅ 확정', note: '5컷 — 에너지 아크: 다이브(훅)→콩 임팩트(클라이맥스)→쌓기(서스펜스)→누워 인형놀이(이완)→잠듦(피날레) · 엄마와의 일상' },
  { stage: 'STAGE 3 · 스틸', s: '✅ 완료', note: '전 컷 승인 스틸 확보 (아이 캐스팅 락 → 컷별 2cr, 쌓기 엄마 전환 포함)' },
  { stage: 'STAGE 4 · 영상화', s: '✅ 완료', note: 'Kling 3.0 3s pro 무음 × 5컷 (실측 5.25cr/컷) — 전 컷 완료, 쌓기는 엄마 버전 재제작' },
  { stage: 'STAGE 5 · 조립', s: '✅ 완료', note: 'v15 확정 + 4K 마스터 2종 완성(음원 Carpe Diem 버전 · 무음 버전) — 🎬 게시 준비 완료 (크레딧 표기: Music: Kevin MacLeod (incompetech.com), CC BY 4.0)' },
];

const CAST = [
  { role: '아이 (주연) — 딸 ✅ 확정', el: 'yogibo-daughter · b4eaaa37', img: '/fam3/_daughter_face.png?v=1', imgNote: '확정 캐스팅 (C1 v1 기준 · 2026-07-10) — 이 얼굴이 전 컷 기준', note: '2~3살 여아 — 통통한 둥근 볼·또렷한 눈(2탄 아기 성장형)·검은 단발+앞머리·크림 니트 원피스. 이후 컷은 daughter Element + C1 v1 얼굴참조 + 프로즈 3중 락' },
  { role: '엄마', el: 'yogibo-wife-c3 · f761df4a', img: '/fam2/_c2_face_ref.png?v=1', imgNote: '확정 룩 앵커 = 2탄 C2 웃는 프레임 (갸름한 계란형·시스루 앞머리)', note: '프로즈 주의: Element 설명문의 "도톰한 볼·두꺼운 앞머리" 금지 — 2탄 C4 드리프트 교훈. 이 이미지가 3중 락 얼굴 참조(media 3b0dbce9)' },
  { role: '아빠 — ❌ 최종본 제외 (2026-07-11)', el: 'yogibo-husband · 7d9a9105', img: '/ref_family/cut10_ours.png?v=1', imgNote: '얼굴 기준 = 1탄 CUT10 (보관)', note: '신규 포즈마다 얼굴 드리프트가 반복돼 전 컷을 "엄마와의 일상"으로 전환하며 제외 — 쌓기 컷도 엄마로 재제작. Element·구버전 파일은 보관' },
  { role: '제품 — 올리브그린·네이비 기준 (사용자 확정)', el: '레지스트리 단일 소스', note: '맥스 네이비블루 ✅ Element 락 완료(yogibo-max-navy · eeddd2d7 — 공식 360 정면·측면 프레임, 레지스트리 기록됨) · 팟 올리브그린(ff505175 · 360) · 서포트 올리브그린(el 락 완료) · 스퀴지보 티렉스 18ce4f74·유니콘 b097fc3c 외(360 · 5.5cm 골프공 스케일문) · 메이트 티렉스 81603f7e(30~40cm) · 지퍼 반대면 · 엄마 160cm 스케일 앵커. 딥 컬러(올리브·네이비)가 발색 최선 — 생성 단계 확정, 사후 리컬러 지양' },
];

export default function Storyboard10Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🧸 가족 요기보 3탄 — "노는 자리" (유아기 놀이)</h1>
          <p className="page-desc">
            10차 · 시리즈 3부작 완결(시작→성장→<b>놀이</b>) · 9:16 · 12.5초 · <b>엄마와 딸의 일상 · 제품 노출 최다(맥스·스퀴지보·메이트 공식 라인업)</b> · Kling 3.0
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
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 연출 설계 — 2탄 검증 문법 + 놀이 에너지</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8 }}>
        <b>에너지 아크가 이 작품의 문법</b> — 2탄이 "고정 구도 반복"이었다면 3탄은 <b>공간·앵글·에너지 다양화</b>(스킬 원칙: 같은 에너지 반복 금지): 도입(달려옴) → 놀이(쌓기) → 디테일(접사) → 클라이맥스(다이브) → 쉼(와이드).
        <br />· <b>kling 한계 내 모션 설계</b>: 큰 동작 컷(C1 달려옴·C4 다이브)은 스틸을 &quot;동작의 끝 순간&quot;으로 고정하고 모션은 반동·리액션만 — 보행·점프 궤적을 통째로 시키지 않음
        <br />· <b>시선 릴레이</b> (2탄 C3 교훈): 컷 안의 감정 연결은 인물 간 시선으로 설계 — C2 아이↔아빠, C4 아이 다이브→부모 리액션, C5 셋이 서로
        <br />· <b>컬러는 생성 단계에서 확정</b> (2탄 리컬러 교훈): 맥스 = 네이비로 처음부터 생성. 딥 컬러(올리브·네이비)가 드리프트 적고 발색 최선 — 사용자 확정 선호
        <br />· <b>아이 캐스팅이 최우선 게이트</b>: 성장 편집은 드리프트 최고위험 → 첫 스틸부터 3중 락, 룩 확정 후 신규 Element 락 검토
        <br />· 톤 = 시리즈 웜 필믹 계승 · LAB 공통 앵커 부분 수렴 · 화질 패스(hqdn3d+cas) · 4K 업스케일(Real-ESRGAN 무료) · 음원은 최종
      </div>

      {/* 캐스팅 시트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 캐스팅 시트</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {CAST.map((c) => (
          <div key={c.role} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.6, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {c.img && (
              <div style={{ flex: '0 0 110px' }}>
                <img src={c.img} alt={`${c.role} Element 기준 컷`}
                  style={{ width: 110, aspectRatio: '3 / 4', objectFit: 'cover', objectPosition: 'top', borderRadius: 10, border: '2px solid #AB47BC' }} />
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

      {/* 컷 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 컷 보드 (6컷 · 20s · 초안)</h2>
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
                <summary style={{ fontSize: 11.5, color: 'var(--accent)', cursor: 'pointer' }}>📝 생성 프롬프트 보기</summary>
                <pre style={{ fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,.15)', padding: 10, borderRadius: 8, marginTop: 6, color: 'var(--text-dim)' }}>{c.prompt}</pre>
              </details>
            )}
            {(c.vid || c.img || c.scaffold) && (
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'flex-start' }}>
                {c.vid && (
                  <video src={c.vid} controls loop muted playsInline
                    style={{ width: 180, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '2px solid #FFB300' }} />
                )}
                {!c.vid && c.img && (
                  <img src={c.img} alt={`${c.id} 확정 스틸`}
                    style={{ width: 180, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '2px solid #42A5F5' }} />
                )}
                {c.scaffold && !c.img && !c.vid && (
                  <img src={c.scaffold} alt={`${c.id} 포즈 뼈대`}
                    style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px dashed var(--border)', opacity: .7 }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 러프컷 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 러프컷 (진행하며 버전업 · 무료 조립)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <video src="/fam3/rough_v15.mp4?v=1" controls loop muted playsInline
            style={{ width: 260, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #FFB300' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>러프컷 v15 (본편 5컷 · 12.6s) — 2026-07-11 AI-티 감사 수정 완결</b> · <b>아기 뛰고(다이브) → 엄마랑 메이트놀이(콩 임팩트) → 엄마랑 스퀴지보 쌓기 → 빈백에 누워 인형놀이 → 엄마가 재워줌</b> — 전 컷 엄마(wife-c3) 통일 · 로고 첫 프레임부터+피날레 정중앙 수미상관 · 티렉스 릴레이<br />
            감사 반영: <b>C1 보간 고스팅 제거(슬로모 해제)</b> · <b>C2 메이트놀이 재생성(5.25cr — 그립 유지 CRITICAL RULE + 파도형 웃음 지시로 인형 자율비행·고정폭소 해소)</b> · <b>C3 엄마 글라이딩 트림</b> · 프리즈 0(302f 전수검사)<br />
            <a href="/fam3/rough_v15_4k.mp4" download style={{ color: 'var(--accent)' }}>⬇ 4K 마스터 다운로드 (2160×3840 · 12.6s · LANCZOS4+디더링+디노이즈 무료 업스케일)</a> · 남은 후반: 음원(최종) · 구버전 v7~v14(+v13 4K) 보존
          </div>
        </div>
      </div>

      {/* 음원 A/B 시안 */}
      <div className="note" style={{ marginBottom: 22, padding: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>🎵 음원 확정: B안 Carpe Diem (무료 · Incompetech CC-BY · 사용자 선택 2026-07-12)</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 220px' }}>
            <video src="/fam3/rough_v15_musicA.mp4?v=1" controls loop playsInline
              style={{ width: 220, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #66BB6A' }} />
            <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
              A안 · Carefree — 미채택 (시안 보존)
            </div>
          </div>
          <div style={{ flex: '0 0 220px' }}>
            <video src="/fam3/rough_v15_musicB.mp4?v=1" controls loop playsInline
              style={{ width: 220, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #42A5F5' }} />
            <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
              <b>✅ B안 · Carpe Diem 확정</b> — 클라리넷+우쿨렐레+실로폰 · 장난기 있는 놀이 무드 · <a href="/fam3/rough_v15_4k_music.mp4" download style={{ color: 'var(--accent)' }}>⬇ 4K 음원 마스터 다운로드 (2160×3840 · 27.2MB)</a>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 10 }}>
          처리: 0.85 볼륨 · 페이드인 0.3s · 잠듦 구간(10.8s~) 페이드아웃 1.8s · <b>최종 2종 산출: 음원 4K 마스터(rough_v15_4k_music) + 무음 4K 마스터(rough_v15_4k)</b>. <b>게시 시 크레딧 필수: &quot;Music: Kevin MacLeod (incompetech.com), CC BY 4.0&quot;</b>
        </div>
      </div>

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 비용 플랜 (실측 단가 기준 · 매 호출 전 개별 승인)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        스틸: 아이 캐스팅 포함 C1~C5 <b>각 2cr</b>(~10cr + 리터치 여유) → Kling 3.0 3s pro 무음 <b>5.25cr × 5컷 = 26.25cr</b> → 엔딩·조립·톤·화질·4K <b>무료</b>
        <br />예상 합계 <b>~37cr + 재시도 여유 = 가드 70cr</b> · 잔액 ~1,883cr (2026-07-10)
        <br /><b>규칙: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 실행 · 1장씩 · get_cost 프리플라이트 실측</b>
      </div>
    </>
  );
}
