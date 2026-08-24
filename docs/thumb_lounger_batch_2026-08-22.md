# 자사몰 썸네일 — Lounger 12컷 (2026-08-22 · 파이핑 라인 반영 · 1회 생성 · 미검수)

도구: 힉스필드 MCP `nano_banana_pro` · 2K · 1:1 · 컷당 1회 생성 · 빌더 `scratchpad/final_batch/gen_lounger_fix.mjs`(v2 워크플로우 빌더 재사용) → `lounger_cuts.json` / `batch_A.json`

## 공통 규칙 (사용자 지적 반영)
- **파이핑 라인 필수**: 파스텔블루·프레시민트·올리브 = **검정** 라인(파스텔블루는 `lounger_on_06` 실제 제품, 민트/올리브는 `lounger_off_02`를 #7 파이핑 레퍼로 투입) / **네이비 = 라이트그레이** 라인(`lounger_off_01` 레퍼의 "라운드" 라인)
- Lounger 60×65×80 고정 — 아동A 컷은 등받이가 어깨/목, 빈백 폭 > 어깨 2배(아이 작게), 또래 아이 착석 레퍼(`lounger_on_03`) #8 사이즈 레퍼 투입
- 얼굴·헤어 고정(대표컷+표정시트, 헤어 규격 문장), 배경 #f2f2f4, 성인 맨발·아동 양말
- 레퍼 순서: #1 형태(빈 제품) · #2 포즈 · #3 얼굴 · #4 표정시트 · #5 의상 · #6 스와치 · #7 파이핑 레퍼 · (#8 아동 사이즈 레퍼)

## 결과 (FTP `web/img/api/modal/` · `/thumbnails` Lounger 등록)
| 그룹 | 컬러 | 컷 | 파일 | 비고 |
|---|---|---|---|---|
| 여성C(169) · C_W_C_01 | 파스텔블루 #BEDDEF | p5 / p2 / p4 | `cand_lounger_pastelblue_c_p5/p2/p4` (?v=2 덮어씀) | 파이핑 없던 v1 전면 교체, `_p2_alt`는 등록 제외 |
| 여성B(172) · B_W_C_01 | 프레시민트 #B0EEE7 | p4 / p5 / p1 | `cand_lounger_freshmint_b_p4/p5/p1` | 신규 |
| 남성A(180) · A_M_C_02(의상 미지정→가정) | 네이비블루 #1D395D (Lounger 컬러 신규 추가) | p5 / p2 / p1 | `cand_lounger_navy_ma_p5/p2/p1` | 라이트그레이 파이핑 |
| 아동A(6~7세·120) · KID_A_01 | 올리브그린 #668B01 | p3 / p4 / p7 | `cand_lounger_olive_ka_p3/p4/p7` | 검정 파이핑 · 고정 크기 |

잡 ID: c_p5 `68719b09…` c_p2 `b7915cf5…` c_p4 `7204cbcf…` b_p4 `d2ce9094…` b_p5 `4a2abd66…` b_p1 `b7cd3ddc…` ma_p5 `4b94ebc8…` ma_p2 `b306e1c9…` ma_p1 `aa4c5bf0…` ka_p3 `bd321739…` ka_p4 `3ce8becd…` ka_p7 `78188811…`

## 같은 날 Pyramid 검수 반영
- `cand_pyramid_blossompink_kb_p3` v2: 꼭짓점 완만하게(스파이크 NG) · `cand_pyramid_pastelblue_ka_p3` v2: 피라미드 약간 축소 · `cand_pyramid_lightgrey_ma_p1` 삭제 → **여성A(168·A_W_C_01) 포즈5** `cand_pyramid_lightgrey_fa_p5` 신규 ("모델A"=여성A)
- 참고: `cand_pyramid_lightgrey_ma_p5`(남성A p5)는 지시가 없어 유지

## 미해결/참고
- 서버 `lounger_on/off_05`, `_06` 파일명 내용 뒤바뀜(미정정) · Lounger 컬러 `navy` 키는 page.js에만 추가(colorchips.json 등록 여부 확인 필요)

## 추가 검수 반영 (2026-08-22 심야 · 종료 전)
- 삭제: `cand_lounger_navy_ma_p5` · `cand_lounger_olive_ka_p4` · `cand_lounger_olive_ka_p7` · `cand_pyramid_lightgrey_ma_p1`
- 재생성(v2/v3): `cand_lounger_freshmint_b_p4`(배경 제거) · `cand_lounger_pastelblue_c_p4`(얼굴 고정 → v3 각진 폼체어라 v4 형태 오버라이드 1회 추가) · `cand_pyramid_blossompink_b_p1`(하단 볼륨감) · `cand_pyramid_blossompink_kb_p2`/`cand_pyramid_pastelblue_ka_p2`(하단 길이 축소) · `cand_pyramid_blossompink_kb_p3`(꼭짓점 완만) · `cand_pyramid_pastelblue_ka_p3`(약간 축소) · `cand_pod_pastelblue_ka_p3` v3(크기 적정화)
- 신규: `cand_pyramid_lightgrey_fa_p5`(여성A) · **Double 다크그레이 2인컷** `cand_double_darkgrey_duo_p2/p3`(남성A A_M_C_02 + 여성A A_W_C_01, double_02/03 on/off 각도락)
- 힉스필드 안전필터 오탐 1회(C p4 "nsfw") → 문구 완화 후 재제출로 해결

## 2026-08-22 오후 (재부팅 후 · MCP 재연결)
- 숨김: Lounger 파스텔블루 C p4(v4) · Pod B p3(v2) · Pod 아동B p3 · Pod 남성A p4 · Pod 아동A p4 · Pod 아동A p1
- 올리브 Lounger 아동A **p4·p7 v2**: 승인된 p3 컷(`cand_lounger_olive_ka_p3`)을 #9 사이즈 레퍼로 첨부해 동일 비례 잠금 → 교체 등록
- **Double 올리브 여성B+남성A p1·p2·p3** 신규(`cand_double_olive_bma_p1/p2/p3`): p1·p3 1차는 인물 중복(고스트) 아티팩트 → "정확히 2인·중복 금지" 규칙 추가해 v2로 교체
- 참고: 플랫폼 API 키(.env.local)는 나노바나나 미제공+크레딧 0이라 MCP 끊김 시 대체 불가 — MCP 재연결(세션 재시작)이 유일한 복구 경로
- (오후 추가) Lounger 파스텔블루 C p2: v3 얼굴 OK/포즈 변형 → v4 포즈 OK/형태 각짐 → **v5 형태+포즈+얼굴 3중 잠금(형태 레퍼 1번 슬롯 + 포즈락 최상단)으로 해결** → 등록 v=4 · Double 올리브 p1은 사용자 선택으로 **v2(이전 버전) 유지**, p3는 v4(크기 유지+남성A 헤어 고정) 채택
