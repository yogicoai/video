'use client';

// 12차 프로젝트 — 요기보 단편 CF 엔진 비교: Kling(컷 단위) vs Seedance(원테이크)
// 동일 원작 레퍼런스(videoFile.mp4 · 15.04s · 10컷)를 두 엔진으로 각각 제작해 파이프라인을 비교
// 2026-07-12 사용자 확정 — 모델 교체 + 빈백 색상 차별화

// ★ 마스터 기준 = 사용자가 1차(Kling)에서 직접 짠 컷분할 스토리보드 (시작/끝 프레임 시트)
// 시댄스 세그먼트는 반드시 이 10컷 서사를 따른다 — 2026-07-15 사용자 지적으로 기준 명문화
const SHEET_URL = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/storyboard_final8.png';
const MASTER_CUTS = [
  { n: 1, t: '00:00–00:02', title: '깨어남', dir: '★침대가 있는데도 요기보에서 잠 — 빈 침대가 뒤에 보이고, 그는 요기보에 파묻혀 잠듦 → 고개 살짝 듦', cam: '측면 인티메이트 CU', line: '"음… 잘 잤다"', seg: 'S1-5 ✅ 침대 반영' },
  { n: 2, t: '00:02–00:04', title: '깜짝 — 폰 확인', dir: '빈백에 기대 폰 확인 → 깜짝 놀람(상체)', cam: '와이드→타이트 CU', line: '"헉, 지각!"', seg: 'S1 뻗기 + S2 놀람 ✅' },
  { n: 3, t: '00:04–00:07', title: '정신없이 갈아입기', dir: '줄무늬 잠옷 → 네이비 블레이저', cam: '핸드헬드 미디엄', line: '"늦었다 늦었어"', seg: 'S2 ✅' },
  { n: 4, t: '00:07–00:09', title: '출근 — 당찬 걸음', dir: '개운하게 줄쭉, 환한 미소·빠른 걸음', cam: '타이트 핸드헬드 워크', line: '"근데 몸은 개운해" ★제품 페이오프', seg: '🔴 누락 — 생성 필요' },
  { n: 5, t: '00:09–00:11', title: '바쁜 회사', dir: '서류 보며 바쁜 하루', cam: '인물중심 미디엄 보케', line: '—', seg: 'S3 ✅' },
  { n: 6, t: '00:11–00:12', title: '동료와 짧은 회의', dir: '동료(뒷모습)와 짧게 논의·끄덕임', cam: '미디엄 보케 핸드헬드', line: '"이건 이렇게요"', seg: '🟡 S3에 미포함(수화기로 대체)' },
  { n: 7, t: '00:12–00:14', title: '지친 표정 (퇴근 직전)', dir: '관자놀이 짚고 지친 한숨·어깨 툭', cam: '인물중심 보케', line: '"오늘도 길었다"', seg: 'S3 ✅' },
  { n: 8, t: '00:14–00:15', title: '쓰러지듯 다이브', dir: '빈백에 몸 던져 안착 → 얼굴로 줌인', cam: '로우앵글 다이브→푸시인', line: '"역시 집이 최고"', seg: '⬜ S4 예정' },
  { n: 9, t: '00:15–00:17', title: '잠들며 마무리', dir: '잠든 얼굴 클로즈업·평온하게', cam: '얼굴 CU (디졸브)', line: '"내 하루의 끝, 요기보"', seg: '⬜ S4 예정' },
  { n: 10, t: '00:17–00:18', title: '엔딩 — 로고', dir: 'yogibo 로고 천천히 떠오르며 끝', cam: '그래픽 흰배경 페이드인', line: '—', seg: '⬜ 후편집 오버레이' },
];

const REF_CUTS = [
  { t: '0.0–2.0s', desc: '빈백에서 자는 여성 클로즈업 + 로고/캠페인 타이틀 오버레이' },
  { t: '2.0–3.3s', desc: '폰을 집어 확인 (빈백에 기댄 와이드)' },
  { t: '3.3–4.0s', desc: '화면 보고 입 떡 벌어지는 놀람 ECU' },
  { t: '4.0–5.0s', desc: '정면 클로즈업 — 사태 파악' },
  { t: '5.0–6.0s', desc: '옷장에서 급히 환복 (실루엣)' },
  { t: '6.0–7.8s', desc: '뛰어가는 출근길 — 밝은 웃음 핸드헬드' },
  { t: '7.8–8.7s', desc: '현장/사무 업무 비트 (헬멧·서류)' },
  { t: '8.7–9.8s', desc: '분주함 → 지침 전환' },
  { t: '9.8–12.0s', desc: '귀가 → 빈백으로 다이브, 파묻힘' },
  { t: '12.0–15.0s', desc: '잠든 얼굴 + 엔드카드(로고·캠페인 정보)' },
];

const COMPARE = [
  { k: '제작 단위', kling: '컷별 생성(스틸 게이트 → 3s 영상 × 10컷) 후 조립', seed: '원테이크 15s 1회 생성 (참조 영상이 컷 전환까지 렌더)' },
  { k: '레퍼런스 주입', kling: '컷별 스틸·Element·프롬프트', seed: 'video_reference(원작 전체) + image_references + 타임라인 프롬프트' },
  { k: '컷 통제력', kling: '높음 — 컷 단위 검수·재생성 가능', seed: '낮음 — 실패 시 15s 통째 재생성' },
  { k: '캐스팅', kling: '모델 A (Element 락 · 컷 간 유지)', seed: '동일 모델 A (이미지 시트 참조 · 재현률이 비교 지표)' },
  { k: '제품 색상', kling: '아보카도 그린', seed: '아쿠아블루 (차별화)' },
  { k: '실측 비용', kling: '~50cr+ (컷별 누적 · 재생성 포함)', seed: 'mini 37.5cr / std 720p ~67.5cr / std 1080p 135cr' },
];

export default function Storyboard12Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🆚 요기보 단편 CF — Kling vs Seedance 엔진 비교</h1>
          <p className="page-desc">
            12차 · 동일 원작(15.04s · 10컷)을 <b>Kling 컷 단위 파이프라인</b>과 <b>Seedance 원테이크 파이프라인</b>으로 각각 제작 — 연출 충실도·캐스팅·비용·통제력 비교 실험
          </p>
        </div>
      </div>

      {/* ★ 마스터 기준 — 사용자 원 스토리보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>0. ★ 마스터 기준 — 사용자 원 스토리보드 (1차 Kling · 시작/끝 프레임 시트)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, borderLeft: '3px solid #E53935' }}>
        <div style={{ fontSize: 12.5, lineHeight: 1.8, marginBottom: 10 }}>
          <b style={{ color: '#E53935' }}>불변 규칙 (2026-07-15 사용자 지적으로 명문화)</b>: 시댄스 세그먼트는 <b>반드시 이 10컷 서사를 따른다</b> — 컷을 건너뛰지 않는다.
          <br />
          <br /><b style={{ color: '#FFB300' }}>★ 핵심 요소 ① — CUT1 &quot;침대가 있는데도 요기보에서 잔다&quot;</b>: 방에 <b>멀쩡한 침대가 보이는데(이불이 젖혀진 채 비어 있음)</b> 그는 요기보 맥스에 파묻혀 잠들어 있다. 침대를 두고도 요기보를 고른다 = <b>제품 우위의 시각적 증명</b>. 침대가 없으면 &quot;침대 대신 쓰는 싸구려&quot;로 읽혀 의미가 정반대가 된다.
          <br /><b style={{ color: '#FFB300' }}>★ 핵심 요소 ② — CUT4 &quot;근데 몸은 개운해&quot;</b>: 이 CF의 <b>제품 페이오프</b> — 지각했지만 요기보에서 잘 자서 몸이 개운하다 → 환한 미소로 당차게 출근. 이 컷이 빠지면 &quot;지각→회사→소진&quot;의 의미 없는 고생담이 된다.
          <br />
          <br />나레이션 아크: &quot;음… 잘 잤다&quot; → &quot;헉, 지각!&quot; → &quot;늦었다 늦었어&quot; → <b>&quot;근데 몸은 개운해&quot;</b> → &quot;오늘도 길었다&quot; → &quot;역시 집이 최고&quot; → &quot;내 하루의 끝, 요기보&quot; · <b>서사 논리</b>: 침대를 두고 요기보에서 잤다(①) → 그래서 지각했지만 몸은 개운하다(②) → 하루를 버틴다 → 하루의 끝에 다시 요기보로 돌아온다(수미상관)
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href={SHEET_URL} target="_blank" rel="noreferrer" style={{ flex: '0 0 auto' }}>
            <img src={SHEET_URL} alt="원 컷분할 스토리보드 시트 (시작/끝 프레임)"
              style={{ width: 240, borderRadius: 10, border: '2px solid #E53935', display: 'block' }} />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>↗ 시트 원본 열기 (시작/끝 프레임·카메라·SFX)</div>
          </a>
          <div style={{ flex: '1 1 420px', display: 'grid', gap: 4 }}>
            {MASTER_CUTS.map((c) => {
              const miss = c.seg.startsWith('🔴');
              return (
                <div key={c.n} style={{ display: 'flex', gap: 8, fontSize: 11.5, alignItems: 'baseline', padding: '3px 6px', borderRadius: 5, background: miss ? 'rgba(229,57,53,.14)' : 'transparent' }}>
                  <b style={{ flex: '0 0 46px' }}>CUT{c.n}</b>
                  <span style={{ flex: '0 0 78px', color: 'var(--text-dim)' }}>{c.t}</span>
                  <b style={{ flex: '0 0 106px', color: miss ? '#E53935' : 'var(--text)' }}>{c.title}</b>
                  <span style={{ flex: '1 1 0', color: 'var(--text-dim)' }}>{c.dir} · <i>{c.line}</i></span>
                  <span style={{ flex: '0 0 150px', fontWeight: 700, color: miss ? '#E53935' : 'var(--text-dim)' }}>{c.seg}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 원작 레퍼런스 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 원작 레퍼런스 (videoFile.mp4 · 15.04s · 24fps · 프레임 분석 완료)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <video src="/videoFile.mp4" controls loop playsInline
            style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid var(--border)', flex: '0 0 auto' }} />
          <div style={{ flex: '1 1 300px', fontSize: 12, lineHeight: 1.7, color: 'var(--text-dim)' }}>
            {REF_CUTS.map((c, i) => (
              <div key={i}><b style={{ color: 'var(--text)' }}>{i + 1}.</b> <code style={{ fontSize: 10.5 }}>{c.t}</code> {c.desc}</div>
            ))}
            <div style={{ marginTop: 8 }}>서사: 잠 → 지각 소동 → 출근·업무 소진 → 귀가 다이브 → 잠 (수미상관) · Higgsfield 업로드 완료(media eec19948)</div>
          </div>
        </div>
      </div>

      {/* Kling 버전 (기존 1차) */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. Kling 버전 — 기존 1차 완성본 (컷 단위 파이프라인)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <video src="/rough_cut_v3.mp4" controls loop playsInline
            style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '2px solid #FFB300', flex: '0 0 auto' }} />
          <div style={{ flex: '1 1 300px', fontSize: 12.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
            <b style={{ color: 'var(--text)' }}>지친 직장인 → 요기보 휴식</b> (1차 프로젝트 · <a href="/storyboard" style={{ color: 'var(--accent)' }}>스토리보드 →</a>)<br />
            모델 A · 아보카도 그린 Pod · 10컷 개별 생성(스틸 게이트) 후 러프컷 조립 · 컷별 톤 매칭<br />
            강점: 컷 단위 통제·재생성 · 약점: 조립 공정 많음, 컷 경계 콜드스타트 관리 필요
          </div>
        </div>
      </div>

      {/* Seedance 버전 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. Seedance 버전 — 원테이크 → 세그먼트 분할 리메이크</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, fontSize: 12.5, lineHeight: 1.8 }}>
        <b>설계</b>: 원작 15s를 video_reference로 주입 → 카메라 동선·컷 전환·페이싱을 모델이 직접 렌더 (10주년 영상 검증 문법)<br />
        · <b>모델</b>: Kling판 모델 A 재사용 (2026-07-12 사용자 확정 — 순수 엔진 비교를 위해 동일 캐스팅) · 모델A 3프레임 시트(cf12_modelA_sheet · media 2376a67b) image_reference 주입<br />
        · <b>다중 제품 배치 테스트</b>: 방·거실 장면에 요기보 제품군 추가 배치(메이트 인형들·서포트 — 기존 공식 시트 재사용: 메이트 788ddfaf·서포트 0af67055) — Seedance의 multi-SKU 재현력 검증이 이 실험의 핵심 지표<br />
        · <b>제품</b>: 빈백 색상 <b>아쿠아블루</b>(추천 시안 — Kling판 아보카도·원작 핑크와 구분) · 공식 360 레퍼런스 주입<br />
        · <b>티어</b>: mini 720p 37.5cr(테스트) → 통과 시 std 1080p 135cr(본편) 단계 승격 전략<br />
        · <b>클린 플레이트 원칙 (2026-07-12 사용자 확정)</b>: 원작의 로고/캠페인 타이틀/엔드카드 그래픽은 생성에서 <b>전부 제외</b> — 인물·장면만 렌더 (프롬프트에 no text/no logo/no graphics 명시). 로고·타이틀은 후편집 오버레이(시리즈 화이트 로고 파이프라인)로 — 캠페인 정보 변경 시 재생성 불필요<br />
        · <b>상태</b>: 🔴 v1 생성 완료(mini 720p·37.5cr·오디오 포함) — 컷 구조·카메라·페이싱 재현은 프레임 단위로 정확했으나 <b>사실상 원본 복제 모드</b>로 작동. 사용자 QC 문제 목록(2026-07-14): ①모델 미교체(원작 배우 복제) ②빈백 색 오락가락(핑크↔네이비, 첫·끝 컷 핑크) ③원곡 음원 거의 그대로 복제(저작권 리스크 — 오디오 레퍼런스 과반영) ④일본식 회사 생활 복제(헬멧 현장) → 한국 오피스로 교체 필요 ⑤원본 자막·텍스트 복제 ⑥팟 과대 표현 → <b>맥스 네이비(170cm·360 데이터)로 제품 변경</b> ⑦서포트 실측 = 가로76×높이94×깊이30cm·1.7kg<br />
        · <b>v2 결과(std 720p·67.5cr)</b>: 개선 — 첫·끝 컷 네이비 맥스 ✓·메이트/서포트 배치 ✓·자체 작곡 음원 ✓·원작 배우 이탈 🟡 / 잔존 — 2.6s 핑크 재발·8.2s 헬멧 현장·7.0s 일본어 자막. <b>실측 결론: video_reference가 있는 한 컷별 요소 오버라이드는 ~70% 한계</b><br />
        · <b>v3 설계 (2026-07-14 사용자 방향: 스토리보드 먼저)</b>: video_reference 완전 제거(원본 유출 원천 차단) → 3세그먼트 분할 게이트 방식 — S1(5s·집): 잠든CU→폰→놀람ECU / S2(5s·이동): 환복→한국거리 출근→한국 오피스 착석 / S3(5s·귀가): 지침→다이브→잠든 엔딩. 연속성 = S1 통과 후 여성 스틸을 S2·S3 image_reference로 체이닝. 비용 22.5cr×3 = 67.5cr(게이트 3개·세그먼트 단위 재생성 가능)<br />
        · <b>v4 설계 (2026-07-15 사용자 제안: 경계 스틸 게이트)</b>: 세그먼트마다 <b>start_image + end_image 동시 주입</b> — 첫 장면과 컷 넘어가는 끝 장면을 스틸로 먼저 확정(2cr 게이트)하고 영상은 그 사이만 생성. 아래 3-2 참조
      </div>

      {/* S1 세그먼트 반복 기록 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3-1. S1 세그먼트 반복 기록 — 제품 지오메트리·스케일 전투 (22.5cr × 3)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <video src="/cf12/s1_v4_trim.mp4?v=1" controls loop playsInline
            style={{ width: 200, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #4CAF50', flex: '0 0 auto' }} />
          <video src="/cf12/s1_v3.mp4" controls loop playsInline
            style={{ width: 130, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '1px solid var(--border)', opacity: .55, flex: '0 0 auto' }} />
          <div style={{ flex: '1 1 300px', fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-dim)' }}>
            · <b style={{ color: 'var(--text)' }}>S1-1</b>: 맥스가 <b>공 모양</b>(빈백 카테고리 전형)으로 렌더 — 공식 360 이미지 레퍼런스를 제품 지오메트리가 무시함. NSFW 오탐 2회(잠든 자세 앵커 시트가 원인 — 소거법 특정, 자동 환불 확인)<br />
            · <b style={{ color: 'var(--text)' }}>S1-2</b>: 기하 서술 전략("LONG SAUSAGE / GIANT BODY PILLOW, NOT a ball")으로 <b>필 형태 전투 승리</b> ✓ 로고 제거 ✓ 메이트 수량·크기 ✓ — 그러나 스케일이 <b>침대급(~250cm)</b>으로 과대, 여성이 매트리스처럼 위에 누움<br />
            · <b style={{ color: 'var(--text)' }}>S1-3 (최종)</b>: 스케일 앵커 4종 투입 — ①STRICT SIZE 170×65×45cm ②NOT a bed/mattress 네거티브 ③<b>인체 대비 앵커</b>(여성 몸이 길이 대부분을 덮고 발이 끝에 걸침·앉으면 어깨가 더 높음) ④"올라타는 가구 아님, 바닥에서 기대는 쿠션" → <b>스케일 전투 승리</b> ✓ 인체 스케일 안착·필 형태·네이비·모델A·무텍스트 전부 유지<br />
            · <b style={{ color: 'var(--text)' }}>잔존 이슈 = 연출</b>: 모델이 맥스 <b>위에 올라타 엎드린</b> 자세로 렌더 — 스케일이 아니라 제품 사용 방식이 어색 (실제로는 기대거나 파묻히는 제품)<br />
            · <b style={{ color: '#4CAF50' }}>S1-4 (2026-07-15 · 초록 보더 = 검토 대상)</b>: <b>usage 연출컷 실전 투입</b> — 레지스트리 공식 sleeping 컷(자세·눌림 물리)을 참조로 동봉 + &quot;침대 모드, COMPLETELY FLAT&quot; 명시 + NOT wedge/draped 네거티브 + <b>자취 원룸으로 공간 축소</b> + <b>메이트 1개 제한</b> → QC: 침대 모드 파묻힘 ✓(가장자리가 몸을 감쌈) · 좁은 원룸(옷걸이 랙·작은 책상) ✓ · 메이트 여우 1개 ✓ · 네이비 전 프레임 ✓ · 무텍스트 ✓ (5s · 22.5cr · job 9d7ca728)<br />
            · <b style={{ color: '#4CAF50' }}>S1-4 트림 확정 (사용자 QC 2026-07-15)</b>: &quot;폰을 들어 보고 놀란다&quot; 인과가 미렌더(바닥 탭→잠든 얼굴 컷백→맥락 없는 번쩍) → <b>3.75s에서 트림</b>(잠든 CU→와이드 폰 뻗기까지만 사용, s1_v4_trim) · <b>놀람 비트는 S2 오프닝으로 이월</b>(폰 화면 리액션→벌떡→환복으로 이어지는 설계)
          </div>
        </div>
      </div>
      <div className="note" style={{ padding: 14, marginBottom: 8, fontSize: 12.5, lineHeight: 1.8, borderLeft: '3px solid #26A69A' }}>
        <b>💡 최종 발견 (2026-07-15 사용자 통찰)</b>: 원작 재팬 CF가 <b>팟(아쿠아)</b>을 쓴 것은 우연이 아니라 설계 — 팟은 눈물방울 형태라 인물이 <b>안기듯 파묻히는</b> 기상/취침 구도가 자연스럽게 나온다. 맥스는 낮고 긴 라운저라 "위에서 잠들다 깬다"를 시키면 서핑보드에 엎드린 그림이 됨. <b>150cr 실험이 원작 제작진의 제품 캐스팅 판단을 역검증한 셈</b> — 장면의 동작(파묻힘 vs 기댐 vs 눕기)에 맞는 SKU 선택이 프롬프트 엔지니어링보다 상위 결정.<br />
        <b>Seedance 프롬프트 레시피 확립</b>: 카테고리 전형 밖 제품은 ①카테고리 단어 대신 기하 서술 ②치수 명시 ③NOT 네거티브 ④인체 대비 앵커 — 이 4종 세트로 형태·스케일 모두 통제 가능 (단, 사용 자세까지는 별도 연출 지시 필요)
      </div>

      {/* 러프컷 — 세그먼트 연결본 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3-3. 러프컷 — 세그먼트 연결본 (v3 파이프라인 실전)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF50', marginBottom: 6 }}>▶ 러프컷 v3 — S1-5(침대)+S2+S3 (15.2s · 검토 대상)</div>
            <video src="/cf12/rough_v3.mp4?v=1" controls loop playsInline
              style={{ width: 220, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #4CAF50' }} />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB300', marginBottom: 4 }}>★ S1-5 — 침대 대비 (5s · 22.5cr)</div>
            <video src="/cf12/s1_v5.mp4?v=1" controls loop playsInline
              style={{ width: 150, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '2px solid #FFB300' }} />
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 4 }}>S2 (놀람·환복)</div>
              <video src="/cf12/s2_v1.mp4?v=1" controls loop playsInline
                style={{ width: 130, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 4 }}>S3 (오피스·소진)</div>
              <video src="/cf12/s3_v1.mp4?v=1" controls loop playsInline
                style={{ width: 130, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>v1 (S1+S2)</div>
              <video src="/cf12/rough_v1.mp4?v=1" controls loop playsInline
                style={{ width: 110, aspectRatio: '9 / 16', borderRadius: 10, background: '#000', border: '1px solid var(--border)', opacity: .6 }} />
            </div>
          </div>
          <div style={{ flex: '1 1 280px', fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-dim)' }}>
            <b style={{ color: '#FFB300' }}>★ S1-5 QC (2026-07-15 · 침대 대비 성공)</b>: 2.0s에 카메라가 빠지며 <b>말끔히 정리된 빈 침대</b>가 뒤로 드러나고, 그는 바닥의 네이비 맥스에 파묻혀 잠듦 → <b>&quot;침대를 두고도 요기보&quot;가 한 프레임에 성립</b> ✓ · 침대가 흐트러지지 않아 &quot;아예 쓰지도 않았다&quot;로 더 강하게 읽힘 ✓ · 인티메이트 CU→와이드 리빌 카메라 ✓ · 여우 1개·네이비·무텍스트 유지 ✓ · <b>끝 프레임에서 폰을 집어 S2 놀람과 정확히 연결</b> ✓<br />
            <b style={{ color: 'var(--text)' }}>v3 구성 (15.2s)</b>: S1-5(5s 침대 대비→잠듦→폰 집기) + S2(5s 놀람→벌떡→환복→대시) + S3(5s 출근→업무→소진) 하드컷 · 24fps · 720×1280 · crf17 · 네이티브 오디오<br />
            <b style={{ color: 'var(--text)' }}>S2 QC</b>: 놀람 ECU ✓(S1에서 못 잡은 인과가 여기서 성립) · 벌떡 ✓ · 옷걸이 랙 환복 ✓ · 퇴장 후 <b>빈 방에 네이비 맥스+여우만 남음</b> ✓(제품 라스트 임프레션)<br />
            <b style={{ color: 'var(--text)' }}>S3 QC</b>: 한국 오피스(창가 파티션·모니터) ✓ <b>헬멧 현장 완전 제거</b>(v2 잔존 이슈 해결) · 타이핑→서류→수화기 업무 몽타주 ✓ · 창밖 노을로 시간 경과 ✓ · 엎드려 소진 엔딩 ✓ · 무텍스트 ✓ · 🟡 <b>얼굴이 S1·S2보다 다소 성숙</b>(체이닝 참조 1장 한계 — 필요 시 재생성)<br />
            <b style={{ color: 'var(--text)' }}>연속성 기법</b>: S1-4에서 얼굴 CU(4.6s)·와이드(3.4s) 추출 → FTP → 다음 세그먼트 image_references로 체이닝<br />
            <b style={{ color: '#E53935' }}>🔴 잔여 결함 — CUT4 누락</b>: <b>출근길 당찬 걸음(&quot;근데 몸은 개운해&quot;)</b>이 아직 없음 → S2 문밖 대시에서 S3 사무실로 바로 점프. 제품 페이오프 소실 상태 (S2.5 신규 생성 필요 · 22.5cr)<br />
            <b style={{ color: 'var(--text)' }}>남은 계획</b>: S2.5 출근길(22.5cr · CUT4) + S4 귀가·다이브·잠(22.5cr · CUT8-9) → 러프컷 v4 = 마스터 10컷 전체 준수 ~25s + 로고 후편집
          </div>
        </div>
      </div>

      {/* v4 — 경계 스틸 게이트 설계 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3-2. v4 설계 — 경계 스틸 게이트 (start_image + end_image · 2026-07-15 사용자 제안)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, fontSize: 12.5, lineHeight: 1.8, borderLeft: '3px solid #FF7043' }}>
        <b>원리</b>: Seedance는 start_image와 end_image를 동시에 받는다(7차 S2 리빌 문법). 각 세그먼트의 <b>첫 프레임과 끝 프레임을 스틸(2cr)로 먼저 승인</b>하고, 영상 생성은 &quot;두 확정 프레임 사이를 채우는 일&quot;로 좁힌다. 세그먼트 경계는 원작의 하드컷 지점에 배치 — 경계 앞뒤 스틸이 달라도 컷 전환으로 자연스럽다.<br />
        <b>v1~v3 실패 요인이 구조적으로 해결되는 지점</b>:
        ① 정체성 체이닝 — 모델A·네이비 맥스가 6장 스틸에 전부 박혀 세그먼트 양끝에서 고정 (v2의 &quot;2.6s 핑크 재발&quot;류 중간 드리프트는 남은 3초 안에서만 가능)
        ② 연출 교정 — S1-3 잔존 이슈(맥스 위에 올라탄 자세)를 <b>스틸 단계에서 2cr로 교정</b> 후 영상 진입 (22.5cr 재생성 불필요)
        ③ 실패 반경 축소 — 문제 시 해당 세그먼트만 재생성, 스틸은 재사용
        ④ 원본 유출 차단 유지 — video_reference 없음, 구도만 원작 프레임 베이스로 스틸 제작(전 요소 교체)
      </div>
      <div className="note" style={{ padding: 14, marginBottom: 8, fontSize: 12.5, lineHeight: 1.8 }}>
        <b>경계 스틸 6장 (P0~P5 · 각 2cr · 총 12cr) — 전부 모델A 시트 + 맥스 네이비 360 + 한국 배경 + 무텍스트</b><br />
        · <b>P0</b> (S1 시작 · 0s) — 잠든 측면 CU: 모델A가 네이비 맥스에 <b>비스듬히 기대 파묻혀</b> 잠듦(올라타기 금지 — S1-3 교정 포즈), 한국 아파트 아침광<br />
        · <b>P1</b> (S1 끝 · ~5s) — 놀람 정점: 폰 든 채 입 벌어진 ECU, 상체 일어난 순간<br />
        · <b>P2</b> (S2 시작 · 5s) — 옷장 앞 급환복 실루엣 (P1과 하드컷 경계라 불일치 허용)<br />
        · <b>P3</b> (S2 끝 · ~10s) — 한국 오피스 책상 착석, 업무 중 지침 시작<br />
        · <b>P4</b> (S3 시작 · 10s) — 귀가 거실 와이드: 현관 쪽에서 네이비 맥스를 향해 다이브 직전<br />
        · <b>P5</b> (S3 끝 · 15s) — 잠든 얼굴 CU + 네이비 맥스 — P0과 같은 공간·톤(수미상관 엔딩, 로고는 후편집)<br />
        <b>세그먼트 생성</b>: S1 = P0→P1 · S2 = P2→P3 · S3 = P4→P5 (각 5s · 22.5cr) — 중간 비트(폰 확인·출근 거리·다이브)는 타임라인 프롬프트로 지시<br />
        <b>비용 플랜</b>: 스틸 12cr + 세그먼트 67.5cr = <b>~80cr</b> (+재시도 버퍼 · 매 호출 get_cost 프리플라이트 + 개별 승인)<br />
        <b>상태</b>: ⬜ P0 스틸부터 게이트 시작 대기
      </div>

      {/* 프롬프트 단 — 사용자 원 스토리보드 & 생성 프롬프트 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 프롬프트 단 — 사용자 원 스토리보드 기준 (1차 설계 그대로)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, fontSize: 12.5, lineHeight: 1.8 }}>
        <b>사용자가 1차 프로젝트에서 직접 짠 스토리보드 (첫 장면 → 끝 장면)</b> — 시댄스 버전도 이 서사 골격을 그대로 따른다:<br />
        ① 빈백에서 자다 깸(측면 CU) → ② 폰 확인, 흠칫 놀람(ECU) → ③ 옷장에서 급히 환복 → ④ 출근길 빠른 걸음(3/4 CU 핸드헬드) → ⑤ 사무실 서류 업무 → ⑥ 동료와 논의 → ⑦ 퇴근 직전 지친 표정 → ⑧ 귀가, 빈백 다이브 → ⑨ 잠든 얼굴 CU → ⑩ 로고(후편집)<br />
        <b>v2 교체 스펙 (2026-07-14 사용자 확정)</b>: 배경 = 한국(집·거리·오피스 전부, 일본풍 금지) · 모델 = 모델A 시트 기준(원작 배우 금지) · 제품 = <b>맥스 네이비 170cm(공식 360)</b> · 서포트 실측 76×94×30cm·1.7kg(배경 소품) · 텍스트 전면 금지 · 음원 = 원곡 복제 금지, 자체 작곡(오디오 레퍼런스 제거)
        <details style={{ marginTop: 8 }}>
          <summary style={{ fontSize: 11.5, color: 'var(--accent)', cursor: 'pointer' }}>📝 v2 시댄스 생성 프롬프트 전문 보기</summary>
          <pre style={{ fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,.15)', padding: 10, borderRadius: 8, marginTop: 6, color: 'var(--text-dim)' }}>{`HOW TO USE THE REFERENCES: reference VIDEO = camera path/timing/pacing ONLY - do NOT copy its actress, pink bean bag, Japanese setting, on-screen text, or music.
CRITICAL RULES:
(1) WOMAN = the woman in image 1 (Model A) in EVERY shot - NOT the reference video's actress.
(2) Bean bag = YOGIBO MAX (image 2): deep NAVY BLUE 170cm pill, NO armrests - navy in EVERY frame, NEVER pink, color never changes.
(3) Setting = KOREAN throughout: Korean apartment, Korean street, Korean office (no construction site/helmet).
(4) Home scenes: Mate plushes (image 3) + olive U Support standing backrest 76x94x30cm (image 4).
(5) NO text/subtitles/logos/graphics anywhere.
(6) Audio: ORIGINAL upbeat playful instrumental - do NOT reproduce the reference's song.
Timeline: 0-2 잠든 CU / 2-3.3 폰 확인 / 3.3-4 놀람 ECU / 4-5 정면 CU / 5-6 환복 / 6-7.8 출근 핸드헬드 / 7.8-8.7 한국 오피스 업무 / 8.7-9.8 지침 / 9.8-12 귀가 다이브 / 12-15 잠든 얼굴 (클린 엔딩)`}</pre>
        </details>
      </div>

      {/* 비교표 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>5. 파이프라인 비교 (결과 나오면 실측 채움)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 30 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          {COMPARE.map((r) => (
            <div key={r.k} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 90px', fontWeight: 700 }}>{r.k}</span>
              <span style={{ flex: '1 1 0', color: 'var(--text-dim)' }}>🟡 Kling: {r.kling}</span>
              <span style={{ flex: '1 1 0', color: 'var(--text-dim)' }}>🔵 Seedance: {r.seed}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
