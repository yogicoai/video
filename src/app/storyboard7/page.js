'use client';

// 7차 프로젝트 — 파티 리빌 & 리버 불꽃놀이 (인물 없음 · 공간/키비주얼 연출)
// 레퍼런스: 마케터 제작 10s 영상 (imgFile.mp4 → public/refparty/ref.mp4) — 2026-07-09 프레임 해부 완료
// cafe24 FTP에 .jpg로 위장 업로드된 영상 → /api/video 프록시가 video/mp4로 서빙
const V = (name, ver = 1) => `/api/video/party/${name}.jpg?v=${ver}`;

// 섹션 구성 — 타임라인은 레퍼런스 실측 (0.5s 간격 프레임 해부, 10s @24fps)
const SECTIONS = [
  {
    id: 'S1', t: '0–1.2s', title: '어둠 — 블루 커튼이 쳐진 공간',
    camera: '고정에 가까운 미세 푸시인 · 커튼 틈 사이 빛이 점점 강해짐',
    desc: '어두운 실내, 블루(아쿠아) 극장식 커튼이 닫혀 있음 — 미술은 kt.jpg 키비주얼 기준(깊은 주름·스포트 조명 그라데이션). 틈 사이로 빛줄기가 새어 리빌 예고.',
    how: '스틸 1장(2cr) → Seedance (S2와 한 컷 가능)',
    status: '⬜ 대기',
  },
  {
    id: 'S2', t: '1.2–3.0s', title: '리빌 — 커튼이 양쪽으로 열리며 파티 공간',
    camera: '커튼 열림과 함께 밝기 급상승 → 와이드 유지, 3.0s에 벽 모서리가 화면을 스치며 와이프',
    desc: '블루 커튼이 양쪽으로 열리며 역광 선버스트 + 파스텔 파티 공간 리빌. 제품 캐스트가 방에 깔린 연출(2026-07-09 확정): 뒤쪽 벽가에 맥스(올리브그린·네이비블루·아쿠아), 중간층에 팟·라운저(올리브·아쿠아), 그 위·옆에 메이트 옐리·샤크·티렉스·유니콘이 파티 게스트처럼 앉음. 파스텔 풍선(블라썸핑크·파스텔블루·크림·민트)·배너 가랜드·중앙 케이크. 카메라 중앙 경로는 비움. 인물 없음.',
    how: '스틸 2장(어둠/파티, 4cr) → Seedance start/end_image 트랜지션',
    status: '⬜ 대기',
  },
  {
    id: 'S3', t: '3.0–4.7s', title: '로고 — 파스텔블루 벽면 yogibo 클로즈업',
    camera: '오른쪽으로 트래킹 — 벽 패널을 스치듯 지나며 로고 정면 → 골드 컨페티가 전경에 흩날림',
    desc: '파스텔블루 웨인스코팅 벽에 화이트 입체(3D) yogibo 로고. 골드 컨페티 낙하가 정적인 벽에 생동감. 로고가 화면 중앙을 지나가는 무빙 클로즈업.',
    how: '스틸 1장(2cr) → Seedance 트래킹',
    status: '⬜ 대기',
  },
  {
    id: 'S4', t: '4.7–6.3s', title: '케이크 연출 — 10주년 케이크 히어로 비트 → 창으로',
    camera: '트래킹이 케이크 앞에서 감속 → 케이크 클로즈업 홀드(~1s, 살짝 오비탈) → 다시 가속해 아치창으로 푸시인',
    desc: '케이크가 이 구간의 주인공 — 미술은 visual_line.png 키비주얼 그대로: 화이트·파스텔블루 3단 + "10th" 캔들(불꽃 흔들림) + 케이크 위 요기보 제품 미니어처(문필로우·카터필러 롤 레인보우·하트 쿠션·로고 마크)가 또렷이 보이게 클로즈업. 주변에 메이트 인형·풍선·선물상자, 골드 컨페티 낙하. 홀드 후 카메라가 창으로 넘어가며 창밖 저녁 하늘로 시선 유도.',
    how: '스틸 1장(2cr · 케이크 히어로 프레임) → Seedance 감속-홀드-가속',
    status: '⬜ 대기',
  },
  {
    id: 'S5', t: '6.3–8.2s', title: '클라이맥스 — 창문 열리며 강 위 불꽃놀이',
    camera: '창문 양쪽으로 열림 → 카메라가 창틀을 통과해 밤하늘로 · 창틀이 프레임 아웃',
    desc: '창이 열리면 밤 — 강 위로 컬러 불꽃 연발(레드·그린·블루·골드), 수면 반사. 실내 파스텔 톤 → 야경 스펙터클 전환.',
    how: '스틸 1장(2cr) → Seedance',
    status: '⬜ 대기',
  },
  {
    id: 'S6', t: '8.2–10s', title: '엔딩 — yogibo 로고 형태의 불꽃',
    camera: '하늘 고정 와이드 — 로고 불꽃이 형성된 뒤 ~1.5s 홀드',
    desc: '금색 불꽃 파티클이 "yogibo" 레터링으로 수렴·유지, 아래엔 블루 불꽃과 강 반사. 생성 난이도 최상 — A) 생성 시도 B) 무료 파티클 합성(로고 실루엣 좌표 수렴) 이원 트랙.',
    how: 'A안 스틸 1장(2cr)→영상화 / B안 무료 합성',
    status: '⬜ 대기',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '9:16 · 10s 확정 · 인물 없음 · 10주년 케이크 유지 · 메이트 상품 노출 (2026-07-09 컨펌)' },
  { stage: 'STAGE 1 · 에셋 락', s: '✅ 완료', note: '카메라 동선 ref.mp4 · 커튼 kt.jpg · 케이크 visual_line.png · 메이트 Element(옐리) · yogibo 로고 PNG(투명배경) — 전부 확보' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '6섹션 · 레퍼런스 실측 타임라인 반영 완료' },
  { stage: 'STAGE 3 · 스틸', s: '✅ 완료', note: 'S1 커튼 v2(풀블리드) + S2 파티 v4(라운저 교체) 확정 — 총 12cr' },
  { stage: 'STAGE 4 · 영상화', s: '🟡 검토중', note: 'Seedance 2.0 통짜 10s 1회차 완료(std 720p·45cr·오디오 포함) — 검수 대기 · 통과 시 1080p 마스터(90cr)' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: '통짜 성공 시 트림·톤만 / 분할 시 와이프 포인트(3.0s 벽·6.3s 창틀) 스티치 + S6 합성 (무료)' },
];

export default function Storyboard7Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎆 파티 리빌 & 리버 불꽃놀이 — 브랜드 무드필름</h1>
          <p className="page-desc">
            7차 · 9:16 · <b>10초 확정</b> · 인물 없음 · 10주년 파티 — 어둠 → 블루 커튼 리빌 → 파스텔 파티(메이트) → 벽면 로고 → 10주년 케이크 → 창밖 강 불꽃놀이 → yogibo 로고 불꽃 엔딩
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

      {/* 레퍼런스 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 레퍼런스 — 역할 분담: 영상=카메라 동선 · 이미지=미술</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <video src="/refparty/ref.mp4?v=1" controls loop muted playsInline
          style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #FFB300' }} />
        <div className="note" style={{ flex: '1 1 320px', padding: 14, fontSize: 12.5, lineHeight: 1.8, alignSelf: 'flex-start' }}>
          <b>마케터 영상 = 카메라 무빙 동선 기준</b> (미술 아님 · 0.5s 프레임 해부 2026-07-09)
          <br />· <b>원테이크 구조</b> — 컷 대신 카메라가 계속 오른쪽·전방으로 전진: 커튼 → 벽 로고 → 케이크/창 → 창밖 하늘
          <br />· <b>와이프 전환 2곳</b>: 3.0s 벽 모서리가 화면을 스침(S2→S3) · 6.3s 창틀 통과(S4→S5) — 섹션을 나눠 만들어도 이 지점에서 이어붙이면 원테이크로 보임
          <br />· <b>라이트 아크</b>: 차콜 어둠 → 역광 선버스트 → 파스텔 데이라이트 → 밤하늘 불꽃 발광
          <br /><a href="/refparty/ref_grid.png" target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>→ 20프레임 해부 시트 열기</a>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 220px' }}>
          <img src="/refparty/curtain_kt.jpg?v=1" alt="커튼 키비주얼"
            style={{ width: 220, borderRadius: 10, border: '1px solid var(--border)', display: 'block' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, lineHeight: 1.5 }}>
            <b>커튼 키비주얼 (kt.jpg)</b> — S1·S2의 미술 기준: 블루(아쿠아) 극장식 커튼, 깊은 주름 + 스포트 그라데이션
          </div>
        </div>
        <div style={{ flex: '0 0 160px' }}>
          <img src="/refparty/cake_visual.png?v=1" alt="케이크 키비주얼"
            style={{ width: 160, borderRadius: 10, border: '1px solid var(--border)', display: 'block' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 5, lineHeight: 1.5 }}>
            <b>10주년 케이크 키비주얼 (visual_line.png)</b> — S4의 미술 기준: 화이트·파스텔블루 3단 + &quot;10th&quot; 캔들 + 요기보 제품 미니어처 데코
          </div>
        </div>
        <div className="note" style={{ flex: '1 1 280px', padding: 14, fontSize: 12.5, lineHeight: 1.7, alignSelf: 'flex-start' }}>
          <b>종합</b> — 카메라는 영상 레퍼런스의 동선을 그대로, 미술은 키비주얼 2종 + 10주년 파스텔 팔레트로 교체.
          커튼 리빌(kt) → 파티 공간(메이트 인형들) → 벽 로고 → 케이크(visual_line) → 강 불꽃놀이 → 로고 불꽃.
        </div>
      </div>

      {/* 섹션 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 섹션 보드 (6섹션 · 레퍼런스 실측 타임라인)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {SECTIONS.map((p) => (
          <div key={p.id} className="note" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14 }}>{p.id} · {p.title}</b>
              <span className="badge badge-review" style={{ fontSize: 11 }}>{p.t}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{p.how}</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11.5 }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>📷 {p.camera}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* 에셋 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 에셋 (STAGE 1)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>✅ 카메라 동선 레퍼런스</b> — ref.mp4 (10s · 720×1280 · 24fps). 섹션별 스틸은 <b>레퍼런스 프레임을 베이스(medias image)로 편집 생성</b>해 구도·동선을 락하고 미술만 교체 — 각도 락 기법 재사용
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>✅ 제품 캐스트 10종 (파티 게스트 · 레지스트리 360에서 참조 프레임 추출 — 무료)</b>
          <br />· 빈백(딥 컬러 큐레이션): 맥스 올리브그린·네이비블루·아쿠아블루 / 팟 올리브·아쿠아 / 라운저 올리브그린
          <br />· 메이트: 옐리펀트(Element 락) · 샤크 · 티렉스(크앙이) · 유니콘 — 배경 파스텔 vs 제품 딥 톤 대비로 제품이 도드라지는 설계
          <img src="/refparty/cast_sheet.jpg?v=1" alt="제품 캐스트 시트" style={{ width: '100%', maxWidth: 640, borderRadius: 8, marginTop: 8, display: 'block' }} />
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <img src="/logo_brand.png?v=2" alt="yogibo 로고" style={{ width: 150, background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px', borderRadius: 8, padding: 8 }} />
          <div style={{ flex: '1 1 260px' }}>
            <b>✅ yogibo 로고 에셋</b> — 공식 PNG(투명배경 400×160 · 다크그레이 레터 + 시안 g) 확보 → <code style={{ fontSize: 11 }}>public/logo_brand.png</code>
            <br />S3 벽면 입체 로고의 형태 기준 + S6 로고 불꽃 B안(파티클 합성)은 이 실루엣에서 좌표 추출
          </div>
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>🟡 컬러 팔레트</b> — 10주년 파스텔: 커튼 블루(kt) + 케이크 화이트·파스텔블루(visual_line) + 풍선(컬러칩: 블라썸핑크 #E2A8BE · 파스텔블루 #BEDDEF · 프레시민트 #B0EEE7) + 골드 컨페티 액센트. 스틸 검수 시 칩 HEX 기준 드리프트 체크
        </div>
      </div>

      {/* 기술 노트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 제작 기술 노트</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8 }}>
        · <b>영상 엔진 = Seedance 2.0 (std)</b> — kling이 정적이라는 판단(2026-07-09)으로 교체. 근거: <b>video_references 입력을 받는 유일한 모델</b> → 마케터 ref.mp4를 그대로 넣어 카메라 동선을 따라가게 함 + image_references로 키비주얼(커튼·케이크·옐리) 동시 주입 + duration 4–15s로 <b>10초 통짜 원테이크 1회 생성 가능</b> + 9:16 지원 · <b>generate_audio=true (네이티브 오디오 확정 2026-07-09)</b> — 커튼·파티·불꽃 효과음이 화면 싱크로 생성, 필요 시 Pixabay BGM 추가 믹스
        <br />· <b>플랜 A (통짜)</b>: start_image=S1 어둠 스틸 + video_reference=ref.mp4 + image_references=키비주얼 → 10s 1회. 성공하면 스티치 자체가 불필요 — 진짜 원테이크
        <br />· <b>플랜 B (분할 폴백)</b>: 통짜가 미술·동선 중 하나를 놓치면 섹션별 생성 후 레퍼런스의 와이프 지점(3.0s 벽 모서리 · 6.3s 창틀)에서 전경 가림 스티치
        <br />· <b>S2 리빌(분할 시)</b>: 어둠 스틸 + 파티 스틸 같은 구도 → Seedance start/end_image, &quot;blue curtains slowly part, sunlight floods in&quot;. 실패 시 두 스틸 루마 디졸브(무료) 대체
        <br />· <b>공간 일관성</b>: 레퍼런스 프레임을 각 섹션 베이스로 직접 사용 → 맨땅 생성 대비 구도 드리프트 차단 (가족 CF 검증 기법)
        <br />· <b>S6 로고 불꽃</b>: 생성 모델이 정확한 레터링을 못 그릴 확률 높음 → A) 생성 1회 시도 B) cv2 파티클 합성(불꽃 스파크를 로고 실루엣 좌표로 수렴) 백업 확정
        <br />· 톤: 라이트 아크가 의도된 변화 → 구간별 LAB 타깃(S1 어둠 / S2–4 파스텔 데이 / S5–6 야경)으로 나눠 통일
        <br />· <b>음원 = Seedance 네이티브 오디오 확정</b> — 효과음·앰비언스는 생성 시 화면 싱크로 포함. BGM이 더 필요하면 러프컷 확정 후 Pixabay 무료 트랙을 밑에 믹스 (오디오 on/off 크레딧 차이는 첫 호출 직전 실측 보고)
      </div>

      {/* 섹션별 산출물 슬롯 (진행하며 채움) */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 산출물 슬롯 (진행하며 채움)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <img src="/refparty/s1_v2.png?v=1" alt="S1 어둠 커튼 스틸 v2 (풀블리드)"
            style={{ width: 260, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 12, border: '3px solid #42A5F5' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>S1 v2 (검토 대상 · 풀블리드)</b> · 2K · 2cr · 2026-07-09<br />
            커튼이 프레임 100% + 중앙 틈 골드 빛샘 · 베이스 = kt.jpg 9:16 크롭 · 플랜 A 통짜의 start_image 후보
          </div>
        </div>
        <div style={{ flex: '0 0 130px' }}>
          <img src="/refparty/s1_v1.png?v=1" alt="S1 v1 (기각 — 양옆 벽 노출)"
            style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .45 }} />
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v1 — 기각 (양옆 벽이 보여 스케일 작음)</div>
        </div>
        <div style={{ flex: '0 0 260px' }}>
          <img src="/refparty/s2_v4.png?v=1" alt="S2 파티 공간 스틸 v4"
            style={{ width: 260, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 12, border: '3px solid #42A5F5' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>S2 v4 (검토 대상 · 파티 공간)</b> · 2K · 총 8cr(v1→v4) · 2026-07-09<br />
            배너 &quot;YOGIBO 10th&quot; · 맥스 올리브/네이비 · 팟 블루(옐리) · <b>라운저 아쿠아(우측, 눌린 팟 교체)</b> · 티렉스 호스트 · 중앙 통로 클리어
          </div>
        </div>
        <div style={{ flex: '0 0 280px' }}>
          <video src="/refparty/oneshot_v1.mp4?v=1" controls loop playsInline
            style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #FFB300' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>🎬 통짜 원테이크 1회차 (검토 대상)</b> · Seedance 2.0 std 720p · 10s · 45cr · 네이티브 오디오 포함<br />
            커튼 리빌 → 파티(티렉스·맥스·라운저) → 벽 로고(시안 g 정확) → 10th 케이크 → 창밖 불꽃 → yogibo 로고 불꽃 — 전 섹션 1테이크 재현
          </div>
        </div>
      </div>

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>6. 비용 플랜 (추정 · 매 호출 전 개별 승인)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        <b>Seedance 2.0 실측 단가 (10s · 9:16 · 레퍼런스 포함 · 오디오 on/off 동일, 2026-07-09 프리플라이트)</b>: std 1080p <b>90cr</b> · std 720p <b>45cr</b> · fast 720p <b>35cr</b>
        <br />운영안: 1회차는 <b>std 720p(45cr)</b>로 동선·미술 검증 → 통과 시 최종 마스터만 1080p(90cr) 또는 720p 업스케일 · 스틸 지출 현황 12cr(S1 2장·S2 4장)
        <br />프로젝트 예산 가드 <b>~150cr</b>로 상향 (720p 검증 45 + 1080p 마스터 90 + 스틸 여유) · 잔액 <b>~2,058cr</b>
        <br /><b>규칙: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 실행 · 1장씩</b>
      </div>
    </>
  );
}
