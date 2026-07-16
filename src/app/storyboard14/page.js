'use client';

// 14차 프로젝트 — 팍스 캐릭터 파일럿 (2026-07-16 시작)
// 목적: 캐릭터 생성 → Element 락 → 장면별 컷 → 영상 조립까지 전 파이프라인 1회 완주 테스트
// 이미지 = 웹 UI Unlimited(무료) · 영상 = MCP 크레딧

const GATES = [
  { stage: 'STAGE 0 · 캐릭터 확정', s: '✅ 확정', note: '소프트 3D 애니메이션 캐릭터 · 3등신 · 인형 흔적 제거 (07-16) — 실물 인형은 판독 근거로만 쓰고 역할 종료' },
  { stage: 'STAGE 1 · Element 락', s: '✅ 완료', note: 'yogibo-fox-3view (정면+측면+후면 3장) 생성 · IDENTITY+SCALE+PERSONALITY 포함 · 무료' },
  { stage: 'STAGE 2 · 장면 설계', s: '🟡 세계관 대기', note: '기승전결 컷 리스트 — 클레이 세계 vs 3D 실내 중 선택 후 착수' },
  { stage: 'STAGE 3 · 컷별 스틸', s: '⬜', note: '웹 UI에서 Element 토큰 + 장면 프롬프트로 생성(무료) → URL 전달 → 검수' },
  { stage: 'STAGE 4 · 영상화', s: '⬜', note: '컷별 생성 · 탐색은 Seedance mini 480p(1cr/초), 확정본은 std 또는 Kling start/end' },
  { stage: 'STAGE 5 · 조립', s: '⬜', note: 'ffmpeg 연결·배속·로고·음원 — 전부 무료' },
];

// 오늘(07-16) 실측으로 확립한 원칙 — 이 프로젝트에 그대로 적용
const RULES = [
  {
    k: '레퍼런스 > 프롬프트',
    v: '스타일은 말로 설명하는 것보다 레퍼런스 1장이 압도적으로 강하다. 캐릭터 룩이 흔들리면 프롬프트를 고치기 전에 레퍼런스를 붙인다.',
  },
  {
    k: '카테고리 전형은 네거티브로 깬다',
    v: '"메이트=인형" 같은 사전관념은 긍정 서술로 안 깨진다. NOT a plush / NOT 6 heads tall / no realistic fur 처럼 명시적 네거티브 + 숫자로 못박아야 한다. (맥스=공 모양 문제와 동일 구조)',
  },
  {
    k: '연출은 첫 프레임 설계로 잡는다',
    v: '13차에서 "던지지 마라"를 3회(대문자 강조 포함) 넣어도 계속 던졌다. 프롬프트가 아니라 첫 프레임이 원인이었다 — 물체를 최종 위치에서 멀리 두면 모델이 순간이동을 택한다. 프레임을 다시 짜니 1회에 해결.',
  },
  {
    k: '연속 프레임 = 작은 변화',
    v: '앞 컷의 끝 = 뒤 컷의 첫으로 물리면 이음매가 안 보인다(13차 검증). 단 두 프레임의 차이가 클수록 왜곡이 커지므로, 한 번에 한 가지만 바꾸고 앵글이 바뀌면 하드컷으로 끊는다.',
  },
  {
    k: 'Element 재료는 개별 이미지',
    v: '3면이 한 장에 배치된 시트는 축소 시 각 면이 뭉개진다. 정면·측면·후면을 각각 따로 생성해 Element에 넣는다. 생성 호출의 image_reference도 각도 매칭 단일 프레임을 쓴다.',
  },
  {
    k: 'Element 설명문을 프롬프트에 복붙 금지',
    v: '9차에서 Element description을 프롬프트에 그대로 넣었다가 얼굴이 드리프트했다. Element 토큰이 형태를 잡고, 프롬프트엔 짧은 식별 문구만.',
  },
];

// 캐릭터 스타일 탐색 이력 (07-16)
const STYLE_TRIES = [
  { v: '1차', desc: '3D 실사 털 · 6~7등신 (주토피아풍)', verdict: '🔴 캐릭터성은 좋으나 등신·질감이 목표와 다름' },
  { v: '2차', desc: '완전 평면 2D 벡터 · 3등신', verdict: '🔴 너무 납작함 · 배에 "Fox" 텍스트 오염' },
  { v: '3차', desc: '★ 소프트 3D 벨벳/플록 · 3등신 (레퍼런스 확보)', verdict: '🟢 방향 확정 — 이 결로 3면 생성 중' },
];

// ★ 확정 캐릭터 3면 (2026-07-16) — 이게 기준. 실물 인형은 판독 근거였고 역할 종료
const CHAR_VIEWS = [
  ['정면', 'https://yogibo.kr/web/img/video/ca/fox.png'],
  ['측면', 'https://yogibo.openhost.cafe24.com/web/img/ai/fox/fox_side.png'],
  ['후면', 'https://yogibo.openhost.cafe24.com/web/img/ai/fox/fox_back.png'],
];

const ELEMENTS = [
  ['yogibo-fox-3view ⭐', 'b16db188-8273-4c0f-94da-cf65b9832919', '정면+측면+후면 3장 — 메인. 각도가 바뀌는 컷에 강함'],
  ['yogibo-fox-character', '796e5386-3839-4cae-9266-e1f1b697aaac', '정면 1장 — 백업'],
];

// 확정 캐릭터 디자인 락 (확정 캐릭터에서 판독)
const DESIGN_LOCK = [
  ['질감', '소프트 매트 벨벳/플록 — 잔털이 보이되 가닥이 아닌 보송함 (실사 털 ✕ / 평면 ✕)'],
  ['등신', '3등신 — 머리가 전체 높이의 1/3, 통통한 몸통, 짧고 굵은 팔다리'],
  ['바디', '따뜻한 버밀리언 오렌지'],
  ['배·주둥이', '크림 아이보리 (턱에서 앞면으로)'],
  ['볼', '부드러운 블러시'],
  ['손발', '초콜릿 브라운 (차콜 ✕ — 레퍼런스 판독으로 교정)'],
  ['귀', '뾰족한 삼각 · 겉 오렌지 / 안쪽 크림 / 끝 다크'],
  ['눈·입', '감은 초승달 눈 + 작은 미소 (뜬 눈 버전은 옵션)'],
  ['꼬리', '몸통만큼 굵고 풍성 · 크림 팁'],
];

export default function Storyboard14Page() {
  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">🦊 팍스 캐릭터 파일럿 — 캐릭터부터 영상까지 전 파이프라인 테스트</h1>
          <p className="page-desc">
            14차 · 요기보 메이트 <b>팍스</b>를 캐릭터화 → Element 락 → 장면별 컷 → 영상 조립까지 <b>1회 완주</b> ·
            이미지는 웹 UI <b>Unlimited(무료)</b>, 영상만 크레딧
          </p>
        </div>
      </div>

      {/* 게이트 */}
      <div className="note" style={{ marginBottom: 18, padding: 14 }}>
        <b style={{ fontSize: 13.5 }}>🚦 게이트 파이프라인</b>
        <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
          {GATES.map((g) => (
            <div key={g.stage} style={{ display: 'flex', gap: 10, fontSize: 12.5, alignItems: 'baseline' }}>
              <span style={{ flex: '0 0 160px', fontWeight: 700 }}>{g.stage}</span>
              <span style={{ flex: '0 0 100px' }}>{g.s}</span>
              <span style={{ color: 'var(--text-dim)' }}>{g.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 역할 분담 */}
      <div className="note" style={{ padding: 14, fontSize: 12.5, lineHeight: 1.8, marginBottom: 8, borderLeft: '3px solid #4CAF50' }}>
        <b style={{ color: '#4CAF50' }}>💰 비용 구조 (2026-07-16 확인)</b> — 힉스필드 <b>웹 UI의 Unlimited는 이미지 생성에 적용</b>(무료), <b>MCP 호출은 크레딧을 소모</b>(잔액이 실제로 차감됨을 확인). 따라서:<br />
        · <b>사용자</b>: 웹 UI에서 캐릭터·장면 스틸을 <b>무제한 무료로</b> 생성 → URL 전달<br />
        · <b>Claude</b>: URL 임포트(무료) · Element 락(무료) · 레지스트리 기록(무료) · <b>영상 생성만 크레딧</b> · ffmpeg 조립(무료)<br />
        · <b>탐색 단가</b>: Seedance mini 480p = <b>1cr/초</b>(12차 A/B 실측 — std 4.5cr/초의 1/4.5, 기능 제약 없음)
      </div>

      {/* 캐릭터 스타일 탐색 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>1. 캐릭터 스타일 탐색 (07-16)</h2>
      <div style={{ display: 'grid', gap: 6, marginBottom: 8 }}>
        {STYLE_TRIES.map((s) => (
          <div key={s.v} className="note" style={{ padding: 10, fontSize: 12.5, display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <b style={{ flex: '0 0 40px' }}>{s.v}</b>
            <span style={{ flex: '1 1 0', color: 'var(--text-dim)' }}>{s.desc}</span>
            <span style={{ flex: '0 0 280px', fontWeight: 700 }}>{s.verdict}</span>
          </div>
        ))}
      </div>

      {/* 디자인 락 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>2. 확정 디자인 락 — 팍스</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#4CAF50' }}>★ 확정 캐릭터 3면 — 이게 기준</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {CHAR_VIEWS.map(([lab, url]) => (
                <a key={lab} href={url} target="_blank" rel="noreferrer" style={{ textAlign: 'center' }}>
                  <img src={url} alt={lab}
                    style={{ width: 116, height: 155, objectFit: 'contain', background: '#fff', borderRadius: 8, border: '2px solid #4CAF50', display: 'block' }} />
                  <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{lab}</span>
                </a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 5, lineHeight: 1.5 }}>
              측면·후면은 사용자가 뽑은 2면 1장을 <b>로컬 분할 + 라벨 제거</b>해 개별화 (무료)
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8, paddingTop: 6, borderTop: '1px dashed var(--border)', lineHeight: 1.5 }}>
              <b>실물 인형 3면</b>(메이트 팍스 id 26eb9faa) — 색·형태를 <b>판독해 텍스트로 옮기는 근거</b>였고 <b>역할 종료</b>. 참조로 넣으면 솔기·인형성이 딸려오므로 캐릭터 작업에선 사용 금지.
            </div>
          </div>
          <div style={{ flex: '1 1 320px', display: 'grid', gap: 4 }}>
            {DESIGN_LOCK.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
                <b style={{ flex: '0 0 76px' }}>{k}</b>
                <span style={{ color: 'var(--text-dim)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Element */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>3. Element 락 ✅ 완료 (무료)</h2>
      <div className="note" style={{ padding: 14, marginBottom: 8, borderLeft: '3px solid #4CAF50' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          {ELEMENTS.map(([name, id, note]) => (
            <div key={id} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <b style={{ flex: '0 0 190px' }}>{name}</b>
              <code style={{ fontSize: 10.5, color: 'var(--accent)' }}>{id}</code>
              <span style={{ color: 'var(--text-dim)', flex: '1 1 200px' }}>{note}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.7 }}>
          웹 UI Elements 목록에서 <b>yogibo-fox-3view</b>를 고르면 됩니다 (같은 워크스페이스 확인 완료).<br />
          <b>description에 3종이 들어감</b> — IDENTITY(색·형태) · <b>SCALE</b>(90cm · 팟만 한 키 · 맥스에 전신으로 누울 수 있음 · 성인 허리 높이) · <b>PERSONALITY</b>(밝고 호기심 많고 덜렁댐 · 꼬리가 감정을 말한다: 기쁘면 흔들·놀라면 부풀·지치면 처짐).<br />
          <b>SCALE이 실전에서 검증됨</b> — 실내 씬 테스트에서 팍스가 선 사람의 무릎~허벅지 높이로 정확히 나옴.
        </div>
      </div>

      {/* 원칙 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>4. 이 프로젝트에 적용할 원칙 (07-16 실측으로 확립)</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 30 }}>
        {RULES.map((r) => (
          <div key={r.k} className="note" style={{ padding: 12, fontSize: 12.5, lineHeight: 1.7 }}>
            <b style={{ color: '#FF7043' }}>{r.k}</b>
            <div style={{ color: 'var(--text-dim)', marginTop: 3 }}>{r.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}
