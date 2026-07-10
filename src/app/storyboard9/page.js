'use client';

// 9차 프로젝트 — 가족 요기보 2탄 "함께 자라는 자리" (엄마+아기 사계절 성장 몽타주 · 2026-07-09 확정)
// 1탄(4차 가족 CF)의 후속 — 주연 = 부인(wife-c3, 최고 재현률 Element) + 아기 · 엔진 = Kling 3.0 (인물 중심 마이크로 모션)
// cafe24 FTP 서빙 시: /api/video/fam2/ 프록시 사용 예정
const V = (name, ver = 1) => `/api/video/fam2/${name}.jpg?v=${ver}`;

// 컷 구성 — 같은 거실·같은 아쿠아 맥스·고정 구도, 계절과 아기 성장만 변화 (15s = 4컷×3s + 엔딩 3s)
const CUTS = [
  {
    id: 'C1', season: '🌸 봄', t: '0–3s', months: '3~4개월',
    title: '수유 — 서포트 안에서 (1탄 CUT6 계승)',
    motion: '아기가 젖병을 빨며 손을 꼼지락, 엄마는 내려다보며 미세하게 토닥 · 카메라 슬로우 푸시인',
    desc: '엄마가 올리브 서포트에 감싸여 앉아 아기(트리 우주복)에게 분유를 먹이는 수유 모먼트 — 1탄 CUT6 승인 구도의 최소 편집(동작만 교체). 계절감 = 크림 니트 + 부드러운 봄 햇살. 1탄 거실 그대로.',
    status: '🎬 영상 완료 (kling pro 1080p · Element 포함 · 5.25cr) — 측면 45도 앵글 · 얼굴 복원 · 러프컷 v2 반영',
    img: '/fam2/c1_spring_v9.png?v=1',
    vid: '/fam2/c1_v1.mp4?v=1',
  },
  {
    id: 'C2', season: '☀️ 여름', t: '3–6s', months: '7~8개월',
    title: '옹알이 — 마주보는 웃음',
    motion: '아기가 손을 흔들며 옹알이, 엄마가 마주보고 웃음 터짐 · 카메라 동일 푸시인',
    desc: '아기가 맥스에 기대 앉아 옹알이(7~8개월) — 민소매 여름 배냇옷, 엄마는 반팔 린넨으로 마주보며 웃음. 옆에 옐리 인형. 1탄 거실 유지.',
    status: '🎬 영상 완료 (kling pro 1080p · Element 포함 · 5.25cr) — OTS 앵글 · 옹알이+엄마 웃음 반응 · 러프컷 v2 반영',
    scaffold: '/ref_family/cut07_ours.png?v=1',
    img: '/fam2/c2_summer_v2.png?v=1',
    vid: '/fam2/c2_v1.mp4?v=1',
  },
  {
    id: 'C3', season: '🍁 가을', t: '6–9s', months: '10~11개월',
    title: '붙잡고 서기 — 기다리는 두 팔',
    motion: '아기가 서포트를 붙잡고 일어서고, 엄마가 두 팔을 벌려 기다림 · 미세 흔들림(긴장감)',
    desc: '아기 눈높이 로우앵글 — 올리브 서포트를 붙잡고 일어서는 순간(긴팔 맨투맨), 엄마는 가디건 차림으로 두 팔 벌려 기다림. 플레이매트에 장난감 소품 배치(레지스트리 실측 스케일): 메이트 티렉스·유니콘(30~40cm 인형) + 스퀴지보 티렉스·유니콘(5.5cm 골프공 크기, yogibo 태그 디테일) + 옐리. 웜 앰버 가을 빛 · 맥스 = 네이비 블루(사용자 확정).',
    img: '/fam2/c3_autumn_v2.png?v=1',
    vid: '/fam2/c3_v1.mp4?v=1',
    status: '🎬 영상 완료 (kling pro 1080p · Element 포함 · 5.25cr) — 아기 팔걸이 그립 유지·웃음 성장·어색 모션 없음 · 러프컷 v4 반영',
  },
  {
    id: 'C4', season: '❄️ 겨울', t: '9–12s', months: '12~14개월',
    title: '포옹 — 함께 쓰러지는 웃음',
    motion: '아기가 두세 걸음 걸어 엄마 품으로 폭 — 둘이 맥스로 부드럽게 쓰러지며 웃음',
    desc: '같은 구도. 아기가 엄마 품으로 안기고 둘이 맥스에 파묻히며 웃는 클라이맥스 — 맥스의 폭신함(USP)이 감정 비트와 결합. 계절감 = 두툼한 스웨터·아기 겨울 우주복·무릎 담요, 실내 웜 조명. 스틸 = "포옹 후 맥스에 막 파묻힌 순간"으로 고정(걷기 과정은 kling 3s 한계 밖) · 모션 = 파묻히는 반동+마주보는 웃음. 맥스는 아쿠아로 생성 후 후반 일괄 네이비 리컬러(C1·C2와 동일 처리).',
    scaffold: '/ref_family/cut11_ours.png?v=1',
    img: '/fam2/c4_winter_v3.png?v=1',
    vid: '/fam2/c4_v1.mp4?v=1',
    status: '🎬 영상 완료 (kling pro 1080p · Element 포함 · 5.25cr) — 마주 웃다 이마 맞대는 흐름 · 얼굴 유지 · 어색 모션 없음 · 러프컷 v6 반영. 스틸은 v3(6cr: 포옹 구도 → 아기 복원 → 엄마 얼굴을 C2 승인 프레임으로 교정)',
  },
  {
    id: 'C5', season: '✨ 엔딩', t: '12–15s', months: '—',
    title: '태그라인 — "함께 자라는 자리"',
    motion: 'C4 마지막 프레임 슬로우 홀드 → 타이포 페이드인 → 로고',
    desc: 'C4 그레이딩본 마지막 프레임 3s 슬로우 줌 홀드(zoompan 1.0→1.04) + 로고 페이드인(0.8s in). 타이포그래피(태그라인)는 사용자 직접 작업으로 확정 — 영상에는 로고만. 오프닝 로고는 C1에 유지(1탄 방식). 사용자 타이포 작업용 소스 = c5_ending_hd.mp4.',
    vid: '/fam2/c5_ending_v2.mp4?v=1',
    status: '✅ 완료 (무료 합성 · 로고만 v2) — 러프컷 v7~v8 엔딩으로 반영',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '9:16 · 15s · 엄마+아기 주연(부인 Element 최고 재현률) · 사계절 성장 몽타주 · Kling 3.0 (2026-07-09 확정)' },
  { stage: 'STAGE 1 · 에셋 락', s: '🟡 대부분', note: 'wife-c3 ✅ · baby ✅(개월수는 프롬프트 파생) · max-aqua ✅ · support ✅ · 옐리 ✅ — 거실 베이스 스틸만 신규' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '5컷 확정 — 고정 구도 반복 + 계절·성장 변주' },
  { stage: 'STAGE 3 · 스틸', s: '🟡 진행중', note: 'C1(봄·수유) ✅ v8 확정 — 다음: C2~C4는 포즈 뼈대 사진 컨펌 → 스틸 (각 2cr)' },
  { stage: 'STAGE 4 · 영상화', s: '⬜', note: 'Kling 3.0 3s pro(1080p급) × 4컷 · 무음 — 마이크로 모션만(젖병 빨기·옹알이·일어서기·포옹) · 음원은 후반' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: '비트 리타이밍 + LAB 톤 통일(계절별 의도 변화는 유지) + 태그라인·로고 + BGM (무료)' },
];

export default function Storyboard9Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🌱 가족 요기보 2탄 — "함께 자라는 자리" (사계절 성장)</h1>
          <p className="page-desc">
            9차 · 1탄(가족 CF) 공식 후속 · 9:16 · 15초 · <b>같은 거실·같은 맥스·고정 구도, 계절과 아기만 자란다</b> · 주연 = 엄마(wife-c3)+아기 · Kling 3.0 인물 중심
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
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 연출 설계 — Kling 강점에 맞춘 원칙</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8 }}>
        <b>고정 구도 반복이 이 작품의 문법</b> — 카메라는 전 컷 동일한 미드샷 슬로우 푸시인만. <b>계절감의 1순위 = 모녀의 의상 + 아기의 성장</b> (2026-07-09 확정): 어차피 실내 아이와의 장면이라 시간의 흐름은 옷차림과 아기 개월수가 말해줌. 창밖·소품·빛은 은은한 보조만(과한 벚꽃/눈 연출 배제 — 고정 구도에서 배경 급변은 합성 티 리스크)
        <br />· <b>모션 설계 = kling이 잘하는 것만</b>: 토닥임·옹알이·붙잡고 서기·포옹 — 전부 인물 마이크로 모션. 큰 동선·카메라 안무 없음 (1탄에서 검증된 승률 높은 유형)
        <br />· <b>베이스 프레임 전략</b>: C1(봄) 스틸 하나만 크레딧으로 확정 → C2~C4는 그 스틸에서 계절 요소만 편집 교체(구도·인물 위치 락). 컷 간 드리프트가 구조적으로 차단됨
        <br />· <b>아기 성장 표현</b>: baby Element(6~8개월 기준) + 컷별 개월수 프로즈 — 검수 기준은 엄마 품·맥스 대비 아기 크기 비율. 신생아(C1)와 돌쟁이(C4)는 Element 의존도를 낮추고 프로즈+1탄 승인 스틸 참조로
        <br />· <b>톤</b>: 1탄의 웜 필믹 톤 계승 — 계절별 라이트 변주(봄 연두빛/여름 하이키/가을 앰버/겨울 웜+블루 창) 위에 LAB 공통 앵커
        <br />· 지퍼 반대면 · 맥스 170cm 스케일 앵커 · 음원은 러프컷 확정 후 (1탄 A안 계열 잔잔한 피아노 후보)
      </div>

      {/* 컷 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 컷 보드 (5컷 · 15s)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {CUTS.map((c) => (
          <div key={c.id} className="note" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14 }}>{c.id} {c.season} · {c.title}</b>
              <span className="badge badge-review" style={{ fontSize: 11 }}>{c.t}</span>
              {c.months !== '—' && <span style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>아기 {c.months}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>🎬 {c.motion}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.6 }}>{c.desc}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{c.status}</div>
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
                  <div>
                    <img src={c.scaffold} alt={`${c.id} 포즈 뼈대`}
                      style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px dashed var(--border)', opacity: .7 }} />
                    <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 2 }}>포즈 뼈대 (1탄 승인 컷)</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 에셋 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 에셋 (STAGE 1 — 전부 1탄 재사용)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8 }}>
        · <b>엄마</b> = wife-c3 Element + 1탄 CUT3 승인 스틸 얼굴 참조 (3중 락) · 크림 니트 → 계절별 의상 변주
        <br />· <b>아기</b> = baby Element + 1탄 CUT7 승인 스틸 참조 · 개월수는 컷별 프로즈
        <br />· <b>제품</b> = 맥스 <b>네이비 블루</b>(2026-07-09 사용자 확정 — C3부터 적용, C1·C2는 아쿠아로 제작돼 후반에서 무료 HSV 리컬러로 통일 예정) + 서포트(C3) + 옐리(C2 소품) + 메이트·스퀴지보(C3 소품) — 신규 락 불필요
        <br />· <b>거실</b> = C1 베이스 스틸에서 신규 확정 (1탄 거실과 같은 집 느낌의 밝은 거실 — 창이 커야 계절 변주가 삶)
      </div>

      {/* 산출물 슬롯 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 산출물 슬롯 (진행하며 채움)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <img src="/fam2/c1_spring_v8.png?v=1" alt="C1 봄 수유 스틸 v8"
            style={{ width: 260, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 12, border: '3px solid #42A5F5' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>C1 🌸 봄 v8 (검토 대상 · 수유 연출)</b> · 2K · 2026-07-09<br />
            <b>1탄 CUT6 승인 컷 베이스 최소 편집</b> — 서포트(올리브)가 허리를 감싼 검증 구도 유지, 동작만 &quot;내려다보며 분유 수유&quot;로 교체 · 레지스트리 Element+연출문 주입 · 1탄 거실·트리 우주복 연속성
          </div>
        </div>
        <div style={{ flex: '0 0 130px' }}>
          <img src="/fam2/c1_spring_v1.png?v=1" alt="C1 v1 기각"
            style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .45 }} />
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v1 — 기각 (와이드·하늘색 맥스·신규 거실)</div>
        </div>
        <div className="note" style={{ flex: '1 1 280px', padding: 14, fontSize: 12.5, lineHeight: 1.7, alignSelf: 'flex-start', color: 'var(--text-dim)' }}>
          검수 포인트: ① 타이트 프레이밍 OK? ② 아기 정체성(1탄 아기 + 트리 우주복) ③ 네이비 톤 ④ 1탄 거실 소품 연속성 — 승인 시 이 프레임에서 여름·가을·겨울 파생 (각 2cr)
        </div>
      </div>

      {/* 러프컷 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4.5 러프컷 (진행하며 버전업 · 무료 조립)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <video src="/fam2/rough_v8.mp4?v=1" controls loop muted playsInline
            style={{ width: 260, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #FFB300' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>러프컷 v8 (전 컷 · 15.6s · 톤 매칭 + 화질 개선)</b> · C1 수유(슬로우+로고 인트로) + C2 옹알이 + C3 일어서기 + C4 포옹(겨울) + <b>C5 엔딩(로고만 — 타이포는 사용자 직접 작업)</b> · 전 컷 LAB 톤 매칭 + <b>무료 화질 패스(시간축 디노이즈 hqdn3d + 적응형 샤프닝 cas, crf17)</b><br />
            편집용 개별 HD 클립: <code style={{ fontSize: 10.5 }}>c1_hd·c2_hd·c3_hd·c4_hd·c5_ending_hd.mp4</code> (톤+화질 처리본, 원배속) · 남은 후반: 맥스 네이비 일괄 리컬러 · 음원(최종 컴펌 후)
          </div>
        </div>
      </div>

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 비용 플랜 (실측 단가 기준 · 매 호출 전 개별 승인)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        스틸: C1 베이스 <b>2cr</b> + 계절 파생 C2~C4 <b>각 2cr</b>(총 ~8cr) → Kling 3.0 3s pro 무음 <b>5.25cr × 4컷 = 21cr</b> → 엔딩 합성·조립·톤·음원 <b>무료</b>
        <br />예상 합계 <b>~29cr + 재시도 여유 = 가드 60cr</b> · 잔액 ~1,952cr (2026-07-09) — 사계절 반복 구도 덕에 역대 최저 예산 프로젝트
        <br /><b>규칙: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 실행 · 1장씩</b>
      </div>
    </>
  );
}
