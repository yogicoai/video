'use client';

import { useState } from 'react';

const EMPTY = {
  title: '',
  scenario: '',
  tone: '',
  target: '',
  durationSec: 30,
  aspectRatio: '16:9',
};

export default function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('프로젝트 제목을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      await onCreate(form);
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>새 영상 프로젝트</h2>
        <p className="modal-sub">캠페인 기본 정보를 입력합니다. 에셋·스토리보드는 다음 단계에서 올립니다.</p>

        <div className="field">
          <label>제목 *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="예: 여름 신상 빈백 런칭 영상"
            autoFocus
          />
        </div>

        <div className="field">
          <label>시나리오 / 상황</label>
          <textarea
            value={form.scenario}
            onChange={(e) => set('scenario', e.target.value)}
            placeholder="예: 거실에서 빈백에 편하게 누워 휴식하는 일상. 따뜻한 오후 햇살."
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>톤·분위기</label>
            <input
              value={form.tone}
              onChange={(e) => set('tone', e.target.value)}
              placeholder="따뜻한, 감성적인"
            />
          </div>
          <div className="field">
            <label>타깃</label>
            <input
              value={form.target}
              onChange={(e) => set('target', e.target.value)}
              placeholder="20·30대 1인가구"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>목표 길이(초)</label>
            <input
              type="number"
              min={5}
              max={120}
              value={form.durationSec}
              onChange={(e) => set('durationSec', e.target.value)}
            />
          </div>
          <div className="field">
            <label>화면 비율</label>
            <select value={form.aspectRatio} onChange={(e) => set('aspectRatio', e.target.value)}>
              <option value="16:9">16:9 (가로)</option>
              <option value="9:16">9:16 (세로/쇼츠)</option>
              <option value="1:1">1:1 (정방형)</option>
            </select>
          </div>
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '생성 중…' : '프로젝트 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
