import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// GET /api/skills/export — 제작 워크플로우 스킬(cf-video-production SKILL.md) 다운로드.
// 제품 데이터 스킬(/api/products/export)과 짝: 데이터 + 제작 방법론을 함께 배포.
// 파일이 단일 소스 — 여기서 복제본을 만들지 않고 그대로 서빙 (스킬 갱신이 곧 배포 갱신).
const SKILL_PATH = path.join(process.cwd(), '.claude', 'skills', 'cf-video-production', 'SKILL.md');

export async function GET() {
  try {
    // 주의: Vercel 서버리스는 이 경로를 번들에 안 넣을 수 있음(fs 동적 읽기 트레이싱 한계).
    // 주 사용처는 로컬(5300) — 배포판에서 필요해지면 next.config outputFileTracingIncludes에 경로 추가.
    const md = fs.readFileSync(SKILL_PATH, 'utf8');
    const stamp = new Date().toISOString().slice(0, 10);
    const header = `---
name: cf-video-production
description: 레퍼런스 영상 기반 9:16 세로 AI 단편 CF 제작 워크플로우 — 게이트 파이프라인·Element 락·엔진 선택(Seedance/Kling)·원테이크·톤 통일·러프컷 편집. 요기보 videoGen에서 실전 검증된 절차. (export ${stamp})
---

`;
    // 원본에 frontmatter가 이미 있으면 그대로, 없으면 붙여서 배포
    const body = md.trimStart().startsWith('---') ? md : header + md;
    return new Response(body, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="SKILL.md"',
      },
    });
  } catch (e) {
    return new Response(
      '제작 스킬 파일을 찾을 수 없습니다 (.claude/skills/cf-video-production/SKILL.md). 로컬 videoGen 환경에서 다운로드하세요.',
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }
}
