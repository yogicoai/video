import { listProducts } from '@/lib/productsStore';
import { listChips } from '@/lib/colorChips';
import { BRAND, MATERIALS } from '@/lib/sizeChart';

export const dynamic = 'force-dynamic';

// GET /api/products/export?format=skill|json
// 제품 레지스트리를 스킬(SKILL.md) 또는 원시 JSON으로 다운로드 — 다른 환경(다른 사람의 Claude Code 등)에서 재사용.
export async function GET(req) {
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'skill';
  const products = await listProducts();
  const chips = await listChips();
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === 'json') {
    return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), colorChips: chips, products }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="yogibo-products-${stamp}.json"`,
      },
    });
  }

  const productLines = products.map((p) => {
    const colors = (p.colors || []).map((c) => {
      const el = c.elementId ? `element: \`${c.elementId}\` (${c.elementName || '-'})` : 'element: 미등록 (아래 절차로 락)';
      const sp = c.sprite360 ? `360: ${c.sprite360}` : '360: 없음';
      return `  - **${c.color || '기본'}**${c.hex ? ` \`${c.hex}\`` : ''} — ${el} · ${sp}`;
    }).join('\n');
    const spec = p.spec && (p.spec.w || p.spec.h || p.spec.d || p.spec.weight)
      ? `\n- 스펙: 가로 ${p.spec.w || '?'}cm × 높이 ${p.spec.h || '?'}cm × 깊이 ${p.spec.d || '?'}cm · ${p.spec.weight || '?'}kg`
      : '';
    return `### ${p.name}${p.category ? ` (${p.category})` : ''}
${colors}${spec}
- 사이즈 프롬프트: "${p.scalePrompt || '-'}"
- 노트: ${p.notes || '-'}${p.usedIn?.length ? `\n- 사용 이력: ${p.usedIn.join(', ')}` : ''}`;
  }).join('\n\n');

  const md = `---
name: yogibo-products
description: 요기보 제품 데이터 레지스트리(360 제품컷 URL·Higgsfield Element ID·스펙·사이즈 프롬프트) — 요기보 제품이 등장하는 이미지/영상 생성 시 제품의 형태·색·사이즈 정확도를 확보할 때 사용. "요기보 제품 넣어줘", "Max/서포트/문필로우/메이트 등장 컷" 요청 시 참조.
---

# 요기보 제품 데이터 레지스트리 (export ${stamp})

요기보 제품이 등장하는 **모든 생성 전에 이 데이터를 참조**한다. 원본 레지스트리: videoGen 앱 \`/products\` (GET /api/products).

## 설치 & 새 환경 온보딩 (다른 사람의 Claude Code + 힉스필드 환경)

1. **다운로드**: videoGen \`/products\` 페이지 → "⬇ 스킬 다운로드(SKILL.md)" / "⬇ products.json". (URL 직접: \`/api/products/export?format=skill\` 또는 \`?format=json\`)
2. **설치**: 받은 SKILL.md를 그 환경의 \`.claude/skills/yogibo-products/SKILL.md\`로 저장 → Claude Code가 요기보 제품 요청 시 자동 참조. products.json은 스크립트/코드에서 기계 판독용(같은 데이터의 원시 JSON — 이 문서 맨 아래에도 임베드돼 있음).
3. **⚠️ Element는 힉스필드 워크스페이스 종속**: 이 문서의 element ID들은 원 제작 워크스페이스 기준이다. 새 환경에서는 세션 시작 시 \`show_reference_elements(action:'list')\`로 존재 여부부터 확인하고, **없으면 사용 규칙 2번 절차로 360 URL에서 재락(전부 무료)** 후 새 ID를 쓴다. 재락한 ID는 가능하면 원본 레지스트리(PUT /api/products/:id)에도 반영해 되돌려준다.
4. **생성 프롬프트 조립 순서(영어)**: ① 제품 \`<<<element-id>>>\` 토큰 ② 노트의 "연출:" 영어 문장(형태·사용 모드·포즈 — 그대로 복사) ③ "사이즈 프롬프트"(인물 대비 비율 — 그대로 복사) ④ 클로즈업이면 브랜드 로고 태그 문장 ⑤ 장면·조명·무드. 생성 후 색상은 컬러칩 HEX와 대조 검수.
5. **비용 규칙**: 이미지/영상 생성만 크레딧 소모. 업로드·Element 생성·조회는 무료. 스틸 승인 후 영상화(스틸 1장씩 확인)가 기본 순서.

## 사용 규칙

1. **Element 우선**: 해당 색상에 element ID가 있으면 Higgsfield 프롬프트에 \`<<<element-id>>>\` 토큰으로 사용 — 형태·색 드리프트를 막는 검증된 방법.
2. **Element가 없거나 죽었으면 360에서 재락**: 360 URL은 가로 스프라이트(폭÷높이=프레임 수). 다운로드 → 프레임 분할 → **정면/측면/뒤 3각도** 선별 → media_upload → \`show_reference_elements(action:create)\` (전부 무료) → 새 ID를 레지스트리에 기록.
3. **사이즈는 숫자가 아니라 비교 언어로**: 생성 모델은 cm를 못 읽는다 → 각 제품의 "사이즈 프롬프트"를 프롬프트에 그대로 주입하고, 생성 후 인물 대비 비율을 스펙과 대조 검수.
4. **다른 색상이 필요하면**: 아래 컬러칩 팔레트에서 HEX를 확정 → 같은 제품의 360 URL 파일명에서 색상 토큰만 교체해보고(cafe24 규칙), 없으면 기존 프레임을 HSV 리컬러(블루→올리브 사례: H=38, 목표색=칩 HEX) 후 락.
5. Higgsfield Element는 워크스페이스에서 삭제될 수 있음 — **이 문서/레지스트리가 원본, Element는 캐시**.
6. **색상명은 컬러칩 팔레트가 단일 진실**: "요기보 맥스 아쿠아블루로" 식 요청이 오면 팔레트에서 이름·HEX를 확정하고, 그 제품의 해당 색상 360/Element를 찾아 진행. 색상 검수(드리프트 감지)도 칩 HEX 기준.

## 브랜드 공통

- 브랜드: **${BRAND.name}(${BRAND.ko})** · 라인: ${BRAND.lines}
- **로고 태그 (프롬프트에 영어 그대로 주입)**: "${BRAND.logoTagPrompt}" — 모든 패브릭 제품 공통. 제품 클로즈업 컷에서 브랜드 식별의 핵심.
- **촬영 규칙 (프롬프트에 영어 그대로 주입)**: "${BRAND.shootRulePrompt}" — 지퍼·시임 면은 항상 카메라 반대쪽.
- **모델 스케일 앵커**: ${BRAND.modelHeightNote} — 프롬프트: "${BRAND.modelHeightPrompt}". 제품 대비 인물 비율 검수 기준 (예: 맥스 170cm 세우면 모델보다 머리 하나 큼).
- 로고 에셋: ${BRAND.logoAsset}
- 소재 공통(빈백): ${MATERIALS}

## 컬러칩 팔레트 (요기보 공식 고정값)

${chips.map((c) => `- **${c.name}** \`${c.hex}\`${c.note ? ` — ${c.note}` : ''}`).join('\n')}

## 제품 데이터

${productLines}

## 원시 데이터 (JSON)

\`\`\`json
${JSON.stringify(products, null, 2)}
\`\`\`
`;

  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="SKILL.md"`,
    },
  });
}
