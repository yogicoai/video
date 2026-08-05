'use client';

import { useState } from 'react';

// 18차 프로젝트 — 스티커 peel (인물을 뜯어 다른 배경에 붙이는 효과) (2026-08-04)
// 컨셉: 시작 이미지 속 특정 인물(+빈백+고양이)을 스티커처럼 "촤악" 뜯어내 → 새 배경에 탁 붙이기 · ~5초 · SNS용
// 엔진 후보: Seedance 2.0(네이티브 오디오 촤악) vs 합성(정밀). 크레딧은 get_cost 확인 후에만 사용.

const START_IMG = '/sticker18/original.jpg';
const CUTOUT_IMG = '/sticker18/cutout.png';

const GATES = [
  { stage: 'STAGE 0 · 정의', s: '✅ 확정', note: '~5초 · 9:16 세로(숏츠) · 인물+빈백 스티커 peel → 새 배경 붙이기 · 방식 🅐 합성' },
  { stage: 'STAGE 1 · 에셋', s: '🟡 진행', note: '✅ 컷아웃 로컬 완료(rembg·0원, 인물+빈백+고양이) · ⬜ 배경3(새 배경 9:16) 필요' },
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
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={START_IMG} alt="원본" style={{ width: 240, borderRadius: 12, border: '1px solid #333' }} />
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>① 원본</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={CUTOUT_IMG} alt="컷아웃 스티커" style={{ width: 240, borderRadius: 12, border: '1px solid #FF7043', background: 'repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 50% / 20px 20px' }} />
          <div style={{ fontSize: 12, color: '#FF7043', marginTop: 4 }}>② 스티커(컷아웃·rembg 0원)</div>
        </div>
        <div style={{ flex: 1, minWidth: 220, color: '#bbb', fontSize: 13.5, lineHeight: 1.7 }}>
          <b>다크브라운 요기보 빈백에 기대 누운 인물 + 회색 고양이</b>가 한 덩어리 스티커로 분리됨.
          스티커 영역 <b>477×435</b>, 캔버스(1080×1349) 하단중앙 위치 → peel 시작점 확보.
          <br /><br />
          <b style={{ color: '#e6c86a' }}>남은 것 = ③ 새 배경(9:16)</b> 하나. 받으면 바로 합성 초안.
        </div>
      </div>

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
