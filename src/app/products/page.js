'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildProductPrompt } from '@/lib/productPrompt';

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

// 각도별 미리보기 — 스프라이트에서 추출·FTP 업로드된 생성용 참조 프레임 (2026-07-15)
// 기본 3뷰(정면·측면·후면) · 주력 제품(맥스 라인)은 45° 간격 8각도 확장
const VIEW_ORDER = [
  ['front', '정면 0°'], ['a045', '45°'], ['side', '측면 90°'], ['a135', '135°'],
  ['back', '후면 180°'], ['a225', '225°'], ['a270', '270°'], ['a315', '315°'],
];
// 생성용 영문 프롬프트 — 레지스트리 데이터에서 자동 조립 (기하·치수·네거티브·인체앵커 4종 세트 + 참조 URL)
function PromptBlock({ product, ci }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => buildProductPrompt(product, ci).text, [product, ci]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div style={{ marginTop: 8, borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setOpen(!open)}
          style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #FF7043', background: open ? '#FF7043' : 'none', color: open ? '#fff' : '#FF7043', cursor: 'pointer', fontSize: 11.5, fontWeight: 700 }}>
          {open ? '▾' : '▸'} 생성 프롬프트 (EN)
        </button>
        <button onClick={copy}
          style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: copied ? '#4CAF50' : 'none', color: copied ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontSize: 11.5, fontWeight: 700 }}>
          {copied ? '✓ 복사됨' : '📋 복사'}
        </button>
        <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>
          기하 서술 · 치수 · NOT 네거티브 · 인체 대비 앵커 · 참조 URL 자동 포함 — 그대로 붙여넣어 사용
        </span>
      </div>
      {open && (
        <pre style={{ marginTop: 6, padding: 10, borderRadius: 8, background: 'rgba(0,0,0,.22)', border: '1px solid var(--border)', fontSize: 10.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: 'var(--text-dim)', maxHeight: 320, overflow: 'auto' }}>{text}</pre>
      )}
    </div>
  );
}

// 사용 연출컷 — 자세·패브릭 눌림 물리의 참조 (2026-07-15 · 맥스 라인부터). 스틸 생성 시 "각도 프레임(형태) + 연출컷(자세)" 세트로 참조
const USAGE_LABEL = {
  sitting_recliner: '리클라이너 앉기', sitting_on_top: '눕힌 위 앉기', modes4: '4형태(의자·소파·리클·침대)',
  sleeping: '누워 잠듦', cover_gif: '커버 탄성(GIF)', howto: '활용법 시트',
};
function UsagePreview({ usage }) {
  if (!usage || !Object.keys(usage).length) return null;
  const img = { width: 92, height: 66, objectFit: 'cover', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', display: 'block' };
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 0 2px' }}>
      <span style={{ fontSize: 10.5, color: 'var(--text-dim)', alignSelf: 'center', fontWeight: 700 }}>연출컷</span>
      {Object.entries(usage).map(([k, url]) => (
        <a key={k} href={url} target="_blank" rel="noreferrer" style={{ width: 92, textAlign: 'center' }} title={`${USAGE_LABEL[k] || k} — 자세·눌림 참조`}>
          <img src={url} alt={USAGE_LABEL[k] || k} style={img} loading="lazy" />
          <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>{USAGE_LABEL[k] || k}</span>
        </a>
      ))}
    </div>
  );
}

function ViewsPreview({ views }) {
  if (!views || !views.front) return null;
  const keys = VIEW_ORDER.filter(([k]) => views[k]);
  const cell = { width: 74, textAlign: 'center', flex: '0 0 auto' };
  const img = { width: 74, height: 74, objectFit: 'contain', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', display: 'block' };
  return (
    <div style={{ display: 'flex', gap: 6, flex: '0 0 auto', flexWrap: 'wrap', maxWidth: 336 }}>
      {keys.map(([k, label]) => (
        <a key={k} href={views[k]} target="_blank" rel="noreferrer" style={cell} title={`${label} — 생성 참조용 (클릭: 원본)`}>
          <img src={views[k]} alt={label} style={img} loading="lazy" />
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{label}</span>
        </a>
      ))}
    </div>
  );
}

// 다른 사람이 이 스킬을 가져다 쓰는 방법 안내 (접이식)
function SkillGuide() {
  const [open, setOpen] = useState(false);
  const step = { display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, lineHeight: 1.6 };
  const num = { flex: '0 0 auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 };
  const code = { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, padding: '1px 6px', fontSize: 11.5, fontFamily: 'monospace' };
  return (
    <div className="note" style={{ marginBottom: 18, padding: 14 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
        <b style={{ fontSize: 13.5 }}>📖 스킬 사용 방법 — 다른 사람이 이 데이터를 가져다 쓸 때</b>
        <span className="card-meta" style={{ fontSize: 11 }}>Claude Code + 힉스필드 MCP 환경 기준</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{open ? '▲ 접기' : '▼ 펼치기'}</span>
      </div>
      {open && (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <div style={step}><span style={num}>1</span><span>
            <b>다운로드 & 설치</b> — 위의 "⬇ 스킬 다운로드" 버튼으로 SKILL.md를 받아, 자기 프로젝트의 <span style={code}>.claude/skills/yogibo-products/SKILL.md</span> 경로에 저장.
            저장만 하면 그 환경의 Claude가 요기보 제품 관련 요청 때 자동으로 참조함 (별도 설정 불필요). <span style={code}>products.json</span>은 같은 데이터의 원시 JSON — 스크립트에서 쓸 때만 필요.
          </span></div>
          <div style={step}><span style={num}>2</span><span>
            <b>이렇게 요청하면 됨</b> — 예: <i>"요기보 맥스 아쿠아블루가 등장하는 거실 라이프스타일 이미지 만들어줘"</i>, <i>"서포트에 앉아 아기 안고 있는 컷"</i>.
            제품명+컬러칩 이름으로 부르면 Claude가 스킬에서 Element ID·형태 연출·사이즈 비율·HEX를 자동으로 찾아 프롬프트를 조립함.
          </span></div>
          <div style={step}><span style={num}>3</span><span>
            <b>⚠️ Element는 힉스필드 워크스페이스 종속</b> — 내 워크스페이스에서 락한 Element ID는 다른 계정/워크스페이스에 없을 수 있음.
            Claude가 세션 시작 시 <span style={code}>show_reference_elements</span>로 확인하고, 없으면 스킬에 적힌 절차대로 <b>360 URL에서 재락(무료)</b> 후 진행함 — 사용자는 신경 쓸 것 없음.
          </span></div>
          <div style={step}><span style={num}>4</span><span>
            <b>비용 원칙</b> — 이미지/영상 생성만 크레딧 소모(업로드·Element·조회는 무료). 스틸을 먼저 확인·승인한 뒤 영상화하는 것이 기본 순서.
          </span></div>
          <div style={step}><span style={num}>5</span><span>
            <b>데이터가 바뀌면</b> — 이 페이지가 원본. 제품·컬러칩 수정 후 SKILL.md를 다시 다운로드해서 교체하면 끝. 새 환경에서 재락한 Element ID는 이 페이지에 돌아와 기록해주는 것을 권장.
          </span></div>
        </div>
      )}
    </div>
  );
}

// 전역 컬러칩 팔레트 — 요기보 공식 컬러 고정값. 제품 색상행은 여기서 칩을 선택한다.
function ChipPalette({ chips, setChips, onSave, saving }) {
  const [edit, setEdit] = useState(false);
  const inp = { padding: '4px 6px', fontSize: 12, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' };
  const patch = (i, k, v) => setChips(chips.map((c, j) => (j === i ? { ...c, [k]: v } : c)));
  return (
    <div className="note" style={{ marginBottom: 18, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <b style={{ fontSize: 13.5 }}>🎨 컬러칩 팔레트</b>
        <span className="card-meta" style={{ fontSize: 11 }}>요기보 공식 고정값 · {chips.length}색 — 제품 색상은 여기서 선택</span>
        <div style={{ flex: 1 }} />
        {edit ? (
          <>
            <button onClick={() => setChips([...chips, { id: '', name: '', hex: '#', note: '' }])}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px dashed var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11.5 }}>+ 칩 추가</button>
            <button onClick={async () => { await onSave(chips); setEdit(false); }} disabled={saving}
              style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 11.5 }}>
              {saving ? '저장 중…' : '💾 저장'}
            </button>
          </>
        ) : (
          <button onClick={() => setEdit(true)}
            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11.5 }}>편집</button>
        )}
      </div>
      {!edit ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c) => (
            <div key={c.id || c.name} title={`${c.name} ${c.hex}${c.note ? ' · ' + c.note : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 9px 4px 5px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.hex || 'transparent', border: '1px solid rgba(128,128,128,.35)', flex: '0 0 auto' }} />
              <span style={{ fontSize: 11.5 }}>{c.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{c.hex}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 6 }}>
          {chips.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: c.hex || 'transparent', border: '1px solid var(--border)', flex: '0 0 auto' }} />
              <input value={c.name} placeholder="색상명" onChange={(e) => patch(i, 'name', e.target.value)} style={{ ...inp, width: 90 }} />
              <input value={c.hex} placeholder="#HEX" onChange={(e) => patch(i, 'hex', e.target.value)} style={{ ...inp, width: 72 }} />
              <input value={c.note || ''} placeholder="메모" onChange={(e) => patch(i, 'note', e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => setChips(chips.filter((_, j) => j !== i))}
                style={{ padding: '2px 7px', borderRadius: 5, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [chips, setChips] = useState([]);
  const [chipsSaving, setChipsSaving] = useState(false);
  const [saving, setSaving] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { load(); loadChips(); }, []);
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
  async function loadChips() {
    try {
      const r = await fetch('/api/colorchips');
      const j = await r.json().catch(() => ({}));
      setChips(j.chips || []);
    } catch { setChips([]); }
  }
  async function saveChipsAll(next) {
    setChipsSaving(true);
    const r = await fetch('/api/colorchips', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chips: next }),
    });
    setChipsSaving(false);
    if (r.ok) { const j = await r.json(); setChips(j.chips); flash('팔레트 저장 완료'); }
    else flash('팔레트 저장 실패');
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

  // 웹뷰 환경에서 window.prompt/confirm 미지원 → 인라인 UI로 처리
  const [newName, setNewName] = useState(null); // null=닫힘, 문자열=입력 중
  const [pendingDelete, setPendingDelete] = useState('');

  async function addProduct() {
    const name = (newName || '').trim();
    if (!name) { flash('제품명을 입력해주세요'); return; }
    const r = await fetch('/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, colors: [{ ...EMPTY_COLOR }] }),
    });
    if (r.ok) { setNewName(null); await load(); flash(`${name} 추가됨`); }
    else flash('추가 실패');
  }

  async function removeProduct(p) {
    if (pendingDelete !== p.id) {
      setPendingDelete(p.id);
      setTimeout(() => setPendingDelete(''), 3500);
      return;
    }
    setPendingDelete('');
    await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
    await load();
    flash(`${p.name} 삭제됨`);
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
        사용 절차: ① 색상은 아래 <b>컬러칩 팔레트</b>에서 선택(이름·HEX 자동) → ② 색상별 <b>360 스프라이트 URL</b> 입력 → ③ 제작 세션에서 각도 추출·Element 락 → ④ <b>Element ID 자동 기록</b> → ⑤ 스펙·비교 문구는 프롬프트에 주입.
        <br />크레딧: 업로드·Element 생성은 <b>무료</b> — 등록만 해두면 어떤 프로젝트에서든 재사용.
      </div>

      <ChipPalette chips={chips} setChips={setChips} onSave={saveChipsAll} saving={chipsSaving} />

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        {newName === null ? (
          <button onClick={() => setNewName('')} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            + 제품 추가
          </button>
        ) : (
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <input autoFocus value={newName} placeholder="제품명 (예: Yogibo Pod)"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addProduct(); if (e.key === 'Escape') setNewName(null); }}
              style={{ ...inp, width: 220, padding: '8px 10px', fontSize: 13 }} />
            <button onClick={addProduct} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>추가</button>
            <button onClick={() => setNewName(null)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>취소</button>
          </span>
        )}
        <a href="/api/products/export?format=skill" download
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #4CAF50', background: 'none', color: '#4CAF50', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ⬇ 스킬 다운로드 (SKILL.md)
        </a>
        <a href="/api/products/export?format=json" download
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--text-dim)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ⬇ products.json
        </a>
        <a href="/api/skills/export" download
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #AB47BC', background: 'none', color: '#AB47BC', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ⬇ 제작 스킬 (cf-video-production)
        </a>
        <span className="card-meta" style={{ fontSize: 11.5 }}>
          스킬 설치: 제품 SKILL.md → <b>.claude/skills/yogibo-products/</b> · 제작 SKILL.md → <b>.claude/skills/cf-video-production/</b>에 저장 → 제품 데이터와 검증된 제작 워크플로우(게이트·엔진 선택·원테이크)를 자동 참조
        </span>
      </div>

      <SkillGuide />

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
                  style={{ padding: '6px 10px', borderRadius: 7, border: pendingDelete === p.id ? '1px solid #E53935' : '1px solid var(--border)', background: pendingDelete === p.id ? '#E53935' : 'none', color: pendingDelete === p.id ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontSize: 12, fontWeight: pendingDelete === p.id ? 700 : 400 }}>
                  {pendingDelete === p.id ? '정말 삭제? (한 번 더)' : '삭제'}
                </button>
              </div>

              {/* 사용 연출컷 (자세·눌림 참조) */}
              <UsagePreview usage={p.usage} />

              {/* 색상별 360 + Element */}
              {(p.colors || []).map((c, ci) => (
                <div key={ci} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <Sprite360Preview url={c.sprite360} />
                  <ViewsPreview views={c.views} />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '190px 120px 1fr', gap: 8 }}>
                    <div>
                      <span style={lbl}>색상 (컬러칩 선택)</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ width: 18, height: 18, borderRadius: 5, background: c.hex || 'transparent', border: '1px solid var(--border)', flex: '0 0 auto' }} />
                        <select
                          value={(chips.find((ch) => ch.name === (c.color || '').trim()) || {}).id || '__custom'}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === '__custom') { patch(idx, (q) => { q.colors[ci].color = ''; q.colors[ci].hex = ''; return q; }); return; }
                            const ch = chips.find((x) => x.id === v);
                            if (ch) patch(idx, (q) => { q.colors[ci].color = ch.name; q.colors[ci].hex = ch.hex; return q; });
                          }}
                          style={{ ...inp, flex: 1 }}>
                          {chips.map((ch) => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                          <option value="__custom">직접 입력…</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      {chips.some((ch) => ch.name === (c.color || '').trim()) ? (
                        <>
                          <span style={lbl}>HEX (칩 고정값)</span>
                          <div style={{ ...inp, background: 'var(--bg-elev)', color: 'var(--text-dim)' }}>{c.hex || '-'}</div>
                        </>
                      ) : (
                        <>
                          <span style={lbl}>직접 입력 (명 / HEX)</span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <input value={c.color} placeholder="색상명" onChange={(e) => patch(idx, (q) => { q.colors[ci].color = e.target.value; return q; })} style={{ ...inp, width: '55%' }} />
                            <input value={c.hex || ''} placeholder="#HEX" onChange={(e) => patch(idx, (q) => { q.colors[ci].hex = e.target.value; return q; })} style={{ ...inp, width: '45%' }} />
                          </div>
                        </>
                      )}
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
                    <div style={{ gridColumn: '1 / -1' }}>
                      <PromptBlock product={p} ci={ci} />
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
