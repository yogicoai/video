# 자사몰 썸네일 — 2026-08-23 새벽 검수 반영 (1회 생성 · 미검수 → 프론트 확인)

## 교체(버전업)
- `cand_pyramid_blossompink_kb_p2` v5 — 아동B 얼굴만 재교체(생성본 베이스 포토에딧, A안)
- `cand_pyramid_cherry_kb_read` v2 — 얼굴 고정+크기 축소 재생성(2샘플 중 fix1)
- `cand_support_sweetorange_b_jp2`(리빙코랄) v2 — 의상 B_W_C_02(크림 오버셔츠+와이드)로 포토에딧(2샘플 중 1)
- `cand_midi_darkgrey_d_m01` v2 — 형태(낮은 롱 웨지)+포즈+얼굴 3중 잠금 재생성(fix2)
- `cand_double_lightgrey_fad_p3` v3 — 사용자 확정 앵글(올리브 B+남성A p3 컷) 베이스 포토에딧: 라이트그레이 리컬러 + 여성A/여성D 교체(b안)
- `cand_double_olive_bma_p1` v4 — 얼굴/헤어만 여성B·남성A 재교체(a안)

## 신규
- `cand_pod_pastelblue_ka_p2` / `_p5` — 아동A 추가 포즈(태블릿·독서), 승인 p3 v3 컷을 #7 비례 레퍼로 잠금
- `cand_midi_darkgrey_d_p3` — 네이비 여성A p3 컷 베이스 포토에딧(다크그레이 리컬러+D 얼굴/의상, a안)

## 숨김
- `cand_mini_cherry_duo_p4`(아동 2인 p4) · `cand_pyramid_blossompink_kb_p3` v4(얼굴 고정 재생성 실패)

## 메모
- 생성본(우리 컷)을 베이스로 한 포토에딧이 **컬러 리컬러 + 인물 2명 교체**까지 안정적으로 동작(Double 라이트그레이) — 앵글·제품 형태가 확정된 컷은 이 방식이 가장 빠름.
- 잡 ID: midi d p1 `c21794ce`/`38fc3451`, 코랄 B `3cc2692c`/`f1be5249`, dbl lg `32d39f45`/`c0f87b32`, dbl olive p1 `2766022a`/`4672811c`, pod ka p2 `55c5eb86`, p5 `2361deee`, midi d p3 `9969a39d`/`6c7be87a`

## 2차 추가 (2026-08-23 01:30)
- 숨김: `cand_pyramid_blossompink_kb_p2` v5 (사용자 지시)
- **Pod 파스텔블루 여성C** 신규 3컷: `cand_pod_pastelblue_c_p1/p2/p4` (랩탑 ¾정면 / 태블릿 ¾측면 / 포인팅 ¾정면)
- **Pyramid 체리레드 아동B** 신규 2컷: `cand_pyramid_cherry_kb_p1`(세운·기대·어깨너머) / `_p5`(눕힌·랩탑) — 눌림 레퍼 #7 + KB 사이즈락
- **Pyramid 블라썸핑크 여성B** 신규 2컷: `cand_pyramid_blossompink_b_p2`(눕힌·머그) / `_p3`(세운 앞 착석·독서; 1차 과대 → SIZE 오버라이드 2샘플 중 fix2)
- **Mini 체리레드 아동B** 신규 2컷: `cand_mini_cherry_kb_p6`(티어드롭 안에 앉아 태블릿·측면) / `_p1`(사이드 리클라인; 2샘플 중 b) — mini_03/06 모델컷(아동)은 힉스필드 업로드·URL임포트 모두 "nsfw" 거부 → off(형태) 레퍼 + 승인 p7 컷 비례/컬러 레퍼 + 텍스트 포즈로 대체
- **Mini 아보카도그린 여성B** 신규 2컷: `cand_mini_avo_b_p2`(바닥 착석 옆으로 기대기) / `_p3`(세운 Mini 앞 독서) — 아보카도 스와치 없음 → 승인 C p1 컷을 컬러 레퍼로
- 코랄 Support B jp2 의상 교체(B_W_C_02) 건은 앞서 v2로 이미 반영됨(프론트 새로고침 필요)
- 제출 위임: 서브에이전트에 `scratchpad/pyr_batch/add_0823.json` + `scratchpad/pod_batch/pod_c_0823.json` 경로만 전달(프롬프트는 `gen_add_0823.py`로 빌더 재사용)

## 3차 추가 (2026-08-23 01:50) — 실사 레퍼 포토에딧
- **Pyramid 체리레드 아동B** `cand_pyramid_cherry_kb_jp1` — yogibo.jp `pre-prm-rd.jpg` 원본 그대로 + PREMIUM 배지/텍스트/태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 (2샘플 중 a) → 사용자 "너무 잘나왔어"
  - 같은 레퍼 베이스로 **포즈만 변경** 3컷 추가: `_jp2`(기대 앉아 그림책·인형 옆), `_jp3`(경사면에 누워 인형 안기), `_jp4`(옆으로 앉아 인형 안고 어깨너머) — 각 2샘플 중 선택. 생성본(아동) 재임포트는 실패(아동 이미지 필터)라 원본 jp 레퍼(5d044591)를 베이스로 포즈 텍스트만 교체
  - 숨김: `cand_pyramid_cherry_kb_read` v2 · `_kb_p1` · `_kb_p5` (사용자 지시, jp 스타일로 대체)
- **Pyramid 블라썸핑크 여성B** `cand_pyramid_blossompink_b_jp5` — pyramid_on_05(Premium+) 레퍼 원본 형태 그대로 + 텍스트 제거 + 블라썸핑크 리컬러 + 얼굴/헤어 B·의상 B_W_C_01 (2샘플 중 a)
- **Pyramid 라이트그레이 여성A** `cand_pyramid_lightgrey_fa_jp7` — yogibo.jp `prm_7.jpg` 원본 그대로(의상 유지) + 라이트그레이 리컬러 + 얼굴/헤어만 여성A (2샘플 중 a)
- 레퍼 media: pre-prm-rd `5d044591-03be-411c-9eba-e2225ad25760` · prm_7 `b4aababb-013d-4bd1-aa20-777a3c97cbeb` · pyramid_on_05 `e5503a1c-5720-4b78-b1b8-ecceb93121aa`

## 4차 추가 (2026-08-23 02:10) — 실사 레퍼 포토에딧 확장 (Pyramid)
- 체리레드 아동B: `_jp1`(유지) · `_jp2/_jp3/_jp4` 포즈 변형 → 모두 사용자 지시로 숨김 · `_p3jp`(pyramid_on_03 원본+체리 리컬러+아동B, v2 컬러 Lab 매칭 보정) 등록
- 블라썸핑크: `b_jp5` v2(헤어 뒤 핑크 얼룩 영역 합성 리터치) · `b_jp1`(pyramid_on_01 원본·배경 #f2f2f4·B) · `b_jp7`(prm_7·B·B_W_C_01) · `b_jp4`(pyramid_on_04 방 배경 원본·얼굴만 B) 신규 · `fa_jp5`(여성A·A_W_C_01) 신규→숨김 · `b_p2`·`b_p5` 숨김
- 라이트그레이: `fa_jp7`(prm_7·얼굴만 여성A) · `ma_jp1`(pyramid_on_01·남성A·A_M_C_02·배경 정리) · `ma_jp7`(prm_7·남성A·책) 신규 · `fa_p5`·`ma_p5` 숨김
- 파스텔블루: `ka_jp1`(pre-prm-rd·아동A) 신규 · `ka_p3jp`(pyramid_on_03·아동A) 신규→숨김 · `ka_p3` 숨김 · `fa_jp5`·`fa_jp7`·`b_jp7` 신규(여성A/B)
- Pod 파스텔블루 `ka_p3` v3 숨김 · Support 리빙코랄: `cand_support_coral_b_jp2_floral`(원본 의상 버전) 추가 후 사용자 지시로 숨김; Max 섹션 내 리빙코랄(Support 컷) 블록은 사용자 "일단 둬" → 유지
- 레퍼 media: pyramid_on_04 `c591c48f-d7bb-4d02-836e-cb6ee0ec15a0`

## 5차 추가 (2026-08-23 02:20)
- 블라썸핑크 `b_jp4` 유지 + **`d_jp4`(여성D)** 추가 · 파스텔블루 **`b_jp4`(여성B)** 추가 (사용자: 포즈4는 D, 파스텔블루는 B)
- 라이트그레이 `ma_jp7` v2 — 의상 A_M_C_02로 교체 재생성(책 들기 유지)
- **Midi 체리레드 컬러 블록 신설** — `cand_midi_cherry_duo_p4`(mini_04_on 원본·아동A+B 얼굴만 교체·체리 리컬러)
- 숨김: Mini 아보카도 `c_p6`·`b_p3` · Max 섹션 리빙코랄(Support 컷) 블록은 사용자 지시로 유지

## 6차 추가 (2026-08-23 02:35)
- Pyramid 파스텔블루 **여성C** 2컷: `c_jp7`(prm_7·C_W_C_01) · `c_jp5`(pyramid_05·C_W_C_01) / 숨김: `fa_jp5`·`fa_jp7`(여성A 파스텔블루), Midi 체리 duo, Mini 체리 duo p4jp
- Support 코랄 B jp2(크림 의상) 베이스 **컬러만 리컬러** 3종: `cand_support_lightgrey_b_jp2`(b) · `cand_support_orange_b_jp2`(a) · `cand_support_navy_b_jp2`(b) — 스와치는 로컬 PNG 생성→media_upload(orange `81a97b35…`, navy `3aaeb600…`)
- Double 라이트그레이 **여성B+여성C** `cand_double_lightgrey_bc_p1`(올리브 B+남성A p1 컷 베이스 포토에딧, 남성→C)
- 엑박 점검: FTP 컷 128 + 레퍼 URL 109 전부 200 (캐시 이슈 추정)
