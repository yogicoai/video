export const metadata = { title: 'Higgsfield 사용설명 — VideoGen Studio' };

export default function HiggsfieldGuidePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Higgsfield 사용설명</h1>
          <p className="page-desc">
            이 앱에서 만든 <strong>장면 프롬프트 + 추천 모션 + 이미지</strong>를 Higgsfield 웹에 넣어 실제 영상을 만드는 방법이에요. (이미 결제한 Ultra 구독 크레딧 사용 — 추가 비용 없음)
          </p>
        </div>
      </div>

      <div className="note" style={{ marginBottom: 24 }}>
        🌐 <strong>higgsfield.ai</strong> 로그인 → 영상 제작. 영상은 여기서, 프롬프트·아이디어는 이 앱에서. 두 화면을 오가며 작업해요.
      </div>

      {/* 준비물 */}
      <h2 className="section-title" style={{ marginBottom: 10 }}>시작 전 — 앱에서 챙길 3가지</h2>
      <div className="flow" style={{ marginBottom: 24 }}>
        <span className="flow-step">🖼 이미지 (열기/저장)</span>
        <span className="flow-arrow">+</span>
        <span className="flow-step">🎬 장면 프롬프트 (복사)</span>
        <span className="flow-arrow">+</span>
        <span className="flow-step">🎥 추천 모션 이름</span>
      </div>

      {/* 단계 */}
      <h2 className="section-title" style={{ marginBottom: 12 }}>단계별 사용법</h2>

      <div className="step">
        <div className="step-num">1</div>
        <div>
          <h3>로그인 & 이미지→영상 도구 열기</h3>
          <p>
            higgsfield.ai 로그인 후, <strong>Image to Video(이미지→영상) / DoP</strong> 도구를 선택합니다.
            ⚠️ <strong>텍스트→영상</strong>이 아니라 <strong>이미지→영상</strong>이어야 우리 제품 사진이 출발점으로 들어가요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">2</div>
        <div>
          <h3>시작 이미지 업로드</h3>
          <p>앱의 샷 카드에서 저장한 <strong>제품 이미지</strong>를 업로드합니다. 이 사진의 모습/색감이 영상에 그대로 반영돼요(고해상도일수록 좋음).</p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">3</div>
        <div>
          <h3>장면 프롬프트 붙여넣기</h3>
          <p>
            프롬프트 입력칸에 앱에서 <strong>복사한 "🎬 장면 프롬프트"(영어)</strong>를 그대로 붙여넣습니다. 카메라 묘사가 없는 게 정상이에요 — 카메라는 다음 단계의 "모션"이 담당하니까요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">4</div>
        <div>
          <h3>모션(Motion) 선택 + 강도</h3>
          <p>
            모션 목록에서 앱이 <strong>추천한 모션</strong>(예: 360 Orbit, Zoom In)을 골라요. 이게 <strong>카메라 움직임 = 역동성</strong>이에요.
            강도(strength)가 있으면 <strong>0.7~0.9</strong> 정도가 자연스러워요 (너무 높으면 과하게 흔들림).
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">5</div>
        <div>
          <h3>비율·길이 확인 → 생성</h3>
          <p>
            쇼츠면 비율 <strong>9:16</strong> 확인. <strong>생성(Generate)</strong> 버튼 옆 <strong>크레딧 수</strong>를 보고 진행 → 1~3분 뒤 영상 완성. <strong>다운로드</strong>하세요.
          </p>
        </div>
      </div>

      <div className="step">
        <div className="step-num">6</div>
        <div>
          <h3>샷마다 반복 → 이어붙이기</h3>
          <p>
            샷(클립)별로 1~5를 반복. 여러 클립이 모이면 <strong>캡컷(CapCut)</strong> 등에서 순서대로 이어붙이고 음악·자막을 더하면 한 편 완성. (음악은 앱의 샷 설명에 <strong>[음악/효과음 제안]</strong>으로 힌트가 있어요.)
          </p>
        </div>
      </div>

      {/* 잘 나오게 하는 팁 */}
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>잘 나오게 하는 팁</h2>
      <div className="glossary">
        <div className="term"><b>여러 번 뽑기</b><span>AI 영상은 복불복. 같은 설정으로 2~3번 생성해 베스트를 고르세요.</span></div>
        <div className="term"><b>일관성</b><span>모든 샷에 같은 제품 이미지·같은 분위기를 쓰면 한 편처럼 통일돼요.</span></div>
        <div className="term"><b>모션 강도</b><span>0.7~0.9 권장. 잔잔=낮게, 역동=높게.</span></div>
        <div className="term"><b>이미지 품질</b><span>배경 깔끔·고해상도 제품컷일수록 결과가 좋아요.</span></div>
        <div className="term"><b>짧게</b><span>한 클립은 6~10초. 길게는 클립을 이어붙여 만들어요.</span></div>
        <div className="term"><b>워터마크</b><span>무료/저가 등급은 워터마크가 붙을 수 있어요. 등급 확인.</span></div>
      </div>

      {/* 비용 주의 */}
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>비용 — 꼭 알아두기</h2>
      <div className="note" style={{ marginBottom: 24 }}>
        • Higgsfield 영상은 <strong>Higgsfield 계정의 크레딧</strong>으로 만듭니다 (이미 낸 Ultra 구독).<br />
        • 생성 화면의 <strong>크레딧 표시</strong>로 1건당 비용을 미리 확인하세요. 모델 등급이 높을수록 비쌈.<br />
        ⚠️ <strong>Claude(앱 프롬프트) 충전과 Higgsfield 크레딧은 완전 별개</strong>예요 — 서로 호환 안 됨(다른 회사·계정). 클로드 충전이 Higgsfield 크레딧이 되지 않습니다.
      </div>

      <div className="note" style={{ textAlign: 'center' }}>
        먼저 <a href="/" style={{ color: 'var(--accent)' }}>프로젝트</a>에서 프롬프트를 만들고 → 여기 단계대로 Higgsfield에서 영상화하세요 🎬
      </div>
    </>
  );
}
