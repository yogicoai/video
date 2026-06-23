export const metadata = { title: '가이드 — VideoGen Studio' };

export default function GuidePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">사용 가이드</h1>
          <p className="page-desc">
            이 프로그램은 <strong>제품 이미지와 스토리보드를 넣으면 → AI가 영상 제작용 프롬프트를 만들고 → 실제 영상까지</strong> 뽑아주는 도구예요.
          </p>
        </div>
      </div>

      {/* 전체 흐름 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>한눈에 보는 전체 흐름</h2>
      <div className="flow">
        <span className="flow-step">① 브랜드 설정</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">② 프로젝트 생성</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">③ 이미지 업로드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">④ 스토리보드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">⑤ AI 프롬프트 생성</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">⑥ 승인</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">⑦ 영상 렌더</span>
      </div>

      <div className="note" style={{ marginBottom: 28 }}>
        💡 <strong>핵심 개념</strong> — ①~⑥(프롬프트 만들기·검수)까지는 <strong>거의 무료</strong>예요(AI 글쓰기 비용만).
        실제 돈이 드는 건 <strong>⑦ 영상 렌더(Veo 3.1, 유료)</strong> 뿐입니다. 그래서 <strong>승인한 샷만</strong> 렌더하도록 막아뒀어요.
      </div>

      {/* 단계별 */}
      <h2 className="section-title" style={{ marginBottom: 12 }}>단계별 사용법</h2>

      <div className="step">
        <div className="step-num">1</div>
        <div>
          <span className="where">상단 메뉴 · 브랜드</span>
          <h3>브랜드 프로필을 먼저 확정</h3>
          <p>
            요기보의 톤·분위기·피해야 할 연출을 한 번 적어 저장합니다. 여기 적은 내용이 <strong>모든 영상 프롬프트에 자동으로 반영</strong>돼요.
            (요기보 초안이 미리 채워져 있으니 확인·수정 후 <strong>저장</strong>만 누르면 됩니다.)
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">2</div>
        <div>
          <span className="where">상단 메뉴 · 프로젝트 → + 새 프로젝트</span>
          <h3>캠페인(프로젝트) 만들기</h3>
          <p>
            영상 한 편 = 프로젝트 하나예요. 제목·시나리오(상황)·톤·타깃·목표 길이(예 30초)·화면 비율(쇼츠는 9:16)을 입력합니다.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">3</div>
        <div>
          <span className="where">프로젝트 카드 클릭 → 제품 이미지</span>
          <h3>제품 이미지 업로드</h3>
          <p>
            영상에 쓸 제품·연출 사진을 드래그&드롭으로 올립니다. 이 이미지가 <strong>영상의 시작 장면</strong>이 됩니다 (image-to-video).
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">4</div>
        <div>
          <span className="where">프로젝트 상세 · 스토리보드</span>
          <h3>스토리보드(컷별 장면) 작성</h3>
          <p>
            컷별로 "어떤 장면인지" 한 줄씩 적고, 각 컷에 위에서 올린 <strong>이미지를 연결</strong>합니다. 순서도 바꿀 수 있어요.
            작성 후 <strong>스토리보드 저장</strong>. (비워두면 AI가 시나리오만 보고 알아서 구성합니다.)
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">5</div>
        <div>
          <span className="where">프로젝트 상세 · 샷 보드 · ✨ AI 프롬프트 생성</span>
          <h3>AI 프롬프트 생성</h3>
          <p>
            버튼 한 번이면 Claude가 <strong>브랜드 + 시나리오 + 이미지 + 스토리보드</strong>를 종합해 샷별 Veo 3 프롬프트(영어)를 만들어줍니다.
            각 프롬프트는 직접 <strong>편집</strong>하거나 <strong>복사</strong>해서 다른 영상툴(클링 등)에 붙여 쓸 수도 있어요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">6</div>
        <div>
          <span className="where">각 샷 카드 · ✓ 승인</span>
          <h3>쓸 샷만 승인</h3>
          <p>
            마음에 드는 샷에 <strong>✓ 승인</strong>을 누릅니다. <strong>승인한 샷만 영상으로 렌더</strong>할 수 있어요 — 돈이 새는 걸 막는 안전장치입니다.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">7</div>
        <div>
          <span className="where">승인된 샷 카드 · 🎬 렌더</span>
          <h3>실제 영상 렌더 (유료)</h3>
          <p>
            🎬 렌더 버튼 → <strong>예상 비용 확인창</strong>이 뜨고, 확인을 누르면 Veo 3.1이 1~3분 안에 영상을 만들어 카드 안에 보여줍니다. 다운로드도 가능.
            기본은 <strong>최소 비용(약 $0.40, 4초)</strong>으로 설정돼 있어요.
          </p>
        </div>
      </div>

      {/* 비용 */}
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>비용은 얼마나?</h2>
      <div className="note" style={{ marginBottom: 28 }}>
        영상 렌더만 유료예요 (Veo 3.1, 초당 과금 · 최소 4초 · 오디오 포함).<br />
        • <strong>최소 설정(Fast·720p·4초) ≈ $0.40(약 550원)/개</strong> → $10이면 약 25번 테스트<br />
        • 더 저렴(Lite ≈ $0.20/개)·더 길게(6·8초)도 설정 가능<br />
        프롬프트 만들기·검수는 거의 무료이니, <strong>충분히 다듬은 다음 승인 샷만 렌더</strong>하는 게 비용 절약의 핵심입니다.
      </div>

      {/* 용어집 */}
      <h2 className="section-title" style={{ marginBottom: 12 }}>용어 정리</h2>
      <div className="glossary">
        <div className="term"><b>프로젝트</b><span>영상 한 편 단위. 캠페인 하나 = 프로젝트 하나.</span></div>
        <div className="term"><b>브랜드 프로필</b><span>모든 프롬프트에 자동 반영되는 요기보 톤·규칙. 한 번만 설정.</span></div>
        <div className="term"><b>스토리보드</b><span>컷별 장면 설명. 사람이 작성하는 영상의 뼈대.</span></div>
        <div className="term"><b>샷(Shot)</b><span>AI가 스토리보드를 쪼갠 영상 한 토막(보통 4~8초).</span></div>
        <div className="term"><b>Veo 프롬프트</b><span>영상 엔진이 알아듣는 영어 지시문. 카메라·조명·동작 포함.</span></div>
        <div className="term"><b>image-to-video</b><span>제품 이미지를 출발점으로 영상을 만드는 방식.</span></div>
        <div className="term"><b>렌더(Render)</b><span>프롬프트를 실제 영상 파일로 뽑는 단계. 유료.</span></div>
        <div className="term"><b>Veo 3.1</b><span>Google의 영상 생성 AI. 우리 앱이 API로 자동 호출.</span></div>
      </div>

      <div className="note" style={{ marginTop: 28, textAlign: 'center' }}>
        준비됐다면 <a href="/" style={{ color: 'var(--accent)' }}>프로젝트로 가서</a> ②번부터 시작해보세요 🎬
      </div>
    </>
  );
}
