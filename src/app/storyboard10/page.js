'use client';

// 10차 프로젝트 — 가족 요기보 3탄 "노는 자리" (유아기 놀이 · 2026-07-10 A안 확정)
// 시리즈 3부작 완결: 시작(1탄) → 성장(2탄) → 놀이(3탄) · 아빠(1탄 Element) 재등장으로 가족 3인 완성
// 엔진 = Kling 3.0 (인물 마이크로 모션 — 2탄 검증 포맷 계승) · 20초 = 본편 5컷 + GIF 엔딩

const CUTS = [
  {
    id: 'C1', energy: '🏃 도입', t: '0–3s',
    title: '달려옴 — 티렉스를 안고 (로고 인트로)',
    motion: '아이가 메이트 티렉스를 안고 맥스를 향해 마지막 한두 스텝 + 기대감 웃음 · 머리칼 출렁',
    desc: '거실 와이드 — 딸(2~3살)이 티렉스 메이트(30~40cm)를 꼭 안고 네이비 맥스를 향해 달려오는 도입. kling 보행 한계를 감안해 스틸 = "도착 직전 마지막 스텝" 순간으로 고정, 모션은 1~2스텝+상체 반동만. 로고 인트로는 1·2탄 방식(정중앙 오버레이 → 페이드아웃). 2탄 거실 연속성.',
    img: '/fam3/c1_run_v1.png?v=1',
    status: '🟢 스틸 v1 확정 (2cr) — 딸 룩 사용자 컨펌(2026-07-10 "귀엽다") → yogibo-daughter Element 신규 락(b4eaaa37). 영상화 5.25cr 대기',
    prompt: 'Wide living room shot, vertical 9:16, camera at child height. Use the first image as the ENVIRONMENT reference - same living room from this campaign: the window with sheer curtains and warm light, the colorful alphabet play mat, the wooden floor, the red T-rex plush toy design. New composition: a 2-3 year old Korean toddler GIRL runs toward a deep navy blue Yogibo Max bean bag <<<yogibo-max-navy>>> - a large pill-shaped bean bag sofa as long as an adult is tall (170cm), lying on the floor by the window, plump and smooth with NO armrests and NO backrest. The girl is captured at her LAST STEP just before reaching it - one foot forward mid-stride, leaning slightly forward with momentum, hugging the red T-rex plush (30-40cm) tightly to her chest, laughing with excitement, soft black chin-length hair bouncing mid-motion. Her identity: <<<yogibo-baby>>> grown up - the SAME child as the toddler in the second image, now 2-3 years old, a little girl wearing a cream knit dress over soft leggings. Warm daytime home light, photorealistic warm family film photograph. [참조: ①2탄 C3 v3(환경·티렉스) ②2탄 C4 v3(얼굴 성장 출발점)]',
  },
  {
    id: 'C2', energy: '🏗 놀이 1', t: '3–6s',
    title: '스퀴지보 쌓기 놀이 — 아빠 재등장',
    motion: '아빠가 스퀴지보 하나를 얹고, 아이가 마지막 하나를 조심조심 꼭대기에 — 흔들리는 탑에 둘 다 숨죽였다 까르르',
    desc: '아빠(1탄 Element 재등장)와 딸이 플레이매트에서 스퀴지보 5~6개(티렉스·유니콘·블루·도그 등, 각 5.5cm 골프공 크기)를 탑처럼 쌓는 놀이 (2026-07-10 사용자 확정 — 쿠션 성에서 변경). 시선 릴레이 = 아이↔아빠 ↔ 흔들리는 탑. 배경에 네이비 맥스·올리브 팟. 스퀴지보 형태는 레지스트리 360 락.',
    img: '/fam3/c2_stack_v1.png?v=1',
    status: '🔴 스틸 v1 (2cr) — 구도·딸·네이비맥스·올리브팟은 좋으나 ①아빠가 수염+40대로 드리프트(참조 슬롯 부족으로 Element+프로즈만 사용 — 2탄 C4 동일 패턴) ②스퀴지보 타워 디자인 이탈. 수정안: v2 아빠 얼굴 복원(베이스=v1+1탄 CUT10 얼굴참조, 2cr) → v3 타워 교정(베이스=v2+소품 콜라주, 2cr) — 최소 편집 1건씩 분리',
    prompt: 'Use the first image as the ENVIRONMENT and CHARACTER reference (living room + the SAME girl <<<yogibo-daughter>>>). New composition: the girl and her FATHER <<<yogibo-husband>>> kneel on the play mat facing each other, stacking tiny Yogibo Squeezibo squishies (second image for exact designs, each 5.5cm golf-ball sized) - a wobbly tower of four, the girl placing the fifth on top, father leaning in hands-ready. Background: navy Max <<<yogibo-max-navy>>> + olive egg-shaped Pod (95cm, smooth undented top). [참조: ①C1 v1(환경+딸) ②2탄 소품 콜라주(스퀴지보) — 아빠 얼굴참조 슬롯 없음 → 드리프트 원인]',
  },
  {
    id: 'C3', energy: '🔍 디테일', t: '6–9s',
    title: '스퀴지보 조몰락 — 접사 호흡',
    motion: '아이 손바닥 위 스퀴지보를 조몰락조몰락 — 눌렸다 복원되는 스퀴시 질감 강조',
    desc: '접사 클로즈업 — 아이 손바닥의 스퀴지보 티렉스(5.5cm 골프공 크기, 레지스트리 스케일문+yogibo 태그)를 쥐었다 펴는 디테일. 배경 보케에 부모 실루엣. 빠른 놀이 컷 사이 호흡 조절 + 스퀴지보 USP(쥐는 맛) 제품 샷.',
    status: '⬜ 대기',
  },
  {
    id: 'C4', energy: '💥 클라이맥스', t: '9–12s',
    title: '다이브 — 폭신하게 파묻힘 (1탄 오마주)',
    motion: '착지 직후 쿠션 반동으로 몸이 살짝 튀어오르고 까르르 — 부모 웃음 리액션',
    desc: '아이가 네이비 맥스로 폴짝 다이브 — 스틸 = "착지 직후 파묻힌 순간"으로 고정(점프 궤적은 kling 한계 밖), 모션 = 쿠션 반동+웃음. 1탄 다이브 컷 오마주 + 맥스 폭신함(USP) 클라이맥스. 컬러는 생성 단계에서 네이비 확정(사후 리컬러 지양 — 역광 교훈).',
    status: '⬜ 대기',
  },
  {
    id: 'C5', energy: '😌 쉼', t: '12–15s',
    title: '셋이 나란히 — 가족 완성 (시리즈 수미상관)',
    motion: '셋이 맥스에 파묻혀 숨 고르기, 아이가 부모 사이에서 까르르 · 미세 호흡·웃음만',
    desc: '와이드 — 엄마·아이·아빠가 맥스에 나란히 파묻혀 노곤하게 쉬는 그림. 1탄 엔딩(부부+신생아 3인)과 수미상관: 그 아기가 자라 셋이 함께 노는 자리. 시리즈 완결 그림.',
    status: '⬜ 대기',
  },
  {
    id: 'C6', energy: '✨ 엔딩', t: '15–20s',
    title: '태그라인 카드 — "잘 노는 자리, 잘 자라는 자리"',
    motion: '화이트 카드 크로스디졸브 → 문구 → 로고 (사용자 GIF 제작 예정 — 2탄 방식)',
    desc: '엔딩 = 사용자 제작 GIF (2탄 yogibo_section_logo.gif 방식 · 1536×2752 권장). 태그라인 후보: "잘 노는 자리, 잘 자라는 자리" / "우리 집에서 제일 신나는 자리". 확정 전까지 클로드 합성 카드로 러프컷 가조립 가능(무료).',
    status: '⬜ 대기 (태그라인 문구 확정 필요)',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '9:16 · 20s · A안 "노는 자리" 확정(2026-07-10) · 유아기 놀이 에너지 · 가족 3인 완성 · Kling 3.0' },
  { stage: 'STAGE 1 · 에셋 락', s: '🟡 진행', note: '엄마 wife-c3 ✅ · 아빠 husband ✅(1탄 재등장) · 아이 2~3살 = 신규 캐스팅 게이트(3중 락 필수) · 제품: 맥스 네이비·팟·스퀴지보·메이트·옐리(레지스트리)' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '6컷 초안 — 에너지 아크: 도입→놀이→디테일→클라이맥스→쉼→엔딩' },
  { stage: 'STAGE 3 · 스틸', s: '⬜', note: '첫 게이트 = 아이 캐스팅 스틸(C1) — 룩 확정 후 필요시 신규 Element 락 · 이후 컷별 2cr' },
  { stage: 'STAGE 4 · 영상화', s: '⬜', note: 'Kling 3.0 3s pro 무음 × 5컷 (실측 5.25cr/컷) — 승인 스틸만' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: '러프컷 버전업(무료) → 톤 매칭 → 화질 패스 → 4K 업스케일(무료 Real-ESRGAN) → 음원(최종)' },
];

const CAST = [
  { role: '아이 (주연) — 딸 ✅ 확정', el: 'yogibo-daughter · b4eaaa37', img: '/fam3/_daughter_face.png?v=1', imgNote: '확정 캐스팅 (C1 v1 기준 · 2026-07-10) — 이 얼굴이 전 컷 기준', note: '2~3살 여아 — 통통한 둥근 볼·또렷한 눈(2탄 아기 성장형)·검은 단발+앞머리·크림 니트 원피스. 이후 컷은 daughter Element + C1 v1 얼굴참조 + 프로즈 3중 락' },
  { role: '엄마', el: 'yogibo-wife-c3 · f761df4a', img: '/fam2/_c2_face_ref.png?v=1', imgNote: '확정 룩 앵커 = 2탄 C2 웃는 프레임 (갸름한 계란형·시스루 앞머리)', note: '프로즈 주의: Element 설명문의 "도톰한 볼·두꺼운 앞머리" 금지 — 2탄 C4 드리프트 교훈. 이 이미지가 3중 락 얼굴 참조(media 3b0dbce9)' },
  { role: '아빠', el: 'yogibo-husband · 7d9a9105', img: '/ref_family/cut10_ours.png?v=1', imgNote: '얼굴 기준 = 1탄 CUT10 승인 룩', note: '1탄 Element 재등장 — 30대 초반 다정한 인상, 무채색 레이어드(회색 니트+카디건)' },
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
            10차 · 시리즈 3부작 완결(시작→성장→<b>놀이</b>) · 9:16 · 20초 · <b>아빠 재등장으로 가족 3인 완성 · 제품 노출 최다(맥스·팟·스퀴지보·메이트)</b> · Kling 3.0
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
