'use client';

// 자사몰 상품 썸네일 — 제작·등록·관리 워크스페이스 (2026-08-13)
// 목적: 요기보 자사몰(cafe24) 상품 리스트/상세용 썸네일을 제품 레지스트리 + 전속 모델 + "빈백 눌림(구김) 레퍼"로
//       일관성 있게 제작해 관리한다. (제작한 썸네일은 아래 THUMBS에 등록 → FTP 업로드)

import { useState } from 'react';

const FTP = 'https://yogibo.openhost.cafe24.com/web/img/api/modal';
const USAGE = 'https://yogibo.openhost.cafe24.com/web/img/ai/usage';

// 제작 레시피 — 착석/제품 썸네일 표준 조합
const RECIPE = [
  { n: '①', t: '눌림 형태 레퍼 (구김)', d: '사람 지운 "빈백 단독 눌림" 이미지 → 실제 앉았을 때의 구김·압축 물리 재현 (인물 오염 0)', c: '#26A69A' },
  { n: '②', t: '제품 색상 / Element', d: '레지스트리의 제품 색상 뷰·Element 락 → 정확한 색상·형태·로고', c: '#FFB74D' },
  { n: '③', t: '모델 (선택)', d: '전속 모델 얼굴/헤어/체형 앵커 → 착석 라이프스타일. 제품 단독이면 생략', c: '#7E57C2' },
];

// 탐색 후보(미확정) — 슬롯 확정 전 비교/검토용
const CAND = 'https://yogibo.openhost.cafe24.com/web/img/api/modal';
const CANDIDATES = [
  { key: 'navy_c_p2', name: 'C · 네이비 · 포즈2 (각도락)', url: `${CAND}/cand_max_navy_c_p2.png?v=2`, note: '체어형 · ¾측면·접힘top 정확 · 지퍼X · C의상(화이트티+네이비슬랙스)' },
  { key: 'olive_a_p1', name: 'A · 올리브그린 · 포즈1 (각도락)', url: `${CAND}/cand_max_olive_a_p1.png?v=1`, note: '눕듯 리클라이너 · 길고 낮은 테이퍼 · A의상(브라운티+그레이스웰)' },
  { key: 'orange_d_p3', name: 'D · 스위트오렌지 · 포즈3 (각도락)', url: `${CAND}/cand_max_orange_d_p3.png?v=4`, note: '흰스튜디오 리클라이너 · 크레스트 top · 비례보정 v4(모델 173≈Max170) · 맨발 · D의상' },
  { key: 'aqua_b_p4', name: 'B · 아쿠아블루 · 포즈4 (¾측면)', url: `${CAND}/cand_max_aqua_b_p4.png?v=1`, note: '플랫 데이베드 · 낮은 플로어 라운징 · B의상(그레이티+데님쇼츠) · 맨발' },
  { key: 'aqua_b_p4_front', name: 'B · 아쿠아블루 · 포즈4 (정면 연출)', url: `${CAND}/cand_max_aqua_b_p4_front.png?v=2`, note: '플랫 라운저 정면 · 빈백 확대(v2) · B_W_C_02(크림 오버셔츠+와이드) · 맨발' },
  { key: 'darkgrey_ma_p5', name: '남A · 다크그레이 · 포즈5 (게이밍)', url: `${CAND}/cand_max_darkgrey_ma_p5.png?v=2`, note: '게이밍 체어 · 양반다리 정면 · 미소+빈백확대(v2) · 공식다크그레이#353B3E · A_M_C_02' },
  { key: 'cherry_b_pose', name: 'B · 체리레드 · 포즈레퍼(미소)', url: `${CAND}/cand_max_cherry_b_pose.png?v=1`, note: 'test02 포즈 차용 · 은은한 미소(눈감음) · B_W_C_02 · 비례 172↔170' },
  { key: 'choco_c_pose', name: 'C · 초코브라운 · 랩탑연출 → Drop 배치', url: `${CAND}/cand_max_choco_c_pose.png?v=1`, note: 'test03 포즈 차용 · 라운드형=Drop 제품으로 이동됨 · 무브랜드 랩탑 · C_W_C_01' },
];

// 생성 주의사항 — 실측 피드백으로 도출된 표준 체크리스트(모든 생성에 반영)
const CAUTIONS = [
  '★ 모델 표정은 기본 "자연스러운 미소"(은은하게 웃는 표정) — 무표정 금지(전 컷 공통)',
  '★ 얼굴 드리프트 방지: 모델별 "표정 시트(expr, /models·8표정)"를 identity+표정 앵커로 함께 투입하고 원하는 패널(옅은미소/밝은미소/놀람 등) 지정. 얼굴 턴어라운드만+프롬프트"smile"는 얼굴 흔들림 위험. expr시트 파일=B_A_expr/B_B_expr/B_C_expr/B_D_expr/M_A_expr',
  '등받이 top은 프롬프트로 모양을 말로 덧씌우지 말고 "베이스프레임 그대로 복사"가 원칙(내가 둥근돔/뾰족 등으로 묘사하면 오히려 망가짐). 포즈3=뒤로 말리는 둥근 크레스트(파도 마루/쉼표, 둥근 공·뾰족 삼각 아님) / 포즈2=뒤로 접힘 / 포즈1=길고 낮은 테이퍼',
  '각도·구도·앉는 연출이 중요한 포즈는 "형태 레퍼"가 아니라 "원본 포즈 프레임(모델 포함)"을 베이스로 넣어 각도락 후 얼굴/의상/색/배경만 교체',
  '실제 Max엔 없는 지퍼/봉제선 넣지 않기(원단 매끈·연속)',
  '실제 Max 비례(약 170×70×45cm) ↔ 모델 신체 사이즈 반영 — "넓적"하게 크지 않게',
  '모델별 의상 매핑 정확히(A의상을 D에 쓰는 식 오사용 금지)',
  '★ 배경색은 순백이 아니라 #f2f2f4 (연한 라이트그레이 스튜디오) — 이제부터 전 컷 공통',
  '2048 무손실 업로드 — 일부러 사이즈 줄이지 않기',
  '생성 전 스펙(색+포즈+모델+의상) 재확인 + 크레딧(잔액·차감) 고지 후 진행',
];

// 확보된 "눌림(구김) 형태 레퍼" 자산 — 착석 썸네일 품질의 핵심
const NONE = 'https://yogibo.openhost.cafe24.com/web/img/none';
const PRESS_REFS = [
  { key: 'max_p1', name: 'Max 리클라이너 (포즈1)', url: `${NONE}/max/max_p_none_01.png`, orig: `${NONE}/max/max_p_01.webp`, note: '실사·모델제거 · 눕듯 리클라이너 · 버건디(거실)', tag: '실사' },
  { key: 'max_p2', name: 'Max 업라이트 체어 (포즈2)', url: `${NONE}/max/max_p_none_02.png`, orig: `${NONE}/max/max_p_02.webp`, note: '실사·모델제거 · 세워 앉는 체어형 · 블랙(거실)', tag: '실사' },
  { key: 'max_p3', name: 'Max 리클라이너 · 흰 스튜디오 (포즈3)', url: `${NONE}/max/max_p_none_03.png`, orig: `${NONE}/max/max_p_03.jpg`, note: '실사·모델제거 · 볼륨/구김 O · 썸네일 최적 · 아쿠아', tag: '실사' },
  { key: 'max_p4', name: 'Max 플랫 라운저 (포즈4)', url: `${NONE}/max/max_p_none_04.png`, orig: `${NONE}/max/max_p_04.png`, note: '실사·모델제거 · 바닥에 낮게 눕힌 플랫 데이베드형 · 낮은 플로어 라운징 · 아쿠아', tag: '실사' },
  { key: 'max_p5', name: 'Max 게이밍 체어 (포즈5)', url: `${NONE}/max/max_p_05_none.png`, orig: `${NONE}/max/max_p_05.png`, note: '실사·모델제거 · 게이밍 체어형(등받이+좌석) · 양반다리 정면 게이밍 연출 · 블랙/레드', tag: '실사' },
  // 추가 예정: Max 컬러별 / Pod · Support · Mini 등
];

// Slim 실사 포즈 레퍼 (모델포함=orig / 모델제거=url) — Slim 정확한 형태·비례용
const SLIM = 'https://yogibo.openhost.cafe24.com/web/img/none/slim';
const SLIM_REFS = [
  // 포즈1(업라이트 체어·게이밍) 숨김 — 생성 잘 안돼 제외(데이터 보존): { key: 'slim_p1', name: 'Slim 업라이트 체어 (포즈1)', url: `${SLIM}/slim_01_off.png`, orig: `${SLIM}/slim_01_on.png`, note: '실사·모델제거 · 양반다리 정면 게이밍(업라이트 체어형) · 블랙', tag: '실사' },
  { key: 'slim_p2', name: 'Slim 보트 리클라이너 (포즈2)', url: `${SLIM}/slim_02_off.png`, orig: `${SLIM}/slim_02_on.jpg`, note: '실사·모델제거 · 낮은 보트형 리클라이너·기대어 눕기(¾측면) · 차콜', tag: '실사' },
  { key: 'slim_p3', name: 'Slim 업라이트 리클라이너 (포즈3)', url: `${SLIM}/slim_03_off.png`, orig: `${SLIM}/slim_03_on.jpg`, note: '실사·모델제거 · 업라이트 리클라이너·책읽기(¾정면) · 차콜', tag: '실사' },
  { key: 'slim_p4', name: 'Slim 플랫 로우 라운저 (포즈4)', url: `${SLIM}/slim_04_off.png`, orig: `${SLIM}/slim_04_on.png`, note: '실사·모델제거 · 바닥에 낮게 눕힌 플랫 라운저 · 엎드려 팔꿈치 괴고 릴랙스(¾측면) · 차콜', tag: '실사' },
  { key: 'slim_p6', name: 'Slim 업라이트 체어·게이밍 (포즈6)', url: `${SLIM}/slim_06_off.png`, orig: `${SLIM}/slim_06_on.png`, note: '실사·모델제거 · 업라이트 체어형 착석 게이밍(¾측면) · 남성 · 올리브', tag: '실사·남성' },
  { key: 'slim_p7', name: 'Slim 세로 업라이트·옆 기대기 (포즈7)', url: `${SLIM}/slim_07_off.png`, orig: `${SLIM}/slim_07_on.png`, note: '실사·모델제거 · 세로로 세운 Slim 옆에 서서 손 얹고 기대기(제품 높이 강조·바닥지지) · 라이트그레이', tag: '실사' },
  { key: 'slim_p8', name: 'Slim 허그·옆 감싸안기 (포즈8)', url: `${SLIM}/slim_08_off.png`, orig: `${SLIM}/slim_08_on.png`, note: '실사·모델제거 · 세로 Slim 옆에서 감싸안기·볼 기대기·팔 끝까지 안감김 · 남성 · 오렌지', tag: '실사·남성' },
  { key: 'slim_p9', name: 'Slim 업라이트 체어 정면 착석·게이밍 (포즈9)', url: `${SLIM}/slim_09_off.png`, orig: `${SLIM}/slim_09_on.png`, note: '실사·모델제거 · 정면 착석 게이밍(업라이트 체어형) · 남성 · 블루/퍼플', tag: '실사·남성' },
];

// Midi 전용 실사 포즈 레퍼 (모델포함=포즈/비례 · 모델제거=형태 · 각도락용)
const MIDI = 'https://yogibo.openhost.cafe24.com/web/img/none/midi';
const MIDI_REFS = [
  { key: 'midi_p1', name: 'Midi 플랫 라운저·누워 스트레칭 (포즈1)', url: `${MIDI}/midi_01_off.png`, orig: `${MIDI}/midi_01_on.jpg`, note: '실사·모델제거 · 낮게 눕힌 롱 웨지형 · 등받이 슬로프에 거의 눕듯 기대어 양팔 머리 위 스트레칭·다리 뻗기(¾측면) · 차콜', tag: '실사' },
];

// Mini 전용 실사 포즈 레퍼 (모델포함=포즈/비례 · 모델제거=형태 · 각도락용) — on 확장자 01~05=.jpg / 06~07=.png, off는 전부 .png
const MINI_R = 'https://yogibo.openhost.cafe24.com/web/img/none/mini';
const MINI_REFS = [
  { key: 'mini_p1', name: 'Mini 사이드 리클라인 (포즈1)', url: `${MINI_R}/mini_01_off.png`, orig: `${MINI_R}/mini_01_on.jpg`, note: '실사·모델제거 · 성인 여성이 옆으로 기대 앉기(¾측면·다리 뻗기) · 차콜', tag: '실사' },
  { key: 'mini_p2', name: 'Mini 바닥 라운지·체스 (포즈2)', url: `${MINI_R}/mini_02_off.png`, orig: `${MINI_R}/mini_02_on.jpg`, note: '실사·모델제거 · 바닥에 앉아 Mini에 기대어 놀이/체스(¾측면) · 베이지', tag: '실사' },
  { key: 'mini_p3', name: 'Mini 아동 기대 책읽기 (포즈3)', url: `${MINI_R}/mini_03_off.png`, orig: `${MINI_R}/mini_03_on.jpg`, note: '실사·모델제거 · 아동이 Mini에 기대 앉아 책읽기(¾정면) · 그린', tag: '실사·아동' },
  { key: 'mini_p4', name: 'Mini 아동 2인 함께 (포즈4)', url: `${MINI_R}/mini_04_off.png`, orig: `${MINI_R}/mini_04_on.jpg`, note: '실사·모델제거 · 아동 두 명이 낮은 Mini에 함께 앉기(자매 연출) · 레드', tag: '실사·아동' },
  { key: 'mini_p5', name: 'Mini 앉아 공부·트레이 (포즈5)', url: `${MINI_R}/mini_05_off.png`, orig: `${MINI_R}/mini_05_on.jpg`, note: '실사·모델제거 · 남아가 Mini에 앉아 무릎 트레이로 공부/그리기(¾측면) · 모카', tag: '실사·아동' },
  { key: 'mini_p6', name: 'Mini 아동 앉아 책읽기 (포즈6)', url: `${MINI_R}/mini_06_off.png`, orig: `${MINI_R}/mini_06_on.png`, note: '실사·모델제거 · 아동이 Mini에 폭 안겨 앉아 책읽기(책장 앞·측면) · 브라운', tag: '실사·아동' },
  { key: 'mini_p7', name: 'Mini 아동 착석 독서 (포즈7)', url: `${MINI_R}/mini_07_off.png`, orig: `${MINI_R}/mini_07_on.png`, note: '실사·모델제거 · 아동이 Mini에 앉아 무릎에 책 놓고 읽기(¾측면·방 연출) · 모카', tag: '실사·아동' },
];

// Lounger 전용 실사 포즈 레퍼 — 확장자 혼재(on: 01·02·05·06=.png / 03·04·07=.jpg, off: 05=.jpg 나머지=.png)
const LG = 'https://yogibo.openhost.cafe24.com/web/img/none/lounger';
const LOUNGER_REFS = [
  { key: 'lg_p1', name: 'Lounger 포즈1', url: `${LG}/lounger_off_01.png`, orig: `${LG}/lounger_on_01.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p2', name: 'Lounger 포즈2', url: `${LG}/lounger_off_02.png`, orig: `${LG}/lounger_on_02.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p3', name: 'Lounger 포즈3', url: `${LG}/lounger_off_03.png`, orig: `${LG}/lounger_on_03.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p4', name: 'Lounger 포즈4', url: `${LG}/lounger_off_04.png`, orig: `${LG}/lounger_on_04.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p5', name: 'Lounger 포즈5', url: `${LG}/lounger_off_05.jpg`, orig: `${LG}/lounger_on_05.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p6', name: 'Lounger 포즈6', url: `${LG}/lounger_off_06.png`, orig: `${LG}/lounger_on_06.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'lg_p7', name: 'Lounger 포즈7', url: `${LG}/lounger_off_07.png`, orig: `${LG}/lounger_on_07.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// Drop 전용 실사 포즈 레퍼 — 확장자 혼재(on: 01·07=.png 나머지=.jpg / off: 전부 .png)
const DR = 'https://yogibo.openhost.cafe24.com/web/img/none/drop';
const DROP_REFS = [
  { key: 'dr_p1', name: 'Drop 포즈1', url: `${DR}/drop_off_01.png`, orig: `${DR}/drop_on_01.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p2', name: 'Drop 포즈2', url: `${DR}/drop_off_02.png`, orig: `${DR}/drop_on_02.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p3', name: 'Drop 포즈3', url: `${DR}/drop_off_03.png`, orig: `${DR}/drop_on_03.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p4', name: 'Drop 포즈4', url: `${DR}/drop_off_04.png`, orig: `${DR}/drop_on_04.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p5', name: 'Drop 포즈5', url: `${DR}/drop_off_05.png`, orig: `${DR}/drop_on_05.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p6', name: 'Drop 포즈6', url: `${DR}/drop_off_06.png`, orig: `${DR}/drop_on_06.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p7', name: 'Drop 포즈7', url: `${DR}/drop_off_07.png`, orig: `${DR}/drop_on_07.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'dr_p8', name: 'Drop 포즈8', url: `${DR}/drop_off_08.png`, orig: `${DR}/drop_on_08.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// Pyramid 전용 실사 포즈 레퍼 — on: 01·04·06=.png / 02·03·05=.jpg, off: 전부 .png
const PY_ = 'https://yogibo.openhost.cafe24.com/web/img/none/pyramid';
const PYRAMID_REFS = [
  { key: 'py_p1', name: 'Pyramid 포즈1', url: `${PY_}/pyramid_off_01.png`, orig: `${PY_}/pyramid_on_01.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'py_p2', name: 'Pyramid 포즈2', url: `${PY_}/pyramid_off_02.png`, orig: `${PY_}/pyramid_on_02.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'py_p3', name: 'Pyramid 포즈3', url: `${PY_}/pyramid_off_03.png`, orig: `${PY_}/pyramid_on_03.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'py_p4', name: 'Pyramid 포즈4', url: `${PY_}/pyramid_off_04.png`, orig: `${PY_}/pyramid_on_04.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'py_p5', name: 'Pyramid 포즈5', url: `${PY_}/pyramid_off_05.png`, orig: `${PY_}/pyramid_on_05.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'py_p6', name: 'Pyramid 포즈6', url: `${PY_}/pyramid_off_06.png`, orig: `${PY_}/pyramid_on_06.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// Pod 전용 실사 포즈 레퍼 — on: 01~04=.jpg / 05·06=.png, off: 전부 .png
const PD = 'https://yogibo.openhost.cafe24.com/web/img/none/pod';
const POD_REFS = [
  { key: 'pd_p1', name: 'Pod 포즈1', url: `${PD}/pod_off_01.png`, orig: `${PD}/pod_on_01.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'pd_p2', name: 'Pod 포즈2', url: `${PD}/pod_off_02.png`, orig: `${PD}/pod_on_02.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'pd_p3', name: 'Pod 포즈3', url: `${PD}/pod_off_03.png`, orig: `${PD}/pod_on_03.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'pd_p4', name: 'Pod 포즈4', url: `${PD}/pod_off_04.png`, orig: `${PD}/pod_on_04.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'pd_p5', name: 'Pod 포즈5', url: `${PD}/pod_off_05.png`, orig: `${PD}/pod_on_05.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'pd_p6', name: 'Pod 포즈6', url: `${PD}/pod_off_06.png`, orig: `${PD}/pod_on_06.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// Double 전용 실사 포즈 레퍼 — on: 전부 .jpg / off: 전부 .png
const DB = 'https://yogibo.openhost.cafe24.com/web/img/none/double';
const DOUBLE_REFS = [
  { key: 'db_p1', name: 'Double 포즈1', url: `${DB}/double_off_01.png`, orig: `${DB}/double_on_01.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'db_p2', name: 'Double 포즈2', url: `${DB}/double_off_02.png`, orig: `${DB}/double_on_02.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'db_p3', name: 'Double 포즈3', url: `${DB}/double_off_03.png`, orig: `${DB}/double_on_03.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// Support 전용 실사 포즈 레퍼 — on: 01=.png / 02=.jpg, off: 전부 .png
const SP = 'https://yogibo.openhost.cafe24.com/web/img/none/support';
const SUPPORT_REFS = [
  { key: 'sp_p1', name: 'Support 포즈1', url: `${SP}/support_off_01.png`, orig: `${SP}/support_on_01.png`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
  { key: 'sp_p2', name: 'Support 포즈2', url: `${SP}/support_off_02.png`, orig: `${SP}/support_on_02.jpg`, note: '실사 · 모델포함=자세/각도 · 모델제거=형태', tag: '실사' },
];

// 참고 포즈(타사) — 포즈/앵글/분위기만 참고, 제품·인물 복사 X. 생성 시 우리 제품 형태(off레퍼)로 락.
const TEST = 'https://yogibo.openhost.cafe24.com/web/img/none/test';
const MIDI_POSEREFS = [
  { key: 'tp01', name: '착석·다리 뻗고 릴랙스', url: `${TEST}/test_01.jpg`,  note: '¾ 착석 · 다리 뻗고 릴랙스' },
  { key: 'tp02', name: '보트 리클라이너·기대 눕기', url: `${TEST}/test_02.jpg`,  note: '¾측면 · 무릎 세우고 기대 눕기' },
  { key: 'tp03', name: '라운드 착석·랩탑', url: `${TEST}/test_03.jpg`,  note: '앉아서 랩탑 사용' },
  { key: 'tp04', name: '깊게 앉기·거실 세팅', url: `${TEST}/test_04.webp`, note: '¾정면 · 깊게 파묻혀 앉기' },
  { key: 'tp05', name: '사이드 리클라인', url: `${TEST}/test_05.jpg`,  note: '옆으로 기대 눕기' },
  { key: 'tp06', name: '플랫 리클라인(남성)', url: `${TEST}/test_06.jpg`,  note: '뒤로 기대 평평하게 눕기' },
  { key: 'tp07', name: '리클라인·헤드폰 릴랙스', url: `${TEST}/test_07.jpg`,  note: '¾ · 헤드폰 음악 릴랙스' },
];

// 썸네일용 전속 모델 (1차: 여성·남성) — 착석/라이프스타일 썸네일에 지정 사용. 헤어 업데이트 반영.
// outfits = MD 의상 컨셉 레퍼(제품컷 때 이 옷 입힘). 파일 = web/img/none/clothes/<name>.jpg
const CLOTHES = 'https://yogibo.openhost.cafe24.com/web/img/none/clothes';
const THUMB_MODELS = [
  {
    cat: '여성', emoji: '👩', items: [
      { code: 'A', rep: `${FTP}/B_A_rep.jpg?v=smile`, expr: `${FTP}/B_A_expr.png?v=hair`, desc: '유럽계 · 다크 텍스처 보브 · 키168 슬림 · 차분/미니멀',
        outfits: [{ f: 'A_W_C_01', t: '브라운 티+그레이 스웻' }] },
      { code: 'B', rep: `${FTP}/B_B_rep.jpg?v=e2`, expr: `${FTP}/B_B_expr.png?v=v2`, desc: '유럽계 · 롱 체스트넛 웨이브(주근깨) · 키172 · 청순/내추럴',
        outfits: [{ f: 'B_W_C_01', t: '그레이 티+데님 쇼츠' }, { f: 'B_W_C_02', t: '크림 오버셔츠+와이드' }] },
      { code: 'C', rep: `${FTP}/B_C_rep.jpg?v=smile`, expr: `${FTP}/B_C_expr.png?v=hair`, desc: '유럽계 · 블론드 레이어드 롭+커튼뱅 · 키169 · 쿨/미니멀',
        outfits: [{ f: 'C_W_C_01', t: '화이트 티+네이비 슬랙스' }] },
      { code: 'D', rep: `${FTP}/B_D_rep.jpg?v=smile2`, expr: `${FTP}/B_D_expr.png?v=hair`, desc: '동아시아계 · 롱 흑발+시스루뱅 · 키173 · 쿨/에디토리얼',
        outfits: [{ f: 'D_W_C_01', t: '그레이 티+라이트 배기진' }, { f: 'D_W_C_02', t: '네이비 스트라이프 니트' }] },
    ],
  },
  {
    cat: '남성', emoji: '👨', items: [
      { code: 'A', rep: `${FTP}/M_A_rep.jpg?v=smile`, expr: `${FTP}/M_A_expr.png?v=hair`, desc: '유럽계 · 미디엄 터슬드 웨이브 · 키180 · 클린컷/애슬레틱',
        outfits: [{ f: 'A_M_C_01', t: '그레이 티+스웻' }, { f: 'A_M_C_02', t: '화이트 티+블랙 슬랙스' }, { f: 'A_M_C_03', t: '올리브 후디+차콜' }] },
    ],
  },
  {
    cat: '아동', emoji: '🧒', items: [
      { code: 'K_A', rep: `${FTP}/K_A_rep_new.png?v=smile`, expr: `${FTP}/K_A_expr.png?v=braid`, desc: '유럽계 여아 6~7세 · 라이트브라운 양갈래 땋은머리(핀) · 밝고 명랑 · 키~120 · ①얼굴②표정 완료',
        outfits: [{ f: 'KID_A_01', t: '그레이 프린트 티+크림 반바지' }] },
      { code: 'K_B', rep: `${FTP}/K_B_rep_new.png?v=smile`, expr: `${FTP}/K_B_expr.png?v=straight`, desc: '유럽계 여아 10~12세 · 오번 롱 생머리(센터파트)·주근깨 · 청순 · 키~150 · ①얼굴②표정 완료',
        outfits: [{ f: 'KID_B_01', t: '아이보리 링거 티+그레이 숏팬츠' }] },
    ],
  },
];

// 썸네일 규격 프리셋
const SPECS = [
  { t: '상품 리스트', ratio: '1:1', use: 'cafe24 리스트 · 정사각' },
  { t: '상세/배너', ratio: '4:5 · 16:9', use: '상세 상단 · 배너' },
  { t: 'SNS', ratio: '4:5 · 9:16', use: '인스타 · 릴스/쇼츠' },
];

// 제품별 썸네일 작업 — 컬러별 슬롯. 제작되면 url 채움(그전엔 null=대기), key로 FTP 파일명(thumb_<product>_<key>.jpg)
const PRODUCTS = [
  {
    product: 'Max', emoji: '🛋️', spec: '대표 빈백 소파 · 170×70×45cm 6.6kg · Slim/Midi/Mini 동일 형태(사이즈만 다름)', ratio: '1:1', bg: '화이트', size: 'h170 × w70 × d45 · 6.6kg', scale: 'a large bean bag sofa as long as an adult is tall (170cm) - long enough for a grown-up to lie down on fully; stood upright it stands taller than a 160cm woman, topping her head by about 10cm',
    colors: [
      { key: 'aqua', name: '아쿠아블루', hex: '#0075BD', el: true, rep: true, cuts: [
        { url: `${FTP}/cand_max_aqua_b_p4_front.png?v=4`, spec: 'B · 포즈4 정면(플랫라운저·확대) · 미소 · 색보정 · #f2f2f4' },
        { url: `${FTP}/cand_max_aqua_b_pose2.png?v=2`, spec: 'B · 포즈2(체어·미소) · 색보정 · #f2f2f4' },
        { url: `${FTP}/cand_max_aqua_b_poseref.png?v=3`, spec: 'B · 포즈레퍼(리클라이너·은은한미소) · 색보정 · #f2f2f4' },
        { url: `${FTP}/cand_max_aqua_b_pose1.png?v=2`, spec: 'B · 포즈1(눕듯·곁눈질 미소) · Max확대·색스와치락 · #f2f2f4' },
      ] },
      { key: 'navy', name: '네이비블루', hex: '#1D395D', el: true, rep: true, cuts: [
        { url: `${FTP}/cand_max_navy_c_pose1.png?v=2`, spec: 'C · 포즈1(눕듯·밝은미소) · 아쿠아연출 비례·얼굴C재락 · #f2f2f4' },
        { url: `${FTP}/cand_max_navy_c_pose3.png?v=1`, spec: 'C · 포즈3(리클라이너·은은한미소) · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_navy_c_pose4.png?v=1`, spec: 'C · 포즈4(플랫라운저·곁눈질미소) · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_navy_c_pose2_smile.png?v=1`, spec: 'C · 포즈2(체어·밝은미소) · 표정변화컷 · #f2f2f4' },
      ] },
      { key: 'olive', name: '올리브그린', hex: '#668B01', el: true, rep: true, cuts: [
        { url: `${FTP}/cand_max_olive_a_pose1.png?v=1`, spec: 'A · 포즈1(눕듯·밝은미소) · A_W_C_01 · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_olive_a_poseref.png?v=1`, spec: 'A · 포즈레퍼(낮은크레스트·은은한미소) · A_W_C_01 · #f2f2f4' },
        { url: `${FTP}/cand_max_olive_a_pose2.png?v=1`, spec: 'A · 포즈2(체어·곁눈질미소) · A_W_C_01 · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_olive_a_pose4.png?v=1`, spec: 'A · 포즈4(플랫라운저·따뜻한미소) · A_W_C_01 · 색스와치락 · #f2f2f4' },
      ] },
      { key: 'darkgrey', name: '다크그레이', hex: '#353B3E', el: true, url: `${FTP}/cand_max_darkgrey_ma_p5.png?v=2`, spec: '남A · 포즈5(게이밍·미소) · A_M_C_02 · 2048' },
      { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3' },
      { key: 'chocobrown', name: '초코브라운', hex: '#583E30' },
      { key: 'cherryred', name: '체리레드', hex: '#790619', el: true, url: `${FTP}/cand_max_cherry_b_pose.png?v=1`, spec: 'B모델(172) · test02 포즈(리클라이너·미소) · B_W_C_02 · 2048' },
      { key: 'wineburgundy', name: '와인버건디', hex: '#7A031F' },
      { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19' },
      { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_support_coral_b_jp2_floral.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·플로럴 톱·방 배경 유지) + 얼굴/헤어만 모델B 교체(포토 에딧) · 리빙코랄 · 원본 의상 버전' },
      { url: `${FTP}/cand_support_sweetorange_b_jp2.png?v=2`, spec: 'B(172cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·플로럴 톱·방 배경 유지) + 얼굴/헤어만 모델B 교체(포토 에딧) · 컬러명 코랄로 등록 · 2샘플 중 선택 · 1회생성(미검수) · v2 의상 크림 오버셔츠+와이드(B_W_C_02)로 교체(포토 에딧·2샘플 중 1)' },
      { url: `${FTP}/cand_support_coral_ma_jp2.png?v=1`, spec: '남성A(180cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·방 배경 유지) + 인물을 남성A로 교체 + 흰 반팔티·청바지(포토 에딧) · 2샘플 중 선택 · 1회생성(미검수)' },
    ] },
    { key: 'sweetorange', name: '스위트오렌지', hex: '#EE780C', el: true, rep: true, cuts: [
        { url: `${FTP}/cand_max_sweetorange_d_pose1.png?v=1`, spec: 'D · 포즈1(눕듯·밝은미소) · D_W_C_01 · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_sweetorange_d_pose2.png?v=1`, spec: 'D · 포즈2(체어·은은한미소) · D_W_C_01 · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_sweetorange_d_pose3.png?v=1`, spec: 'D · 포즈3(리클라이너·곁눈질미소) · D_W_C_01 · 색스와치락 · #f2f2f4' },
        { url: `${FTP}/cand_max_sweetorange_d_pose4.png?v=1`, spec: 'D · 포즈4(플랫라운저·따뜻한미소) · D_W_C_01 · 색스와치락 · #f2f2f4' },
      ] },
      { key: 'brightyellow', name: '브라이트옐로우', hex: '#EBCD00' },
      { key: 'rosepink', name: '로즈핑크', hex: '#EF0066' },
      { key: 'blossompink', name: '블라썸핑크', hex: '#E5B9C8' },
      { key: 'brightpurple', name: '브라이트퍼플', hex: '#644D9A' },
      { key: 'deeppurple', name: '딥퍼플', hex: '#5F2A38' },
      { key: 'lavender', name: '라벤더퍼플', hex: '#CDA7DB' },
      { key: 'pastelblue', name: '파스텔블루', hex: '#BEDDEF' },
      { key: 'freshmint', name: '프레시민트', hex: '#B0EEE7' },
    ],
  },
  { product: 'Slim',    emoji: '📏', spec: 'Max 동일 형태 · 130×65×45cm 4.4kg · 폭 슬림(세로형) · Slim 전용 실사레퍼', ratio: '1:1', sameLine: 'Max', size: 'h130 × w65 × d45 · 4.4kg', models: '여성A · 여성B · 여성D · 남성A', refs: SLIM_REFS, scale: 'a narrow vertical bean bag about chest height of a standing adult (130cm); one adult reclines against it with legs extended', colors: [
    { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_slim_lightgrey_b_p4.png?v=2`, spec: 'B · 포즈4(로우 라운저·엎드려 릴랙스) · 볼륨보정(통통) · 그레이티+데님쇼츠 · 중앙 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_b_p2_v2.png?v=2`, spec: 'B · 포즈2(보트 리클라이너) · 그레이티+데님쇼츠 · 중앙 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_b_p3.png?v=1`, spec: 'B · 포즈3(업라이트 리클라이너) · 그레이티+데님쇼츠 · 중앙 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_b_hug.png?v=5`, spec: 'B · 허그 연출(실물 slim_05 on/off 레퍼락·두께면 보임·팔 끝까지 안감김·바닥~머리 스케일) · 그레이티+데님쇼츠 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_ma_p6.png?v=1`, spec: '남성A(180cm) · 포즈6(업라이트 체어·게이밍·¾측면) · 화이트티+블랙슬랙스 · 라이트그레이 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_duo_p9.png?v=3`, spec: '여성A + 남성A 2인 · 포즈9(게이밍·자연스러운 연출) · 실물 slim_09 on/off 형태락(체어형·130 사이즈·유령머리 해결) · 그레이티+롱와이드데님 / 화이트티+블랙슬랙스 · 라이트그레이+리빙코랄 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_ma_p3.png?v=1`, spec: '남성A(180cm) · 포즈3(업라이트 리클라이너) · 올리브후디+차콜조거 · 라이트그레이 · #f2f2f4' },
      { url: `${FTP}/cand_slim_lightgrey_ma_p3_white.png?v=1`, spec: '남성A(180cm) · 포즈3(업라이트 리클라이너) · 화이트티+블랙슬랙스 · 라이트그레이 · #f2f2f4' },
      // 숨김(들고있기 포기): { url: `${FTP}/cand_slim_lightgrey_b_hold.png?v=2`, spec: 'B · 살짝 들고 있는 연출(firm 유지·밑단만 바닥에서 띄움·바람빠짐 없음) · 그레이티+데님쇼츠 · #f2f2f4' },
    ] },
    { key: 'olive', name: '올리브그린', hex: '#668B01', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_slim_olive_d_p2.png?v=1`, spec: 'D · 포즈2(보트 리클라이너) · 네이비 스트라이프 니트(긴팔)+데님쇼츠 · 올리브 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_slim_olive_d_p3.png?v=1`, spec: 'D · 포즈3(업라이트 리클라이너) · 네이비 스트라이프 니트(반팔)+데님쇼츠 · 올리브 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_slim_olive_d_p2b.png?v=2`, spec: 'D · 보트 리클라이너(포즈 변화·팔 젖혀 릴랙스·다리 교차) · 네이비 스트라이프 니트+데님쇼츠 · 올리브 #668B01(색보정: 밝게) · #f2f2f4' },
    ] },
    { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_slim_coral_a_p4.png?v=1`, spec: 'A · 포즈4(로우 라운저·엎드려 릴랙스) · 브라운 티+그레이 스웻팬츠 · 리빙코랄 #EA3D19 · #f2f2f4' },
      { url: `${FTP}/cand_slim_coral_a_p3.png?v=1`, spec: 'A · 포즈3(업라이트 리클라이너) · 브라운 티+그레이 스웻팬츠 · 리빙코랄 #EA3D19 · #f2f2f4' },
      { url: `${FTP}/cand_slim_coral_a_p2.png?v=1`, spec: 'A · 포즈2(보트 리클라이너) · 브라운 티+그레이 스웻팬츠 · 리빙코랄 #EA3D19 · #f2f2f4' },
    ] },
  ] },
  { product: 'Midi',    emoji: '🟦', spec: 'Max 동일 형태 · 125×70×45cm 4.8kg · 가슴 높이 · 눌림레퍼 공유', ratio: '1:1', sameLine: 'Max', size: 'h125 × w70 × d45 · 4.8kg', models: '여성A · 여성B · 여성D · 남성A', refs: MIDI_REFS, scale: 'a mid-size bean bag reaching an adult chest when stood upright (125cm); one adult can curl up on it lying down, or sit with full back support', colors: [
    { key: 'lavender', name: '라벤더퍼플', hex: '#CDA7DB', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_midi_lavender_d_m01.png?v=1`, spec: '여성D(173cm) · Midi포즈1(플랫 라운저·누워 양팔 스트레칭·midi_01 on/off 각도락) · 그레이티+라이트배기진(D_W_C_01 의상레퍼) · 라벤더퍼플 #CDA7DB · 125×70×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_midi_lavender_b_p2.png?v=1`, spec: 'B · 포즈2 실사레퍼 형태락(보트 리클라이너) + 사이드 리클라인 연출 · 크림 오버셔츠+와이드(B_W_C_02 의상레퍼) · 라벤더퍼플 #CDA7DB · #f2f2f4' },
      { url: `${FTP}/cand_midi_lavender_b_p3.png?v=2`, spec: 'B · 포즈3(업라이트 리클라이너·책읽기 ¾정면·slim_03 on/off 자세각도락·소프트 빈백폼) · 크림 오버셔츠+와이드(B_W_C_02 의상레퍼) · 라벤더퍼플 #CDA7DB · #f2f2f4' },
      { url: `${FTP}/cand_midi_lavender_b_p8.png?v=1`, spec: 'B · 포즈8(허그·옆 감싸안기·팔 끝까지 안감김) · 크림 오버셔츠+와이드(B_W_C_02 의상레퍼) · 라벤더퍼플 #CDA7DB · #f2f2f4' },
    ] },
    { key: 'navy', name: '네이비블루', hex: '#1D395D', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_midi_navy_a_p3.png?v=1`, spec: '여성A(168cm) · 포즈3(업라이트 리클라이너·책읽기 ¾정면·소프트 빈백폼) · 브라운티+그레이스웻(A_W_C_01 의상레퍼) · 네이비블루 #1D395D · #f2f2f4' },
      // 숨김: { url: `${FTP}/cand_midi_navy_a_p2.png?v=1`, spec: '여성A(168cm) · 포즈2(보트 리클라이너·소프트 빈백폼) · 브라운티+그레이스웻(A_W_C_01 의상레퍼) · 네이비블루 #1D395D · #f2f2f4' },
      { url: `${FTP}/cand_midi_navy_a_m01.png?v=1`, spec: '여성A(168cm) · Midi포즈1(플랫 라운저·누워 양팔 스트레칭·midi_01 on/off 각도락) · 브라운티+그레이스웻(A_W_C_01 의상레퍼) · 네이비블루 #1D395D · #f2f2f4' },
    ] },
    { key: 'darkgrey', name: '다크그레이', hex: '#353B3E', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_midi_darkgrey_d_m01.png?v=2`, spec: '여성D(173cm) · Midi포즈1(플랫 라운저·누워 양팔 스트레칭·midi_01 on/off 각도락) · 그레이티+라이트배기진(D_W_C_01 의상레퍼) · 다크그레이 #353B3E · 125×70×45 실측비례 · 1회생성(미검수) · #f2f2f4 · v2 형태(낮은 롱 웨지)+포즈+얼굴 3중 잠금 재생성(2샘플 중 fix2)' },
      { url: `${FTP}/cand_midi_darkgrey_d_p3.png?v=1`, spec: '여성D(173cm) · 포즈3(업라이트 리클라이너·책읽기 ¾정면·소프트 빈백폼) · 그레이티+라이트배기진(D_W_C_01 의상레퍼) · 다크그레이 #353B3E · 네이비 여성A p3 컷 베이스 포토에딧(리컬러+얼굴/의상 교체·2샘플 중 a) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_midi_darkgrey_ma_p2.png?v=2`, spec: '남성A(180cm) · 포즈2(보트 리클라이너) · 그레이티+그레이와이드팬츠(A_M_C_01 의상레퍼) · 다크그레이 #353B3E(색보정 통일) · #f2f2f4' },
      { url: `${FTP}/cand_midi_darkgrey_ma_t06.png?v=2`, spec: '남성A(180cm) · test06 참고포즈(플랫 리클라인·뒤로 기대 눕기·타사포즈+우리제품 형태락) · 화이트티+블랙와이드(A_M_C_02 의상레퍼) · 다크그레이 #353B3E(색보정 통일) · #f2f2f4' },
      { url: `${FTP}/cand_midi_darkgrey_ma_p3.png?v=2`, spec: '남성A(180cm) · 포즈3(업라이트 리클라이너·소프트라운드) · 올리브후디+차콜와이드(A_M_C_03 의상레퍼) · 다크그레이 #353B3E(색보정 통일) · #f2f2f4' },
    ] },
    { key: 'cherryred', name: '체리레드', hex: '#790619', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_midi_cherry_duo_p4.png?v=1`, spec: '아동A(6~7세) + 아동B(10~12세) 2인 · Mini 포즈4 모델 레퍼(mini_04_on·자매 함께 앉기) 원본 그대로(의상·포즈·흰 배경 유지) + 체리레드 리컬러·태그 제거 + 두 아이 얼굴/헤어만 아동A·아동B로 교체(포토 에딧) · 체리레드 #790619 · 2샘플 중 b · 1회생성(미검수)' },
    ] },
  ] },
  { product: 'Mini',    emoji: '🔹', spec: 'Max 동일 형태 · 85×70×45cm 3.2kg · 엉덩이 높이·1인 시트 · 눌림레퍼 공유', ratio: '1:1', sameLine: 'Max', size: 'h85 × w70 × d45 · 3.2kg', models: '아동A · 아동B · 여성B · 여성C · 남성A', refs: MINI_REFS, scale: 'a compact bean bag about hip-height of a standing adult (85cm); a single seat where an adult sits with knees bent, child-friendly size', colors: [
    { key: 'chocobrown', name: '초코브라운', hex: '#583E30', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_mini_choco_ka_p5.png?v=1`, spec: '아동A(~120cm) · 포즈5(앉아 공부·무릎 트레이·mini_05 on/off 각도락) · KID_A_01 고정의상(그레이 프린트티+크림 반바지) · 초코브라운 #583E30 · #f2f2f4' },
      { url: `${FTP}/cand_mini_choco_ka_p7.png?v=2`, spec: '아동A(~120cm) · 포즈7(착석 독서·무릎에 책·mini_07 on/off 각도락) · KID_A_01 고정의상 · 초코브라운 #583E30 · #f2f2f4' },
      { url: `${FTP}/cand_mini_choco_duo_p4.png?v=1`, spec: '아동A + 아동B 2인 · 포즈4(자매 함께 앉기·mini_04 on/off 각도락) · KID_A_01 / KID_B_01 고정의상 · 초코브라운 #583E30 · #f2f2f4' },
    ] },
    { key: 'cherryred', name: '체리레드', hex: '#790619', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_mini_cherry_kb_p7.png?v=1`, spec: '아동B(~150cm) · 포즈7(착석 독서·둥근 빈백폼) · KID_B_01 고정의상(아이보리 링거티+그레이 숏팬츠) · 체리레드 #790619 · #f2f2f4' },
      { url: `${FTP}/cand_mini_cherry_kb_p6.png?v=1`, spec: '아동B(~150cm) · 포즈6(티어드롭 Mini 안에 폭 앉아 태블릿·측면·mini_06 형태락+승인 p7 컷 비례/컬러 레퍼) · KID_B_01 고정의상 · 체리레드 #790619 · 85×70×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_mini_cherry_kb_p1.png?v=1`, spec: '아동B(~150cm) · 포즈1(사이드 리클라인·턱 괴기·¾측면·mini_01 on/off 각도락+승인 p7 컷 비례/컬러 레퍼) · KID_B_01 고정의상 · 체리레드 #790619 · 85×70×45 실측비례 · 2샘플 중 b(둥근 티어드롭) · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_mini_cherry_duo_p4jp.png?v=1`, spec: '아동A(6~7세) + 아동B(10~12세) 2인 · Mini 포즈4 모델 레퍼(mini_04_on·자매 함께 앉기) 원본 그대로(의상·포즈·흰 배경 유지) + 체리레드 리컬러·태그 제거 + 두 아이 얼굴/헤어만 아동A·아동B로 교체(포토 에딧) · 체리레드 #790619 · 2샘플 중 a · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_mini_cherry_duo_p4.png?v=1`, spec: '아동A + 아동B 2인 · 포즈4(자매 함께 앉기·mini_04 on/off 각도락) · KID_A_01 / KID_B_01 고정의상 · 체리레드 #790619 · 85×70×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      // 숨김: { url: `${FTP}/cand_mini_cherry_kb_p5.png?v=2`, spec: '아동B(~150cm) · 포즈5(앉아 공부·무릎 트레이·티어드롭 형태·실측 비례) · KID_B_01 고정의상 · 체리레드 #790619 · #f2f2f4' },
      // 숨김: { url: `${FTP}/cand_mini_cherry_kb_p2.png?v=2`, spec: '아동B(~150cm) · 포즈2(바닥 라운지·체스·티어드롭 형태·실측 비례) · KID_B_01 고정의상 · 체리레드 #790619 · #f2f2f4' },
    ] },
    { key: 'avocadogreen', name: '아보카도그린', hex: '#7AA991', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_mini_avo_c_p1.png?v=1`, spec: '여성C(169cm) · 포즈1(사이드 리클라인·티어드롭 형태·실측 비례) · 화이트티+네이비 와이드(C_W_C_01 의상레퍼) · 아보카도그린 #7AA991 · #f2f2f4' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_mini_avo_c_p6.png?v=1`, spec: '여성C(169cm) · 포즈6(폭 안겨 앉아 독서·측면·티어드롭 형태·실측 비례) · 화이트티+네이비 와이드(C_W_C_01 의상레퍼) · 아보카도그린 #7AA991 · #f2f2f4' },
      { url: `${FTP}/cand_mini_avo_b_p2.png?v=1`, spec: '여성B(172cm) · 포즈2(바닥 착석·Mini에 옆으로 기대기·¾측면·mini_02 on/off 각도락·소품 제거) · 크림 오버셔츠+와이드(B_W_C_02 의상레퍼) · 아보카도그린 #7AA991(승인 C p1 컷 컬러 레퍼) · 85×70×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_mini_avo_b_p3.png?v=1`, spec: '여성B(172cm) · 포즈3(세운 Mini 앞 바닥 착석·독서·¾정면·mini_03 형태락) · 크림 오버셔츠+와이드(B_W_C_02 의상레퍼) · 아보카도그린 #7AA991(승인 C p1 컷 컬러 레퍼) · 85×70×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
    ] },
  ] },
  { product: 'Drop',    emoji: '💧', spec: '라운드 물방울형 · 75×85×85cm 3.7kg · 착석/랩탑 연출', ratio: '1:1', size: 'h75 × w85 × d85 · 3.7kg', models: '아동A · 아동B · 여성B · 여성C · 남성A', scale: 'a round droplet-shaped bean bag about the height of a seated adult shoulders (75cm); one adult sinks into it with knees bent', refs: DROP_REFS, colors: [
    { key: 'olive', name: '올리브그린', hex: '#668B01', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_drop_olive_b_p1.png?v=1`, spec: 'B(172cm) · 포즈1(책상다리 착석·머그·¾정면) · 크림 오버셔츠+와이드(B_W_C_02) · 올리브그린 #668B01 · 75×85×85 실측비례 · #f2f2f4' },
      { url: `${FTP}/cand_drop_olive_b_p4.png?v=1`, spec: 'B(172cm) · 포즈4(뒤로 기대 스트레칭·측면) · 크림 오버셔츠+와이드(B_W_C_02) · 올리브그린 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_drop_olive_b_p5.png?v=1`, spec: 'B(172cm) · 포즈5(다리 접고 앉아 독서·¾측면) · 크림 오버셔츠+와이드(B_W_C_02) · 올리브그린 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_drop_olive_ka_p2.png?v=1`, spec: '아동A(6~7세·120cm) · 포즈2(옆으로 기대 턱괴고 릴랙스·측면) · KID_A_01 고정의상 · 올리브그린 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_drop_olive_ka_p3.png?v=1`, spec: '아동A(6~7세·120cm) · 포즈3(팔 올린 활기 릴랙스·¾측면) · KID_A_01 고정의상 · 올리브그린 #668B01 · #f2f2f4' },
      { url: `${FTP}/cand_drop_olive_ka_p4.png?v=1`, spec: '아동A(6~7세·120cm) · 포즈4(뒤로 기대 스트레칭·측면) · KID_A_01 고정의상 · 올리브그린 #668B01 · #f2f2f4' },
    ] },
    { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_drop_coral_c_p1.png?v=1`, spec: 'C(169cm) · 포즈1(책상다리 착석·머그·¾정면) · 화이트티+네이비 와이드(C_W_C_01) · 리빙코랄 #EA3D19 · 75×85×85 실측비례 · #f2f2f4' },
      { url: `${FTP}/cand_drop_coral_c_p3.png?v=1`, spec: 'C(169cm) · 포즈3(기대 릴랙스·팔 올린 활기 연출) · 화이트티+네이비 와이드(C_W_C_01) · 리빙코랄 #EA3D19 · #f2f2f4' },
      { url: `${FTP}/cand_drop_coral_c_p5.png?v=1`, spec: 'C(169cm) · 포즈5(다리 접고 앉아 독서·¾측면) · 화이트티+네이비 와이드(C_W_C_01) · 리빙코랄 #EA3D19 · #f2f2f4' },
    ] },
    { key: 'aqua', name: '아쿠아블루', hex: '#0075BD', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_drop_aqua_kb_p2.png?v=2`, spec: '아동B(12세·150cm) · 포즈2(옆으로 기대 턱괴고 릴랙스·측면) · KID_B_01 고정의상 · 아쿠아블루 #0075BD · 75×85×85 실측비례 · 좌하단 꽁지 제거(v2·원본=_orig) · #f2f2f4' },
      { url: `${FTP}/cand_drop_aqua_kb_p5.png?v=3`, spec: '아동B(12세·150cm) · 포즈5(다리 접고 앉아 독서·¾측면) · KID_B_01 고정의상 · 아쿠아블루 #0075BD(얼굴 재생성) · #f2f2f4' },
      { url: `${FTP}/cand_drop_aqua_kb_p6.png?v=2`, spec: '아동B(12세·150cm) · 포즈6(깊게 파묻혀 릴랙스·¾정면·얼굴/배경 재생성) · KID_B_01 고정의상 · 아쿠아블루 #0075BD · #f2f2f4' },
      // 숨김(2026-08-23 검수 · 남성A Drop p1): { url: `${FTP}/cand_drop_aqua_ma_p1.png?v=1`, spec: '남성A(180cm) · 포즈1(책상다리 착석·머그·¾정면) · 화이트티+블랙와이드(A_M_C_02) · 아쿠아블루 #0075BD · #f2f2f4' },
      // 숨김(2026-08-23 검수 · 남성A Drop p5): { url: `${FTP}/cand_drop_aqua_ma_p5.png?v=2`, spec: '남성A(180cm) · 포즈5(다리 접고 앉아 독서·¾측면) · 화이트티+블랙와이드(A_M_C_02) · 아쿠아블루 #0075BD · 좌하단 꽁지 제거(v2·원본=_orig) · #f2f2f4' },
      { url: `${FTP}/cand_drop_aqua_ma_p8.png?v=2`, spec: '남성A(180cm) · 포즈8(비스듬히 기대 다리 뻗고 독서·¾측면) · 화이트티+블랙와이드(A_M_C_02) · 아쿠아블루 #0075BD · 좌하단 꽁지 제거(v2·원본=_orig) · #f2f2f4' },
    ] },
    { key: 'chocobrown', name: '초코브라운', hex: '#583E30', el: true, url: `${FTP}/cand_max_choco_c_pose.png?v=1`, spec: 'C모델 · 랩탑연출 · C_W_C_01 (실험컷, 매트릭스 외)' },
  ] },
  { product: 'Lounger', emoji: '🏖️', spec: '낮은 라운지체어 · 60×65×80cm 4.4kg', ratio: '1:1', size: 'h60 × w65 × d80 · 4.4kg', models: '아동A · 아동B · 여성B · 여성C · 남성A', scale: 'a low lounge chair bean bag about knee-height of a standing adult (60cm); a one-person seat whose backrest reaches a seated adult mid-back', refs: LOUNGER_REFS, colors: [
    { key: 'pastelblue', name: '파스텔블루', hex: '#BEDDEF', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_lounger_pastelblue_c_p5.png?v=2`, spec: '여성C(169cm) · Lounger 포즈5(무릎 안고 깊게 착석·¾정면·lounger_05 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01) · 파스텔블루 #BEDDEF · v2 검정 파이핑 라인(포즈6 레퍼 제품선) · 크기 보정 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_lounger_pastelblue_c_p2.png?v=4`, spec: '여성C(169cm) · Lounger 포즈2(등받이에 팔꿈치·턱괴고 다리 교차 릴랙스·¾정면·lounger_02 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01) · 파스텔블루 #BEDDEF · 검정 파이핑 라인 · v5 얼굴+포즈+형태 3중 잠금 재생성 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-22 검수 · 모델 상이+형태 불량, 재생성 대기): { url: `${FTP}/cand_lounger_pastelblue_c_p4.png?v=4`, spec: '여성C(169cm) · Lounger 포즈4(업라이트 착석·화이트 게임패드·다리 뻗기·¾정면·lounger_04 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01) · 파스텔블루 #BEDDEF · v2 검정 파이핑 라인 · 1회생성(미검수) · #f2f2f4 · v4 얼굴 고정+소프트 빈백 형태 보정' },
      { url: `${FTP}/cand_lounger_pastelblue_b_p1.png?v=2`, spec: 'B(172cm) · Lounger 포즈1(착석·머그·¾정면·lounger_01 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 파스텔블루 #BEDDEF · 검정 파이핑 라인 · v2 소프트 형태 3중잠금 · 1회생성(미검수) · #f2f2f4' },
      // 제외(2026-08-22): cand_lounger_pastelblue_c_p2_alt — 파이핑 없는 구버전(미재생성)
    ] },
    { key: 'freshmint', name: '프레시민트', hex: '#B0EEE7', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 검수 · B Lounger 민트 p4): { url: `${FTP}/cand_lounger_freshmint_b_p4.png?v=2`, spec: 'B(172cm) · Lounger 포즈4(업라이트 착석·화이트 게임패드·다리 뻗기·¾정면·lounger_04 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · 검정 파이핑 라인(포즈2 레퍼) · 1회생성(미검수) · #f2f2f4 · v2 배경 제거 재생성' },
      { url: `${FTP}/cand_lounger_freshmint_b_p5.png?v=1`, spec: 'B(172cm) · Lounger 포즈5(무릎 안고 깊게 착석·¾정면·lounger_05 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · 검정 파이핑 라인 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_lounger_freshmint_b_p1.png?v=1`, spec: 'B(172cm) · Lounger 포즈1(착석·머그·¾정면·lounger_01 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · 검정 파이핑 라인 · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'navy', name: '네이비블루', hex: '#1D395D', el: true, rep: true, cuts: [
      // 삭제(2026-08-22 검수): cand_lounger_navy_ma_p5
      { url: `${FTP}/cand_lounger_navy_ma_p2.png?v=1`, spec: '남성A(180cm) · Lounger 포즈2(등받이에 팔꿈치·턱괴고 다리 교차 릴랙스·¾정면·lounger_02 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) · 네이비블루 #1D395D · 라이트그레이 파이핑 라인 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_lounger_navy_ma_p1.png?v=1`, spec: '남성A(180cm) · Lounger 포즈1(착석·머그·¾정면·lounger_01 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) · 네이비블루 #1D395D · 라이트그레이 파이핑 라인 · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'olive', name: '올리브그린', hex: '#668B01', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_lounger_olive_ka_p3.png?v=1`, spec: '아동A(6~7세·120cm) · Lounger 포즈3(정면 착석·팔짱·다리 뻗기·lounger_03 on/off 각도락) · KID_A_01 고정의상 · 올리브그린 #668B01 · 검정 파이핑 라인 · 60×65×80 고정크기(아이 작게) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_lounger_olive_ka_p7.png?v=2`, spec: '아동A(6~7세·120cm) · Lounger 포즈7(착석·인형 들고 놀이·¾정면·lounger_07 on/off 각도락) · KID_A_01 고정의상 · 올리브그린 #668B01 · 검정 파이핑 라인 · v2 승인된 p3 컷과 동일 비례 잠금(사이즈 레퍼 첨부) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_lounger_olive_ka_p4.png?v=2`, spec: '아동A(6~7세·120cm) · Lounger 포즈4(업라이트 착석·화이트 게임패드·다리 뻗기·¾정면·lounger_04 on/off 각도락) · KID_A_01 고정의상 · 올리브그린 #668B01 · 검정 파이핑 라인 · v2 승인된 p3 컷과 동일 비례 잠금(사이즈 레퍼 첨부) · 1회생성(미검수) · #f2f2f4' },
      // 교체(2026-08-22 검수): cand_lounger_olive_ka_p4/p7 v1 → v2(승인 p3 비례 잠금)
    ] },
  ] },
  { product: 'Pyramid', emoji: '🔺', spec: '삼각 플로어쿠션 · 66×75×75cm 2.2kg', ratio: '1:1', size: 'h66 × w75 × d75 · 2.2kg', models: '아동A · 아동B · 여성B · 여성C · 남성A', scale: 'a triangular floor cushion about knee-height of a standing adult (66cm); one adult sits against its slope, a child can climb onto it', refs: PYRAMID_REFS, colors: [
    { key: 'blossompink', name: '블라썸핑크', hex: '#E5B9C8', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 검수): { url: `${FTP}/cand_pyramid_blossompink_b_p1.png?v=3`, spec: 'B(172cm) · Pyramid 포즈1(바닥 착석·세운 피라미드에 기대기·¾측면·pyramid_01 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 블라썸핑크 #E5B9C8 · 66×75×75 실측비례 · 1회생성(미검수) · #f2f2f4 · v2 하단 볼륨감(둥근감) 보정 · v3 둥근 눌림 재생성(눌림 레퍼 첨부)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_blossompink_b_p5.png?v=2`, spec: 'B(172cm) · Pyramid 포즈5(눕힌 피라미드에 착석·랩탑·환호·¾정면·pyramid_05 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 블라썸핑크 #E5B9C8 · 1회생성(미검수) · #f2f2f4 · v2 둥근 눌림 재생성(눌림 레퍼 첨부)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_blossompink_b_p2.png?v=1`, spec: '여성B(172cm) · Pyramid 포즈2(눕힌 피라미드 착석·머그·¾정면·pyramid_02 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01 의상레퍼) · 블라썸핑크 #E5B9C8 · 66×75×75 고정크기 · 둥근 눌림 레퍼 첨부 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pyramid_blossompink_b_p3.png?v=1`, spec: '여성B(172cm) · Pyramid 포즈3(세운 피라미드 앞 바닥 착석·독서·정면·pyramid_03 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01 의상레퍼) · 블라썸핑크 #E5B9C8 · 66×75×75 고정크기 · 1차 과대 → SIZE+눌림 오버라이드 재생성(2샘플 중 fix2) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pyramid_blossompink_b_jp5.png?v=2`, spec: '여성B(172cm) · pyramid_05 모델 레퍼(Premium+) 원본 그대로(눕힌 피라미드 형태·랩탑·환호·흰 배경) + 텍스트 제거 + 블라썸핑크 리컬러 + 얼굴/헤어 B·의상 B_W_C_01 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 a · 1회생성(미검수) · v2 오른쪽 헤어 뒤 핑크 얼룩 리터치(해당 영역만 합성)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_blossompink_fa_jp5.png?v=1`, spec: '여성A(168cm) · pyramid_05 모델 레퍼(Premium+) 원본 그대로(눕힌 피라미드 형태·랩탑·환호·흰 배경) + 텍스트 제거 + 블라썸핑크 리컬러 + 얼굴/헤어 여성A·기본 의상 A_W_C_01(브라운티+그레이스웻) 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_blossompink_b_jp7.png?v=1`, spec: '여성B(172cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·흰 배경) + 블라썸핑크 리컬러 + 얼굴/헤어 B·의상 B_W_C_01 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 b · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_blossompink_b_jp4.png?v=1`, spec: '여성B(172cm) · Pyramid 포즈4 모델 레퍼(pyramid_on_04) 원본 그대로(방 배경·노란 테이블·랩탑·캡+헤드폰·눕힌 피라미드 착석) + 블라썸핑크 컬러 + 얼굴/헤어만 B 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_blossompink_d_jp4.png?v=1`, spec: '여성D(173cm) · Pyramid 포즈4 모델 레퍼(pyramid_on_04) 원본 그대로(방 배경·노란 테이블·랩탑·캡+헤드폰·눕힌 피라미드 착석) + 블라썸핑크 컬러 + 얼굴/헤어만 D 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_blossompink_b_jp1.png?v=1`, spec: '여성B(172cm) · Pyramid 포즈1 모델 레퍼(pyramid_on_01·Premium) 원본 그대로(세운 피라미드 기대 앉기·어깨너머 시선·블라썸핑크) + 배경 #f2f2f4 정리·텍스트 제거 + 얼굴/헤어 B·의상 B_W_C_01 교체(포토 에딧) · 블라썸핑크 #E5B9C8 · 2샘플 중 b · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_blossompink_kb_p2.png?v=5`, spec: '아동B(10~12세·150cm) · Pyramid 포즈2(눕힌 피라미드에 착석·인형 안기·¾정면·pyramid_02 on/off 각도락) · KID_B_01 고정의상 · 블라썸핑크 #E5B9C8 · 66×75×75 고정크기 · 1회생성(미검수) · #f2f2f4 · v2 하단 길이 축소(원형 비례) · v3 둥근 눌림 재생성(눌림 레퍼 첨부) · v4 피라미드 크기 축소 · v5 얼굴만 아동B로 재교체(포토 에딧)' },
      // 숨김(2026-08-23 v4 얼굴 고정 재생성 잘못나옴): { url: `${FTP}/cand_pyramid_blossompink_kb_p3.png?v=4`, spec: '아동B(10~12세·150cm) · Pyramid 포즈3(세운 피라미드 앞 바닥 착석·인형·정면·pyramid_03 on/off 각도락) · KID_B_01 고정의상 · 블라썸핑크 #E5B9C8 · v2 꼭짓점 완만하게 보정 · 1회생성(미검수) · #f2f2f4 · v3 둥근 눌림 재생성(눌림 레퍼 첨부) · v4 얼굴 고정 재생성' },
    ] },
    { key: 'pastelblue', name: '파스텔블루', hex: '#BEDDEF', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 검수): { url: `${FTP}/cand_pyramid_pastelblue_ka_p2.png?v=2`, spec: '아동A(6~7세·120cm) · Pyramid 포즈2(눕힌 피라미드에 착석·인형 안기·¾정면·pyramid_02 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · 66×75×75 고정크기(아이 작게) · 1회생성(미검수) · #f2f2f4 · v2 하단 길이 축소(원형 비례)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_pastelblue_ka_p3.png?v=4`, spec: '아동A(6~7세·120cm) · Pyramid 포즈3(세운 피라미드 앞 바닥 착석·인형·정면·pyramid_03 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · v2 피라미드 약간 축소(꼭짓점 머리 조금 위) · 1회생성(미검수) · #f2f2f4 · v3 레퍼 느낌(앞에 걸터앉기·꼭짓점 머리 바로 위·둥근 눌림) 크기 축소 · v4 얼굴만 아동A로 재교체(포토 에딧)' },
      { url: `${FTP}/cand_pyramid_pastelblue_ka_jp1.png?v=1`, spec: '아동A(6~7세·120cm) · yogibo.jp 레퍼(pre-prm-rd) 원본 그대로(눕힌 피라미드 착석·핑크 돼지 인형·흰 배경) + 배지/텍스트/태그 제거 + 파스텔블루 리컬러 + 얼굴/헤어 아동A·의상 KID_A_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_pastelblue_ka_p3jp.png?v=1`, spec: '아동A(6~7세·120cm) · Pyramid 포즈3 모델 레퍼(pyramid_on_03) 원본 그대로(세운 피라미드 앞 착석·원숭이 인형·흰 배경) + 파스텔블루 리컬러·태그 제거 + 얼굴/헤어 아동A·의상 KID_A_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_pastelblue_fa_jp5.png?v=1`, spec: '여성A(168cm) · pyramid_05 모델 레퍼(Premium+) 원본 그대로(눕힌 피라미드 형태·랩탑·환호·흰 배경) + 텍스트 제거 + 파스텔블루 리컬러 + 얼굴/헤어 여성A·기본 의상 A_W_C_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_pastelblue_fa_jp7.png?v=1`, spec: '여성A(168cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·그린 니트+카키팬츠+스니커즈·흰 배경) + 파스텔블루 리컬러 + 얼굴/헤어만 여성A 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_pastelblue_b_jp7.png?v=1`, spec: '여성B(172cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·흰 배경) + 파스텔블루 리컬러 + 얼굴/헤어 B·의상 B_W_C_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_pastelblue_b_jp4.png?v=1`, spec: '여성B(172cm) · Pyramid 포즈4 모델 레퍼(pyramid_on_04) 원본 그대로(방 배경·노란 테이블·랩탑·캡+헤드폰·눕힌 피라미드 착석) + 파스텔블루 리컬러 + 얼굴/헤어만 B 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_pastelblue_c_jp7.png?v=1`, spec: '여성C(169cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·흰 배경) + 파스텔블루 리컬러 + 얼굴/헤어 C·의상 C_W_C_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 b · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_pastelblue_c_jp5.png?v=1`, spec: '여성C(169cm) · pyramid_05 모델 레퍼(Premium+) 원본 그대로(눕힌 피라미드·랩탑·환호·흰 배경) + 텍스트 제거 + 파스텔블루 리컬러 + 얼굴/헤어 C·의상 C_W_C_01 교체(포토 에딧) · 파스텔블루 #BEDDEF · 2샘플 중 a · 1회생성(미검수)' },
    ] },
    { key: 'cherryred', name: '체리레드', hex: '#790619', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 사용자 지시·jp 레퍼 스타일로 대체): { url: `${FTP}/cand_pyramid_cherry_kb_read.png?v=2`, spec: '아동B(10~12세·150cm) · Pyramid 세운 피라미드 앞 바닥 착석·독서(Mini 포즈7 느낌·pyramid_03 각도락) · KID_B_01 고정의상 · 체리레드 #790619 · 66×75×75 고정크기 · 둥근 눌림 레퍼 첨부 · 1회생성(미검수) · #f2f2f4 · v2 얼굴 고정+크기 축소 재생성(2샘플 중 fix1)' },
      // 숨김(2026-08-23 사용자 지시·jp 레퍼 스타일로 대체): { url: `${FTP}/cand_pyramid_cherry_kb_p1.png?v=1`, spec: '아동B(10~12세·150cm) · Pyramid 포즈1(세운 피라미드 기대 앉기·어깨너머 시선·pyramid_01 on/off 각도락) · KID_B_01 고정의상 · 체리레드 #790619 · 66×75×75 고정크기 · 둥근 눌림 레퍼 첨부 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-23 사용자 지시·jp 레퍼 스타일로 대체): { url: `${FTP}/cand_pyramid_cherry_kb_p5.png?v=1`, spec: '아동B(10~12세·150cm) · Pyramid 포즈5(눕힌 피라미드 착석·랩탑·pyramid_05 on/off 각도락) · KID_B_01 고정의상 · 체리레드 #790619 · 66×75×75 고정크기 · 둥근 눌림 레퍼 첨부 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pyramid_cherry_kb_jp1.png?v=1`, spec: '아동B(10~12세·150cm) · yogibo.jp 레퍼(pre-prm-rd) 원본 그대로(눕힌 피라미드 착석·핑크 돼지 인형·흰 배경) + PREMIUM 배지/텍스트/태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 교체(포토 에딧) · 체리레드 #790619 · 2샘플 중 a · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_cherry_kb_jp2.png?v=1`, spec: '아동B(10~12세·150cm) · yogibo.jp 레퍼(pre-prm-rd) 빈백 형태/컬러/배경 그대로 + 배지/텍스트/태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 (포토 에딧·포즈만 변경) · 포즈: 기대 앉아 그림책 읽기·인형 옆에 · 체리레드 #790619 · 2샘플 중 b · 1회생성(미검수)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_cherry_kb_jp3.png?v=2`, spec: '아동B(10~12세·150cm) · yogibo.jp 레퍼(pre-prm-rd) 빈백 형태/컬러/배경 그대로 + 배지/텍스트/태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 (포토 에딧·포즈만 변경) · 포즈: 경사면에 누워 인형 안기·다리 뻗기 · 체리레드 #790619 · 2샘플 중 a · 1회생성(미검수) · v2 피라미드 길이 과대 → SIZE LOCK 재생성(2샘플 중 a)' },
      { url: `${FTP}/cand_pyramid_cherry_kb_p3jp.png?v=2`, spec: '아동B(10~12세·150cm) · Pyramid 포즈3 모델 레퍼(pyramid_on_03) 원본 그대로(세운 피라미드 앞 착석·원숭이 인형·흰 배경) + 체리레드 리컬러·태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 교체(포토 에딧) · 체리레드 #790619 · 2샘플 중 a · 1회생성(미검수) · v2 컬러를 기존 체리레드 컷(jp1)에 맞춰 보정(Lab 매칭)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_cherry_kb_jp4.png?v=1`, spec: '아동B(10~12세·150cm) · yogibo.jp 레퍼(pre-prm-rd) 빈백 형태/컬러/배경 그대로 + 배지/텍스트/태그 제거 + 얼굴/헤어 아동B·의상 KID_B_01 (포토 에딧·포즈만 변경) · 포즈: 옆으로 앉아 인형 안고 어깨너머 시선 · 체리레드 #790619 · 1회생성(미검수)' },
    ] },
    { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3', el: true, rep: true, cuts: [
      // 삭제(2026-08-22 검수): cand_pyramid_lightgrey_ma_p1 — "모델A"=여성A로 정정 → 여성A 포즈5로 대체
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_lightgrey_fa_p5.png?v=1`, spec: '여성A(168cm) · Pyramid 포즈5(눕힌 피라미드에 착석·랩탑·환호·¾정면·pyramid_05 on/off 각도락) · 브라운티+그레이스웻(A_W_C_01) · 라이트그레이 #E5DED3 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pyramid_lightgrey_fa_jp7.png?v=1`, spec: '여성A(168cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·그린 니트+카키팬츠+스니커즈·흰 배경) + 라이트그레이 리컬러 + 얼굴/헤어만 여성A 교체(포토 에딧) · 라이트그레이 #E5DED3 · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_lightgrey_ma_jp1.png?v=1`, spec: '남성A(180cm) · Pyramid 포즈1 모델 레퍼(pyramid_on_01·Premium) 원본 그대로(세운 피라미드 기대 앉기·어깨너머 시선) + 라이트그레이 리컬러·배경 #f2f2f4 정리·텍스트 제거 + 인물 남성A(A_M_C_02 화이트티+블랙슬랙스) 교체(포토 에딧) · 라이트그레이 #E5DED3 · 2샘플 중 a · 1회생성(미검수)' },
      { url: `${FTP}/cand_pyramid_lightgrey_ma_jp7.png?v=2`, spec: '남성A(180cm) · yogibo.jp 레퍼(prm_7) 원본 그대로(눕힌 피라미드 착석·다리 꼬기·그린 니트+카키팬츠+스니커즈·흰 배경) + 라이트그레이 리컬러 + 인물 남성A 교체·책 들기 추가(포토 에딧) · 라이트그레이 #E5DED3 · 2샘플 중 b · 1회생성(미검수) · v2 의상 A_M_C_02(화이트티+블랙슬랙스·맨발)로 교체 재생성(2샘플 중 b)' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pyramid_lightgrey_ma_p5.png?v=1`, spec: '남성A(180cm) · Pyramid 포즈5(눕힌 피라미드에 착석·랩탑·환호·¾정면·pyramid_05 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) · 라이트그레이 #E5DED3 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pyramid_duo_p9.png?v=1`, spec: '여성A + 남성A 2인 · 게이밍(서로 보며 자연스러운 연출) · 그레이티+롱와이드데님 / 화이트티+블랙슬랙스 · 라이트그레이+리빙코랄 · #f2f2f4 · ⚠형태=체어형(Slim에서 이관, Pyramid 실형태 아님)' },
    ] },
  ] },
  { product: 'Pod',     emoji: '🥚', spec: '라운드 에그형 · 95×85×85cm 4.7kg', ratio: '1:1', size: 'h95 × w85 × d85 · 4.7kg', models: '아동A · 아동B · 여성B · 여성C · 남성A', scale: 'a round egg-shaped bean bag about waist-height of a standing adult (95cm), as wide as an adult shoulder span; one person sinks deeply into it', refs: POD_REFS, colors: [
    { key: 'freshmint', name: '프레시민트', hex: '#B0EEE7', el: true, rep: true, cuts: [
      // 삭제(2026-08-22 검수): cand_pod_freshmint_b_p1 — 모델 얼굴 상이
      { url: `${FTP}/cand_pod_freshmint_b_p2.png?v=1`, spec: 'B(172cm) · Pod 포즈2(옆으로 기대 태블릿·¾측면·pod_02 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_pod_freshmint_b_p3.png?v=2`, spec: 'B(172cm) · Pod 포즈3(정면 착석·양팔 활짝·밝은미소·pod_03 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · v2 크기보정(상단=머리높이·폭≈어깨1.3배) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_freshmint_b_p5.png?v=1`, spec: 'B(172cm) · Pod 포즈5(기대어 독서·¾측면·pod_05 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) · 프레시민트 #B0EEE7 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_pod_freshmint_kb_p3.png?v=1`, spec: '아동B(10~12세·150cm) · Pod 포즈3(정면 착석·양팔 활짝·밝은미소·pod_03 on/off 각도락) · KID_B_01 고정의상 · 프레시민트 #B0EEE7 · 95×85×85 고정크기(아이 작게) · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_freshmint_kb_p4.png?v=1`, spec: '아동B(10~12세·150cm) · Pod 포즈4(착석·손가락 포인팅·밝은미소·¾정면·pod_04 on/off 각도락) · KID_B_01 고정의상 · 프레시민트 #B0EEE7 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_freshmint_kb_p6.png?v=1`, spec: '아동B(10~12세·150cm) · Pod 포즈6(옆모습 기대 게임패드·다리 뻗기·pod_06 on/off 각도락) · KID_B_01 고정의상 · 프레시민트 #B0EEE7 · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'darkgrey', name: '다크그레이', hex: '#353B3E', el: true, rep: true, cuts: [
      // 삭제(2026-08-22 검수): cand_pod_darkgrey_c_p5 · cand_pod_darkgrey_c_p1 · cand_pod_darkgrey_ma_p2
      { url: `${FTP}/cand_pod_darkgrey_c_p6.png?v=1`, spec: '여성C(169cm) · Pod 포즈6(옆모습 기대 게임패드·다리 뻗기·pod_06 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01) · 다크그레이 #353B3E · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_pod_darkgrey_ma_p4.png?v=1`, spec: '남성A(180cm) · Pod 포즈4(착석·손가락 포인팅·밝은미소·¾정면·pod_04 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) · 다크그레이 #353B3E · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_darkgrey_ma_p6.png?v=1`, spec: '남성A(180cm) · Pod 포즈6(옆모습 기대 게임패드·다리 뻗기·pod_06 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) · 다크그레이 #353B3E · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'pastelblue', name: '파스텔블루', hex: '#BEDDEF', el: true, rep: true, cuts: [
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_pod_pastelblue_ka_p1.png?v=2`, spec: '아동A(6~7세·120cm) · Pod 포즈1(착석·랩탑·¾정면·pod_01 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · 95×85×85 고정크기(아이 작게) · v2 뒷부분 넓은 돔 형태보정 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_pod_pastelblue_ka_p3.png?v=3`, spec: '아동A(6~7세·120cm) · Pod 포즈3(정면 착석·양팔 활짝·밝은미소·pod_03 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · v2 뒷부분 넓은 돔 형태보정 · 1회생성(미검수) · #f2f2f4 · v3 크기 적정화(상단=머리 약간 위)' },
      { url: `${FTP}/cand_pod_pastelblue_ka_p2.png?v=1`, spec: '아동A(6~7세·120cm) · Pod 포즈2(옆으로 기대 태블릿·¾측면·pod_02 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · 95×85×85 고정크기(승인 p3 컷 비례 레퍼) · 넓은 돔 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_pastelblue_ka_p5.png?v=1`, spec: '아동A(6~7세·120cm) · Pod 포즈5(기대어 독서·¾측면·pod_05 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · 95×85×85 고정크기(승인 p3 컷 비례 레퍼) · 넓은 돔 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_pastelblue_c_p1.png?v=1`, spec: '여성C(169cm) · Pod 포즈1(착석·랩탑·¾정면·pod_01 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01 의상레퍼) · 파스텔블루 #BEDDEF · 95×85×85 고정크기 · 넓은 돔 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_pastelblue_c_p2.png?v=1`, spec: '여성C(169cm) · Pod 포즈2(옆으로 기대 태블릿·¾측면·pod_02 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01 의상레퍼) · 파스텔블루 #BEDDEF · 95×85×85 고정크기 · 넓은 돔 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_pod_pastelblue_c_p4.png?v=1`, spec: '여성C(169cm) · Pod 포즈4(착석·손가락 포인팅·밝은 미소·¾정면·pod_04 on/off 각도락) · 화이트티+네이비 슬랙스(C_W_C_01 의상레퍼) · 파스텔블루 #BEDDEF · 95×85×85 고정크기 · 넓은 돔 · 1회생성(미검수) · #f2f2f4' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_pod_pastelblue_ka_p4.png?v=2`, spec: '아동A(6~7세·120cm) · Pod 포즈4(착석·손가락 포인팅·밝은미소·¾정면·pod_04 on/off 각도락) · KID_A_01 고정의상 · 파스텔블루 #BEDDEF · v2 뒷부분 넓은 돔 형태보정 · 1회생성(미검수) · #f2f2f4' },
    ] },
  ] },
  { product: 'Double',  emoji: '🛏️', spec: '초대형 2인 · 170×120×45cm 13.2kg · Max 2배 폭', ratio: '1:1', size: 'h170 × w120 × d45 · 13.2kg', models: '여성B + 남성A (함께)', scale: 'an extra-large bean bag sofa as long as an adult is tall (170cm) and nearly twice the width of a single-person bean bag; two adults can lie or sit side by side', refs: DOUBLE_REFS, colors: [
    { key: 'olive', name: '올리브그린', hex: '#668B01', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_double_olive_bma_p1.png?v=4`, spec: '여성B(172) + 남성A(180) 2인 · Double 포즈1(눕혀 나란히 기대기·double_01 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) / 화이트티+블랙슬랙스(A_M_C_02) · 올리브그린 #668B01 · 170×120×45 실측비례 · 이전 버전(v2) 채택 · 1회생성(미검수) · #f2f2f4 · v4 얼굴/헤어만 여성B·남성A로 재교체(생성본 베이스 포토에딧·2샘플 중 a)' },
      { url: `${FTP}/cand_double_olive_bma_p2.png?v=1`, spec: '여성B(172) + 남성A(180) 2인 · Double 포즈2(눕혀 나란히 환호·double_02 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) / 화이트티+블랙슬랙스(A_M_C_02) · 올리브그린 #668B01 · 170×120×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_double_olive_bma_p3.png?v=3`, spec: '여성B(172) + 남성A(180) 2인 · Double 포즈3(세워 소파형·나란히 착석·double_03 on/off 각도락) · 그레이티+데님쇼츠(B_W_C_01) / 화이트티+블랙슬랙스(A_M_C_02) · 올리브그린 #668B01 · v4(크기 유지 + 남성A 헤어 고정) · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 검수 · 얼굴 변형): { url: `${FTP}/cand_double_lightgrey_kids_p2.png?v=2`, spec: '아동A+아동B · Double 포즈2(눕혀 환호) · 라이트그레이 v2' },
      // 숨김(2026-08-23 검수 · 소파 이음새/크기 미표현 → 여성A+D로 교체): { url: `${FTP}/cand_double_lightgrey_kids_p3.png?v=1`, spec: '아동A(6~7세·120cm) + 아동B(10~12세·150cm) 2인 · Double 포즈3(세워 소파형·나란히 앉아 인형 놀이·double_03 on/off 각도락) · KID_A_01 / KID_B_01 고정의상 · 라이트그레이 #E5DED3 · 170×120×45 고정크기(아이들 작게) · 얼굴 고정 강화 · 2샘플 중 선택 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_double_lightgrey_fad_p3.png?v=3`, spec: '여성A(168) + 여성D(173) 2인 · Double 포즈3(등부분 세워 앉기·나란히 담소·double_03 on/off 각도락) · 브라운티+그레이스웻(A_W_C_01) / 그레이티+라이트배기진(D_W_C_01) · 라이트그레이 #E5DED3 · 170×120×45(Max 2개 합친 빈백) · v2 소파 구조 금지·Max 질감 레퍼 앵커로 푹신한 빈백 덩어리 표현 · 2샘플 중 선택 · 1회생성(미검수) · #f2f2f4 · v3 올리브 B+남성A p3 컷(앵글 확정) 베이스 포토에딧 → 라이트그레이 리컬러+여성A/D 교체(2샘플 중 b)' },
      // 숨김(사용자 제외 지시): { url: `${FTP}/cand_double_lightgrey_bc_p1.png?v=1`, spec: '여성B(172) + 여성C(169) 2인 · Double 포즈1(눕혀 나란히 기대기·double_01 각도) · 올리브 B+남성A p1 컷 베이스 포토에딧 → 라이트그레이 리컬러 + 남성→여성C(C_W_C_01 화이트티+네이비 슬랙스) 교체·B 유지(B_W_C_01) · 라이트그레이 #E5DED3 · 170×120×45 · 2샘플 중 a · 1회생성(미검수) · #f2f2f4' },
    ] },
    { key: 'darkgrey', name: '다크그레이', hex: '#353B3E', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_double_darkgrey_duo_p2.png?v=1`, spec: '남성A(180cm) + 여성A(168cm) 2인 · Double 포즈2(바닥에 눕힌 더블 위에 나란히 누워 환호·double_02 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) / 브라운티+그레이스웻(A_W_C_01) · 다크그레이 #353B3E · 170×120×45 실측비례 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_double_darkgrey_duo_p3.png?v=1`, spec: '남성A(180cm) + 여성A(168cm) 2인 · Double 포즈3(세워 소파형·나란히 앉아 기대기·double_03 on/off 각도락) · 화이트티+블랙슬랙스(A_M_C_02) / 브라운티+그레이스웻(A_W_C_01) · 다크그레이 #353B3E · 1회생성(미검수) · #f2f2f4' },
    ] },
  ] },
  { product: 'Support', emoji: '🌙', spec: 'U형 등받이 쿠션 · 94×76×30cm 1.7kg', ratio: '1:1', size: 'h94 × w76 × d30 · 1.7kg', models: '여성B · 남성A', scale: 'a U-shaped armrest cushion that wraps around an adult lower back, armrests about hip-height when seated', refs: SUPPORT_REFS, colors: [
    { key: 'navy', name: '네이비블루', hex: '#1D395D', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_support_navy_b_p1_max.png?v=5`, spec: 'B(172cm) · Support 포즈1(support_01 레퍼 구도: 정면·낮은 앵글·Support 화면 중심 + 모델 포함·태블릿) · 그레이티+데님쇼츠(B_W_C_01) · Support 네이비블루 #1D395D + 하단 Yogibo Max 라이트그레이 #E5DED3 · 94×76×30 · v4 타이트 크롭(정사각 1:1·1840px) · 1회생성(미검수) · #f2f2f4 · v5 더 타이트한 정사각 크롭(빈백 일부 잘림)' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_support_navy_p2_only.png?v=1`, spec: '제품 단독 · Support 포즈2 · 네이비 + Max 라이트그레이' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_support_navy_b_p2.png?v=1`, spec: 'B · Support 포즈2(모델 포함·폰) · 네이비 + Max 라이트그레이' },
      { url: `${FTP}/cand_support_navy_b_ref1.png?v=1`, spec: 'B(172cm) · yogibo.kr 레퍼 재현(측면 근접·무릎 안고 웃음·Support 등 감싸기) — 얼굴/헤어만 모델B로 교체, 의상은 레퍼 유지(네이비 탱크+블랙 쇼츠) · Support 네이비블루 #1D395D + 하단 Max 라이트그레이 · 2샘플 중 선택 · 1회생성(미검수) · #f2f2f4' },
      { url: `${FTP}/cand_support_navy_b_jp1.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼 원본 그대로(구도·네이비 Support·블루 빈백·화이트티+청바지·팔 머리 뒤 포즈·방 배경 유지) + 얼굴/헤어만 모델B 교체(포토 에딧) · 2샘플 중 시선 일치 안 선택 · 1회생성(미검수)' },
      { url: `${FTP}/cand_support_navy_ma_jp3.png?v=1`, spec: '남성A(180cm) · yogibo.jp 레퍼 원본 그대로(침대·우드 헤드보드·블루 Support에 기대 앉기·화이트 헨리티+그레이 스웻·방 배경 유지) + 얼굴/헤어만 남성A 교체(포토 에딧) · 2샘플 중 선택 · 1회생성(미검수)' },
      // 숨김(2026-08-22 검수 · 구도 재작업): { url: `${FTP}/cand_support_navy_b_p1.png?v=1`, spec: 'B(172cm) · Support 포즈1(빈백 위 기대 + Support 등 감싸기·태블릿) · Support 네이비블루(하단 빈백 베이지) · v1' },
      { url: `${FTP}/cand_support_navy_b_jp2.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼(jp2) 코랄 B 컷(크림 오버셔츠+와이드) 베이스 → Support 컬러만 네이비블루로 자연 리컬러(포토 에딧) · 네이비블루 #1D395D · 2샘플 중 b · 1회생성(미검수)' },
    ] },
    { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_support_lightgrey_b_ref2.png?v=2`, spec: 'B(172cm) · yogibo.kr 레퍼 원본 그대로(구도·Support 크기·의상·방 배경 유지) + 얼굴/헤어만 모델B로 교체(포토 에딧) · Support 라이트그레이(레퍼 톤) · v2 · 1회생성(미검수)' },
      { url: `${FTP}/cand_support_lightgrey_ma_ref2.png?v=1`, spec: '남성A(180cm) · yogibo.kr 레퍼 원본 그대로(구도·Support 크기·방 배경·눈 감은 릴랙스 포즈 유지) + 인물을 남성A로 교체 + 상의만 흰 반팔티(청바지 유지)(포토 에딧) · Support 라이트그레이(레퍼 톤) · 2샘플 중 선택 · 1회생성(미검수)' },
      // 숨김(2026-08-22 검수): { url: `${FTP}/cand_support_lightgrey_b_ref3.png?v=1`, spec: 'B · 레퍼3 얼굴 교체 + Support 라이트그레이 리컬러' },
      { url: `${FTP}/cand_support_lightgrey_b_jp2.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼(jp2) 코랄 B 컷(크림 오버셔츠+와이드) 베이스 → Support 컬러만 라이트그레이로 자연 리컬러(포토 에딧) · 라이트그레이 #E5DED3 · 2샘플 중 b · 1회생성(미검수)' },
    ] },
    { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19', el: true, rep: true, cuts: [
      // 숨김(2026-08-23 사용자 지시): { url: `${FTP}/cand_support_coral_b_jp2_floral.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·플로럴 톱·방 배경 유지) + 얼굴/헤어만 모델B 교체(포토 에딧) · 리빙코랄 · 원본 의상 버전' },
      { url: `${FTP}/cand_support_sweetorange_b_jp2.png?v=2`, spec: 'B(172cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·플로럴 톱·방 배경 유지) + 얼굴/헤어만 모델B 교체(포토 에딧) · 컬러명 코랄로 등록 · 2샘플 중 선택 · 1회생성(미검수) · v2 의상 크림 오버셔츠+와이드(B_W_C_02)로 교체(포토 에딧)' },
      { url: `${FTP}/cand_support_coral_ma_jp2.png?v=1`, spec: '남성A(180cm) · yogibo.jp 레퍼 원본 그대로(측면 프로필·턱 괴기·코랄 Support·그레이 빈백·방 배경 유지) + 인물을 남성A로 교체 + 흰 반팔티·청바지(포토 에딧) · 2샘플 중 선택 · 1회생성(미검수)' },
    ] },
    { key: 'sweetorange', name: '스위트오렌지', hex: '#EE780C', el: true, rep: true, cuts: [
      { url: `${FTP}/cand_support_sweetorange_b_ref3.png?v=2`, spec: 'B(172cm) · yogibo.kr 레퍼3 원본 그대로(구도·Support 크기·틸 롱슬리브+청바지·네이비 빈백·태블릿 포즈 유지) + 얼굴/헤어만 모델B 교체 + Support만 스위트오렌지 #EE780C 자연 리컬러(원본 음영·주름 유지, v2) + Premium+ 텍스트·태그 제거 · 1회생성(미검수)' },
      { url: `${FTP}/cand_support_orange_b_jp2.png?v=1`, spec: 'B(172cm) · yogibo.jp 레퍼(jp2) 코랄 B 컷(크림 오버셔츠+와이드) 베이스 → Support 컬러만 스위트오렌지로 자연 리컬러(포토 에딧) · 스위트오렌지 #EE780C · 2샘플 중 a · 1회생성(미검수)' },
    ] },
  ] },
];

const C = { accent: '#26A69A', ok: '#66BB6A', wait: '#e6c86a', card: '#161616', line: '#2a2a2a', sub: '#9aa' };

// 일반(비대표) 컬러칩 그리드 표시 여부 — false면 숨김(데이터는 PRODUCTS에 그대로 보존). 대표 컬러 갤러리는 항상 표시.
const SHOW_REGULAR_COLORS = false;

// ZIP 다운로드용 한글 상품명 (폴더명으로 사용)
const KO_NAME = {
  Max: '맥스', Slim: '슬림', Midi: '미디', Mini: '미니', Drop: '드롭',
  Lounger: '라운저', Pyramid: '피라미드', Pod: '팟', Double: '더블', Support: '서포트',
};

// 파일명에 못 쓰는 문자 제거
const safe = (s) => String(s).replace(/[\/:*?"<>|]/g, '').trim();

// PRODUCTS에서 생성 컷만 모아 { path, url, color, spec } 목록으로 만든다.
// 폴더 = 상품 한글명, 파일명 = 상품_컬러_번호.확장자 (실사 레퍼는 제외)
function collectThumbnails() {
  const items = [];
  PRODUCTS.forEach((p, pi) => {
    const folder = `${String(pi + 1).padStart(2, '0')}_${safe(KO_NAME[p.product] || p.product)}`;
    (p.colors || []).forEach((c) => {
      const cuts = c.cuts && c.cuts.length ? c.cuts : (c.url ? [{ url: c.url, spec: c.spec }] : []);
      cuts.forEach((cut, i) => {
        if (!cut || !cut.url) return;
        const clean = cut.url.split('?')[0];
        const ext = (clean.match(/\.(png|jpe?g|webp)$/i) || ['.png'])[0];
        const name = `${safe(KO_NAME[p.product] || p.product)}_${safe(c.name)}_${String(i + 1).padStart(2, '0')}${ext}`;
        items.push({ path: `${folder}/${name}`, url: cut.url, color: c.name, spec: cut.spec || '' });
      });
    });
  });
  return items;
}

export default function ThumbnailsPage() {
  const [zoom, setZoom] = useState(null);
  const [dl, setDl] = useState(null); // null | 'working'

  const items = collectThumbnails();

  // 브라우저가 응답을 그대로 디스크에 스트리밍 저장하도록 '폼 전송'으로 내려받는다.
  // (fetch+blob 방식은 수백MB를 메모리에 담다가 중간에 끊겨 일부만 받아지는 문제가 있었음)
  function downloadZip(list, label) {
    if (dl) return;
    const payload = label ? list.map((it, i) => (i === 0 ? { ...it, zipLabel: label } : it)) : list;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/thumbnails/zip';
    form.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payload';
    input.value = JSON.stringify({ items: payload });
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    form.remove();
    // 서버가 zip을 만드는 동안(수십 초) 버튼을 잠가 중복 요청을 막는다
    setDl('working');
    setTimeout(() => setDl(null), 8000);
  }

  // 제품별 묶음 (상품명 폴더 기준)
  const groups = [];
  items.forEach((it) => {
    const folder = it.path.split('/')[0];
    let g = groups.find((x) => x.folder === folder);
    if (!g) { g = { folder, label: folder.replace(/^\d+_/, ''), list: [] }; groups.push(g); }
    g.list.push(it);
  });

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 20px 80px', color: '#e8e8e8', fontFamily: 'system-ui, "Malgun Gothic", sans-serif' }}>
      <a href="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← 홈</a>

      <h1 style={{ fontSize: 26, margin: '14px 0 6px' }}>🛍️ 자사몰 썸네일 작업</h1>
      <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>
        요기보 자사몰(cafe24) 상품 <b>리스트·상세·배너</b>용 썸네일을 <b style={{ color: C.accent }}>제품 레지스트리 + 전속 모델 + 빈백 눌림(구김) 레퍼</b>로
        일관성 있게 제작·관리합니다. 제작한 썸네일은 아래에 등록되고 FTP로 올라갑니다.
      </p>

      {/* 전체 ZIP 다운로드 — 상품명 폴더로 정리해서 내려받기 */}
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '12px 16px', margin: '0 0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => downloadZip(items)}
            disabled={!!dl}
            style={{
              background: dl ? '#2a3a38' : C.accent,
              color: dl ? '#8aa' : '#04201c',
              border: 'none', borderRadius: 8, padding: '10px 18px',
              fontSize: 13.5, fontWeight: 800, cursor: dl ? 'default' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {dl ? '⏳ ZIP 생성 요청됨…' : `📦 전체 ZIP 다운로드 (${items.length}장)`}
          </button>
          <div style={{ fontSize: 12, color: '#9aa', lineHeight: 1.5 }}>
            <b style={{ color: C.accent }}>상품명 폴더</b>로 정리 (예: <code style={{ color: '#bbb' }}>01_맥스/맥스_아쿠아블루_01.png</code>) · 목록.txt 동봉
            <br />전체는 <b style={{ color: '#ddd' }}>약 400MB</b>라 완료까지 1~2분 걸립니다. 브라우저 다운로드 목록에서 진행률을 확인하세요.
          </div>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 11.5, color: '#8a9', fontWeight: 700, marginBottom: 6 }}>제품별로 나눠 받기 (용량 부담 없이 권장)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {groups.map((g) => (
              <button
                key={g.folder}
                onClick={() => downloadZip(g.list, g.label)}
                disabled={!!dl}
                style={{
                  background: '#1c2422', color: dl ? '#667' : '#cde', border: `1px solid ${C.line}`,
                  borderRadius: 7, padding: '6px 11px', fontSize: 11.5, fontWeight: 700,
                  cursor: dl ? 'default' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {g.label} <span style={{ color: '#7a8', fontWeight: 400 }}>{g.list.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 제작 레시피 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>제작 레시피 (착석·제품 썸네일)</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        착석 라이프스타일 썸네일의 리얼리티 핵심 = <b style={{ color: C.accent }}>"사람 지운 눌림(구김) 레퍼"</b>. 인물 오염 없이 실제 앉았을 때의 원단 눌림·압축을 재현합니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
        {RECIPE.map((r) => (
          <div key={r.n} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: r.c }}>{r.n} {r.t}</div>
            <div style={{ fontSize: 12, color: '#bbb', lineHeight: 1.55, marginTop: 5 }}>{r.d}</div>
          </div>
        ))}
      </div>

      {/* 생성 주의사항 (실측 피드백 체크리스트) */}
      <div style={{ background: 'rgba(230,200,106,0.07)', border: `1px solid ${C.wait}`, borderRadius: 10, padding: '12px 16px', marginTop: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.wait, marginBottom: 6 }}>⚠️ 생성 주의사항 (실측 피드백 기준)</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#cfcaba', fontSize: 12, lineHeight: 1.7 }}>
          {CAUTIONS.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* 탐색 후보 (슬롯 확정 전) */}
      {CANDIDATES.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 6px', borderLeft: `3px solid ${C.wait}`, paddingLeft: 10 }}>🧪 탐색 후보 <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>(미확정 · 슬롯 반영 전 검토)</span></h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {CANDIDATES.map((c) => (
              <div key={c.key} style={{ width: 240, background: C.card, border: `1px solid ${C.wait}`, borderRadius: 12, padding: 9 }}>
                <img src={c.url} alt={c.name} onClick={() => setZoom(c.url)} title="클릭하면 크게 보기"
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.wait}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', marginTop: 6 }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: C.sub, marginTop: 2, lineHeight: 1.4 }}>{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 눌림 레퍼 자산 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>눌림(구김) 형태 레퍼 자산</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>한 번 만들면 모든 착석 썸네일에 무료 재사용. <b style={{ color: C.accent }}>Max·Slim·Midi·Mini는 같은 형태 라인</b>이라 눌림 레퍼 공유(사이즈만 다름). Drop·Lounger·Pyramid·Pod·Double·Support는 별도 형태 레퍼 필요.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {PRESS_REFS.map((p) => (
          <div key={p.key} style={{ textAlign: 'center', width: 200 }}>
            <img src={p.url} alt={p.name} onClick={() => setZoom(p.url)} title="클릭하면 크게 보기"
              style={{ width: 200, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in', background: '#fff' }} />
            <div style={{ fontSize: 12, color: '#ddd', marginTop: 4, fontWeight: 700 }}>
              {p.name}
              {p.tag && <span style={{ fontSize: 9.5, fontWeight: 700, color: p.tag === '실사' ? '#0b1f14' : '#1f1b0b', background: p.tag === '실사' ? C.ok : C.wait, borderRadius: 4, padding: '1px 5px', marginLeft: 5 }}>{p.tag}</span>}
            </div>
            <div style={{ fontSize: 10.5, color: '#888', lineHeight: 1.4 }}>{p.note}</div>
            {p.orig && (
              <div style={{ marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <img src={p.orig} alt="원본" onClick={() => setZoom(p.orig)} title="원본(모델 착석) 포즈 가이드"
                  style={{ width: 46, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 5, border: '1px solid #456', cursor: 'zoom-in', background: '#fff' }} />
                <span style={{ fontSize: 9.5, color: '#8a9' }}>원본(포즈)</span>
              </div>
            )}
          </div>
        ))}
        <div style={{ width: 200, aspectRatio: '16/9', border: `1px dashed ${C.line}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6', fontSize: 11.5, textAlign: 'center', padding: 8 }}>
          + 눌림 레퍼 추가<br /><span style={{ color: '#666', fontSize: 10 }}>(Max 컬러별 / Pod · Support · Mini)</span>
        </div>
      </div>

      {/* 썸네일용 모델 (1차: 여성·남성) */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>썸네일용 모델 <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>(1차: 여성·남성)</span></h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 10px' }}>
        착석·라이프스타일 썸네일에 <b>모델 지정</b>해서 사용(예: "여성 A", "남성 A"). 헤어 업데이트 반영본. 얼굴 클릭 시 확대. <span style={{ color: '#667' }}>(아동 K_A·K_B는 2차)</span>
      </p>
      {THUMB_MODELS.map((g) => (
        <div key={g.cat} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0 8px' }}>
            <b style={{ fontSize: 14.5 }}>{g.emoji} {g.cat}</b>
            <span style={{ fontSize: 11.5, color: '#888' }}>{g.items.length}명</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {g.items.map((m) => (
              <div key={m.code} style={{ width: 200, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 9 }}>
                <img src={m.rep} alt={`${g.cat} ${m.code}`} onClick={() => setZoom(m.rep)} title="클릭하면 크게 보기"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', background: C.accent, borderRadius: 7, padding: '2px 9px' }}>{g.cat} {m.code}</span>
                </div>
                <div style={{ fontSize: 10.5, color: C.sub, marginTop: 5, lineHeight: 1.45 }}>{m.desc}</div>
                {m.outfits && (
                  <div style={{ marginTop: 8, borderTop: `1px dashed ${C.line}`, paddingTop: 7 }}>
                    <div style={{ fontSize: 10, color: '#8a9', fontWeight: 700, marginBottom: 4 }}>👕 의상 컨셉 {m.outfits.length}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.outfits.map((o) => (
                        <div key={o.f} style={{ width: 54, textAlign: 'center' }}>
                          <img src={`${CLOTHES}/${o.f}.jpg`} alt={o.t} onClick={() => setZoom(`${CLOTHES}/${o.f}.jpg`)} title={o.t}
                            style={{ width: 54, aspectRatio: '3/4', objectFit: 'cover', borderRadius: 6, border: '1px solid #345', cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                          <div style={{ fontSize: 8.5, color: '#778', marginTop: 2, lineHeight: 1.25 }}>{o.t}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {m.expr && (
                  <div style={{ marginTop: 8, borderTop: `1px dashed ${C.line}`, paddingTop: 7 }}>
                    <div style={{ fontSize: 10, color: C.wait, fontWeight: 700, marginBottom: 4 }}>😊 표정 시트 <span style={{ color: '#778', fontWeight: 400 }}>(얼굴락+표정 앵커)</span></div>
                    <img src={m.expr} alt={`${g.cat} ${m.code} 표정 시트`} onClick={() => setZoom(m.expr)} title="표정 시트 — 생성 시 identity+표정 앵커로 함께 투입"
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 6, border: `1px solid ${C.wait}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 규격 프리셋 */}
      <h2 style={{ fontSize: 19, margin: '26px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>썸네일 규격</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SPECS.map((s) => (
          <div key={s.t} style={{ background: '#14201f', border: '1px solid #234', borderRadius: 10, padding: '8px 12px' }}>
            <b style={{ fontSize: 12.5, color: '#bfe' }}>{s.t}</b>
            <span style={{ fontSize: 11.5, color: '#8bd', marginLeft: 6 }}>{s.ratio}</span>
            <div style={{ fontSize: 10.5, color: '#789', marginTop: 2 }}>{s.use}</div>
          </div>
        ))}
      </div>

      {/* 제작 썸네일 — 제품별 컬러 슬롯 */}
      <h2 style={{ fontSize: 19, margin: '28px 0 6px', borderLeft: `3px solid ${C.accent}`, paddingLeft: 10 }}>제작 썸네일 (제품별)</h2>
      <p style={{ color: '#999', fontSize: 12.5, margin: '0 0 12px' }}>컬러별 슬롯. 제작되면 썸네일이 채워지고, 그 전엔 <b style={{ color: C.wait }}>대기</b>. 규격 = 상품 리스트용 <b>1:1 화이트</b> 기준(추후 모델 착석 변형 추가 가능).</p>
      {PRODUCTS.map((p) => {
        const reps = p.colors.filter((c) => c.rep);
        const rest = SHOW_REGULAR_COLORS ? p.colors.filter((c) => !c.rep) : [];
        const done = p.colors.filter((c) => c.url || (c.cuts && c.cuts.length)).length;
        return (
          <div key={p.product} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0 10px', flexWrap: 'wrap' }}>
              <b style={{ fontSize: 15.5 }}>{p.emoji} {p.product}</b>
              <span style={{ fontSize: 11.5, color: '#888' }}>· {p.spec}</span>
              {p.soon
                ? <span style={{ fontSize: 11, fontWeight: 700, color: C.wait, border: `1px solid ${C.wait}`, borderRadius: 6, padding: '1px 8px' }}>준비중</span>
                : <span style={{ fontSize: 12, color: done ? C.ok : C.wait }}>{done}/{p.colors.length} 제작</span>}
            </div>
            {p.models && (
              <div style={{ fontSize: 11.5, color: '#8a9', margin: '-4px 0 9px', fontWeight: 600 }}>👤 배정 모델: <span style={{ color: '#aab', fontWeight: 400 }}>{p.models}</span></div>
            )}
            {p.refs && (
              <div style={{ marginBottom: 12, border: `1px solid ${C.line}`, borderRadius: 10, padding: '9px 11px', background: '#0f1512' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: C.accent, marginBottom: 7 }}>📐 {p.product} 전용 실사 포즈 레퍼 <span style={{ color: '#778', fontWeight: 400 }}>(모델포함=포즈/비례 · 모델제거=형태 · 각도락용)</span></div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {p.refs.map((r) => (
                    <div key={r.key} style={{ width: 150, textAlign: 'center' }}>
                      <img src={r.url} alt={r.name} onClick={() => setZoom(r.url)} title="모델제거(형태) · 클릭 확대"
                        style={{ width: 150, aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                      <div style={{ fontSize: 10.5, color: '#ddd', marginTop: 4, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 9.5, color: '#889', lineHeight: 1.35 }}>{r.note}</div>
                      {r.orig && (
                        <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <img src={r.orig} alt="원본" onClick={() => setZoom(r.orig)} title="원본(모델 착석) 포즈 가이드"
                            style={{ width: 44, aspectRatio: '1/1', objectFit: 'cover', borderRadius: 5, border: '1px solid #456', cursor: 'zoom-in', background: '#fff' }} />
                          <span style={{ fontSize: 9, color: '#8a9' }}>모델포함</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.poseRefs && (
              <div style={{ marginBottom: 12, border: `1px solid ${C.line}`, borderRadius: 10, padding: '9px 11px', background: '#0f1512' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: C.accent, marginBottom: 7 }}>🎬 참고 포즈 <span style={{ color: '#778', fontWeight: 400 }}>(타사 참고 · 포즈/앵글/분위기만 · 제품·인물 복사 X → 우리 제품 형태락으로 생성)</span></div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {p.poseRefs.map((r) => (
                    <div key={r.key} style={{ width: 132, textAlign: 'center' }}>
                      <img src={r.url} alt={r.name} onClick={() => setZoom(r.url)} title="참고 포즈 · 클릭 확대"
                        style={{ width: 132, aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, border: '1px solid #345', cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                      <div style={{ fontSize: 10.5, color: '#ddd', marginTop: 4, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 9.5, color: '#889', lineHeight: 1.35 }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.soon && (
              <div style={{ border: `1px dashed ${C.line}`, borderRadius: 10, padding: '20px 16px', color: '#778', fontSize: 12.5, background: '#101010', textAlign: 'center' }}>
                색상 슬롯 준비중 — 포즈·컬러 배정 후 채워집니다
              </div>
            )}
            {reps.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.wait, margin: '0 0 8px' }}>🌟 대표 컬러 <span style={{ color: '#778', fontWeight: 400 }}>(모델·포즈 다중 컷)</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {reps.map((c) => (
                    <div key={c.key} style={{ background: C.card, border: `1px solid ${C.wait}`, borderRadius: 12, padding: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ width: 14, height: 14, borderRadius: 4, background: c.hex, border: '1px solid rgba(255,255,255,.25)', flex: '0 0 auto' }} />
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>{c.name}</span>
                        <span style={{ fontSize: 10.5, color: C.sub }}>{c.hex}{c.el ? ' · 🔒Element' : ''}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.ok }}>{c.cuts.length}컷</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {c.cuts.map((cut, i) => (
                          <div key={i} style={{ width: 150 }}>
                            <img src={cut.url} alt={`${c.name} 컷${i + 1}`} onClick={() => setZoom(cut.url)} title="클릭하면 크게 보기"
                              style={{ width: 150, aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                            <div style={{ fontSize: 9.5, color: C.accent, marginTop: 3, lineHeight: 1.35 }}>{cut.spec}</div>
                          </div>
                        ))}
                        <div style={{ width: 150, aspectRatio: '1/1', border: `1px dashed ${C.line}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6', fontSize: 11, textAlign: 'center', background: '#101010' }}>+ 컷 추가</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {rest.map((c) => (
                <div key={c.key} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 9 }}>
                  {c.url
                    ? <img src={c.url} alt={`${p.product} ${c.name}`} onClick={() => setZoom(c.url)} title="클릭하면 크게 보기"
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.accent}`, cursor: 'zoom-in', background: '#fff', display: 'block' }} />
                    : <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, border: `1px dashed ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#101010' }}>
                        <span style={{ width: 40, height: 40, borderRadius: '50%', background: c.hex, border: '1px solid rgba(255,255,255,.25)' }} />
                        <span style={{ fontSize: 10.5, color: '#667' }}>대기</span>
                      </div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: '1px solid var(--border,#444)', flex: '0 0 auto' }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: C.sub, marginTop: 2 }}>
                    {c.hex}{c.el ? ' · 🔒Element' : ''} · {p.ratio}
                  </div>
                  {c.spec && <div style={{ fontSize: 10, color: C.accent, marginTop: 2 }}>{c.spec}</div>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.url ? C.ok : C.wait, marginTop: 3 }}>{c.url ? '완료' : '대기'}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p style={{ color: '#666', fontSize: 12, marginTop: 26, lineHeight: 1.7 }}>
        제작 표준 = 눌림(구김) 레퍼 + 제품 색상/Element + (선택)전속 모델. 착석 컷은 사람 든 연출컷을 직접 넣지 말 것(인물 오염) — 반드시 사람 지운 눌림 레퍼 사용.
        크레딧 사용 전 금액 확인·승인.
      </p>

      {/* 라이트박스 */}
      {zoom && (
        <div onClick={() => setZoom(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
          <img src={zoom} alt="확대" style={{ maxWidth: '96vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,.6)' }} />
          <button onClick={(e) => { e.stopPropagation(); setZoom(null); }}
            style={{ position: 'fixed', top: 18, right: 22, width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 22, cursor: 'pointer' }} aria-label="닫기">✕</button>
        </div>
      )}
    </div>
  );
}
