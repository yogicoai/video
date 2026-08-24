# 자사몰 썸네일 — Lounger 파스텔블루 · 모델 B · Lounger 포즈1 (힉스필드 웹 수동 입력용)

작성 2026-08-21 · 출처: `/thumbnails` 워크스페이스(THUMB_MODELS · LOUNGER_REFS · CAUTIONS) + 제품 레지스트리(라운저 60×65×80 · 4.4kg) + `src/lib/productPrompt.js` 규칙

## 0. 스펙 확정 (생성 전 재확인)

| 항목 | 값 |
|---|---|
| 제품 | Yogibo **Lounger** · h60 × w65 × d80 cm · 4.4kg · 낮은 라운지체어형(등받이 일체) |
| 색상 | **파스텔블루 `#BEDDEF`** (컬러칩 공식값) · 스와치: `scratchpad/swatch_pastelblue_BEDDEF.png` |
| 모델 | **여성 B** — 유럽계 20대 초반 · 롱 체스트넛 웨이브 · 옅은 주근깨 · 키 172 슬림 롱라인 · 청순/내추럴 |
| 의상 | **B_W_C_01 — 그레이 티 + 데님 쇼츠** (헤더그레이 반팔 크롭티 + 라이트워시 데님 버뮤다 쇼츠) · 맨발 |
| 포즈 | **Lounger 포즈1** — `lounger_on_01`(모델 포함=자세/각도 베이스) + `lounger_off_01`(모델 제거=형태/눌림 레퍼) |
| 표정 | 자연스러운 미소 (표정 시트 패널 ② 옅은 미소 / 필요 시 ③ 밝은 미소) — 무표정 금지 |
| 배경 | `#f2f2f4` 연한 라이트그레이 스튜디오 (순백 X) |
| 규격 | 1:1 정사각 · 2048 무손실 |
| 비용 | 스틸 1장 ≈ 1.5cr (Nano Banana 기준, 앱 기록) |

## 1. 레퍼런스 이미지 (첨부 순서대로)

| # | 역할 | URL / 파일 |
|---|---|---|
| 1 | 포즈·각도 베이스 (모델 포함) | https://yogibo.openhost.cafe24.com/web/img/none/lounger/lounger_on_01.png |
| 2 | 제품 형태·눌림 레퍼 (모델 제거) | https://yogibo.openhost.cafe24.com/web/img/none/lounger/lounger_off_01.png |
| 3 | 모델 B 얼굴 대표컷 | https://yogibo.openhost.cafe24.com/web/img/api/modal/B_B_rep.jpg?v=e2 |
| 4 | 모델 B 표정 시트 (8패널: ①무표정 ②옅은미소 ③밝은미소 ④놀람 ⑤슬픔 ⑥찡그림 ⑦진지 ⑧곁눈질미소) | https://yogibo.openhost.cafe24.com/web/img/api/modal/B_B_expr.png?v=v2 |
| 5 | 의상 레퍼 B_W_C_01 | https://yogibo.openhost.cafe24.com/web/img/none/clothes/B_W_C_01.jpg |
| 6 | 색 스와치 #BEDDEF | 로컬 `scratchpad/swatch_pastelblue_BEDDEF.png` (직접 업로드) |
| 7 (선택) | 모델 B 바디/포즈 시트 (체형·비례 보강) | https://yogibo.openhost.cafe24.com/web/img/api/modal/B_B_body.png?v=v1 · https://yogibo.openhost.cafe24.com/web/img/api/modal/B_B_pose.png?v=v1r |
| 8 (선택) | Lounger 제품 뷰(올리브·형태 참고용) | https://yogibo.openhost.cafe24.com/web/img/ai/views/953ea5a8_c0_front.jpg · …/953ea5a8_c0_side.jpg |

> 360 스프라이트 원본은 첨부 금지(작게 깨져서 "작은 물체 여러 개"로 읽힘). 단일 각도 뷰만 사용.

## 2. 프롬프트 (그대로 붙여넣기)

```
Photorealistic e-commerce lifestyle thumbnail, square 1:1, 2048px.

BASE / POSE LOCK: reproduce the pose, camera angle and framing of the attached pose reference (#1) EXACTLY — a young woman sitting into a low Yogibo Lounger bean bag chair, seen from a front three-quarter angle at a slightly low eye level; legs stretched forward and relaxed with ankles crossed, bare feet; both hands holding a small ceramic mug at chest height; torso resting back against the sloped backrest; head turned slightly to her right with a gentle natural smile. Keep the same composition — only replace the person's face/hair/body, the outfit, the bean bag color and the background as described below.

PERSON (Model B identity — use face reference #3 and expression sheet #4, panel 2 "soft smile"): European woman in her early 20s, soft oval face, light chestnut-brown long wavy hair, faint freckles, light calm eyes, natural no-makeup look, 172 cm slim long-limbed build. The SAME face as the reference in every detail. Expression: natural soft smile (never neutral or blank).

OUTFIT (reference #5 — wardrobe B_W_C_01): heather light-grey short-sleeve fitted crop T-shirt + light-wash blue denim Bermuda shorts (knee length, relaxed fit, elastic waistband). Bare feet — no socks, no shoes, no accessories, no logos on clothing.

PRODUCT — Yogibo Lounger (pastel blue):
SHAPE: a LOW CHAIR-SHAPED bean bag with a built-in sloped backrest and a rounded seat — copy the exact silhouette, the single piping seam line and the soft rounded edges from the attached shape reference (#2); do NOT redraw the shape from words.
EXACT SIZE: 65 cm wide x 80 cm deep x 60 cm tall, 4.4 kg.
SCALE ANCHOR: a low lounge chair bean bag about knee-height of a standing adult (60 cm); a one-person seat whose backrest reaches the seated woman's mid-back — the 172 cm model must look correctly proportioned to it; the bag must NOT look oversized or wide.
NEGATIVE: NOT a ball, NOT a round beanbag, NOT a flat cushion, NOT a sofa, NO armrests, NO zipper, NO visible stitching except the single piping seam, NO wrinkled or deflated look.
COLOR: pastel blue (#BEDDEF — see color swatch #6): the exact same soft pastel sky-blue over the whole cover, it must never shift toward aqua, navy, grey or lavender. Piping tone-on-tone pastel blue or light grey — no dark contrasting piping.
FABRIC: soft matte stretch cotton-spandex cover that visibly compresses and dents under her body weight — the seat dips and the backrest bulges around her back exactly as in the shape reference.

SCENE / LIGHT: clean studio, seamless background and floor in very light grey #f2f2f4 (NOT pure white), soft diffused daylight from the front-left, natural soft contact shadow under the bag, no props except the mug, no text, no watermark, no logo.

CAMERA: 50 mm look, front three-quarter view, eye level slightly low, the whole bean bag and the woman fully in frame with comfortable margin, centered, square crop.
```

### 네거티브 프롬프트 (입력칸이 있으면)
```
ball-shaped beanbag, round bean bag, sofa, armrests, zipper, visible stitching, deflated, wrinkled, oversized beanbag, aqua blue, navy, grey beanbag, lavender, pure white background, neutral expression, blank face, different face, socks, shoes, text, watermark, logo, extra person, extra limbs, distorted hands, cropped body
```

## 3. 생성 전 체크 (CAUTIONS 요약)
- 스펙(색 + 포즈 + 모델 + 의상) 재확인, 크레딧 잔액·차감 고지 후 진행
- 포즈1은 **원본 포즈 프레임(#1)을 베이스**로 각도락 → 얼굴/의상/색/배경만 교체 (등받이 모양을 말로 덧씌우지 말 것)
- 표정: 시트(#4) 패널 지정 — 기본 ② 옅은 미소. 얼굴 흔들리면 #3 + #4 둘 다 넣고 "same face" 강조
- 의상 매핑: B → B_W_C_01(그레이티+데님쇼츠) — 다른 모델 의상 오사용 금지
- 비례: 라운저 60×65×80 ↔ 모델 172 — 빈백이 넓적/거대해지지 않게
- 배경 `#f2f2f4`, 2048 무손실 업로드

## 4. 결과 등록
- 파일명: `cand_lounger_pastelblue_b_p1.png` → FTP `web/img/api/modal/`
- `/thumbnails` PRODUCTS → Lounger → pastelblue.cuts 에 추가 예시:
  `{ url: \`${FTP}/cand_lounger_pastelblue_b_p1.png?v=1\`, spec: 'B(172cm) · Lounger 포즈1(착석·머그·¾정면·lounger_01 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 파스텔블루 #BEDDEF · 색스와치락 · #f2f2f4' }`
