import { listProducts } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

// GET /api/products/export?format=skill|json
// 제품 레지스트리를 스킬(SKILL.md) 또는 원시 JSON으로 다운로드 — 다른 환경(다른 사람의 Claude Code 등)에서 재사용.
export async function GET(req) {
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'skill';
  const products = await listProducts();
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === 'json') {
    return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), products }, null, 2), {
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

## 사용 규칙

1. **Element 우선**: 해당 색상에 element ID가 있으면 Higgsfield 프롬프트에 \`<<<element-id>>>\` 토큰으로 사용 — 형태·색 드리프트를 막는 검증된 방법.
2. **Element가 없거나 죽었으면 360에서 재락**: 360 URL은 가로 스프라이트(폭÷높이=프레임 수). 다운로드 → 프레임 분할 → **정면/측면/뒤 3각도** 선별 → media_upload → \`show_reference_elements(action:create)\` (전부 무료) → 새 ID를 레지스트리에 기록.
3. **사이즈는 숫자가 아니라 비교 언어로**: 생성 모델은 cm를 못 읽는다 → 각 제품의 "사이즈 프롬프트"를 프롬프트에 그대로 주입하고, 생성 후 인물 대비 비율을 스펙과 대조 검수.
4. **다른 색상이 필요하면**: 같은 제품의 360 URL 파일명에서 색상 토큰만 교체해보고(cafe24 규칙), 없으면 기존 프레임을 HSV 리컬러(블루→올리브 사례: H=38) 후 락.
5. Higgsfield Element는 워크스페이스에서 삭제될 수 있음 — **이 문서/레지스트리가 원본, Element는 캐시**.

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
