'use client';

// 8차 프로젝트 — 요기보 스위트: 호텔 파티 원테이크 (마케터 프롬프트 기반 · 2026-07-09)
// 원안: 마케터 작성 6씬 영어 프롬프트 (문 앞 기대감 → 파티 공개 → 케이크 클로즈업 → 창가 이동 → 야경 틸트업 → 로고 불꽃)
// cafe24 FTP 서빙 시: /api/video/suite/ 프록시 사용 예정
const V = (name, ver = 1) => `/api/video/suite/${name}.jpg?v=${ver}`;

// 씬 구성 — 마케터 프롬프트 그대로 + 타임라인 배분(15s 시안) + 난이도 진단
const SCENES = [
  {
    id: 'SC1', t: '0–2s', title: '문 앞, 기대감 — "Yogibo Suite" 도어',
    camera: '슬로우 푸시인 → 문이 스스로 열림',
    desc: '호텔 스위트 도어(골드 "Yogibo Suite" 명판), 문틈 아래·둘레로 따뜻한 골드빛. 문이 열리며 파티 빛과 웃음소리가 복도로 새어나옴. 웜 시네마틱 그레이드, 얕은 심도, 소프트 플레어.',
    risk: '🟡 명판 텍스트 "Yogibo Suite" — 작은 글자 생성 리스크. 명판을 크게·단순 서체로 지정 or 후반 오버레이 백업',
  },
  {
    id: 'SC2', t: '2–4.5s', title: '파티 전경 공개',
    camera: '열린 문을 통과해 전진 + 살짝 상승, 컷 없음',
    desc: '밝은 스위트 파티 와이드→미디엄: 부부 게스트(부인·남편 — 뒷모습·측면·보케)의 웃음·잔 부딪힘, 스트링 라이트, 골드 풍선, 맥스·팟·라운저가 스위트 가구로. 중앙 뒤 라운드 테이블에 visual_line 3단 케이크 + "10th" 캔들. ⭐ 제품-인물 스케일 프롬프트 주입(모델 160cm 앵커): 맥스는 성인이 눕는 170cm급, 팟·라운저는 1인용.',
    risk: '🟢 게스트 뒷모습·보케 확정 · 스케일은 레지스트리 프롬프트로 락 + 생성 후 비율 검수',
  },
  {
    id: 'SC3', t: '4.5–7.5s', title: '케이크 클로즈업 — 오빗',
    camera: '케이크로 아크 진입 → 케이크 주위를 우아하게 원호 선회, 전경 보케',
    desc: '케이크가 포컬 포인트: visual_line.png 3단 화이트·파스텔블루, 발광 "10th" 캔들 — 레퍼런스와 동일 유지(형태·색·로고·토퍼 불변). ⭐ 핵심 디테일 = 티어 위 요기보 제품 미니어처들(문필로우·카터필러 롤 레인보우·서포트·미니 옐리·로고 마크)이 마카롱 데코처럼 또렷하게 읽히는 매크로급 클로즈업 (2026-07-09 사용자 확정).',
    risk: '🟡 원테이크 중 오빗(선회)이 최고 난도 무브 → 개선안 ④ 반원 아크(180°)로 완화',
  },
  {
    id: 'SC4', t: '7.5–9.5s', title: '케이크를 스치며 창가로',
    camera: '케이크 지나치며 랙 포커스 → 통유리창으로 슬로우 트래킹',
    desc: '초점이 케이크→배경으로 이동, 스위트 반대편 바닥-천장 통유리창으로. 창밖에 넓은 강과 황혼→밤 도시 스카이라인, 수면 반사가 드러나기 시작.',
    risk: '🟢 7차에서 검증된 유형의 브릿지 무브',
  },
  {
    id: 'SC5', t: '9.5–12s', title: '창밖 야경 + 틸트업',
    camera: '통유리창 정면 → 강·스카이라인에서 밤하늘로 슬로우 틸트업',
    desc: '도시 불빛 반짝임, 강에 마천루 조명 반사, 딥 네이비 하늘. 틸트업과 함께 첫 불꽃이 원거리에서 골드·블루로 개화.',
    risk: '🟢 7차 S5와 동일 계열 — 검증됨',
  },
  {
    id: 'SC6', t: '12–15s', title: '피날레 — 불꽃이 Yogibo 로고로',
    camera: '홀드 + 미세 상승, 스카이라인 위 밤하늘 프레이밍',
    desc: '골드·틸·화이트 불꽃 연발 → 마지막 버스트가 요기보 로고 워드마크 실루엣(틸+화이트)으로 형성, 밝게 빛나다 엠버처럼 서서히 소멸. 환호성과 함께 음악 클라이맥스 후 페이드.',
    risk: '🟢 7차 S6에서 생성만으로 성공한 전례 — 로고 PNG 참조 재사용',
  },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 완료', note: '9:16 · 15s · Kling 3.0(전환) · 케이크=visual_line(3단) · 게스트=부부 2인(기존 Element, 아기 제외) 뒷모습·보케 · 인형 호스트 없음 — 메이트는 케이크 미니어처로만 (2026-07-09 확정)' },
  { stage: 'STAGE 1 · 에셋 락', s: '🟡 일부', note: '로고 PNG ✅ · 케이크 visual_line.png ✅ · 메이트/제품 참조 시트 ✅(7차 재사용) · SC1 도어 스틸 ⬜' },
  { stage: 'STAGE 2 · 스토리보드', s: '📝 이 페이지', note: '마케터 6씬 프롬프트 분석·타임라인 배분 완료 — 아래 보드' },
  { stage: 'STAGE 3 · 스틸', s: '⬜', note: 'SC1 도어 스틸(start_image) 우선 — 매 생성 전 크레딧 승인' },
  { stage: 'STAGE 4 · 영상화', s: '⬜', note: 'Kling 3.0으로 전환(2026-07-09 — 인물 묘사 방식 선호) · 실측: 15s pro 오디오on 37.5cr / 오디오off 26.25cr / 3s pro 7.5cr · start_image=승인 스틸' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: '통짜 성공 시 트림·톤만 · 명판 텍스트 실패 시 오버레이 보정 (무료)' },
];

export default function Storyboard8Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🏨 요기보 스위트 — 호텔 파티 원테이크 (10주년)</h1>
          <p className="page-desc">
            8차 · 9:16 · <b>15초(시안)</b> · 마케터 작성 6씬 원테이크 프롬프트 기반 · 스위트 도어 → 파티 → 케이크 오빗 → 창가 → 야경 틸트업 → Yogibo 로고 불꽃 피날레
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

      {/* 프롬프트 분석 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 마케터 프롬프트 분석 (2026-07-09)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8 }}>
          <b>💪 강점 — 구조가 Seedance에 최적</b>
          <br />· 씬마다 <b>카메라 동사가 명시적</b>(push/glide/arc/rack focus/tilt) + 원테이크 선언 반복 — 7차에서 검증된 성공 패턴 그대로
          <br />· 씬별 무드·오디오 지시 분리 — 네이티브 오디오 아크(정적→파티→오케스트라 클라이맥스) 설계가 이미 돼 있음
          <br />· 케이크에 &quot;레퍼런스와 동일 유지&quot; 지시 — 이미지 참조 규율이 잡혀 있음 (실제 레퍼런스 이미지만 붙이면 됨)
          <br />· 엔딩 로고 불꽃 — 7차에서 생성만으로 성공한 전례가 있어 실현 가능성 확인됨
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, borderColor: '#E65100' }}>
          <b>⚠️ 리스크 3가지 — STAGE 0에서 결정 필요</b>
          <br />· <b>① 실사 게스트(SC2·SC3 배경)</b>: AI 군중은 얼굴·손 붕괴가 가장 잦음. 선택지 — (a) 마케터 원안대로 실사 게스트(보케 처리로 완화) (b) <b>7차처럼 메이트 인형들을 게스트로</b> (브랜드 세계관 통일·리스크 최소, 추천) (c) 실루엣/뒷모습만
          <br />· <b>② 케이크 레퍼런스 불일치</b>: 프롬프트는 <b>2단</b> 화이트+진주 비즈 — 보유한 visual_line.png는 <b>3단</b>. 신규 2단 케이크 이미지가 따로 있으면 제공 필요, 없으면 visual_line 3단으로 통일할지 결정
          <br />· <b>③ 동선 레퍼런스 영상 없음</b>: 7차는 마케터 영상을 video_reference로 락했지만 이번엔 프롬프트 텍스트만. 특히 SC3 <b>케이크 오빗(선회)</b>은 원테이크 중 최고 난도 무브 — 1회차에서 오빗이 뭉개지면 &quot;선회→반원 아크&quot;로 완화하는 플랜 B 준비
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8 }}>
          <b>📐 타임라인 배분 (10s로는 부족 → 15s 필요)</b>
          <br />6씬 중 SC3(오빗 3s)·SC6(로고 형성+소멸 3s)이 홀드를 요구 — 10초에 욱여넣으면 전 구간이 급해짐. Seedance 최대 15s를 그대로 사용: 2 / 2.5 / 3 / 2 / 2.5 / 3
        </div>
      </div>

      {/* 개선 연출안 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1.5 개선 연출안 — 마케터 원안 + 7차에서 검증된 것들 (2026-07-09 제안)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8, borderColor: '#2E7D32' }}>
        <b>원안의 카메라 안무·오디오 아크는 그대로 유지</b>하고 5곳만 업그레이드:
        <br />· <b>① 게스트 = 가족 캐스트 뒷모습·보케 (확정)</b> — 군중 대신 가족 CF의 부인·남편 부부(기존 Element, 아기 제외)가 스위트에 초대된 프라이빗 파티. 뒷모습·측면·보케 위주라 얼굴 붕괴 리스크 없음, 정체성은 의상·헤어 프로즈+승인 스틸 참조로 락. 인형 호스트는 없음(럭셔리 톤 유지) — 메이트는 케이크 위 미니어처로만 존재
        <br />· <b>② 스위트 가구 = 요기보 제품 → 롤백 (2026-07-09)</b> — 시도 결과 빈백이 호텔 스위트 배경과 충돌(합성 티) → 마케터 원안대로 <b>제품 없는 순수 축하 씬</b>으로 확정. 브랜드 존재감은 케이크 위 요기보 미니어처 + 벽 로고 + 엔딩 로고 불꽃이 담당. (제품-인물 스케일 원칙 자체는 유지 — 제품이 등장하는 다른 컷에 적용)
        <br />· <b>③ 도어 명판 단순화</b> — 작은 &quot;Yogibo Suite&quot; 텍스트 대신 도어에 <b>골드 룸넘버 &quot;1010&quot;</b>(10주년 위트) + 로고 마크. 작은 글자 생성 리스크 회피, 실패 시 오버레이 백업도 쉬움
        <br />· <b>④ SC3 오빗 → 반원 아크(180°)로 완화</b> — 전체 선회 대비 성공률이 훨씬 높고 시각 효과는 유사
        <br />· <b>⑤ 톤 차별화</b> — 7차(집·파스텔·데이라이트)와 짝을 이루게 8차는 <b>웜 골드·샴페인 톤 + 황혼→밤</b> 럭셔리 무드. 10주년 캠페인 A/B 시리즈 구성
      </div>

      {/* 씬 보드 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 씬 보드 (마케터 6씬 · 15s 배분 · 난이도 진단)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {SCENES.map((p) => (
          <div key={p.id} className="note" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14 }}>{p.id} · {p.title}</b>
              <span className="badge badge-review" style={{ fontSize: 11 }}>{p.t}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>📷 {p.camera}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.6 }}>{p.desc}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{p.risk}</div>
          </div>
        ))}
      </div>

      {/* 에셋 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. 에셋 (STAGE 1)</h2>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>✅ yogibo 로고 PNG</b> — 7차에서 확보(public/logo_brand.png · 힉스필드 업로드 완료) → SC6 로고 불꽃 + SC1 명판 서체 참조 재사용
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>✅ 케이크 키비주얼</b> — 7차 visual_line.png(3단 · 10th 캔들 · 요기보 미니어처)로 확정 (2026-07-09 컨펌) · 힉스필드 업로드 완료 상태라 즉시 참조 가능
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>⬜ SC1 도어 스틸(start_image)</b> — 골드 명판 + 문틈 빛샘. STAGE 3 첫 생성 대상(2cr) — 7차 커튼 스틸과 같은 역할
        </div>
        <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.7 }}>
          <b>✅ 부부 게스트 정체성 참조</b> — 가족 CF 승인 스틸(부인=CUT3 룩·크림 니트 / 남편=CUT10 룩) 재사용 · 의상·헤어 프로즈로 락 (뒷모습 위주라 Element 토큰보다 프로즈+스틸 참조가 유효)
        </div>
      </div>

      {/* 산출물 슬롯 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3.5 산출물 슬롯 (진행하며 채움)</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 260px' }}>
          <img src="/suite/sc2_v7.png?v=1" alt="SC2 축하 씬 v7 (베이스 프레임 교체)"
            style={{ width: 260, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 12, border: '3px solid #42A5F5' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>SC2 v7 (최종 후보 · 베이스 프레임 교체 방식)</b> · 2K · 2026-07-09<br />
            1010.mp4 프레임(8인 밀집 축하 구도)을 베이스로 Element 3인 얼굴 교체(남편·부인·모델A) + 케이크 주변 요기보 미니어처 · Gemini 워터마크 무료 인페인팅 제거 완료
          </div>
        </div>
        <div style={{ flex: '0 0 130px' }}>
          <img src="/suite/sc2_v2.png?v=1" alt="SC2 v2 보관"
            style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .5 }} />
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v2 — 보관 (부부가 케이크 가림 · 팟 눌림)</div>
        </div>
        <div style={{ flex: '0 0 130px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <img src="/suite/sc2_v1.png?v=1" alt="SC2 v1 기각"
              style={{ width: 130, aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .45 }} />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>v1 — 기각 (맥스가 팔걸이 소파·지퍼 정면)</div>
          </div>
          <div>
            <img src="/suite/cake_v2.png?v=1" alt="케이크 v2 보류"
              style={{ width: 130, aspectRatio: '2 / 3', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', opacity: .6 }} />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>케이크 v2 — 보류 (아쿠아 2개가 일반 소파 → v3 예정)</div>
          </div>
        </div>
      </div>

      {/* 영상 1회차 */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '0 0 280px' }}>
          <video src="/suite/take1.mp4?v=1" controls loop playsInline
            style={{ width: 280, aspectRatio: '9 / 16', borderRadius: 12, background: '#000', border: '3px solid #FFB300' }} />
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
            <b>🎬 통짜 1회차 (검토 대상)</b> · Seedance 2.0 std 720p · 10s · 45cr · 네이티브 오디오<br />
            8인 건배(v7 스틸 시작) → 케이크 히어로(미니어처·보케) → 커튼 와이프+창 전환 → 강 위 불꽃 → yogibo 로고 불꽃 · 동선=1010.mp4 + 연출 업그레이드 프롬프트
          </div>
        </div>
      </div>

      {/* 비용 플랜 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 비용 플랜 (실측 단가 · 매 호출 전 개별 승인)</h2>
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 30 }}>
        <b>Kling 3.0 실측(프리플라이트 2026-07-09)</b>: 15s pro 오디오on <b>37.5cr</b> · 오디오off <b>26.25cr</b> · 3s pro <b>7.5cr</b>(오디오on) — 참고: Seedance 15s는 720p 67.5 / 1080p 135cr
        <br />운영안 A(통짜): 15s pro 오디오on <b>37.5cr</b> 1회 — kling은 동선 레퍼런스 입력이 없어 원테이크 재현률이 관건, 실패 시 B로
        <br />운영안 B(씬 분할): 씬별 3s pro × 5–6컷 <b>~37.5–45cr</b> + 와이프 스티치(무료) — 컷마다 스틸 락이 가능해 인물·제품 통제력은 더 높음
        <br />예산 가드 <b>~150cr</b> (스틸 + 통짜/분할 + 재시도 여유) · 잔액 ~2,009cr
        <br /><b>규칙: 크레딧 쓰는 호출은 직전마다 &quot;OO작업 · Xcr 사용할까?&quot; → 명시적 OK 후 실행</b>
      </div>
    </>
  );
}
