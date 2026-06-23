'use client';

import { useEffect, useState } from 'react';
import NewProjectModal from '@/components/NewProjectModal';

const STATUS_LABEL = {
  draft: '작성 중',
  generating: '생성 중',
  review: '검수 중',
  done: '완료',
};

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`;
}

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(form) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || '생성에 실패했습니다.');
    }
    setModalOpen(false);
    await load();
  }

  async function handleDelete(id, title) {
    if (!confirm(`"${title}" 프로젝트를 삭제할까요?`)) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">영상 프로젝트</h1>
          <p className="page-desc">
            제품 이미지와 스토리보드를 올리면 Veo 3 영상 프롬프트를 생성·관리합니다.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + 새 프로젝트
        </button>
      </div>

      {loading ? (
        <div className="empty">불러오는 중…</div>
      ) : projects.length === 0 ? (
        <div className="empty">
          아직 프로젝트가 없습니다.
          <br />
          오른쪽 위 <strong>새 프로젝트</strong> 버튼으로 첫 캠페인을 만들어 보세요.
        </div>
      ) : (
        <div className="grid">
          {projects.map((p) => (
            <div className="card" key={p._id}>
              <a href={`/project/${p._id}`} style={{ display: 'block' }}>
                <div className="card-title">{p.title}</div>
                <div className="card-meta">
                  {p.scenario ? p.scenario.slice(0, 70) : '시나리오 미입력'}
                  {p.scenario && p.scenario.length > 70 ? '…' : ''}
                  <br />
                  {p.durationSec}초 · {p.aspectRatio}
                  {p.tone ? ` · ${p.tone}` : ''}
                </div>
              </a>
              <div className="card-foot">
                <span className={`badge badge-${p.status}`}>
                  {STATUS_LABEL[p.status] || p.status}
                </span>
                <span className="card-meta" style={{ fontSize: 12 }}>
                  {fmtDate(p.createdAt)}
                </span>
              </div>
              <div className="card-foot" style={{ marginTop: 10 }}>
                <span />
                <button className="btn btn-danger" onClick={() => handleDelete(p._id, p.title)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <NewProjectModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </>
  );
}
