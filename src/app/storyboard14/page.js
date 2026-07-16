'use client';

import { useState } from 'react';

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


// ★ 팍스 포즈 라이브러리 (2026-07-16) — 웹 UI Unlimited로 무료 생성 · Element yogibo-fox-3view 선택 후 사용
const FOX_EL = 'b16db188-8273-4c0f-94da-cf65b9832919';

const POSE_TAIL = `Full body, centred, plain soft off-white studio background, warm soft key light with a gentle rim, soft contact shadow. 9:16 vertical. Same character design, same colours, same proportions. No text, no lettering, no logos, no props.`;

const POSE_LIB = [
  { g: '안내 · 소개 (이벤트용)', items: [
    ['환영', '환영', 'standing with both arms open wide in a warm welcome, big happy smile, tail wagging up behind him'],
    ['오른쪽 가리키기', '오른쪽_가리키기', 'pointing to HIS RIGHT with one paw, head turned that way, cheerful "look at this!" expression, tail up'],
    ['왼쪽 가리키기', '왼쪽_가리키기', 'pointing to HIS LEFT with one paw, head turned that way, same cheerful energy'],
    ['위 가리키기', '위_가리키기', 'pointing UP with one paw, looking up brightly, mouth open in a small "oh!", tail up'],
    ['아래 가리키기', '아래_가리키기', 'pointing DOWN and slightly forward with one paw, leaning in, inviting expression'],
    ['엄지척 · 윙크', '엄지척_윙크', 'giving a big thumbs up with one paw, winking one eye, proud confident grin'],
    ['박수', '박수', 'clapping his paws together, delighted, eyes squeezed happy, tail wagging fast'],
    ['확성기 손 (알림)', '확성기', 'one paw cupped beside his mouth as if announcing something exciting, mouth open in a call, tail up straight'],
    ['하트 손', '하트', 'making a small heart shape with both paws in front of his chest, sweet warm smile, eyes soft'],
    ['오케이 사인', '오케이', 'making an OK sign with one paw, other paw on his hip, confident reassuring smile'],
  ]},
  { g: '감정 표현', items: [
    ['신남 (점프)', '신남', 'jumping up with both arms raised in joy, feet off the ground, huge open smile, tail flying'],
    ['놀람', '놀람', 'startled — eyes wide, mouth open in a gasp, leaning back, TAIL PUFFED UP and bushy'],
    ['졸림', '졸림', 'yawning with one paw over his mouth, eyes half closed and droopy, TAIL DROOPING down, sleepy'],
    ['궁금', '궁금', 'head tilted to one side, one paw touching his chin, curious raised brow, tail curled with a question-mark curve'],
    ['뿌듯', '뿌듯', 'chest puffed out proudly, paws on hips, chin up, satisfied grin, tail standing tall'],
    ['부끄러움', '부끄러움', 'shy — one paw scratching behind his head, other arm behind his back, cheeks flushed, bashful little smile'],
    ['생각', '생각', 'thinking — arms folded, one paw tapping his chin, eyes looking up in thought, tail slowly curling'],
    ['실망', '실망', 'disappointed — shoulders slumped, arms hanging, ears folded back, small frown, tail limp on the floor'],
  ]},
  { g: '동작', items: [
    ['손 흔들기', '손_흔들기', 'waving hello with one raised paw, warm smile, weight relaxed on one leg, tail swaying'],
    ['걷기', '걷기', 'mid-stride walking forward cheerfully, one foot lifted, arms swinging naturally, tail counterbalancing'],
    ['뛰기', '뛰기', 'running fast, both feet off the ground, arms pumping, excited determined face, tail streaming behind'],
    ['앉기', '앉기', 'sitting on the floor with legs stretched out in front, leaning back on both paws, relaxed content face, tail curled beside him'],
    ['밀기', '밀기', 'pushing something heavy with both paws, leaning into it, feet braced, effort on his face'],
    ['들기', '들기', 'carrying something with both arms wrapped around it, hugging it to his chest, cheerful determined face'],
  ]},
  { g: '프레이밍 (후편집 텍스트용)', items: [
    ['좌측 배치 · 우측 여백', '우측_여백', 'standing on the LEFT THIRD of the frame, turned slightly inward, pointing toward the empty space on the right with one paw, cheerful expression. The RIGHT TWO-THIRDS is clean empty background, completely clear, reserved for text. Do not put anything there'],
    ['상단 배치 · 하단 여백', '하단_여백', 'standing in the TOP HALF of the frame, waving with one paw, looking down and forward with a warm smile. The BOTTOM HALF is clean empty background, reserved for text'],
    ['얼굴 클로즈업', '얼굴_클로즈업', 'head and shoulders close-up, looking straight at camera with a bright warm smile, eyes sparkling, ears up'],
  ]},
];

// 제품 × 팍스 조합 — Element 토큰 2개 동시 사용
const COMBO = [
  ['맥스 네이비', '팍스_맥스_네이비', 'eeddd2d7-32c2-42b7-884e-724f44e3df8d', 'lounging happily on the deep navy Yogibo Max lying flat on the floor, sunk into it, tail draped over the side, blissful expression'],
  ['맥스 아쿠아', '팍스_맥스_아쿠아', 'c329fc5b-5283-4821-99e6-ddba2bd741c8', 'lying full-length on the aqua blue Yogibo Max, arms behind his head, one leg crossed, totally relaxed'],
  ['팟 올리브', '팍스_팟_올리브', '8f120498-f4b5-4c18-90d5-fe54a3d7a015', 'sinking deep into the olive green Yogibo Pod, hugged by it, only his head and tail poking out, eyes closed in bliss'],
  ['서포트 그린', '팍스_서포트_그린', 'fd32ee39-f00e-491c-857b-d132cbb87481', 'sitting inside the lime green U-shaped Yogibo Support, leaning back with both arms resting on the sides, relaxed happy face'],
  ['문필로우 올리브', '팍스_문필로우', '432687a2-bec1-487d-8482-5f522d250fa0', 'hugging the olive green crescent Yogibo Moon Pillow, cheek resting on it, sleepy content smile'],
  ['메이트 옐리', '팍스_옐리', 'cd0310ab-4858-4aff-b523-d1cfcca12dfe', 'hugging the Yogibo Mate elephant plush cheek to cheek, both happy, tail wagging'],
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


// 포즈 카드 — 완성 프롬프트 + 클립보드 복사
const CA_BASE = 'https://yogibo.kr/web/img/video/ca';
const caUrl = (name) => `${CA_BASE}/${encodeURIComponent(name)}.png`;

function CopyBlock({ label, text, accent = '#FF7043', file }) {
  const [copied, setCopied] = useState(false);
  const [hasImg, setHasImg] = useState(true);
  async function copy() {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`, borderRadius: 8, padding: 9, background: 'var(--bg-elev)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        {file && hasImg && (
          <a href={caUrl(file)} target="_blank" rel="noreferrer" style={{ flex: '0 0 auto' }}>
            <img src={caUrl(file)} alt={label} onError={() => setHasImg(false)}
              style={{ width: 44, height: 58, objectFit: 'cover', borderRadius: 5, border: `1px solid ${accent}`, display: 'block', background: '#fff' }} />
          </a>
        )}
        <span style={{ flex: 1 }}>
          <b style={{ fontSize: 12.5, display: 'block' }}>{label}</b>
          {file && <code style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>{file}.png</code>}
        </span>
        <button onClick={copy}
          style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${copied ? '#4CAF50' : 'var(--border)'}`, background: copied ? '#4CAF50' : 'none', color: copied ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontSize: 11, fontWeight: 700, flex: '0 0 auto' }}>
          {copied ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>
      <pre style={{ margin: 0, fontSize: 10, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--text-dim)', maxHeight: 110, overflow: 'auto' }}>{text}</pre>
    </div>
  );
}

function foxPrompt(pose) {
  return `The fox character in the reference image, ${pose}.

Same character, same design, same colours, same proportions — only the POSE changes.

${POSE_TAIL}`;
}

function comboPrompt(prodId, desc) {
  return `<<<${FOX_EL}>>> the fox character ${desc}, with <<<${prodId}>>>.

Same character, same design, same colours, same proportions as the reference. The Yogibo product must match its reference exactly in shape and colour.

Cosy modern living room, warm afternoon light, shallow depth of field, soft cinematic look. 9:16 vertical. No text, no lettering, no logos.`;
}

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
      {/* ★ 포즈 라이브러리 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ 팍스 포즈 라이브러리 — 붙여넣기용 완성 프롬프트 (무료 생성)</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.7, marginBottom: 10, borderLeft: '3px solid #FF7043' }}>
        <b>쓰는 법</b>: 웹 UI에 <b>정면 팍스 이미지를 첨부</b>(또는 Elements에서 <code>yogibo-fox-3view</code> 선택) → 아래에서 원하는 포즈의 <b>📋 복사</b> → 붙여넣기 → 생성. <b>전부 무료</b>.<br />
        <b>2문단이 핵심</b>: <i>&quot;only the POSE changes&quot;</i> — 이게 없으면 레퍼런스를 그대로 복사해 포즈가 안 바뀝니다.<br />
        <b>추후 용도</b>: 요기보 이벤트 소개 시 팍스를 주인공으로 — 안내 포즈 + 텍스트 여백 구도는 후편집으로 문구만 갈아끼워 재사용.
      </div>
      {POSE_LIB.map((grp) => (
        <div key={grp.g} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, margin: '10px 0 6px', color: '#FF7043' }}>{grp.g} <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 11.5 }}>· {grp.items.length}종</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8 }}>
            {grp.items.map(([label, file, pose]) => (
              <CopyBlock key={label} label={label} file={file} text={foxPrompt(pose)} />
            ))}
          </div>
        </div>
      ))}

      {/* 제품 조합 */}
      <h2 style={{ fontSize: 16, margin: '22px 0 10px' }}>★ 제품 × 팍스 조합 — Element 토큰 2개 동시 (이벤트 소개용)</h2>
      <div className="note" style={{ padding: 12, fontSize: 12, lineHeight: 1.7, marginBottom: 10, borderLeft: '3px solid #4CAF50' }}>
        제품 Element가 이미 락돼 있어 <b>토큰 두 개를 한 프롬프트에</b> 넣으면 캐릭터 정확도 + 제품 정확도가 동시에 잡힙니다. 이벤트 소개는 <b>소개할 제품이 정확해야</b> 하므로 이 방식이 핵심.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8, marginBottom: 14 }}>
        {COMBO.map(([label, file, pid, desc]) => (
          <CopyBlock key={label} label={`팍스 × ${label}`} file={file} text={comboPrompt(pid, desc)} accent="#4CAF50" />
        ))}
      </div>

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
