import Anthropic from '@anthropic-ai/sdk';
import { collection } from '@/lib/db';
import { COLLECTIONS, BRAND_INSIGHTS_DOC_ID } from '@/lib/models';

// 라이브 브랜드 인사이트 — Claude 웹검색을 yogibo.kr/.jp 도메인으로 제한해
// "현재 브랜드 가치·제품 라인업·캠페인 톤"을 요약한 한국어 브리프를 만든다.
// 매 생성마다 검색하면 느리고 비싸므로, settings 컬렉션에 캐시하고 TTL 내에는 재사용한다.

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
// 캐시 유효기간(일). 이 기간이 지나면 다음 요청 때 자동 갱신.
const TTL_DAYS = Number(process.env.BRAND_INSIGHTS_TTL_DAYS) || 7;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

// 검색 대상 도메인 — 요기보 공식. (한국 시장 우선이라 .kr을 먼저 둔다)
const ALLOWED_DOMAINS = ['yogibo.kr', 'yogibo.jp'];

let _client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY가 설정되지 않았습니다 (.env.local).');
  }
  if (!_client) _client = new Anthropic();
  return _client;
}

const SYSTEM = `당신은 Yogibo(요기보) 브랜드 리서처입니다. 제공된 웹검색 도구로 **yogibo.kr / yogibo.jp 공식 사이트만** 조사해, 숏폼 영상 기획에 바로 쓸 수 있는 "라이브 브랜드 브리프"를 한국어로 작성합니다.

# 규칙
- 반드시 web_search 도구로 공식 사이트를 확인하고, 거기서 읽은 사실만 적습니다. 추측·과장 금지.
- 결과는 간결한 한국어 불릿. 전체 600자 이내로 압축.
- 아래 항목을 순서대로 채웁니다(해당 정보가 없으면 그 항목은 생략):

## 핵심 브랜드 메시지/슬로건
- (공식 카피·태그라인 그대로 1~2개)

## 최신 제품·라인업
- (현재 판매 중인 대표 제품/사이즈/신상, 핵심 특징 한 줄씩)

## 현재 캠페인·시즌 프로모션
- (진행 중인 이벤트·시즌 테마가 보이면)

## 강조 키워드·톤
- (사이트에서 반복되는 단어·분위기)

## 쇼츠에 활용할 포인트
- (위 내용을 영상 훅으로 쓸 만한 아이디어 씨앗 2~3개)`;

const ASK = `yogibo.kr와 yogibo.jp 공식 사이트를 검색해서, 요기보의 현재 브랜드 메시지·최신 제품 라인업·진행 중인 캠페인·강조 키워드를 조사하고 위 형식의 한국어 브랜드 브리프로 정리해줘.`;

/**
 * 웹검색으로 브랜드 브리프 텍스트 생성. 실패 시 throw.
 * @returns {Promise<{text:string, sources:string[]}>}
 */
async function fetchFromWeb() {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: 'user', content: ASK }],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 6,
        allowed_domains: ALLOWED_DOMAINS,
      },
    ],
  });

  // 텍스트 블록을 모아 브리프 본문으로. web_search_tool_result 블록에서 출처 URL 수집.
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const sources = [];
  for (const b of response.content) {
    if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
      for (const r of b.content) {
        if (r.type === 'web_search_result' && r.url) sources.push(r.url);
      }
    }
  }

  if (!text) throw new Error('웹검색 응답에서 브리프 텍스트를 찾지 못했습니다.');
  return { text, sources: [...new Set(sources)].slice(0, 8) };
}

/**
 * 캐시된 브랜드 인사이트를 반환. 없거나 만료됐으면(또는 refresh=true) 웹검색으로 갱신.
 * 웹검색이 실패하면 (있으면) 캐시를 그대로 반환하고, 캐시도 없으면 null.
 *
 * @param {{ refresh?: boolean }} [opts] refresh=true면 TTL 무시하고 강제 재검색
 * @returns {Promise<{ text:string, sources:string[], fetchedAt:Date, stale:boolean } | null>}
 */
export async function getBrandInsights({ refresh = false } = {}) {
  const col = await collection(COLLECTIONS.settings);
  const cached = await col.findOne({ _id: BRAND_INSIGHTS_DOC_ID });

  const fresh =
    cached?.fetchedAt && Date.now() - new Date(cached.fetchedAt).getTime() < TTL_MS;

  if (cached && fresh && !refresh) {
    return { text: cached.text, sources: cached.sources || [], fetchedAt: cached.fetchedAt, stale: false };
  }

  try {
    const { text, sources } = await fetchFromWeb();
    const fetchedAt = new Date();
    await col.updateOne(
      { _id: BRAND_INSIGHTS_DOC_ID },
      { $set: { text, sources, fetchedAt } },
      { upsert: true }
    );
    return { text, sources, fetchedAt, stale: false };
  } catch (err) {
    console.error('[brandInsights] 웹검색 갱신 실패:', err.message);
    // 갱신 실패 — 오래됐어도 캐시가 있으면 그걸 쓴다(서비스 지속).
    if (cached?.text) {
      return { text: cached.text, sources: cached.sources || [], fetchedAt: cached.fetchedAt, stale: true };
    }
    return null;
  }
}

/**
 * 캐시된 인사이트만 읽어 반환(웹검색 안 함). 페이지 로드 등 비용을 일으키면 안 되는 곳에서 사용.
 * @returns {Promise<{ text:string, sources:string[], fetchedAt:Date, stale:boolean } | null>}
 */
export async function peekBrandInsights() {
  const col = await collection(COLLECTIONS.settings);
  const cached = await col.findOne({ _id: BRAND_INSIGHTS_DOC_ID });
  if (!cached?.text) return null;
  const stale = !cached.fetchedAt || Date.now() - new Date(cached.fetchedAt).getTime() >= TTL_MS;
  return { text: cached.text, sources: cached.sources || [], fetchedAt: cached.fetchedAt, stale };
}

/** 인사이트 텍스트를 프롬프트에 끼워 넣을 블록으로 변환 (없으면 빈 문자열). */
export function insightsBlock(insights) {
  if (!insights?.text) return '';
  return `\n\n# 라이브 브랜드 인사이트 (yogibo.kr/.jp 공식 사이트 최신 조사 — 반드시 반영)\n${insights.text}\n`;
}
