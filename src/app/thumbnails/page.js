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
      { code: 'K_A', rep: `${FTP}/K_A_rep_new.png?v=smile`, expr: `${FTP}/K_A_expr.png?v=braid`, desc: '유럽계 여아 6~7세 · 라이트브라운 양갈래 땋은머리(핀) · 밝고 명랑 · 키~120 · ①얼굴②표정 완료' },
      { code: 'K_B', rep: `${FTP}/K_B_rep_new.png?v=smile`, expr: `${FTP}/K_B_expr.png?v=straight`, desc: '유럽계 여아 10~12세 · 오번 롱 생머리(센터파트)·주근깨 · 청순 · 키~150 · ①얼굴②표정 완료' },
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
      ] },
      { key: 'darkgrey', name: '다크그레이', hex: '#353B3E', el: true, url: `${FTP}/cand_max_darkgrey_ma_p5.png?v=2`, spec: '남A · 포즈5(게이밍·미소) · A_M_C_02 · 2048' },
      { key: 'lightgrey', name: '라이트그레이', hex: '#E5DED3' },
      { key: 'chocobrown', name: '초코브라운', hex: '#583E30' },
      { key: 'cherryred', name: '체리레드', hex: '#790619', el: true, url: `${FTP}/cand_max_cherry_b_pose.png?v=1`, spec: 'B모델(172) · test02 포즈(리클라이너·미소) · B_W_C_02 · 2048' },
      { key: 'wineburgundy', name: '와인버건디', hex: '#7A031F' },
      { key: 'livingcoral', name: '리빙코랄', hex: '#EA3D19' },
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
  { product: 'Slim',    emoji: '📏', spec: 'Max 동일 형태 · 130×65×45cm 4.4kg · 폭 슬림(세로형) · 눌림레퍼 공유', ratio: '1:1', soon: true, sameLine: 'Max', size: 'h130 × w65 × d45 · 4.4kg', scale: 'a narrow vertical bean bag about chest height of a standing adult (130cm); one adult reclines against it with legs extended', colors: [] },
  { product: 'Midi',    emoji: '🟦', spec: 'Max 동일 형태 · 125×70×45cm 4.8kg · 가슴 높이 · 눌림레퍼 공유', ratio: '1:1', soon: true, sameLine: 'Max', size: 'h125 × w70 × d45 · 4.8kg', scale: 'a mid-size bean bag reaching an adult chest when stood upright (125cm); one adult can curl up on it lying down, or sit with full back support', colors: [] },
  { product: 'Mini',    emoji: '🔹', spec: 'Max 동일 형태 · 85×70×45cm 3.2kg · 엉덩이 높이·1인 시트 · 눌림레퍼 공유', ratio: '1:1', soon: true, sameLine: 'Max', size: 'h85 × w70 × d45 · 3.2kg', scale: 'a compact bean bag about hip-height of a standing adult (85cm); a single seat where an adult sits with knees bent, child-friendly size', colors: [] },
  { product: 'Drop',    emoji: '💧', spec: '라운드 물방울형 · 75×85×85cm 3.7kg · 착석/랩탑 연출', ratio: '1:1', size: 'h75 × w85 × d85 · 3.7kg', scale: 'a round droplet-shaped bean bag about the height of a seated adult shoulders (75cm); one adult sinks into it with knees bent', colors: [
    { key: 'chocobrown', name: '초코브라운', hex: '#583E30', el: true, url: `${FTP}/cand_max_choco_c_pose.png?v=1`, spec: 'C모델(169) · 랩탑·미소 연출 · C_W_C_01 · 2048 (Max→Drop 이동)' },
  ] },
  { product: 'Lounger', emoji: '🏖️', spec: '낮은 라운지체어 · 60×65×80cm 4.4kg', ratio: '1:1', soon: true, size: 'h60 × w65 × d80 · 4.4kg', scale: 'a low lounge chair bean bag about knee-height of a standing adult (60cm); a one-person seat whose backrest reaches a seated adult mid-back', colors: [] },
  { product: 'Pyramid', emoji: '🔺', spec: '삼각 플로어쿠션 · 66×75×75cm 2.2kg', ratio: '1:1', soon: true, size: 'h66 × w75 × d75 · 2.2kg', scale: 'a triangular floor cushion about knee-height of a standing adult (66cm); one adult sits against its slope, a child can climb onto it', colors: [] },
  { product: 'Pod',     emoji: '🥚', spec: '라운드 에그형 · 95×85×85cm 4.7kg', ratio: '1:1', soon: true, size: 'h95 × w85 × d85 · 4.7kg', scale: 'a round egg-shaped bean bag about waist-height of a standing adult (95cm), as wide as an adult shoulder span; one person sinks deeply into it', colors: [] },
  { product: 'Double',  emoji: '🛏️', spec: '초대형 2인 · 170×120×45cm 13.2kg · Max 2배 폭', ratio: '1:1', soon: true, size: 'h170 × w120 × d45 · 13.2kg', scale: 'an extra-large bean bag sofa as long as an adult is tall (170cm) and nearly twice the width of a single-person bean bag; two adults can lie or sit side by side', colors: [] },
  { product: 'Support', emoji: '🌙', spec: 'U형 등받이 쿠션 · 94×76×30cm 1.7kg', ratio: '1:1', soon: true, size: 'h94 × w76 × d30 · 1.7kg', scale: 'a U-shaped armrest cushion that wraps around an adult lower back, armrests about hip-height when seated', colors: [] },
];

const C = { accent: '#26A69A', ok: '#66BB6A', wait: '#e6c86a', card: '#161616', line: '#2a2a2a', sub: '#9aa' };

export default function ThumbnailsPage() {
  const [zoom, setZoom] = useState(null);
  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 20px 80px', color: '#e8e8e8', fontFamily: 'system-ui, "Malgun Gothic", sans-serif' }}>
      <a href="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← 홈</a>

      <h1 style={{ fontSize: 26, margin: '14px 0 6px' }}>🛍️ 자사몰 썸네일 작업</h1>
      <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>
        요기보 자사몰(cafe24) 상품 <b>리스트·상세·배너</b>용 썸네일을 <b style={{ color: C.accent }}>제품 레지스트리 + 전속 모델 + 빈백 눌림(구김) 레퍼</b>로
        일관성 있게 제작·관리합니다. 제작한 썸네일은 아래에 등록되고 FTP로 올라갑니다.
      </p>

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
        const rest = p.colors.filter((c) => !c.rep);
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
