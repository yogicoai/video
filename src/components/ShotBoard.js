'use client';

import { useEffect, useState } from 'react';

export default function ShotBoard({ projectId, assets }) {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [renderingId, setRenderingId] = useState(null);
  const [motions, setMotions] = useState([]);
  const [engineByShot, setEngineByShot] = useState({}); // shotId → 'veo' | 'higgsfield'
  const [motionByShot, setMotionByShot] = useState({}); // shotId → motionId

  const imgById = Object.fromEntries(assets.map((a) => [String(a._id), a]));

  // Higgsfield 모션 프리셋 목록 (역동적 카메라 무빙)
  useEffect(() => {
    fetch('/api/motions')
      .then((r) => r.json())
      .then((d) => setMotions(d.motions || []))
      .catch(() => setMotions([]));
  }, []);

  const engineOf = (s) => engineByShot[s._id] || s.engine || 'veo';

  async function loadShots() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`);
      const data = await res.json();
      setShots(data.shots || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  async function generate() {
    if (shots.length && !confirm('기존 샷을 모두 새로 생성합니다. 계속할까요?')) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성 실패');
      setShots(data.shots || []);
      flash('프롬프트 생성 완료');
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  function setField(i, field, value) {
    setShots((ss) => ss.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  async function saveShot(i) {
    const s = shots[i];
    await fetch(`/api/shots/${s._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: s.title,
        description: s.description,
        veoPrompt: s.veoPrompt,
        negativePrompt: s.negativePrompt,
      }),
    });
    flash(`샷 ${s.order} 저장됨`);
  }

  async function toggleApprove(i) {
    const s = shots[i];
    const res = await fetch(`/api/shots/${s._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !s.approved }),
    });
    const data = await res.json();
    setShots((ss) => ss.map((x, idx) => (idx === i ? data.shot : x)));
  }

  function copy(text) {
    navigator.clipboard?.writeText(text);
    flash('복사됨');
  }

  async function renderShot(i) {
    const s = shots[i];
    const engine = engineOf(s);
    const motionId = motionByShot[s._id];

    const msg =
      engine === 'higgsfield'
        ? `이 샷을 Higgsfield로 렌더링합니다.\n\n· 역동적 카메라 모션 적용\n· Higgsfield 크레딧 사용\n· 이미지 연결 필수\n생성에 1~3분 걸립니다.\n\n진행할까요?`
        : `이 샷을 Veo 3.1로 렌더링합니다.\n\n예상 비용: 약 $0.40 (Veo 3.1 Fast · 720p · 4초)\n생성에 1~3분 걸립니다.\n\n진행할까요?`;
    if (!confirm(msg)) return;

    setRenderingId(s._id);
    setError('');
    try {
      const res = await fetch(`/api/shots/${s._id}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine, motionId, strength: 0.8 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '렌더 실패');
      setShots((ss) => ss.map((x, idx) => (idx === i ? { ...x, videoUrl: data.videoUrl, engine } : x)));
      flash('렌더 완료');
    } catch (e) {
      setError(`렌더 실패: ${e.message}`);
    } finally {
      setRenderingId(null);
    }
  }

  const approvedCount = shots.filter((s) => s.approved).length;

  return (
    <div className="section">
      <div className="section-head">
        <div>
          <h2 className="section-title">샷 보드 — 프롬프트 & 영상 렌더</h2>
          <p className="section-hint">
            브랜드 프로필 + 시나리오 + 이미지 + 스토리보드를 바탕으로 Claude가 생성합니다.
            {shots.length > 0 && ` · 승인 ${approvedCount}/${shots.length}`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {toast && <span className="toast">{toast}</span>}
          <button className="btn btn-primary" onClick={generate} disabled={generating}>
            {generating ? 'AI 생성 중… (최대 1~2분)' : shots.length ? '↻ 다시 생성' : '✨ AI 프롬프트 생성'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

      {loading ? (
        <div className="empty">불러오는 중…</div>
      ) : shots.length === 0 ? (
        <div className="empty">
          아직 생성된 프롬프트가 없습니다.
          <br />
          위 <strong>AI 프롬프트 생성</strong> 버튼을 눌러 샷별 Veo 3 프롬프트를 만들어 보세요.
        </div>
      ) : (
        shots.map((s, i) => {
          const img = s.referenceImageId ? imgById[String(s.referenceImageId)] : null;
          return (
            <div className={`shot${s.approved ? ' approved' : ''}`} key={s._id}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="shot-thumb" src={img.url} alt={img.originalName} />
              ) : (
                <div className="shot-thumb empty">연결 이미지 없음</div>
              )}

              <div className="shot-main">
                <div className="shot-head">
                  <span className="shot-no">{s.order}</span>
                  <span className="shot-title">{s.title}</span>
                  <span className="shot-tag">🎥 {s.cameraMovement}</span>
                  <span className="shot-tag">⏱ {s.durationSec}s</span>
                  {s.approved && <span className="shot-tag" style={{ color: '#4ade80' }}>✓ 승인됨</span>}
                </div>
                <div className="shot-desc">{s.description}</div>

                <div className="prompt-box">
                  <div className="prompt-label">
                    <span>Veo 3 프롬프트 (영어)</span>
                    <button className="copy-btn" onClick={() => copy(s.veoPrompt)}>복사</button>
                  </div>
                  <textarea
                    rows={4}
                    value={s.veoPrompt}
                    onChange={(e) => setField(i, 'veoPrompt', e.target.value)}
                  />
                </div>

                <div className="prompt-box">
                  <div className="prompt-label">
                    <span>네거티브 프롬프트</span>
                    <button className="copy-btn" onClick={() => copy(s.negativePrompt)}>복사</button>
                  </div>
                  <textarea
                    rows={2}
                    value={s.negativePrompt}
                    onChange={(e) => setField(i, 'negativePrompt', e.target.value)}
                  />
                </div>

                <div className="shot-actions" style={{ flexWrap: 'wrap' }}>
                  <button className="btn btn-sm" onClick={() => saveShot(i)}>저장</button>
                  <button
                    className={`btn btn-sm${s.approved ? '' : ' btn-approve'}`}
                    onClick={() => toggleApprove(i)}
                  >
                    {s.approved ? '승인 취소' : '✓ 승인'}
                  </button>

                  {s.approved && (
                    <>
                      {/* 엔진 선택 */}
                      <select
                        className="cut-body"
                        style={{ padding: '6px 9px', fontSize: 13, width: 'auto' }}
                        value={engineOf(s)}
                        onChange={(e) => setEngineByShot((m) => ({ ...m, [s._id]: e.target.value }))}
                      >
                        <option value="veo">Veo 3.1 (~$0.40)</option>
                        <option value="higgsfield">Higgsfield (역동적 모션)</option>
                      </select>

                      {/* Higgsfield 모션 프리셋 */}
                      {engineOf(s) === 'higgsfield' && (
                        <select
                          className="cut-body"
                          style={{ padding: '6px 9px', fontSize: 13, width: 'auto', maxWidth: 180 }}
                          value={motionByShot[s._id] || ''}
                          onChange={(e) => setMotionByShot((m) => ({ ...m, [s._id]: e.target.value }))}
                        >
                          <option value="">모션 선택(선택사항)</option>
                          {motions.map((mo) => (
                            <option key={mo.id} value={mo.id}>{mo.name}</option>
                          ))}
                        </select>
                      )}

                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => renderShot(i)}
                        disabled={renderingId === s._id}
                        title="실제 영상 생성 (유료)"
                      >
                        {renderingId === s._id ? '🎬 렌더 중… (1~3분)' : s.videoUrl ? '↻ 다시 렌더' : '🎬 렌더'}
                      </button>
                    </>
                  )}
                </div>

                {s.videoUrl && (
                  <div style={{ marginTop: 12 }}>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={s.videoUrl}
                      controls
                      style={{ width: '100%', maxWidth: 360, borderRadius: 10, border: '1px solid var(--border)' }}
                    />
                    <div style={{ marginTop: 4 }}>
                      <a className="copy-btn" href={s.videoUrl} download>영상 다운로드</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
