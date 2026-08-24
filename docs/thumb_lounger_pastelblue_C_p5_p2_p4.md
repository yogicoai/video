# 자사몰 썸네일 — Lounger 파스텔블루 · 여성 C · 포즈5/2/4 (2026-08-21 생성 기록)

작성 2026-08-21 · 도구: 힉스필드 MCP(`nano_banana_pro` · 2K · 1:1) · 출처: `/thumbnails` THUMB_MODELS · LOUNGER_REFS · CAUTIONS

## 0. 스펙

| 항목 | 값 |
|---|---|
| 제품 | Yogibo **Lounger** · h60 × w65 × d80 cm · 4.4kg · 낮은 라운지체어형(등받이 일체) |
| 색상 | **파스텔블루 `#BEDDEF`** · 스와치 `scratchpad/swatch_pastelblue_BEDDEF.png` (힉스필드 media_id `65a5a62a-1365-4870-b358-5b1fd4bb193d`) |
| 모델 | **여성 C** — 유럽계 · 블론드 레이어드 롭+커튼뱅 · 키 169 슬림 · 쿨/미니멀 · 표정시트 ② 옅은 미소 |
| 의상 | **C_W_C_01** — 화이트 티(크롭 핏) + 네이비 핀스트라이프 와이드 슬랙스 · 맨발 |
| 배경 | `#f2f2f4` 라이트그레이 스튜디오(기존 컷 동일) · 정면-좌측 소프트 광 |
| 규격 | 1:1 · 2048 PNG |

## 1. 레퍼런스 (힉스필드 media_id)

| 역할 | URL | media_id |
|---|---|---|
| 포즈2 베이스(모델 포함) | `.../none/lounger/lounger_on_02.png` | `38cb4f83-579d-4d85-8286-e45563ff4618` |
| 포즈2 형태(모델 제거) | `.../none/lounger/lounger_off_02.png` | `99b7c512-0f56-43f3-a1ce-823ac4985f16` |
| 포즈4 베이스(모델 포함) | `.../none/lounger/lounger_on_04.jpg` | `3d733bd7-66a2-43ac-9146-aa1be243c261` |
| 포즈4 형태(모델 제거) | `.../none/lounger/lounger_off_04.png` | `f9a259bb-7ff9-4dfc-a744-6aba98d5be4d` |
| 포즈5 베이스(모델 포함) | `.../none/lounger/lounger_off_05.jpg` ⚠ | `064017e5-0ec1-4c19-9ab6-18543b5ad72d` |
| 포즈5 형태(모델 제거) | `.../none/lounger/lounger_on_05.png` ⚠ | `8dcee552-d431-4f0a-b3ca-fac7adf89d7d` |
| 모델 C 얼굴 대표컷 | `.../api/modal/B_C_rep.jpg?v=smile` | `b44666ed-4e0d-45ef-b584-42edd99305e1` |
| 모델 C 표정 시트 | `.../api/modal/B_C_expr.png?v=hair` | `ae2fad6a-3eb3-47b3-8158-9930526016d5` |
| 의상 C_W_C_01 | `.../none/clothes/C_W_C_01.jpg` | `bd1bb025-1b7d-4a53-968b-a2f423003308` |

> ⚠ **서버의 Lounger 포즈5 파일은 on/off 이름이 뒤바뀜**: `lounger_on_05.png` = 빈 제품(형태), `lounger_off_05.jpg` = 모델 포함(포즈). `/thumbnails` LOUNGER_REFS의 `lg_p5`(url=off, orig=on)도 실제 내용과 반대로 표시됨 — 파일명 정정 또는 키 스왑 필요.

## 2. 결과

| 컷 | 파일(FTP `web/img/api/modal/`) | 잡 ID | 비고 |
|---|---|---|---|
| 포즈5 | `cand_lounger_pastelblue_c_p5.png` | `e0f0ec8a-…-87945c692bae` | 1회 성공 |
| 포즈2 | `cand_lounger_pastelblue_c_p2.png` | `a1c273a8-…-c1ddff5254b9` | 1차(`52bab6ea…`)는 **각진 폼 소파체어**로 형태 실패 → 형태 레퍼를 #1로 올리고 "SOFT BEAN BAG / NO box cushions·flat planes·armrests" 강조한 2차로 해결 |
| 포즈2 대안 | `cand_lounger_pastelblue_c_p2_alt.png` | `a2ebd17b-…-1d484ea2f517` | 더 기대어 앉음 · 인물 비중 작음 |
| 포즈4 | `cand_lounger_pastelblue_c_p4.png` | `c193e6de-…-64d2632a8428` | 1회 성공 · 화이트 게임패드 유지 |

비용: Nano Banana Pro 5장 ≈ 10cr.

## 3. 프롬프트 골격 (재사용)
B 문서(`thumb_lounger_pastelblue_B_p1.md`)의 프롬프트 골격을 그대로 쓰되,
- **Lounger 포즈2처럼 등받이/팔 접촉이 많은 포즈는 PRODUCT 블록을 맨 앞에, 형태 레퍼를 #1로** 두고 "SOFT BEAN BAG · one continuous rounded form · NO box cushions / flat planes / armrests / separate seat cushion / sofa look"을 명시 (1차 실패 원인).
- 모델 C 블록: "European woman early-to-mid 20s, soft oval face, light grey-green eyes, golden-blonde shoulder-length layered lob with soft curtain bangs, natural no-makeup look, 169 cm slim, cool minimal vibe · expression sheet panel 2 soft smile".
- 의상 C_W_C_01: "plain white short-sleeve fitted crop T-shirt + navy fine-pinstripe wide-leg trousers (high-waisted, full length) · bare feet".
