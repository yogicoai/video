export const metadata = { title: '사용설명서 — VideoGen Studio' };

export default function GuidePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">사용설명서</h1>
          <p className="page-desc">
            <strong>이 앱에서 영상 프롬프트를 만들고 → Higgsfield 웹에서 영상을 제작</strong>하는 전체 방법이에요. 영상이 처음이어도 따라할 수 있게 정리했어요.
          </p>
        </div>
      </div>

      {/* 전체 흐름 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>한눈에 보는 흐름</h2>
      <div className="flow">
        <span className="flow-step">💡 아이디어</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">📁 프로젝트</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">🖼 이미지·스토리보드</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">✨ AI 프롬프트 생성</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">🎬 Higgsfield에서 영상</span>
      </div>

      <div className="note" style={{ marginBottom: 28 }}>
        💡 <strong>핵심</strong> — 이 앱은 <strong>"무엇을·어떻게 찍을지(아이디어 + 프롬프트)"</strong>를 만들어줘요. <strong>실제 영상은 Higgsfield 웹앱</strong>에서 만듭니다(이미 결제한 Ultra 크레딧 사용). 두 가지를 오가며 작업해요.
      </div>

      {/* PART A */}
      <h2 className="section-title" style={{ marginBottom: 12 }}>PART A. 이 앱에서 — 프롬프트 만들기</h2>

      <div className="step">
        <div className="step-num">1</div>
        <div>
          <span className="where">상단 메뉴 · 아이디어 (선택)</span>
          <h3>뭘 찍을지 모르겠다면 → 아이디어 받기</h3>
          <p>
            <strong>아이디어</strong> 메뉴에서 시즌·분위기를 넣고 <strong>✨ 아이디어 생성</strong>을 누르면, 트렌드+요기보 브랜드에 맞는 쇼츠 아이디어가 나와요.
            마음에 드는 카드의 <strong>"이 아이디어로 프로젝트 만들기"</strong>를 누르면 ②번이 자동으로 됩니다.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">2</div>
        <div>
          <span className="where">상단 메뉴 · 프로젝트 → + 새 프로젝트</span>
          <h3>프로젝트(영상 한 편) 만들기</h3>
          <p>제목·시나리오·길이·화면 비율(쇼츠는 <strong>9:16</strong>)을 입력합니다. 아이디어에서 만들었다면 이미 채워져 있어요.</p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">3</div>
        <div>
          <span className="where">프로젝트 카드 클릭 → 상세</span>
          <h3>제품 이미지 올리고, 스토리보드 적기</h3>
          <p>
            영상에 쓸 <strong>제품 사진</strong>을 올리고(드래그&드롭), 컷별 장면을 적은 뒤 각 컷에 이미지를 연결합니다. 비워두면 AI가 알아서 구성해요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">4</div>
        <div>
          <span className="where">샷 보드 · ✨ AI 프롬프트 생성</span>
          <h3>AI가 샷별 프롬프트 + 추천 모션 생성</h3>
          <p>
            버튼 한 번이면 샷마다 <strong>① 장면 프롬프트(영어)</strong> + <strong>② 추천 모션</strong>(예: 360 Orbit)이 만들어져요.
            이 두 가지를 Higgsfield에 넣을 거예요. (프롬프트엔 카메라 묘사가 없어요 — 카메라는 "모션"이 담당하니까요.)
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">5</div>
        <div>
          <span className="where">각 샷 카드</span>
          <h3>재료 챙기기 — 3가지</h3>
          <p>
            각 샷에서 Higgsfield로 가져갈 3가지: <strong>① 🖼 이미지(열기/저장)</strong> · <strong>② 🎬 장면 프롬프트(복사)</strong> · <strong>③ 🎥 추천 모션 이름</strong>.
          </p>
        </div>
      </div>

      {/* PART B */}
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>PART B. Higgsfield 웹에서 — 영상 만들기</h2>

      <div className="note" style={{ marginBottom: 16 }}>
        🌐 <strong>higgsfield.ai</strong> 에 로그인하세요 (요기보 님 Ultra 구독 계정). 영상은 여기서 <strong>이미 낸 크레딧</strong>으로 만듭니다 — 추가 결제 없음.
      </div>

      <div className="step">
        <div className="step-num">1</div>
        <div>
          <h3>Image to Video (DoP) 도구 열기</h3>
          <p>Higgsfield 메뉴에서 <strong>이미지 → 영상(Image to Video / DoP)</strong> 모드를 선택합니다. (텍스트→영상이 아니라 <strong>이미지→영상</strong>이어야 우리 제품 사진이 들어가요.)</p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">2</div>
        <div>
          <h3>시작 이미지 업로드</h3>
          <p>앱에서 저장한 <strong>제품 이미지</strong>를 업로드합니다. 이 사진이 영상의 출발점이 돼요.</p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">3</div>
        <div>
          <h3>장면 프롬프트 붙여넣기</h3>
          <p>프롬프트 입력칸에 앱에서 <strong>복사한 장면 프롬프트(영어)</strong>를 그대로 붙여넣습니다.</p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">4</div>
        <div>
          <h3>모션(Motion) 선택</h3>
          <p>
            모션 목록에서 앱이 <strong>추천한 모션</strong>(예: 360 Orbit, Zoom In)을 찾아 선택합니다. 이게 <strong>카메라 움직임</strong>이에요 — 역동성은 여기서 결정돼요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">5</div>
        <div>
          <h3>설정 확인 후 생성</h3>
          <p>
            화면 비율(쇼츠면 <strong>9:16</strong>) 확인 → <strong>생성(Generate)</strong>. 1~3분 뒤 영상이 나오면 <strong>다운로드</strong>하세요. 생성 버튼 옆 <strong>크레딧 수</strong>를 미리 확인하면 비용을 알 수 있어요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">6</div>
        <div>
          <h3>샷마다 반복 → 편집툴에서 이어붙이기</h3>
          <p>
            샷(클립)별로 ①~⑤를 반복해 여러 클립을 만든 뒤, <strong>캡컷(CapCut)</strong> 같은 편집툴에서 순서대로 이어붙이고 음악·자막을 더하면 한 편이 완성돼요.
          </p>
        </div>
      </div>

      {/* 비용 */}
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>비용 — 어디에 돈이 드나</h2>
      <div className="note" style={{ marginBottom: 28 }}>
        • <strong>아이디어·프롬프트 생성</strong> = Claude(앱) — 아주 저렴 (1회 수백 원).<br />
        • <strong>영상 생성</strong> = Higgsfield 웹 — <strong>이미 낸 Ultra 구독 크레딧</strong> 사용(추가 0원). 생성 화면의 크레딧 표시로 확인.<br />
        ⚠️ <strong>Claude 충전과 Higgsfield 크레딧은 완전 별개</strong>예요 — 서로 호환되지 않습니다 (다른 회사·다른 계정).
      </div>

      {/* 용어 */}
      <h2 className="section-title" style={{ marginBottom: 12 }}>용어 정리</h2>
      <div className="glossary">
        <div className="term"><b>아이디어</b><span>트렌드 기반 쇼츠 소재 제안. 원클릭으로 프로젝트화.</span></div>
        <div className="term"><b>프로젝트</b><span>영상 한 편 단위(캠페인).</span></div>
        <div className="term"><b>스토리보드</b><span>컷별 장면 설명. 영상의 뼈대.</span></div>
        <div className="term"><b>샷(Shot)</b><span>영상 한 토막(클립). 보통 6~10초.</span></div>
        <div className="term"><b>장면 프롬프트</b><span>Higgsfield에 넣을 영어 장면 설명(카메라 묘사 없음).</span></div>
        <div className="term"><b>모션(Motion)</b><span>Higgsfield의 카메라 움직임 프리셋(360 Orbit 등). 역동성 담당.</span></div>
        <div className="term"><b>image-to-video</b><span>제품 사진을 출발점으로 영상을 만드는 방식.</span></div>
        <div className="term"><b>Higgsfield</b><span>실제 영상을 만드는 웹앱. Ultra 구독 크레딧 사용.</span></div>
      </div>

      <div className="note" style={{ marginTop: 28, textAlign: 'center' }}>
        준비됐다면 <a href="/ideas" style={{ color: 'var(--accent)' }}>아이디어</a>에서 소재를 받거나, <a href="/" style={{ color: 'var(--accent)' }}>프로젝트</a>부터 시작해보세요 🎬
      </div>
    </>
  );
}
