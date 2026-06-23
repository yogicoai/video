'use client';

import { useEffect, useState } from 'react';
import { BRAND_FIELDS } from '@/lib/models';

export default function BrandPage() {
  const [form, setForm] = useState(null);
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/brand');
      const data = await res.json();
      setForm(data.brand);
      setIsDefault(data.isDefault);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/brand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setForm(data.brand);
      setIsDefault(false);
      flash('브랜드 프로필 저장됨');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <div className="empty">불러오는 중…</div>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">브랜드 프로필</h1>
          <p className="page-desc">
            여기에 적은 내용이 <strong>모든 영상 프롬프트 생성에 자동으로 반영</strong>됩니다.
            오너가 직접 수정해 브랜드 톤을 통제하세요.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {toast && <span className="toast">{toast}</span>}
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>

      {isDefault && (
        <div
          className="section"
          style={{ borderColor: 'var(--accent)', color: 'var(--text-dim)', fontSize: 14 }}
        >
          📝 아직 저장된 프로필이 없어 <strong style={{ color: 'var(--text)' }}>요기보 초안</strong>이 채워져 있습니다.
          내용을 확인·수정한 뒤 <strong style={{ color: 'var(--text)' }}>저장</strong>을 누르세요.
        </div>
      )}

      <div className="section">
        {BRAND_FIELDS.map(({ key, label, hint, multiline }) => (
          <div className="field" key={key}>
            <label>
              {label} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>— {hint}</span>
            </label>
            {multiline ? (
              <textarea value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
            ) : (
              <input value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
            )}
          </div>
        ))}
      </div>

      <div className="section" style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
        이 프로필 + 각 프로젝트의 시나리오·이미지·스토리보드 →{' '}
        <strong style={{ color: 'var(--text)' }}>Veo 3 프롬프트 자동 생성 (Phase 2)</strong>
      </div>
    </>
  );
}
