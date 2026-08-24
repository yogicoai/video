# 자사몰 썸네일 — Pod 16컷 (2026-08-22 · 1회 생성 · 미검수 → 프론트에서 수정 예정)

도구: 힉스필드 MCP `nano_banana_pro` · 2K · 1:1 · 컷당 1회 생성(재시도 없음) · 프롬프트 빌더 `scratchpad/pod_batch/gen_prompts.mjs` → `prompts.json` / `batch_requests.json`

## 공통 규칙(프롬프트에 강제)
- **Pod 실측 95h×85w×85d·4.7kg 고정** — 성인: 등 뒤 Pod 상단이 머리/귀 높이, 옆이 골반 감쌈 / 아동B(150): 상단이 머리 위, 폭 ≈ 어깨 2배 / 아동A(120): 상단이 머리 훨씬 위, 폭 > 어깨 2배(아이가 작게 보여야 함)
- **얼굴·헤어 고정**: 대표컷 + 표정시트(8패널) 동시 투입, 모델별 헤어 규격 문장 명시(색/길이/가르마/앞머리/땋은머리·핀)
- Pod 형태: 매끈한 에그형, **파이핑/솔기/지퍼/태그 없음**(Lounger와 달리 라인 없음)
- 배경 `#f2f2f4` 스튜디오, 포즈는 `pod_on_XX`(모델 포함) 각도락 + `pod_off_XX`(빈 제품) 형태락
- 레퍼 순서: #1 형태(빈 제품) · #2 포즈 베이스 · #3 얼굴 · #4 표정시트 · #5 의상 · #6 색 스와치

## 결과 (FTP `web/img/api/modal/`, `/thumbnails` Pod 컬러별 cuts 등록 완료)
| 그룹 | 컬러 | 컷 | 파일 |
|---|---|---|---|
| 여성B(172) · B_W_C_01 | 프레시민트 #B0EEE7 | p1 랩탑 / p2 태블릿 / p3 양팔 활짝 / p5 독서 | `cand_pod_freshmint_b_p1/p2/p3/p5.png` |
| 여성C(169) · C_W_C_01 | 다크그레이 #353B3E | p5 독서 / p6 게임패드 / p1 랩탑 | `cand_pod_darkgrey_c_p5/p6/p1.png` |
| 아동A(6~7세·120) · KID_A_01 | 파스텔블루 #BEDDEF | p1 / p3 / p4 | `cand_pod_pastelblue_ka_p1/p3/p4.png` |
| 아동B(10~12세·150) · KID_B_01 | 프레시민트 | p3 / p4 / p6 | `cand_pod_freshmint_kb_p3/p4/p6.png` |
| 남성A(180) · A_M_C_02 | 다크그레이(컬러 미지정 → 가정) | p2 / p4 / p6 | `cand_pod_darkgrey_ma_p2/p4/p6.png` |

잡 ID(재생성 시 참고): c_p5 `c969ed41…` · c_p6 `680e07eb…` · c_p1 `6fbdfdcb…` · ka_p1 `34669568…` · ka_p3 `a1bed1db…` · ka_p4 `754cbe0c…` · kb_p3 `582a8f48…` · kb_p4 `9753a61a…` · kb_p6 `0e3daaec…` · ma_p2 `900795cb…` · ma_p4 `aa3bf4f5…` · ma_p6 `f2051c3e…` (B 4컷은 워크플로우 1라운드 산출물 재사용)

## 1차 육안 메모(제 검수 · 참고용)
- 아동A/아동B: Pod 상단이 머리 위로 올라와 "아이가 작게" 표현됨 — 의도대로. 아동B p6(옆모습)은 상대적으로 Pod가 조금 작아 보이는 편(경계선).
- 얼굴·헤어: 전 컷 대표컷과 일관(C 블론드 롭+커튼뱅, B 체스트넛 웨이브+주근깨, MA 다크 웨이브, KA 땋은머리+핀, KB 오번 생머리).
- 다크그레이는 #353B3E 차콜로 정상 표현. 남성A 컬러는 확인 필요.

## 보류 중
- Lounger 17컷(v2: 검정 파이핑·헤어락·아동 크기)은 사용자 요청으로 중단 — 추후 재개 시 `workflows/scripts/lounger-thumbs-batch-v2-*.js` 재사용.
- Lounger 포즈5·6 레퍼 on/off 파일명 뒤바뀜(서버) — 미정정.
