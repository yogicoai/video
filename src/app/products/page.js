'use client';

import { useEffect, useState } from 'react';

// 360 스프라이트(가로로 이어붙은 정사각 프레임들)의 첫 프레임만 보여주는 미리보기
function Sprite360Preview({ url, size = 110 }) {
  if (!url) {
    return (
      <div style={{ width: size, height: size, borderRadius: 10, background: 'var(--bg-elev)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-dim)' }}>
        360 URL 없음
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: 10, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', flex: '0 0 auto' }}>
      {/* 스프라이트 높이=프레임 높이 → 높이 100%로 맞추면 첫 프레임이 보인다 */}
      <img src={url} alt="360 첫 프레임" style={{ height: '100%', width: 'auto', maxWidth: 'none', display: 'block' }} />
    </div>
  );
}

const EMPTY_COLOR = { color: '', hex: '', sprite360: '', elementId: '', elementName: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [saving, setSaving] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const r = await fetch('/api/products');
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { flash(j.error || '불러오기 실패'); setProducts([]); return; }
      setProducts(j.products || []);
    } catch (e) {
      flash('API 오류: ' + e.message); setProducts([]);
    }
  }
  function flash(m) { setToast(m); setTimeout(() => setToast(''), 2200); }

  function patch(idx, updater) {
    setProducts((ps) => ps.map((p, i) => (i === idx ? updater(structuredClone(p)) : p)));
  }

  async function save(p) {
    setSaving(p.id);
    const { id, _id, createdAt, updatedAt, ...body } = p;
    const r = await fetch(`/api/products/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setSaving('');
    if (r.ok) flash(`${p.name} 저장 완료`);
    else flash('저장 실패');
  }

  async function addProduct() {
    const name = prompt('제품명을 입력하세요 (예: Yogibo Pod)');
    if (!name) return;
    const r = await fetch('/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, colors: [{ ...EMPTY_COLOR }] }),
    });
    if (r.ok) { await load(); flash(`${name} 추가됨`); }
  }

  async function removeProduct(p) {
    if (!confirm(`"${p.name}" 삭제할까요?`)) return;
    await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
    await load();
  }

  const inp = { width: '100%', padding: '6px 8px', fontSize: 12.5, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' };
  const lbl = { fontSize: 11, color: 'var(--text-dim)', marginBottom: 3, display: 'block' };

  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">📦 제품 데이터 레지스트리</h1>
          <p className="page-desc">
            영상 제작 시 <b>Element 락 · 사이즈 프롬프트</b>의 단일 소스. 360 URL을 등록하면 각도 추출 → Element 락에 사용되고,
            스펙은 "인물 대비 비율" 프롬프트로 변환돼 제품 사이즈 정확도를 올립니다.
          </p>
        </div>
        {toast && <span className="toast">{toast}</span>}
      </div>

      <div className="note" style={{ marginBottom: 18, fontSize: 12.5 }}>
        사용 절차: ① 색상별 <b>360 스프라이트 URL</b> 입력 → ② 제작 세션에서 각도 추출·Element 락 → ③ <b>Element ID 자동 기록</b> → ④ 스펙·비교 문구는 프롬프트에 주입.
        <br />크레딧: 업로드·Element 생성은 <b>무료</b> — 등록만 해두면 어떤 프로젝트에서든 재사용.
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={addProduct} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          + 제품 추가
        </button>
        <a href="/api/products/export?format=skill" download
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #4CAF50', background: 'none', color: '#4CAF50', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ⬇ 스킬 다운로드 (SKILL.md)
        </a>
        <a href="/api/products/export?format=json" download
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ⬇ products.json
        </a>
        <span className="card-meta" style={{ fontSize: 11.5 }}>
          스킬 설치: 받은 SKILL.md를 <b>.claude/skills/yogibo-products/SKILL.md</b>로 저장 → 그 환경의 Claude가 제품 Element·스펙을 자동 참조
        </span>
      </div>

      {!products ? (
        <div className="empty">불러오는 중…</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {products.map((p, idx) => (
            <div key={p.id} className="note" style={{ padding: 16 }}>
              {/* 헤더 */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <input value={p.name} onChange={(e) => patch(idx, (q) => { q.name = e.target.value; return q; })}
                  style={{ ...inp, width: 200, fontWeight: 700, fontSize: 15 }} />
                <input value={p.category || ''} placeholder="카테고리" onChange={(e) => patch(idx, (q) => { q.category = e.target.value; return q; })}
                  style={{ ...inp, width: 130 }} />
                <span className="badge badge-generating" style={{ fontSize: 11 }}>
                  {p.colors?.some((c) => c.elementId) ? `✅ Element ${p.colors.filter((c) => c.elementId).length}색 락` : '⬜ Element 미등록'}
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => save(p)} disabled={saving === p.id}
                  style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}>
                  {saving === p.id ? '저장 중…' : '💾 저장'}
                </button>
                <button onClick={() => removeProduct(p)}
                  style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12 }}>
                  삭제
                </button>
              </div>

              {/* 색상별 360 + Element */}
              {(p.colors || []).map((c, ci) => (
                <div key={ci} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <Sprite360Preview url={c.sprite360} />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '130px 90px 1fr', gap: 8 }}>
                    <div>
                      <span style={lbl}>색상</span>
                      <input value={c.color} placeholder="예: 아쿠아블루" onChange={(e) => patch(idx, (q) => { q.colors[ci].color = e.target.value; return q; })} style={inp} />
                    </div>
                    <div>
                      <span style={lbl}>HEX</span>
                      <input value={c.hex || ''} placeholder="#0081CC" onChange={(e) => patch(idx, (q) => { q.colors[ci].hex = e.target.value; return q; })} style={inp} />
                    </div>
                    <div>
                      <span style={lbl}>360 스프라이트 URL (cafe24)</span>
                      <input value={c.sprite360 || ''} placeholder="https://yogibo.openhost.cafe24.com/web/img/360/..." onChange={(e) => patch(idx, (q) => { q.colors[ci].sprite360 = e.target.value; return q; })} style={inp} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={lbl}>Element ID (락 완료 시)</span>
                      <input value={c.elementId || ''} placeholder="세션에서 락 후 자동 기록" onChange={(e) => patch(idx, (q) => { q.colors[ci].elementId = e.target.value; return q; })} style={inp} />
                    </div>
                    <div>
                      <span style={lbl}>Element 이름</span>
                      <input value={c.elementName || ''} placeholder="yogibo-..." onChange={(e) => patch(idx, (q) => { q.colors[ci].elementName = e.target.value; return q; })} style={inp} />
                    </div>
                  </div>
                  <button onClick={() => patch(idx, (q) => { q.colors.splice(ci, 1); return q; })}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11, flex: '0 0 auto' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => patch(idx, (q) => { q.colors = [...(q.colors || []), { ...EMPTY_COLOR }]; return q; })}
                style={{ margin: '6px 0 12px', padding: '5px 10px', borderRadius: 7, border: '1px dashed var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12 }}>
                + 색상 추가
              </button>

              {/* 스펙 + 프롬프트 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 110px) 1fr', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                {[['w', '가로(cm)'], ['h', '높이(cm)'], ['d', '깊이(cm)'], ['weight', '무게(kg)']].map(([k, label]) => (
                  <div key={k}>
                    <span style={lbl}>{label}</span>
                    <input value={p.spec?.[k] || ''} onChange={(e) => patch(idx, (q) => { q.spec = { ...(q.spec || {}), [k]: e.target.value }; return q; })} style={inp} />
                  </div>
                ))}
                <div>
                  <span style={lbl}>영상 노출 시 사용 컷</span>
                  <input value={(p.usedIn || []).join(', ')} placeholder="예: 가족 CF CUT6"
                    onChange={(e) => patch(idx, (q) => { q.usedIn = e.target.value.split(',').map((s) => s.trim()).filter(Boolean); return q; })} style={inp} />
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={lbl}>사이즈 비교 프롬프트 (생성 시 그대로 주입 — "인물 대비 비율" 언어로)</span>
                <textarea value={p.scalePrompt || ''} rows={2}
                  onChange={(e) => patch(idx, (q) => { q.scalePrompt = e.target.value; return q; })}
                  style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={lbl}>메모 (연출 노트·주의점)</span>
                <textarea value={p.notes || ''} rows={2}
                  onChange={(e) => patch(idx, (q) => { q.notes = e.target.value; return q; })}
                  style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
