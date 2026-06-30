export const metadata = { title: 'CF 제작 프로세스 — 클로드 × 힉스필드 메이킹' };

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
const UP = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FWrSdFH0VITbqcbxBmMqiSOYx0';
const SHEET = 'https://yogibo.openhost.cafe24.com/web/img/ai/storyboard/storyboard_final8.png';

// 실제 제작 과정에서 힉스필드로 생성했던 이미지들
const MODELS = [
  { k: 'A (선택)', img: `${CDN}/hf_20260629_034659_f80d6ea9-143a-41ff-953e-c48e99e58d4c.png`, note: '긴 머리 · 부드러운 인상 — 최종 채택' },
  { k: 'B', img: `${CDN}/hf_20260629_034659_f8cf2884-aec2-4162-afe7-74d3042637eb.png`, note: '상큼 · 밝은 미소' },
  { k: 'C', img: `${CDN}/hf_20260629_034700_78b17fa7-2697-4aac-a0b0-850728f4258a.png`, note: '또렷 · 자신감' },
];

const STILLS = [
  { t: 'CUT1 깨어남', img: `${CDN}/hf_20260630_031345_1531ca85-2c8f-4d39-9e85-b33b4a8eef21.png` },
  { t: 'CUT2 폰 확인', img: `${CDN}/hf_20260630_061834_ab8bc77f-f543-445a-8a89-0097b38e36c4.png` },
  { t: 'CUT3 갈아입기', img: `${CDN}/hf_20260630_060651_3429cfa6-8007-40a3-afd0-bdd6cd0c0af0.png` },
  { t: 'CUT6 회의', img: `${CDN}/hf_20260630_060653_042b70e6-13ea-4048-acc2-c8778a90c6bc.png` },
  { t: 'CUT7 지친 표정', img: `${CDN}/hf_20260630_052118_3980475c-d961-463f-89c1-dc608911595a.png` },
  { t: 'CUT8 다이브', img: `${CDN}/hf_20260630_012719_2bebe909-fc52-4c1e-a299-1ba4bfe2fd7c.png` },
  { t: 'CUT9 잠든 얼굴', img: `${CDN}/hf_20260630_010145_fb681a9b-cb05-44f6-bd0f-a03d277ebe85.png` },
  { t: 'CUT10 로고 엔딩', img: '/endcard_poster.png' },
];

const card = { borderRadius: 10, border: '1px solid var(--border)', display: 'block', width: '100%' };
const port = { ...card, aspectRatio: '9 / 16', objectFit: 'cover' };

export default function GuidePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">요기보 CF 메이킹 — 클로드 × 힉스필드</h1>
          <p className="page-desc">
            영상을 한 번도 안 만들어 봤어도 괜찮아요. <strong>클로드(Claude·AI 대화)에 힉스필드(Higgsfield·이미지/영상 생성 AI)를 MCP로 연결</strong>해서,
            <strong>말로 시키면서</strong> 요기보 20초 단편 CF를 만든 전 과정을 그대로 정리했습니다.
          </p>
        </div>
      </div>

      {/* 도구 소개 */}
      <div className="note" style={{ marginBottom: 18 }}>
        🧩 <strong>이게 뭐냐면</strong> — <b>MCP</b>는 "클로드가 다른 프로그램을 직접 쓰게 해주는 연결선"이에요. 우리는 클로드에 <b>힉스필드</b>를 연결해서,
        클로드에게 <i>"이런 장면 이미지 만들어줘 → 영상으로 움직여줘"</i>라고 말하면 클로드가 힉스필드를 대신 조작해 결과를 가져왔습니다.
        편집(자르기·붙이기·색보정·자막)은 클로드가 <b>ffmpeg</b>라는 영상 도구로 처리했고요.
      </div>
      <div className="flow" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
        <span className="flow-step">🗣 클로드에 말하기</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">🤖 힉스필드가 이미지·영상 생성 (MCP)</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">✂️ 클로드가 편집·색보정·자막</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">🎬 러프컷 완성</span>
      </div>

      {/* 사용한 스킬·도구 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>이번 제작에 사용한 스킬·도구</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>클로드에 연결한 스킬·도구를 조합해서 진행했어요. 핵심은 <strong>힉스필드 MCP 연결</strong>입니다.</p>
      <div className="glossary" style={{ marginBottom: 14 }}>
        <div className="term"><b>🤖 Claude (클로드)</b><span>전 과정 지휘 — 기획·프롬프트 작성·지시·편집 자동화. 말로 시키면 도구를 대신 조작.</span></div>
        <div className="term"><b>🔌 Higgsfield MCP</b><span>클로드에 연결한 생성 엔진. <code>generate_image</code>(nano_banana·스틸) · <code>generate_video</code>(kling 3.0·영상) · <b>Element</b>(얼굴 토큰) · media_import/job_status/balance.</span></div>
        <div className="term"><b>🎞 ffmpeg</b><span>컷 트림·이어붙이기(concat)·리프레임(crop)·색보정 재인코딩·디졸브·로고/자막 합성.</span></div>
        <div className="term"><b>🐍 Python (OpenCV·Pillow)</b><span>LAB 색통계로 컬러 매칭, 자막·엔딩 카드·스토리보드 시트 렌더링.</span></div>
        <div className="term"><b>🧠 cf-video-production 스킬</b><span>이 전체 절차를 재사용 스킬로 정리 — 다음엔 "이 영상처럼 만들어줘" 한마디로 같은 방식 제작.</span></div>
      </div>
      <div className="note" style={{ marginBottom: 24 }}>
        🔗 <strong>MCP 연결</strong>이 핵심 — 힉스필드를 클로드에 물려서, 채팅만으로 이미지·영상 생성을 시키고 결과를 바로 편집까지 했습니다.
        <br /><span style={{ opacity: 0.7 }}>(이 작업엔 안 썼지만, 환경엔 Figma·Canva 등 다른 스킬도 같은 방식으로 붙여 쓸 수 있어요.)</span>
      </div>

      {/* STEP 1 — 모델 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 1 · 주인공(모델) 정하기</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>
        광고는 <strong>모든 컷에 같은 사람</strong>이 나와야 한 편으로 보여요. 그래서 먼저 힉스필드로 모델 후보 3명을 만들고 <b>A</b>를 골랐습니다.
        고른 얼굴은 <strong>"캐릭터 토큰(Element)"</strong>으로 저장해서, 이후 모든 장면 생성에 그 토큰을 넣어 <strong>얼굴이 안 바뀌게</strong> 고정했어요.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 8 }}>
        {MODELS.map((m) => (
          <div key={m.k}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.k} style={{ ...card, aspectRatio: '1 / 1', objectFit: 'cover', borderColor: m.k.includes('선택') ? 'var(--accent)' : 'var(--border)' }} />
            <div className="card-meta" style={{ fontSize: 12, marginTop: 6 }}><b>{m.k}</b> · {m.note}</div>
          </div>
        ))}
      </div>
      <div className="note" style={{ marginBottom: 14 }}>👤 <strong>왜 토큰으로 고정?</strong> 안 그러면 컷마다 얼굴이 미묘하게 달라져요. 토큰을 넣으면 "같은 배우"가 계속 출연합니다.</div>

      {/* Element 캐릭터 토큰 시각 콜아웃 */}
      <div className="note" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MODELS[0].img} alt="element" style={{ width: 110, aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 10, border: '2px solid var(--accent)', flexShrink: 0 }} />
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>🔒 캐릭터 토큰 (힉스필드 Element) — <code>yogibo-model-a</code></div>
          <div className="card-meta" style={{ fontSize: 13, lineHeight: 1.7 }}>
            힉스필드의 <b>Element</b> 기능으로 이 얼굴을 "토큰"으로 저장했어요. 이후 모든 장면을 만들 때 프롬프트에 토큰(<code>{'<<<...>>>'}</code>)을 넣으면
            힉스필드가 <strong>매번 같은 얼굴</strong>로 생성합니다. 아래 STEP 3의 컷들이 전부 이 한 사람으로 나온 이유예요.
          </div>
        </div>
      </div>

      {/* STEP 2 — 레퍼런스 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 2 · 레퍼런스 영상 분석</h2>
      <p className="card-meta" style={{ marginBottom: 14 }}>
        따라 만들 기준 영상(<code>video.mp4</code>)을 <strong>0.25~0.5초 간격으로 잘라서</strong> 봤어요. 컷이 몇 개인지, 각 컷 길이·카메라 구도·색감·전환을 분석해
        <strong>컷 리스트(스토리보드)</strong>를 짰습니다. 스토리는 "지친 직장인의 하루 → 집에서 요기보로 휴식"으로 잡았어요.
      </p>

      {/* STEP 3 — 컷 만들기 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 3 · 컷별로 만들기 — "스틸 먼저, 영상은 나중"</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>
        영상 생성은 비싸서(크레딧), <strong>① 먼저 정지 이미지(스틸)</strong>를 만들어 구도·인물·옷을 확인하고 → <strong>② OK면 그 이미지를 움직이는 영상으로</strong> 바꿨어요.
        스틸을 만들 땐 <strong>레퍼런스 장면을 편집 + 캐릭터 토큰</strong>을 같이 넣어, 얼굴·톤은 유지하고 필요한 것만 바꿨습니다. 아래가 실제로 만든 컷 스틸들이에요.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
        {STILLS.map((s) => (
          <div key={s.t}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.t} style={port} />
            <div className="card-meta" style={{ fontSize: 11, marginTop: 5, textAlign: 'center' }}>{s.t}</div>
          </div>
        ))}
      </div>
      <div className="note" style={{ marginBottom: 24 }}>
        🎬 각 스틸을 힉스필드 <b>kling 3.0</b>으로 <strong>9:16 · 무음 · 약 3초</strong> 영상으로 움직였어요. (예: "폰 보다 흠칫 놀라게", "빈백에 풀썩 다이브하게")
      </div>

      {/* STEP 4 — 수정 사례 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 4 · 마음에 안 들면 "그 부분만" 다시</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>
        초보자가 가장 궁금한 부분이에요 — <strong>틀린 데만 콕 집어 다시 시킬 수 있어요.</strong> 예를 들어 CUT2는 다리가 어색하게 올라가 있었는데,
        "<i>구도·얼굴·옷은 그대로 두고 다리만 자연스럽게</i>"라고 시켜서 고쳤습니다. (아래 전 / 후)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 10, maxWidth: 520 }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${CDN}/hf_20260630_035327_5770dbda-29f4-47ff-bf89-e5dcbd79d30f.png`} alt="before" style={port} />
          <div className="card-meta" style={{ fontSize: 12, marginTop: 6, textAlign: 'center' }}>❌ 전 — 다리 자세 어색</div>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${CDN}/hf_20260630_061834_ab8bc77f-f543-445a-8a89-0097b38e36c4.png`} alt="after" style={{ ...port, borderColor: 'var(--accent)' }} />
          <div className="card-meta" style={{ fontSize: 12, marginTop: 6, textAlign: 'center' }}>✅ 후 — 다리만 교정 (나머지 동일)</div>
        </div>
      </div>
      <p className="card-meta" style={{ marginBottom: 8 }}>
        반대로 <strong>해봤다가 뺀 것</strong>도 있어요. 회사 장면을 "서류 들고 복도를 뛰는 동적 컷"으로 바꿔봤는데, <strong>종이가 날리는 게 너무 AI 같아서</strong> 기존 데스크 컷으로 되돌렸습니다. (시행착오도 과정의 일부)
      </p>
      <div style={{ maxWidth: 180, marginBottom: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${CDN}/hf_20260630_062908_4174bae8-d944-472d-bc6e-ba4b3d115f73.png`} alt="rejected" style={{ ...port, opacity: 0.7 }} />
        <div className="card-meta" style={{ fontSize: 11, marginTop: 5, textAlign: 'center' }}>🗑 채택 안 함 (종이 날림 = AI 티)</div>
      </div>

      {/* STEP 5 — 컬러/편집/로고/자막 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 5 · 한 편으로 다듬기 — 색·편집·로고·자막</h2>
      <div className="glossary" style={{ marginBottom: 16 }}>
        <div className="term"><b>🎨 컬러 통일</b><span>컷마다 밝기·색이 달라 튀어요. 전 컷을 한 톤(레퍼런스 영상의 색감)으로 맞춰 한 편처럼 묶었습니다.</span></div>
        <div className="term"><b>✂️ 러프컷 편집</b><span>각 컷을 잘라 레퍼런스 리듬으로 이어붙이고, 같은 공간 반복을 피해 이동→회의→지침으로 변화를 줬어요.</span></div>
        <div className="term"><b>🔖 로고</b><span>첫 컷에 로고를 띄웠다 사라지게(인트로), 마지막엔 흰 배경에 yogibo 로고를 천천히 띄웠습니다(엔딩).</span></div>
        <div className="term"><b>🔁 전환</b><span>다이브 끝에서 얼굴로 줌인 → 잠든 얼굴로 디졸브 해서 "풀썩 안기며 잠든다"가 한 동작처럼 이어지게.</span></div>
        <div className="term"><b>💬 자막</b><span>CF는 자막을 최소화 — 출근은 키워드 강조, 마무리는 미니멀 한 줄. 무자막 A / 자막 B 버전으로 비교.</span></div>
        <div className="term"><b>🎵 음악</b><span>러프컷을 무음으로 먼저 확정하고, 음악은 가장 마지막(최종 컴펌 후)에 얹어요.</span></div>
      </div>

      {/* 스토리보드 시트 */}
      <h2 className="section-title" style={{ marginBottom: 6 }}>STEP 6 · 컷분할 스토리보드 시트</h2>
      <p className="card-meta" style={{ marginBottom: 12 }}>전체 10컷을 한 장으로 정리한 기획 시트 — 각 컷의 시작/끝 프레임·카메라·연출·대사까지 한눈에.</p>
      <a href={SHEET} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHEET} alt="스토리보드 시트" style={{ ...card, marginBottom: 24 }} />
      </a>

      {/* 마무리 */}
      <div className="note" style={{ textAlign: 'center', marginBottom: 8 }}>
        ✅ 이 모든 과정은 <strong>클로드에 말로 지시 → 힉스필드(MCP)가 생성 → 클로드가 편집</strong>으로 진행됐어요.
        다음에도 클로드에게 <code>cf-video-production</code> 방식으로 "이 영상처럼 만들어줘"라고 하면 같은 절차로 제작합니다.
      </div>
      <div className="note" style={{ textAlign: 'center' }}>
        완성 결과물(컷별 영상·러프컷 A/B)은 <a href="/storyboard" style={{ color: 'var(--accent)' }}>요기보 단편 CF 스토리보드</a>에서 확인하세요 🎬
      </div>
    </>
  );
}
