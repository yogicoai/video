# 테스트 키트 #1 — Kling AI (image-to-video)

목적: **우리 제품 이미지 + 샷별 프롬프트**가 실제로 쓸만한 영상을 만드는지,
유료 Veo 3로 가기 전에 무료로 검증한다. 동시에 Phase 2 프롬프트 생성기가
뽑아야 할 **출력 포맷**을 확정한다.

---

## 0. 준비물
- Yogibo 제품 사진 1장 (정면 또는 3/4 각도, 고해상도, 배경 깔끔할수록 좋음)
- klingai.com 무료 계정 (하루 66크레딧 ≈ 6생성 리셋)

## 1. Kling 설정 (무료 티어)
1. klingai.com → **AI Video → Image to Video**
2. 제품 이미지 업로드
3. 모델: **Kling 3.0** (가능하면 최신)
4. 길이: **5초**, 모드: Standard(무료)
5. 아래 프롬프트를 **Prompt** 칸에, 네거티브를 **Negative Prompt** 칸에 붙여넣기
6. Generate

> 무료 티어는 워터마크 + 저해상도(720p급)가 붙습니다. **품질이 아니라 "모션·구도·일관성"을 본다**고 생각하세요.

---

## 2. 테스트 프롬프트 (3개 — 카메라 무빙이 다름)

엔진들은 **영어 프롬프트**에 가장 잘 반응합니다. 한글 의도 + 영어 프롬프트를 같이 적어둡니다.

### 샷 A — 도입부 / 천천히 다가가기 (dolly-in)
> 의도: 따뜻한 거실, 빈백에 몸을 파묻으며 휴식. 카메라가 서서히 다가감.

```
Prompt:
A cozy modern living room bathed in warm afternoon sunlight. A person slowly
sinks into a large soft Yogibo beanbag and relaxes, exhaling gently. Slow
cinematic dolly-in toward the subject, soft natural window light, calm and
warm cozy mood, shallow depth of field, premium lifestyle commercial look.

Negative Prompt:
distorted limbs, deformed hands, flickering, morphing, jitter, text, logo,
watermark, fast erratic motion, oversaturated
```

### 샷 B — 제품 디테일 / 궤도 회전 (orbit)
> 의도: 빈백 질감·푹신함 강조. 카메라가 제품 주위를 부드럽게 돈다.

```
Prompt:
Close-up of a plush Yogibo beanbag chair, the soft fabric gently compressing
as someone settles in. Smooth slow orbital camera move around the beanbag,
warm golden hour light, soft shadows, tactile premium product feel,
cinematic, high detail fabric texture.

Negative Prompt:
distorted shape, melting, flickering, text, watermark, harsh lighting,
fast motion, warped geometry
```

### 샷 C — 라이프스타일 / 고정컷 + 미세 모션 (static)
> 의도: 빈백에 기대 책 읽는 일상. 카메라 고정, 자연스러운 미세 움직임.

```
Prompt:
A person comfortably lounging on a Yogibo beanbag, reading a book and slowly
turning a page with a soft relaxed smile. Static locked-off camera, subtle
ambient motion, warm homey atmosphere, natural soft window light, candid
lifestyle mood.

Negative Prompt:
distorted face, deformed hands, extra fingers, flickering, morphing, text,
watermark, camera shake
```

---

## 3. 평가표 (각 샷 5점 만점)

| 항목 | 무엇을 보나 | 샷A | 샷B | 샷C |
|---|---|---|---|---|
| 제품 일관성 | 빈백 모양·색이 안 뭉개지나 | | | |
| 모션 자연스러움 | 사람·천 움직임이 자연스러운가 | | | |
| 카메라 무빙 | 의도한 dolly/orbit/static대로 되나 | | | |
| 분위기 재현 | "따뜻한·감성" 톤이 살았나 | | | |
| 상업성 | 실제 광고로 쓸 수 있을 느낌인가 | | | |

> **결론 메모**: 어떤 카메라 무빙이 제품에 잘 맞았는지, 어떤 표현이 깨졌는지 적어두세요.
> 이게 Phase 2 프롬프트 생성기가 학습할 "잘 먹히는 패턴"이 됩니다.

---

## 4. 다음 단계 → ImagineArt
같은 이미지 + 같은 3개 프롬프트를 **ImagineArt(하루 100크레딧)** 에 넣어
여러 모델로 동시에 돌려보고, Kling 결과와 비교. **"우리 제품엔 어떤 엔진"** 을 정한다.
→ 정해지면 Phase 2 생성기를 그 엔진 포맷 기준으로 구현.
