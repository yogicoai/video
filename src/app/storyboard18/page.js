'use client';

// 18차 프로젝트 — 스티커 peel (인물을 뜯어 다른 배경에 붙이는 효과) (2026-08-04)
// 컨셉: 시작 이미지 속 특정 인물(+빈백+고양이)을 스티커처럼 "촤악" 뜯어내 → 새 배경에 탁 붙이기 · 최대 15초 · 숏츠용
// 엔진 후보: Seedance 2.0(네이티브 오디오 촤악) vs 합성(정밀). 크레딧은 get_cost 확인 후에만 사용.

const START_IMG = '/sticker18/original.jpg';
const NORMAL_IMG = '/sticker18/normal.png';   // 분할 — 깔끔 컷아웃(사용자 제공)
const STICKY_IMG = '/sticker18/sticky.png';   // 스티커 연출 — 흰 테두리 die-cut(사용자 제공)

// 변경 배경(장소) 목록 — 스티커가 옮겨 붙는 장소들. 사용자 제공분을 순서대로 등록.
const BG_SCENES = [
  // { img: '/sticker18/bg1.jpg', place: '장소 이름', note: '' },
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
    ['③ 변경 배경 (9:16, 여러 장소)', '⬜ 등록 대기 — 아래 “변경 배경” 갤러리에 순서대로 채움 (2~3곳 권장)'],
    ['④ 손가락 PNG', '⬜ 소싱 필요 — peel 제스처(집는 손). 실사 손 or “모서리 저절로 들림”으로 대체 가능'],
  ],
};

// 섹션별 제작 — 각 파트를 따로 만들어 컴펌 후 러프컷으로 이어붙임
const SECTIONS = [
  { id: 'S1', title: '인물 스티커 peel (합성 · 인물만 떠짐 + 손가락 + 들어올림)', dur: '5s', dep: '합성 0원 · 러프 초안', status: '완료', file: '/sticker18/s1_peel_composite.mp4' },
  { id: 'S2', title: '장소 ① — 이동 → 탁 착지 → 어울림', dur: '~2.5s', dep: '배경① 필요', status: '대기', file: null },
  { id: 'S3', title: '장소 ② — 이동 → 착지 → 어울림', dur: '~2.5s', dep: '배경② 필요', status: '대기', file: null },
  { id: 'S4', title: '장소 ③ — 이동 → 착지 → 어울림', dur: '~2.5s', dep: '배경③ 필요', status: '대기', file: null },
  { id: 'S5', title: '엔딩 — “어디든 어울리는 요기보” + 로고', dur: '~2s', dep: '문구·로고(있음)', status: '대기', file: null },
];

// AI 생성 참고본 (비교용) — 크레딧 소모분
const REF_GENS = [
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
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FF7043', marginBottom: 8 }}>🎬 전체 흐름 러프컷 (초안 · 0원) — peel → 빈 방 리빌 → 로프트 전환 → 붙여넣기</div>
        <video controls src="/sticker18/rough_flow.mp4?v=1" style={{ width: 240, borderRadius: 8, background: '#000', aspectRatio: '9/16' }} />
        <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>1~5 단계 한 컷. 손가락 그립·모션·톤 그레이딩 다듬기 예정.</div>
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
        AI로도 시도했으나 인물 타겟이 안 잡힘 → <b style={{ color: '#66BB6A' }}>합성(S1·0원)이 유일하게 인물만 정확히 떼어냄.</b>
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {REF_GENS.map((r) => (
          <div key={r.file} style={{ textAlign: 'center' }}>
            <video controls src={`${r.file}?v=1`} style={{ width: 200, borderRadius: 10, background: '#000', aspectRatio: '9/16', border: '1px solid #333' }} />
            <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>{r.label} <span style={{ color: '#e6c86a' }}>({r.cost})</span></div>
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
