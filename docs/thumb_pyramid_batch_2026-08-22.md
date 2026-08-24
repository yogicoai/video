# 자사몰 썸네일 — Pyramid 8컷 (2026-08-22 · 1회 생성 · 미검수 → 프론트에서 수정 예정)

도구: 힉스필드 MCP `nano_banana_pro` · 2K · 1:1 · 컷당 1회 생성 · 프롬프트 빌더 `scratchpad/pyr_batch/gen_prompts.py` → `batch_requests.json` / `prompts_meta.json`

## 공통 규칙
- **Pyramid 실측 66h(세웠을 때)×75×75 base·2.2kg 고정** — 세운 경우(포즈1·3): 성인이 바닥에 앉아 기대면 꼭짓점이 어깨~목, 아동B는 머리/귀, 아동A는 머리 위 / 눕힌 경우(포즈2·5): 경사면이 낮은 등받이(성인 등 중간, 아동A 어깨·목)
- **얼굴·헤어 고정**: 대표컷 + 표정시트 동시 투입, 헤어 규격 명시
- 형태: 삼각(사면체) 플로어쿠션, 소프트 모서리, 파이핑/지퍼/태그 없음; 방향(세움/눕힘)은 `pyramid_on/off_XX` 레퍼 그대로
- 배경 `#f2f2f4` · 레퍼 순서 #1 형태(빈 제품) · #2 포즈 · #3 얼굴 · #4 표정시트 · #5 의상 · #6 스와치
- 컬러: 블라썸핑크 `#E5B9C8`(page.js 기준; colorchips.json은 #E2A8BE) · 파스텔블루 `#BEDDEF` · 라이트그레이 `#E5DED3`(웜 그레이지)

## 결과 (FTP `web/img/api/modal/`, `/thumbnails` Pyramid 컬러별 cuts 등록 완료)
| 그룹 | 컬러 | 컷 | 파일 | 잡 ID |
|---|---|---|---|---|
| 여성B(172) · B_W_C_01 | 블라썸핑크 | p1 세운 피라미드 기대기 / p5 눕힌 피라미드·랩탑·환호 | `cand_pyramid_blossompink_b_p1/p5` | `aff8aec5…` / `d6a076ca…` |
| 아동A(6~7세·120) · KID_A_01 | 파스텔블루 | p2 눕힌·인형 / p3 세운 앞 착석·인형 | `cand_pyramid_pastelblue_ka_p2/p3` | `0b7998f6…` / `27780777…` |
| 남성A(180) · A_M_C_02 ("모델A"=남성A 해석) | 라이트그레이 | p1 / p5 | `cand_pyramid_lightgrey_ma_p1/p5` | `1ac48dac…` / `f6ccfd81…` |
| 아동B(10~12세·150) · KID_B_01 | 블라썸핑크 | p2 / p3 | `cand_pyramid_blossompink_kb_p2/p3` | `47bdf1b2…` / `f56c3906…` |

## 같은 날 Pod 검수 반영
- 삭제: `cand_pod_freshmint_b_p1`(얼굴 상이) · `cand_pod_darkgrey_c_p5` · `cand_pod_darkgrey_c_p1` · `cand_pod_darkgrey_ma_p2` (등록에서 제거, FTP 파일은 유지)
- 재생성 v2: `cand_pod_freshmint_b_p3`(크기 보정: 상단=머리 높이·폭≈어깨 1.3배) · `cand_pod_pastelblue_ka_p1/p3/p4`(뒷부분 좁은 봉우리 → 넓고 낮은 둥근 돔, 아이 작게) — 프롬프트 최상단에 SHAPE/SIZE OVERRIDE 블록을 붙이는 방식이 효과 있었음 (`scratchpad/pod_batch/batch_requests_fix.json`)
