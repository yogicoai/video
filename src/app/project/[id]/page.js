'use client';

import { useEffect, useRef, useState, use } from 'react';

const ASPECT_LABEL = { '16:9': '16:9 가로', '9:16': '9:16 세로', '1:1': '1:1 정방형' };

export default function ProjectDetailPage({ params }) {
  const { id } = use(params);

  const [project, setProject] = useState(null);
  const [assets, setAssets] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [savingSb, setSavingSb] = useState(false);
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(`/api/projects/${id}`),
        fetch(`/api/projects/${id}/assets`),
      ]);
      const p = (await pRes.json()).project;
      const a = (await aRes.json()).assets || [];
      setProject(p);
      setAssets(a);
      setCuts(p?.storyboard?.length ? p.storyboard : [emptyCut(1)]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function emptyCut(order) {
    return { id: `cut_${Date.now()}_${order}`, order, text: '', imageId: null };
  }

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  // ---- 이미지 업로드 ----
  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const res = await fetch(`/api/projects/${id}/assets`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.errors?.length) flash(`일부 실패: ${data.errors.join(', ')}`);
      await load();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function deleteAsset(assetId) {
    await fetch(`/api/assets/${assetId}`, { method: 'DELETE' });
    setCuts((cs) => cs.map((c) => (c.imageId === assetId ? { ...c, imageId: null } : c)));
    await load();
  }

  // ---- 스토리보드 ----
  function setCutText(i, text) {
    setCuts((cs) => cs.map((c, idx) => (idx === i ? { ...c, text } : c)));
  }
  function setCutImage(i, imageId) {
    setCuts((cs) => cs.map((c, idx) => (idx === i ? { ...c, imageId: imageId || null } : c)));
  }
  function addCut() {
    setCuts((cs) => [...cs, emptyCut(cs.length + 1)]);
  }
  function removeCut(i) {
    setCuts((cs) => cs.filter((_, idx) => idx !== i).map((c, idx) => ({ ...c, order: idx + 1 })));
  }
  function moveCut(i, dir) {
    setCuts((cs) => {
      const j = i + dir;
      if (j < 0 || j >= cs.length) return cs;
      const next = [...cs];
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((c, idx) => ({ ...c, order: idx + 1 }));
    });
  }

  async function saveStoryboard() {
    setSavingSb(true);
    try {
      const payload = cuts.filter((c) => c.text.trim());
      const res = await fetch(`/api/projects/${id}/storyboard`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyboard: payload }),
      });
      const data = await res.json();
      setCuts(data.storyboard?.length ? data.storyboard : [emptyCut(1)]);
      flash('스토리보드 저장됨');
    } finally {
      setSavingSb(false);
    }
  }

  if (loading) return <div className="empty">불러오는 중…</div>;
  if (!project) return <div className="empty">프로젝트를 찾을 수 없습니다.</div>;

  return (
    <>
      <a href="/" className="back-link">← 프로젝트 목록</a>

      <div className="page-head">
        <div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-desc">{project.scenario || '시나리오 미입력'}</p>
        </div>
        {toast && <span className="toast">{toast}</span>}
      </div>

      {/* 기본 정보 */}
      <div className="section">
        <div className="meta-grid">
          <div className="meta-item"><div className="k">목표 길이</div><div className="v">{project.durationSec}초</div></div>
          <div className="meta-item"><div className="k">화면 비율</div><div className="v">{ASPECT_LABEL[project.aspectRatio] || project.aspectRatio}</div></div>
          <div className="meta-item"><div className="k">톤·분위기</div><div className="v">{project.tone || '—'}</div></div>
          <div className="meta-item"><div className="k">타깃</div><div className="v">{project.target || '—'}</div></div>
          <div className="meta-item"><div className="k">이미지</div><div className="v">{assets.length}장</div></div>
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">제품 이미지</h2>
            <p className="section-hint">영상에 쓸 제품·레퍼런스 이미지를 올리세요 (JPG·PNG·WebP·GIF, 최대 15MB)</p>
          </div>
          <button className="btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? '업로드 중…' : '+ 파일 선택'}
          </button>
        </div>

        <div
          className={`dropzone${dragOver ? ' drag' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        >
          여기로 이미지를 끌어다 놓거나 클릭해서 선택하세요
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files)}
        />

        {assets.length > 0 && (
          <div className="asset-grid">
            {assets.map((a) => (
              <div className="asset" key={a._id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.originalName} />
                <button className="del" onClick={() => deleteAsset(a._id)} title="삭제">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 스토리보드 */}
      <div className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">스토리보드</h2>
            <p className="section-hint">컷별로 어떤 장면인지 적으세요. 각 컷에 위 이미지를 연결할 수 있습니다.</p>
          </div>
          <button className="btn btn-primary" onClick={saveStoryboard} disabled={savingSb}>
            {savingSb ? '저장 중…' : '스토리보드 저장'}
          </button>
        </div>

        {cuts.map((c, i) => (
          <div className="cut" key={c.id}>
            <div className="cut-no">{i + 1}</div>
            <div className="cut-body">
              <textarea
                value={c.text}
                onChange={(e) => setCutText(i, e.target.value)}
                placeholder={`컷 ${i + 1} 설명 — 예: 빈백에 앉아 햇살을 받으며 책을 펴는 장면`}
              />
              <select value={c.imageId || ''} onChange={(e) => setCutImage(i, e.target.value)}>
                <option value="">연결 이미지 없음</option>
                {assets.map((a, idx) => (
                  <option key={a._id} value={a._id}>이미지 #{idx + 1} ({a.originalName})</option>
                ))}
              </select>
            </div>
            <div className="cut-actions">
              <button className="icon-btn" onClick={() => moveCut(i, -1)} disabled={i === 0} title="위로">↑</button>
              <button className="icon-btn" onClick={() => moveCut(i, 1)} disabled={i === cuts.length - 1} title="아래로">↓</button>
              <button className="icon-btn" onClick={() => removeCut(i)} title="삭제">×</button>
            </div>
          </div>
        ))}

        <button className="btn btn-ghost" onClick={addCut} style={{ marginTop: 4 }}>+ 컷 추가</button>
      </div>

      {/* Phase 2 예고 */}
      <div className="section" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
        다음 단계: 이미지 + 스토리보드를 바탕으로 <strong style={{ color: 'var(--text)' }}>Veo 3 프롬프트 자동 생성</strong> (Phase 2)
      </div>
    </>
  );
}
