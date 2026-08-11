'use client';

// 18차 프로젝트 — 스티커 peel (인물을 뜯어 다른 배경에 붙이는 효과) (2026-08-04)
// 컨셉: 시작 이미지 속 특정 인물(+빈백+고양이)을 스티커처럼 "촤악" 뜯어내 → 새 배경에 탁 붙이기 · 최대 15초 · 숏츠용
// 엔진 후보: Seedance 2.0(네이티브 오디오 촤악) vs 합성(정밀). 크레딧은 get_cost 확인 후에만 사용.

const START_IMG = '/sticker18/original.jpg';
const NORMAL_IMG = '/sticker18/normal.png';   // 분할 — 깔끔 컷아웃(사용자 제공)
const STICKY_IMG = '/sticker18/sticky.png';   // 스티커 연출 — 흰 테두리 die-cut(사용자 제공)

// 변경 배경(장소) 목록 — 스티커가 옮겨 붙는 장소들. "어디든 어울린다" 몽타주.
const BG_SCENES = [
  { img: '/sticker18/clean_plate.png', place: '① 거실 (원본 공간)', note: '빈백 떼고 남은 빈 방 · 시작점' },
  { img: '/sticker18/bg1.png', place: '② 인더스트리얼 로프트', note: '벽돌·콘크리트 · AI 붙이기 완료' },
  { img: '/sticker18/bg3_office.png', place: '③ 홈오피스/서재 라운지', note: '원목 책장·러그 · 카페 대체(빈백 라운징 적합)' },
  // 카페 제외 — 빈백 라운징이 카페 공간과 안 어울림(사용자 판단).
];
const STORY = {
  concept: '어디에 붙여도 어울리는 요기보 — 손가락이 캐릭터(인물+빈백)를 스티커처럼 “촤악” 뜯어, 여러 장소에 옮겨 붙여도 자연스럽게 어울린다는 걸 보여주는 세로 숏츠 몽타주. 총 최대 15초 (인트로 + 3~4장소 + 엔딩).',
  beats: [
    { t: '0.0–2.5s', title: '① 원본 + 손가락 촤악 뜯기', screen: '거실 원본 풀샷 → 손가락이 들어와 캐릭터(빈백)를 스티커처럼 들어올림. 가장자리 말리며(curl) 들린다.', sound: 'BGM 인 + ★ “촤악” peel', how: '원본 + 손가락 PNG + 스티커 peel/curl' },
    { t: '장소마다 ~2.5~3s (반복)', title: '② 이동 → 탁 착지 → 어울림', screen: '스티커가 휙 다음 장소로 이동 → 배경 전환 → 탁 착지 → 잠깐 머물며 그 공간에도 완벽히 어울리는 컷. (장소 수만큼 반복)', sound: '휙 스와이프 + 탁 + BGM', how: '배경(장소) 전환 + 스티커 착지/바운스', repeat: true },
    { t: '마지막 ~2s', title: '③ 태그라인 + 로고', screen: '마지막 장소에서 “어디든 어울리는 요기보” 문구 + yogibo 로고 페이드인.', sound: 'BGM 아웃', how: '텍스트/로고 오버레이' },
  ],
  assets: [
    ['① 원본', '✅ 확보 (co_bon_06)'],
    ['② 캐릭터 컷아웃 스티커', '✅ 완료 — 사용자 제공 (normal=분할 / sticky=흰테두리 die-cut), 머리까지 crisp'],
    ['③ 변경 배경 (9:16, 여러 장소)', '✅ 3곳 확보 — 거실(원본)·로프트(보유)·카페(생성). 추가 가능(각 ~1cr)'],
    ['④ 손가락 peel 제스처', '✅ 해결 — AI(Seedance)가 손가락 peel 연출 자체 생성 (480p 확정)'],
  ],
};

// 섹션별 제작 — 각 파트를 따로 만들어 컴펌 후 러프컷으로 이어붙임
const SECTIONS = [
  { id: '★', title: 'ONE-CUT — 떼기 → 배경전환(로프트) → 붙이기 (단일 Seedance 클립)', dur: '10s', dep: 'Seedance 480p 15cr · ★한 컷에 전부 · 이음새 없음', status: '완료', file: '/sticker18/onecut_v1.mp4' },
  { id: '720', title: '↑ 720p 재생성 (480p 뭉개짐 해결) — 연출 확정 후', dur: '10s', dep: 'Seedance 720p ~45cr · 컴펌 후', status: '대기', file: null },
  { id: '+장소', title: '장소 확장 — 로프트→홈오피스 등 추가(같은 한 컷 방식)', dur: '10s/장소', dep: '한 컷 프롬프트에 대상 배경만 교체', status: '대기', file: null },
  { id: '엔딩', title: '엔딩 — “어디든 어울리는 요기보” + 로고', dur: '~2s', dep: '문구·로고(있음)', status: '대기', file: null },
];

// AI 생성 참고본 (비교용) — 크레딧 소모분
const REF_GENS = [
  { file: '/sticker18/s1_seed480_test.mp4', label: '✅ Seedance 직접 480p — 떼기(peel)', cost: '7.5cr', note: '★ 성공 — 인물+빈백만 정확히 떼고 빈 방 리빌. "인물+빈백만" 명시 + 인물 도드라진 크롭이 열쇠', ok: true },
  { file: '/sticker18/s2_paste_loft_ai_clean.mp4', label: '✅ Seedance 직접 480p — 붙이기(paste)', cost: '7.5cr', note: '★ 성공 — 연속 프레임(paste_start_loft)에서 손가락이 내려 눌러 로프트 안착. 떼기와 동일 엔진, "press down" 프롬프트', ok: true },
  { file: '/sticker18/s1_peel.mp4', label: '프리셋 1차 (원본 전체 입력)', cost: '28cr', note: '❌ 공간 전체를 뗌 (인물 타겟 실패)' },
  { file: '/sticker18/s1_peel2.mp4', label: '프리셋 2차 (인물 크롭 입력)', cost: '28cr', note: '❌ 발 근처 조각만 뜯고 인물은 남음 (누운 인물 인식 실패)' },
  { file: '/sticker18/s1_kling.mp4', label: 'Kling start+end 전환본', cost: '10cr', note: '△ 거실→로프트 morph 전환 (peel 아님)' },
];

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: '최대 15초 · 9:16 세로(숏츠) · 인물+빈백 스티커 peel → 새 배경 붙이기 · 방식 🅐 합성' },
  { stage: 'STAGE 1 · 에셋', s: '🟡 진행', note: '✅ 컷아웃 완료(사용자 제공 normal+sticky·머리까지 crisp) · ⬜ 새 배경(9:16) · ⬜ 손가락 PNG' },
  { stage: 'STAGE 2 · 방식 결정', s: '✅ 확정', note: '🅐 합성 — 컷아웃을 제가 로컬에서 뽑음(0원). AI 영상 불필요·크레딧 0' },
  { stage: 'STAGE 3 · 제작', s: '⬜ 대기', note: '배경3 받으면 → peel 애니메이션 + 새 배경 착지 합성 (로컬·0원)' },
  { stage: 'STAGE 4 · 사운드/후반', s: '⬜ 대기', note: '"촤악" peel SFX 싱크(무료 효과음) · 9:16 마스터 · 조립' },
];

const APPROACHES = [
  {
    key: 'A', title: '🅰 합성 (모션그래픽) — ⭐추천 (사용자 컷아웃 제공 시)', cost: '0원',
    pros: ['★ 사용자가 인물+빈백 스티커(투명PNG) 제공 → 최대 난관(컷아웃) 제거', '깔끔·예측 가능 (스티커 효과의 정석)', '형태 안 뭉개짐 · 촤악 SFX·새 배경 정밀 싱크', '크레딧 0'],
    cons: ['컷아웃은 사용자 제공(경계 깔끔해야 함)', 'AI 특유의 "살아있는" 질감은 덜함'],
    how: '① 사용자 제공 스티커(인물+빈백 투명PNG) → ② 원본에서 그 자리가 peel/기울며 들리는 애니메이션 → ③ 새 배경으로 날아가 탁 붙기 → ④ 촤악 SFX 싱크 (ffmpeg/PIL/remotion, 로컬)',
  },
  {
    key: 'B', title: '🅑 Seedance 2.0 (AI 영상)', cost: 'get_cost 확인 필요',
    pros: ['네이티브 오디오 — 촤악 사운드 함께 생성 시도', '원테이크 · AI 특유의 생동감', 'Kling보다 이 컨셉(사운드)엔 유리'],
    cons: ['peel 기하학이 느슨/불안정 (인물 변형 위험)', '"새 배경에 붙이기"는 한 컷 생성으로 거의 불가 → 후반 필요', 'MCP 계정 0.58cr뿐 → 생성불가(무료 웹/충전 필요)'],
    how: '시작 이미지 → Seedance 프롬프트("인물이 사진에서 스티커처럼 촤악 들려 올라온다") → 배경 붙이기·SFX는 후반 보강',
  },
];

const QUESTIONS = [
  ['✅ 뜯어낼 대상', '인물 + 빈백 (확정) · 고양이는 제외(컷아웃 때 경계 처리)'],
  ['붙일 새 배경', '⬜ 어떤 배경에 붙일지 (URL로 제공) — "붙이기" 완성에 필수'],
  ['방식 선택', '⬜ 🅐 합성(사용자 컷아웃 제공·추천) / 🅑 Seedance / 🅒 Kling 하이브리드'],
  ['✅ 비율', '9:16 세로 (숏츠/SNS) 확정'],
];

export default function Storyboard18() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 20px 80px', color: '#e8e8e8', fontFamily: 'system-ui, "Malgun Gothic", sans-serif' }}>
      <a href="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← 홈</a>

      <h1 style={{ fontSize: 26, margin: '14px 0 6px' }}>🩹 스티커 peel — 인물을 뜯어 붙이는 효과</h1>
      <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>
        18차 · 최대 15초 · <b>9:16 세로(숏츠)</b> · 시작 이미지 속 <b>인물+빈백을 스티커처럼 “촤악” 뜯어내 새 배경에 붙이는</b> 효과.
        엔진 후보 = <b>Seedance 2.0</b>(네이티브 오디오) vs <b>합성</b>(정밀). <b style={{ color: '#e6c86a' }}>크레딧은 get_cost로 금액 확인 후에만 사용.</b>
      </p>

      {/* 시작 이미지 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>시작 이미지</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {[
          [START_IMG, '① 원본', '#888', false],
          [NORMAL_IMG, '② 분할 (깔끔 컷아웃)', '#66BB6A', true],
          [STICKY_IMG, '③ 스티커 연출 (die-cut)', '#FF7043', true],
        ].map(([src, lab, col, chk]) => (
          <div key={lab} style={{ textAlign: 'center' }}>
            <img src={src} alt={lab} style={{ width: 210, borderRadius: 12, border: `1px solid ${col}`, background: chk ? 'repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 50% / 18px 18px' : '#222' }} />
            <div style={{ fontSize: 12, color: col, marginTop: 4 }}>{lab}</div>
          </div>
        ))}
        <div style={{ flex: 1, minWidth: 220, color: '#bbb', fontSize: 13.5, lineHeight: 1.7 }}>
          <b>사용자 제공 컷아웃</b> (머리까지 crisp · rembg 자동본 대체).
          <br />• <b style={{ color: '#66BB6A' }}>분할</b> = 배경 투명 인물+빈백+고양이
          <br />• <b style={{ color: '#FF7043' }}>스티커</b> = 흰 테두리 die-cut → peel 연출용
          <br /><br />
          <b style={{ color: '#e6c86a' }}>남은 것 = ④ 새 배경(9:16) · ⑤ 손가락 PNG</b>
        </div>
      </div>

      {/* 스토리보드 */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>스토리보드 (컷 구성 · 최대 15초)</h2>
      <div style={{ background: '#1b2430', border: '1px solid #2b3a4a', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13.5, lineHeight: 1.7, color: '#cfe' }}>
        🎯 <b>컨셉:</b> {STORY.concept}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {STORY.beats.map((b, i) => (
          <div key={i} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF7043', background: '#2a1a12', padding: '2px 8px', borderRadius: 6 }}>{b.t}</span>
              <b style={{ fontSize: 15 }}>{b.title}</b>
            </div>
            <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.6, margin: '8px 0 4px' }}>{b.screen}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#999' }}>
              <span>🔊 {b.sound}</span>
              <span>🛠 {b.how}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 필요 에셋 */}
      <h3 style={{ fontSize: 15, margin: '18px 0 8px', color: '#ddd' }}>필요 에셋</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        {STORY.assets.map(([a, st], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 10, fontSize: 12.5, padding: '8px 10px', background: '#161616', borderRadius: 8 }}>
            <b>{a}</b><span style={{ color: '#aaa' }}>{st}</span>
          </div>
        ))}
      </div>

      {/* 섹션별 제작 */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>섹션별 제작 → 러프컷 조립</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        한 번에 만들지 않고 <b>파트별로 각각 제작 → 컴펌 → 러프컷으로 이어붙임.</b> 첫 검증 = <b style={{ color: '#e6c86a' }}>배경 1개로 [원본에서 띄우기 → 새 배경에 붙이기]</b>.
      </p>
      <div style={{ background: '#161616', border: '1px solid #FF7043', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#66BB6A', marginBottom: 8 }}>🎬 ★★★ 러프컷 스플라이스 (15.8초) — v2[거실→썬룸 11초] + 좋았던 저녁 홈시어터 붙임</div>
        <video controls src="/sticker18/threecut_spliced.mp4?v=1" style={{ width: 240, borderRadius: 8, background: '#000', aspectRatio: '9/16' }} />
        <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
          <b style={{ color: '#66BB6A' }}>편집(0원): v2의 좋은 앞 11초(거실 모자떼기 → 썬룸 살포시 배치) + 이전 2장소본의 저녁 홈시어터 안착(TV 영화 재생) 이어붙임.</b>
          <br />⚠ 11초 이음새 = 썬룸 스티커 → 저녁 스티커로 배경 전환(몽타주 컷) · 크기 살짝 튈 수 있음(원하면 크로스페이드로 부드럽게). 태그라인·로고 없는 클린본.
          <br /><b style={{ color: '#e6c86a' }}>OK면 720p 최종.</b> <span style={{ color: '#777' }}>3장소원본=threecut_v2 / 2장소=twocut / v1~v7=아래.</span>
        </div>
      </div>

      {/* 🗂 버전 히스토리 (v1~v7 정렬) */}
      <div style={{ background: '#14161a', border: '1px solid #2b3a4a', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#7EC8E3', marginBottom: 4 }}>🗂 버전 히스토리 — v1~v7 (한 컷 15초 시리즈 전체)</div>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>모든 시도를 순서대로 정렬. 각 버전이 뭘 고쳤고 뭐가 문제였는지 한눈에.</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { file: '/sticker18/onecut_v1.mp4', tag: 'V1 · 10초 단일', note: '첫 돌파구 — 한 컷에 떼기·전환·붙이기', col: '#66BB6A' },
            { file: '/sticker18/onecut_15s_test.mp4', tag: '★ 15초 초안', note: '정답 연출(큰 스티커) · 배경 revert', col: '#e6c86a' },
            { file: '/sticker18/onecut_15s_v2.mp4', tag: 'v2', note: 'end_image → 배경유지 성공', col: '#aaa' },
            { file: '/sticker18/onecut_15s_v3.mp4', tag: 'v3 (폐기)', note: '빈백 하나만 → peel 맛 죽음', col: '#EF9A9A' },
            { file: '/sticker18/onecut_15s_v4.mp4', tag: 'v4', note: '마지막 스티커 정지 추가', col: '#aaa' },
            { file: '/sticker18/onecut_15s_v5.mp4', tag: 'v5', note: '침실→로프트 · 게임룸=C', col: '#aaa' },
            { file: '/sticker18/onecut_15s_v6.mp4', tag: 'v6', note: '밝은라운지 · 단 스티커 작아짐', col: '#EF9A9A' },
            { file: '/sticker18/onecut_15s_v7.mp4', tag: '✅ v7 (현재 최선)', note: 'test 방식 복귀 → 큰 스티커 유지 + 밝은 마지막', col: '#66BB6A' },
          ].map((v) => (
            <div key={v.file} style={{ textAlign: 'center', width: 150 }}>
              <video controls src={`${v.file}?v=1`} style={{ width: 150, borderRadius: 8, background: '#000', aspectRatio: '9/16', border: `1px solid ${v.col}` }} />
              <div style={{ fontSize: 12, color: v.col, marginTop: 4, fontWeight: 700 }}>{v.tag}</div>
              <div style={{ fontSize: 10.5, color: '#888', lineHeight: 1.4 }}>{v.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ★ 수정 성공 — end_image 세그먼트 */}
      <div style={{ background: '#12160f', border: '2px solid #66BB6A', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#66BB6A', marginBottom: 8 }}>✅ 수정 성공 — 원본→선룸 세그먼트 (end_image 방식, 480p 15cr)</div>
        <video controls src="/sticker18/seg_sunroom_test.mp4?v=1" style={{ width: 240, borderRadius: 8, background: '#000', aspectRatio: '9/16' }} />
        <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
          <b style={{ color: '#66BB6A' }}>두 버그 해결: ① 선룸으로 가서 끝까지 유지(원본 복귀 X) · ② 끝에서 흰테두리 사라지고 실사로 안착.</b> 비결 = <b>end_image에 "그 방 실사 안착본" 지정</b> → 그 방 고정 + 실사 변환.
          <br />방법 확정 = <b style={{ color: '#e6c86a' }}>세그먼트 체인</b>(원본→선룸 ✅ / 선룸→침실 / 침실→미디어룸). 각 세그 end_image = 그 방 실사본 → 이어붙이면 연속. 480p 뭉개짐만 720p로 해결.
        </div>
      </div>

      {/* ★★ 15초 배경-유지 성공본 */}
      <div style={{ background: '#12160f', border: '2px solid #66BB6A', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#66BB6A', marginBottom: 8 }}>✅ 15초 v7 = test 연출 확정 (480p 22.5cr) — 큰 스티커 유지(안 작아짐)</div>
        <video controls src="/sticker18/onecut_15s_v7.mp4?v=1" style={{ width: 240, borderRadius: 8, background: '#000', aspectRatio: '9/16' }} />
        <div style={{ fontSize: 11.5, color: '#888', margin: '4px 0' }}>✅ <b style={{ color: '#66BB6A' }}>end_image 제거 → 스티커 크게 일정 유지(v6 축소 문제 해결)</b>. 선룸→로프트→밝은라운지. ⚠10.5~11.5s 거실 복귀 1회 남음. <span style={{ color: '#777' }}>↓v6(작아지던 버전)</span></div>
        <video controls src="/sticker18/onecut_15s_v6.mp4?v=1" style={{ width: 150, borderRadius: 6, background: '#000', aspectRatio: '9/16', opacity: 0.6 }} />
        <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
          <b style={{ color: '#66BB6A' }}>✅ 배경 유지력 해결! 선룸(3~7s)·침실(8~11s)·미디어룸(12~14s) 각각 놓아도 유지 — 원본 거실로 복귀 안 함.</b>
          <br />비결 = <b>방 3장 image_references + 미디어 end_image + "절대 복귀 금지" 프롬프트</b>. 구성·배경유지 = 사용자 OK.
          <br />남음: ⚠ 놓을 때 테두리→실사는 마지막 위주(중간은 스티커 유지·부차) · 480p 뭉개짐 → <b style={{ color: '#e6c86a' }}>720p 재생성으로 최종(52.5cr)</b>.
          <br /><span style={{ color: '#777' }}>↓ 이전 실패본(배경 복귀)</span>
          <video controls src="/sticker18/onecut_15s_test.mp4?v=1" style={{ width: 150, borderRadius: 6, background: '#000', aspectRatio: '9/16', marginTop: 4, opacity: 0.7 }} />
        </div>
      </div>

      {/* 인스타 배경 후보 3종 — 순서 정하기 (사진) + 참고 영상 */}
      <div style={{ background: '#12160f', border: '1px solid #33502a', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#66BB6A', marginBottom: 4 }}>🖼 인스타 배경 후보 3종 — 여기서 노출 순서 정하기</div>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>인스타 감성 + 빈백 놓일 자리 기준(사진 각 1cr). 순서 정하면 <b style={{ color: '#e6c86a' }}>정한 배경만 720p 최종</b>. 아래 참고 영상은 배경별 한 컷 테스트(480p).</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { img: '/sticker18/cand_bedroom.png', vid: '/sticker18/onecut_bedroom.mp4', label: 'A · 아늑한 침실', tag: '골든아워 코지' },
            { img: '/sticker18/cand_sunroom.png', vid: '/sticker18/onecut_sunroom.mp4', label: 'B · 선룸/플랜트룸', tag: '최고 IG각 · 식물' },
            { img: '/sticker18/cand_media.png', vid: '/sticker18/onecut_media.mp4', label: 'C · 미디어/게임룸', tag: '무디 시네마틱' },
          ].map((c) => (
            <div key={c.img} style={{ textAlign: 'center' }}>
              <img src={`${c.img}?v=1`} alt={c.label} style={{ width: 160, aspectRatio: '9/16', objectFit: 'cover', borderRadius: 8, border: '1px solid #33502a' }} />
              <video controls src={`${c.vid}?v=1`} style={{ width: 160, borderRadius: 8, background: '#000', aspectRatio: '9/16', marginTop: 6, border: '1px solid #2a2a2a' }} />
              <div style={{ fontSize: 12.5, color: '#66BB6A', marginTop: 4, fontWeight: 700 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{c.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        {SECTIONS.map((s) => (
          <div key={s.id} style={{ background: '#161616', borderRadius: 8, padding: '9px 10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 60px 70px', gap: 10, alignItems: 'center', fontSize: 13 }}>
              <b style={{ color: '#FF7043' }}>{s.id}</b>
              <span>{s.title}<span style={{ color: '#777', fontSize: 11.5 }}> · {s.dep}</span></span>
              <span style={{ color: '#888', fontSize: 12 }}>{s.dur}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: s.file ? '#66BB6A' : '#777', textAlign: 'right' }}>
                {s.file ? '✅ 완료' : `⬜ ${s.status}`}
              </span>
            </div>
            {s.file && (
              <video controls src={`${s.file}?v=1`} style={{ width: 220, borderRadius: 8, marginTop: 8, background: '#000', aspectRatio: '9/16' }} />
            )}
          </div>
        ))}
      </div>

      {/* AI 생성 참고본 (비교) */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #9575CD', paddingLeft: 10 }}>AI 생성 참고본 (비교 · 크레딧 소모분)</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        프리셋(자동 프롬프트)은 인물 타겟 실패 → <b style={{ color: '#66BB6A' }}>Seedance 직접 호출 + “인물+빈백만” 명시 프롬프트 + 인물 도드라진 크롭</b>으로 <b style={{ color: '#66BB6A' }}>480p 7.5cr에 성공(연출 확정).</b>
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {REF_GENS.map((r) => (
          <div key={r.file} style={{ textAlign: 'center' }}>
            <video controls src={`${r.file}?v=1`} style={{ width: 200, borderRadius: 10, background: '#000', aspectRatio: '9/16', border: `2px solid ${r.ok ? '#66BB6A' : '#333'}` }} />
            <div style={{ fontSize: 12, color: r.ok ? '#66BB6A' : '#ccc', marginTop: 4, fontWeight: r.ok ? 700 : 400, maxWidth: 200 }}>{r.label} <span style={{ color: '#e6c86a' }}>({r.cost})</span></div>
            <div style={{ fontSize: 11, color: '#888', maxWidth: 200 }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* 변경 배경 (장소들) */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #66BB6A', paddingLeft: 10 }}>변경 배경 (장소들) — 스티커가 옮겨 붙는 곳</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        “어디든 어울리는 요기보” 몽타주 — 상황(장소)이 바뀔 때마다 배경을 여기 등록. <b style={{ color: '#e6c86a' }}>9:16 세로 · 원본과 대비되는 장소일수록 효과 ↑</b>
      </p>
      {BG_SCENES.length === 0 ? (
        <div style={{ border: '1px dashed #444', borderRadius: 10, padding: '20px', textAlign: 'center', color: '#777', fontSize: 13 }}>
          ⬜ 배경 대기 — 장소 이미지(9:16)를 주시는 대로 순서대로 채웁니다. (1개=심플 / 2~3개=몽타주)
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {BG_SCENES.map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 150 }}>
                <img src={b.img} alt={b.place} style={{ width: 150, aspectRatio: '9/16', objectFit: 'cover', borderRadius: 10, border: '1px solid #333' }} />
                <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 11, fontWeight: 700, background: '#000a', color: '#fff', padding: '2px 7px', borderRadius: 6 }}>{i + 1}</span>
              </div>
              <div style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>{b.place}</div>
              {b.note && <div style={{ fontSize: 11, color: '#777' }}>{b.note}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 게이트 */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>파이프라인 상태</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {GATES.map((g) => (
          <div key={g.stage} style={{ display: 'grid', gridTemplateColumns: '150px 66px 1fr', gap: 10, alignItems: 'center', fontSize: 13, padding: '8px 10px', background: '#161616', borderRadius: 8 }}>
            <b>{g.stage}</b><span>{g.s}</span><span style={{ color: '#aaa' }}>{g.note}</span>
          </div>
        ))}
      </div>

      {/* 접근 방식 */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>접근 방식 (택1)</h2>
      <div style={{ display: 'grid', gap: 14 }}>
        {APPROACHES.map((a) => (
          <div key={a.key} style={{ background: '#161616', border: `1px solid ${a.key === 'A' ? '#33502a' : '#2a2a2a'}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <b style={{ fontSize: 16 }}>{a.title}</b>
              <span style={{ fontSize: 12.5, color: '#e6c86a' }}>비용: {a.cost}</span>
            </div>
            <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.6, margin: '8px 0' }}>{a.how}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
              <div>
                <div style={{ fontSize: 12, color: '#66BB6A', marginBottom: 4 }}>장점</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#aaa', fontSize: 12.5, lineHeight: 1.6 }}>{a.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#EF9A9A', marginBottom: 4 }}>단점</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#aaa', fontSize: 12.5, lineHeight: 1.6 }}>{a.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 컨펌 대기 질문 */}
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #e6c86a', paddingLeft: 10 }}>컨펌 대기 (크레딧 쓰기 전)</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {QUESTIONS.map(([q, note], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 10, fontSize: 13, padding: '8px 10px', background: '#1f1c14', border: '1px solid #3a3320', borderRadius: 8 }}>
            <b style={{ color: '#e6c86a' }}>{q}</b><span style={{ color: '#bbb' }}>{note}</span>
          </div>
        ))}
      </div>

      <p style={{ color: '#666', fontSize: 12, marginTop: 24, lineHeight: 1.7 }}>
        정의 2026-08-04 · 엔진 미확정(Seedance/합성) · 크레딧 사용 전 반드시 get_cost 금액 확인·승인.
        스티커 peel은 합성이 정석이나, AI 생동감을 원하면 Seedance로 실험 가능(peel 기하학 불안정 감수).
      </p>
    </div>
  );
}
