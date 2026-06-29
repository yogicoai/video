'use client';

import { useEffect, useState } from 'react';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [season, setSeason] = useState('');
  const [vibe, setVibe] = useState('');
  const [focus, setFocus] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [refreshingInsights, setRefreshingInsights] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/ideas');
      setIdeas((await res.json()).ideas || []);
    } finally {
      setLoading(false);
    }
  }
  async function loadInsights() {
    try {
      const res = await fetch('/api/brand/insights');
      setInsights((await res.json()).insights || null);
    } catch {
      /* 무시 — 인사이트는 보조 정보 */
    }
  }
  useEffect(() => {
    load();
    loadInsights();
  }, []);

  async function refreshInsights() {
    setRefreshingInsights(true);
    setError('');
    try {
      const res = await fetch('/api/brand/insights', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '갱신 실패');
      setInsights(data.insights);
      flash('브랜드 정보를 yogibo.kr/.jp에서 새로 가져왔어요');
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshingInsights(false);
    }
  }

  function fmtDate(d) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return '';
    }
  }

  function flash(m) {
    setToast(m);
    setTimeout(() => setToast(''), 2500);
  }

  async function generate() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5, season, vibe, focus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성 실패');
      setIdeas((prev) => [...data.ideas, ...prev]);
      flash(`아이디어 ${data.ideas.length}개 생성됨`);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function makeProject(idea) {
    setBusyId(idea._id);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          scenario: `${idea.concept}\n\n장면: ${idea.scenePrompt}`,
          durationSec: idea.durationSec || 10,
          aspectRatio: '9:16',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '프로젝트 생성 실패');
      window.location.href = `/project/${data.project._id}`;
    } catch (e) {
      setError(e.message);
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!confirm('이 아이디어를 삭제할까요?')) return;
    await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
    setIdeas((prev) => prev.filter((x) => x._id !== id));
  }

  function copy(text) {
    navigator.clipboard?.writeText(text);
    flash('복사됨');
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">쇼츠 아이디어</h1>
          <p className="page-desc">트렌드 + 요기보 브랜드를 반영한 쇼츠 아이디어를 AI가 제안합니다. 마음에 들면 바로 프로젝트로.</p>
        </div>
        {toast && <span className="toast">{toast}</span>}
      </div>

      {/* 라이브 브랜드 인사이트 (yogibo.kr/.jp) */}
      <div className="section" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <strong style={{ fontSize: 14 }}>🔗 브랜드 인사이트 <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(yogibo.kr / yogibo.jp 자동 조사)</span></strong>
            <div className="card-meta" style={{ fontSize: 12, marginTop: 2 }}>
              {insights?.fetchedAt ? (
                <>최종 갱신: {fmtDate(insights.fetchedAt)}{insights.stale ? ' · ⚠️ 갱신 실패로 이전 정보 사용 중' : ''}</>
              ) : (
                '아직 가져온 브랜드 정보가 없습니다. 새로고침을 눌러보세요.'
              )}
            </div>
          </div>
          <button className="btn btn-sm" onClick={refreshInsights} disabled={refreshingInsights}>
            {refreshingInsights ? '조사 중… (~20초)' : '🔄 새로고침'}
          </button>
        </div>
        {insights?.text && (
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--accent)' }}>요약 펼쳐보기</summary>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.7, marginTop: 8, color: 'var(--text-dim)' }}>
              {insights.text}
            </div>
            {insights.sources?.length > 0 && (
              <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-dim)' }}>
                출처: {insights.sources.map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', marginRight: 8 }}>[{i + 1}]</a>
                ))}
              </div>
            )}
          </details>
        )}
      </div>

      {/* 생성 패널 */}
      <div className="section">
        <div className="field-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="field">
            <label>시즌 (선택)</label>
            <input value={season} onChange={(e) => setSeason(e.target.value)} placeholder="여름, 장마, 연말…" />
          </div>
          <div className="field">
            <label>분위기 (선택)</label>
            <input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="감성적, 유머, ASMR…" />
          </div>
          <div className="field">
            <label>집중 주제 (선택)</label>
            <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="1인가구, 반려동물, 방수…" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={generating}>
          {generating ? 'AI 아이디어 생성 중… (~30초)' : '✨ 아이디어 생성'}
        </button>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 10 }}>{error}</p>}
      </div>

      {loading ? (
        <div className="empty">불러오는 중…</div>
      ) : ideas.length === 0 ? (
        <div className="empty">아직 아이디어가 없습니다. 위 <strong>아이디어 생성</strong> 버튼을 눌러보세요.</div>
      ) : (
        <div className="grid">
          {ideas.map((idea) => (
            <div className="card" key={idea._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                {idea.tag && <span className="badge badge-draft">{idea.tag}</span>}
                <span className="card-meta" style={{ fontSize: 12 }}>{idea.durationSec}초</span>
              </div>
              <div className="card-title">{idea.title}</div>
              <div className="card-meta" style={{ margin: '6px 0' }}>{idea.concept}</div>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                <div><strong style={{ color: 'var(--accent)' }}>훅</strong> {idea.hook}</div>
                <div style={{ color: 'var(--text-dim)', marginTop: 4 }}><strong>왜 먹히나</strong> {idea.trendRationale}</div>
                {idea.recommendedMotion && (
                  <div style={{ marginTop: 4 }}>🎥 추천 모션: <strong>{idea.recommendedMotion}</strong></div>
                )}
              </div>

              <div className="prompt-box" style={{ marginTop: 10 }}>
                <div className="prompt-label">
                  <span>장면 프롬프트 (영어)</span>
                  <button className="copy-btn" onClick={() => copy(idea.scenePrompt)}>복사</button>
                </div>
                <textarea rows={3} readOnly value={idea.scenePrompt} />
              </div>

              <div className="card-foot" style={{ marginTop: 10 }}>
                <button className="btn btn-sm btn-primary" onClick={() => makeProject(idea)} disabled={busyId === idea._id}>
                  {busyId === idea._id ? '생성 중…' : '이 아이디어로 프로젝트 만들기'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(idea._id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
