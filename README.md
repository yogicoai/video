# VideoGen Studio

이미지·스토리보드 기반 **Veo 3 영상 프롬프트 생성·관리 대시보드**.

회사가 보유한 제품 이미지와 스토리보드를 올리면, AI가 샷(shot) 단위로 분해해
Veo 3 규격의 영상 프롬프트를 생성하고, 편집·버전관리·승인한 뒤 선택적으로
영상까지 렌더링합니다.

## 스택

- Next.js 16 (App Router) + React 19
- MongoDB
- Claude (Sonnet 4.6) — 스토리보드 → Veo 3 프롬프트 생성 (Phase 2)
- Google Veo 3 / Gemini API — 영상 렌더링 (Phase 4, 어댑터로 교체 가능)

## 개발 단계 (로드맵)

- **Phase 0 ✅** 스캐폴드 + 프로젝트 CRUD + 대시보드
- **Phase 1** 에셋 업로드 + 스토리보드 입력
- **Phase 2** Claude 기반 스토리보드 → Veo 3 프롬프트 생성기 (핵심)
- **Phase 3** 샷 보드 (편집·버전·승인)
- **Phase 4** Veo 3 어댑터 + 렌더링
- **Phase 5** 타임라인·다운로드·캠페인 관리

## 실행

```bash
cp .env.local.example .env.local   # MONGODB_URI 등 채우기
npm install
npm run dev                         # http://localhost:5300
```

MongoDB가 로컬에 없으면 `MONGODB_URI`에 Atlas/원격 주소를 넣으세요.

## 데이터 모델

| 컬렉션 | 설명 |
|---|---|
| `projects` | 캠페인 단위 (시나리오·톤·타깃·길이·비율) |
| `assets` | 업로드한 제품 이미지 / 스토리보드 컷 |
| `shots` | AI가 분해한 샷 |
| `prompts` | 샷별 Veo 3 프롬프트 (버전 관리) |
| `render_jobs` | 렌더 요청·결과 클립 |
