'use client';

// 18차 프로젝트 — 스티커 peel (인물을 뜯어 다른 배경에 붙이는 효과) (2026-08-04)
// 컨셉: 시작 이미지 속 특정 인물(+빈백+고양이)을 스티커처럼 "촤악" 뜯어내 → 새 배경에 탁 붙이기 · ~5초 · SNS용
// 엔진 후보: Seedance 2.0(네이티브 오디오 촤악) vs 합성(정밀). 크레딧은 get_cost 확인 후에만 사용.

const START_IMG = '/sticker18/original.jpg';
const NORMAL_IMG = '/sticker18/normal.png';   // 분할 — 깔끔 컷아웃(사용자 제공)
const STICKY_IMG = '/sticker18/sticky.png';   // 스티커 연출 — 흰 테두리 die-cut(사용자 제공)

// 변경 배경(장소) 목록 — 스티커가 옮겨 붙는 장소들. 사용자 제공분을 순서대로 등록.
const BG_SCENES = [
  // { img: '/sticker18/bg1.jpg', place: '장소 이름', note: '' },
];
const STORY = {
  concept: '어디에 붙여도 어울리는 요기보 — 손가락이 캐릭터(인물+빈백)를 스티커처럼 “촤악” 뜯어, 다른 장소에 붙여도 자연스럽게 어울린다는 걸 보여주는 5초 세로 숏츠.',
  beats: [
    { t: '0.0–1.0s', title: '원본 + 손가락 등장', screen: '거실 원본 풀샷. 손가락이 프레임 밖에서 쑥 들어와 캐릭터(빈백) 모서리를 집는다.', sound: '잔잔한 BGM 인', how: '원본 이미지 + 손가락 PNG 인' },
    { t: '1.0–2.3s', title: '촤악 — 스티커 뜯기', screen: '손가락이 캐릭터를 스티커처럼 들어올림. 가장자리가 살짝 말리며(curl) 기울어져 들린다. 밑엔 원래 자리.', sound: '★ “촤악” peel 효과음', how: '컷아웃 스티커에 peel/curl 변형 + 손가락 동반 이동' },
    { t: '2.3–3.2s', title: '이동 (장소 전환)', screen: '뜯긴 스티커가 화면을 가로질러 이동. 배경이 새 장소로 스르륵 전환.', sound: '휙 스와이프', how: '스티커 이동 애니메이션 + 배경 크로스 전환' },
    { t: '3.2–4.4s', title: '탁 — 새 장소에 붙기', screen: '새 장소(야외 잔디/카페/파스텔 룸 등)에 스티커가 탁 안착. 그 배경에도 완벽히 어울림.', sound: '탁 붙는 효과음 + BGM', how: '새 배경 + 스티커 착지 + 살짝 바운스' },
    { t: '4.4–5.0s', title: '태그라인 (선택)', screen: '“어디든 어울리는 요기보” 문구/로고 페이드인.', sound: 'BGM 아웃', how: '텍스트/로고 오버레이' },
  ],
  assets: [
    ['① 원본', '✅ 확보 (co_bon_06)'],
    ['② 캐릭터 컷아웃 스티커', '✅ 완료 — 사용자 제공 (normal=분할 / sticky=흰테두리 die-cut), 머리까지 crisp'],
    ['③ 새 배경 (9:16)', '⬜ 미정 — 어디에 붙일지 (야외/카페/파스텔/다른 요기보 공간…)'],
    ['④ 손가락 PNG', '⬜ 소싱 필요 — peel 제스처(집는 손). 스톡/생성 후보'],
  ],
};

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: '~5초 · 9:16 세로(숏츠) · 인물+빈백 스티커 peel → 새 배경 붙이기 · 방식 🅐 합성' },
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
        18차 · ~5초 · <b>9:16 세로(숏츠/SNS)</b> · 시작 이미지 속 <b>인물+빈백을 스티커처럼 “촤악” 뜯어내 새 배경에 붙이는</b> 효과.
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
      <h2 style={{ fontSize: 19, margin: '30px 0 10px', borderLeft: '3px solid #FF7043', paddingLeft: 10 }}>스토리보드 (컷 구성 · 5초)</h2>
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
