'use client';

import { useEffect, useMemo, useState } from 'react';

// 게이트형 파이프라인 (cf-video-production 스킬 로직의 UI 버전) — MVP / mock
const STAGES = [
  { key: 'def', label: '0 · 정의' },
  { key: 'asset', label: '1 · 에셋·캐릭터 락' },
  { key: 'board', label: '2 · 스토리보드' },
  { key: 'still', label: '3 · 스틸' },
  { key: 'video', label: '4 · 영상화' },
  { key: 'edit', label: '5 · 조립' },
  { key: 'post', label: '6 · 후처리' },
  { key: 'deploy', label: '7 · 배포' },
];

const uid = () => Math.random().toString(36).slice(2, 8);
const RECENTS_KEY = 'cf_product_recents';

export default function CreatePage() {
  const [stage, setStage] = useState(0);
  const [maxReached, setMaxReached] = useState(0); // 컴펌으로 도달한 최고 단계
  const [warn, setWarn] = useState('');

  // STAGE 0
  const [spec, setSpec] = useState({ goal: '', product: '', ratio: '9:16', durationSec: 9, referenceUrl: '' });
  // STAGE 1
  const [assets, setAssets] = useState([]); // {id,url,kind}
  const [assetUrl, setAssetUrl] = useState('');
  const [heroId, setHeroId] = useState(null);
  const [productUrl, setProductUrl] = useState('');    // 확정된 제품 URL (생성 입력)
  const [productInput, setProductInput] = useState(''); // 입력창
  const [recents, setRecents] = useState([]);          // 최근 사용 제품 URL (localStorage)
  const [element, setElement] = useState(null); // {id,name}
  // STAGE 2
  const [cuts, setCuts] = useState([]); // {id,title,camera,copy,stillGen,stillOk,videoGen,videoOk}
  // STAGE 6
  const [post, setPost] = useState({ color: false, subtitle: false, music: false });
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── 게이트 조건: 이 단계를 컴펌할 수 있는가?
  const gateOk = useMemo(() => {
    switch (stage) {
      case 0: return spec.goal.trim() && spec.product.trim();
      case 1: return !!element && !!productUrl;                   // 캐릭터 Element 락 + 제품 URL 확정
      case 2: return cuts.length >= 1 && cuts.every((c) => c.title.trim());
      case 3: return cuts.length >= 1 && cuts.every((c) => c.stillOk); // 모든 컷 스틸 승인
      case 4: return cuts.length >= 1 && cuts.every((c) => c.videoOk); // 모든 컷 영상 승인
      case 5: return true;
      case 6: return true;
      case 7: return deployed;
      default: return false;
    }
  }, [stage, spec, element, productUrl, cuts, deployed]);

  // 최근 제품 URL 로드
  useEffect(() => {
    try { const r = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); if (Array.isArray(r)) setRecents(r); } catch {}
  }, []);
  function setProduct(url) {
    const u = (url || '').trim();
    if (!u) return;
    setProductUrl(u);
    setRecents((rs) => {
      const next = [u, ...rs.filter((x) => x !== u)].slice(0, 8);
      try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  // 로컬 업로드 = 미리보기용 blob URL (공개 URL 아님 → 실제 생성엔 URL 붙여넣기 권장)
  function uploadProduct(file) { if (file) setProductUrl(URL.createObjectURL(file)); }

  // 웹(스펙) → 터미널(Claude+스킬) 연결: 스펙 요약 복사
  function buildSpec() {
    const heroUrl = assets.find((a) => a.id === heroId)?.url || '';
    const lines = [
      '# CF 제작 스펙 (cf-video-production)',
      `- 목표/컨셉: ${spec.goal || '-'}`,
      `- 제품: ${spec.product || '-'}  / 이미지 URL: ${productUrl || '-'}`,
      `- 비율: ${spec.ratio} · 길이: ${spec.durationSec}초`,
      `- 레퍼런스: ${spec.referenceUrl || '-'}`,
      `- 캐릭터: ${element ? `Element 락(${element.name})` : '미락'}${heroUrl ? ` · 원본 이미지: ${heroUrl}` : ''}`,
      `- 컷 (${cuts.length}):`,
      ...cuts.map((c, i) => `  ${i + 1}. ${c.title || '(제목없음)'} · 카메라 ${c.camera || '-'} · 대사 "${c.copy || ''}"`),
      '',
      '지시: 이 스펙으로 cf-video-production 게이트 방식(에셋 락 → 스토리보드 → 스틸→승인 → 영상→승인 → 조립)으로 제작해줘.',
    ];
    return lines.join('\n');
  }
  function copySpec() {
    const text = buildSpec();
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  function confirmStage() {
    if (!gateOk) return;
    const next = Math.min(stage + 1, STAGES.length - 1);
    setStage(next);
    setMaxReached((m) => Math.max(m, next));
    setWarn('');
  }
  function goStage(i) {
    if (i > maxReached) return; // 미래 단계 잠금
    if (i < stage) setWarn('이전 단계로 돌아갔습니다 — 여기서 내용을 바꾸면 하위 단계 산출물은 다시 확인해야 합니다.');
    setStage(i);
  }

  // STAGE1 helpers
  function addAsset() {
    const url = assetUrl.trim();
    if (!url) return;
    setAssets((a) => [...a, { id: uid(), url, kind: 'character' }]);
    setAssetUrl('');
  }
  function uploadAsset(file) {
    if (!file) return;
    setAssets((a) => [...a, { id: uid(), url: URL.createObjectURL(file), kind: 'character', name: file.name }]);
  }
  function lockElement() {
    if (!heroId) return;
    setElement({ id: uid(), name: 'element-' + heroId.slice(0, 4) });
  }
  // STAGE2 helpers
  function addCut() {
    setCuts((cs) => [...cs, { id: uid(), title: '', camera: '', copy: '', stillGen: false, stillOk: false, videoGen: false, videoOk: false }]);
  }
  function setCut(id, patch) { setCuts((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c))); }
  function delCut(id) { setCuts((cs) => cs.filter((c) => c.id !== id)); }

  const btn = { padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 13 };
  const btnP = { ...btn, background: 'var(--accent)', borderColor: 'var(--accent)', color: '#08160c', fontWeight: 700 };
  const input = { padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elev)', color: 'var(--text)', width: '100%', fontSize: 13 };
  const thumb = { width: 78, aspectRatio: '9/16', borderRadius: 8, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 11, color: 'var(--muted,#889)', flexShrink: 0, overflow: 'hidden', objectFit: 'cover' };

  function Badge({ ok, gen, label }) {
    const bg = ok ? 'rgba(120,210,150,.18)' : gen ? 'rgba(210,180,80,.18)' : 'rgba(140,140,160,.15)';
    const col = ok ? 'var(--accent)' : gen ? '#d2b450' : '#8890a0';
    return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: bg, color: col }}>{label}</span>;
  }

  return (
    <>
      <a href="/" className="back-link">← 프로젝트</a>
      <div className="page-head">
        <div>
          <h1 className="page-title">CF 제작 플로우 (게이트형)</h1>
          <p className="page-desc">
            <strong>정의 → 에셋 락 → 스토리보드 → 스틸 → 영상 → 조립 → 후처리 → 배포</strong>. 각 단계는 <b>컴펌해야</b> 다음이 열립니다.
            <span style={{ opacity: 0.6 }}> (MVP · 생성은 mock — 플로우 검토용)</span>
          </p>
        </div>
      </div>

      {/* 스텝퍼 */}
      <div className="flow" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
        {STAGES.map((s, i) => {
          const done = i < maxReached, active = i === stage, locked = i > maxReached;
          return (
            <span key={s.key} style={{ display: 'contents' }}>
              <button
                onClick={() => goStage(i)}
                disabled={locked}
                className="flow-step"
                style={{
                  cursor: locked ? 'not-allowed' : 'pointer',
                  color: locked ? 'var(--text-dim)' : 'var(--text)',
                  borderColor: active ? 'var(--accent)' : done ? 'rgba(120,210,150,.5)' : 'var(--border)',
                  opacity: locked ? 0.6 : 1,
                  fontWeight: active ? 700 : 400,
                }}
              >
                {done ? '✅ ' : locked ? '🔒 ' : '▶ '}{s.label}
              </button>
              {i < STAGES.length - 1 && <span className="flow-arrow">→</span>}
            </span>
          );
        })}
      </div>
      {warn && <div className="note" style={{ marginBottom: 14, borderColor: '#d2b450' }}>⚠️ {warn}</div>}

      {/* 웹(스펙) → 터미널(Claude+스킬) 연결 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button style={{ ...btn, borderColor: 'var(--accent)' }} onClick={copySpec}>
          📋 {copied ? '복사됨! (Claude에 붙여넣기)' : 'Claude에게 넘기기 (스펙 복사)'}
        </button>
      </div>

      {/* 단계 패널 */}
      <div className="section" style={{ marginBottom: 16 }}>
        {stage === 0 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 12 }}>STAGE 0 · 프로젝트 정의</h2>
            <div style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
              <label className="card-meta">목표/컨셉 <input style={input} value={spec.goal} onChange={(e) => setSpec({ ...spec, goal: e.target.value })} placeholder="예: 여름에 신나게 놀고 요기보에서 쉬기" /></label>
              <label className="card-meta">제품명 <input style={input} value={spec.product} onChange={(e) => setSpec({ ...spec, product: e.target.value })} placeholder="예: Yogibo Max (오렌지)" /></label>
              <div className="card-meta">제품 이미지 <span style={{ opacity: 0.6 }}>(URL 권장 · 업로드는 미리보기)</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                  {productUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={productUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                  <input style={{ ...input, flex: 1, minWidth: 180 }} value={productInput} onChange={(e) => setProductInput(e.target.value)} placeholder="이미지 URL 붙여넣기 (공개 URL)" onKeyDown={(e) => { if (e.key === 'Enter') { setProduct(productInput); setProductInput(''); } }} />
                  <button style={btn} onClick={() => { setProduct(productInput); setProductInput(''); }}>URL 설정</button>
                  <label style={{ ...btn, display: 'inline-flex', alignItems: 'center' }}>업로드<input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadProduct(e.target.files?.[0])} /></label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <label className="card-meta" style={{ flex: 1 }}>비율 <input style={input} value={spec.ratio} onChange={(e) => setSpec({ ...spec, ratio: e.target.value })} /></label>
                <label className="card-meta" style={{ flex: 1 }}>길이(초) <input style={input} type="number" value={spec.durationSec} onChange={(e) => setSpec({ ...spec, durationSec: +e.target.value })} /></label>
              </div>
              <label className="card-meta">레퍼런스 URL(선택) <input style={input} value={spec.referenceUrl} onChange={(e) => setSpec({ ...spec, referenceUrl: e.target.value })} placeholder="video.mp4 등" /></label>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 1 · 캐릭터 락 + 제품 선택 ★</h2>
            <p className="card-meta" style={{ marginBottom: 14 }}>캐릭터는 <b>업로드 → Element 락</b>, 제품은 <b>카탈로그에서 선택 → URL 자동 매핑</b>. (둘 다 확정해야 다음 단계)</p>

            {/* 캐릭터 */}
            <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>🧑 캐릭터 (Element 락)</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <input style={{ ...input, flex: 1, minWidth: 200 }} value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} placeholder="캐릭터 이미지 URL 붙여넣기" />
              <button style={btn} onClick={addAsset}>+ URL 추가</button>
              <label style={{ ...btn, display: 'inline-flex', alignItems: 'center' }}>파일 업로드
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadAsset(e.target.files?.[0])} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              {assets.length === 0 && <span className="card-meta">캐릭터 후보를 추가하세요.</span>}
              {assets.map((a) => (
                <div key={a.id} style={{ width: 96, textAlign: 'center' }}>
                  <div onClick={() => setHeroId(a.id)}
                    style={{ ...thumb, width: 96, cursor: 'pointer', borderColor: heroId === a.id ? 'var(--accent)' : 'var(--border)', borderWidth: heroId === a.id ? 2 : 1 }}>
                    {a.url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={a.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '캐릭터'}
                  </div>
                  <div className="card-meta" style={{ fontSize: 11, marginTop: 4 }}>{heroId === a.id ? '· 주인공' : '후보'}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <button style={btnP} disabled={!heroId || !!element} onClick={lockElement}>🔒 Element로 락</button>
              {element && <span className="card-meta">✅ 락 완료 — <code>{element.name}</code></span>}
            </div>

            {/* 제품 — URL 붙여넣기 + 최근 목록 */}
            <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>📦 제품 (URL 붙여넣기)</h3>
            <p className="card-meta" style={{ marginBottom: 8, fontSize: 12 }}>필요한 제품 이미지/360 URL을 그때그때 붙여넣으면 됩니다. 한 번 쓴 URL은 아래 <b>최근 사용</b>에서 원클릭 재사용.</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <input style={{ ...input, flex: 1, minWidth: 220 }} value={productInput} onChange={(e) => setProductInput(e.target.value)}
                placeholder="제품 이미지/360 URL (예: cafe24 링크)" onKeyDown={(e) => { if (e.key === 'Enter') { setProduct(productInput); setProductInput(''); } }} />
              <button style={btn} onClick={() => { setProduct(productInput); setProductInput(''); }}>제품으로 설정</button>
            </div>
            {recents.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div className="card-meta" style={{ fontSize: 11, marginBottom: 4 }}>최근 사용</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {recents.map((u) => (
                    <div key={u} onClick={() => setProductUrl(u)} title={u}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: '1px solid', borderRadius: 8, padding: '4px 8px', borderColor: productUrl === u ? 'var(--accent)' : 'var(--border)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 4 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <span className="card-meta" style={{ fontSize: 11 }}>{(u.split('/').pop() || u).slice(0, 20)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 기록된 참조 */}
            <div className="note" style={{ fontSize: 12 }}>
              <b>기록된 생성 입력</b>
              <br />🧑 캐릭터: {element ? <code>Element {element.name}</code> : <span style={{ opacity: 0.6 }}>락 필요</span>}
              <br />📦 제품 URL: {productUrl
                ? <code style={{ wordBreak: 'break-all' }}>{productUrl}</code>
                : <span style={{ opacity: 0.6 }}>URL을 설정하면 여기에 기록됩니다 (생성 시 그대로 참조)</span>}
            </div>
          </div>
        )}

        {stage === 2 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 2 · 스토리보드</h2>
            <p className="card-meta" style={{ marginBottom: 12 }}>컷을 추가하고 제목·카메라·대사를 적습니다 (컷당 ~3초). 확정 후 컨셉 변경은 하위 단계 재작업.</p>
            <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
              {cuts.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, padding: 10, flexWrap: 'wrap' }}>
                  <b style={{ color: 'var(--accent)', width: 44 }}>CUT{i + 1}</b>
                  <input style={{ ...input, flex: 2, minWidth: 140 }} value={c.title} onChange={(e) => setCut(c.id, { title: e.target.value })} placeholder="제목/액션 (예: 모래 위 달리기)" />
                  <input style={{ ...input, flex: 1, minWidth: 110 }} value={c.camera} onChange={(e) => setCut(c.id, { camera: e.target.value })} placeholder="카메라" />
                  <input style={{ ...input, flex: 1, minWidth: 100 }} value={c.copy} onChange={(e) => setCut(c.id, { copy: e.target.value })} placeholder="대사" />
                  <button style={{ ...btn, borderColor: '#a44' }} onClick={() => delCut(c.id)}>삭제</button>
                </div>
              ))}
            </div>
            <button style={btn} onClick={addCut}>+ 컷 추가</button>
          </div>
        )}

        {(stage === 3 || stage === 4) && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE {stage} · {stage === 3 ? '컷별 스틸' : '컷별 영상화'} · 컷 보드</h2>
            <p className="card-meta" style={{ marginBottom: 12 }}>
              {stage === 3
                ? 'Element 토큰으로 컷별 스틸을 생성하고 컷마다 승인합니다. 모두 승인해야 영상 단계로.'
                : '승인된 스틸만 영상화하고 컷마다 승인합니다. 모두 승인해야 조립 단계로.'}
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {cuts.map((c, i) => {
                const gen = stage === 3 ? c.stillGen : c.videoGen;
                const ok = stage === 3 ? c.stillOk : c.videoOk;
                const canVideo = stage === 4 ? c.stillOk : true;
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, padding: 10, flexWrap: 'wrap' }}>
                    <b style={{ color: 'var(--accent)', width: 44 }}>CUT{i + 1}</b>
                    <div style={{ ...thumb, background: gen ? 'rgba(120,210,150,.08)' : 'transparent' }}>{gen ? (stage === 3 ? '스틸✓' : '▶영상') : (stage === 3 ? '스틸' : '영상')}</div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontWeight: 600 }}>{c.title || '(제목 없음)'}</div>
                      <div className="card-meta" style={{ fontSize: 12 }}>🎥 {c.camera || '—'} · 💬 {c.copy || '—'}</div>
                    </div>
                    <Badge ok={ok} gen={gen} label={ok ? '승인' : gen ? (stage === 3 ? '스틸됨' : '영상됨') : '대기'} />
                    {!gen && (
                      <button style={btn} disabled={!canVideo} title={!canVideo ? '스틸 승인 필요' : ''}
                        onClick={() => setCut(c.id, stage === 3 ? { stillGen: true } : { videoGen: true })}>
                        {stage === 3 ? '스틸 생성 (mock)' : '영상화 (mock)'}
                      </button>
                    )}
                    {gen && !ok && (
                      <>
                        <button style={btn} onClick={() => setCut(c.id, stage === 3 ? { stillGen: false } : { videoGen: false })}>재생성</button>
                        <button style={btnP} onClick={() => setCut(c.id, stage === 3 ? { stillOk: true } : { videoOk: true })}>✅ 승인</button>
                      </>
                    )}
                  </div>
                );
              })}
              {cuts.length === 0 && <span className="card-meta">STAGE 2에서 컷을 먼저 추가하세요.</span>}
            </div>
          </div>
        )}

        {stage === 5 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 5 · 조립 · 러프컷</h2>
            <p className="card-meta" style={{ marginBottom: 12 }}>승인된 클립을 트림·전환(크로스페이드/푸시인) + 로고 인트로/엔딩으로 이어붙입니다.</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ ...thumb, width: 150, fontSize: 13 }}>▶ 러프컷<br />(mock 프리뷰)</div>
              <div className="card-meta">CUT {cuts.length}개 · 크로스페이드 연결 · 예상 {spec.durationSec}초. <br />실제 조립은 ffmpeg 편집으로 처리(연동 단계).</div>
            </div>
          </div>
        )}

        {stage === 6 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 6 · 후처리 (선택)</h2>
            <p className="card-meta" style={{ marginBottom: 12 }}>필요한 것만 켜세요. 음악은 보통 최종 컴펌 후 마지막에.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[['color', '컬러 통일'], ['subtitle', '자막'], ['music', '음악']].map(([k, l]) => (
                <label key={k} className="card-meta" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="checkbox" checked={post[k]} onChange={(e) => setPost({ ...post, [k]: e.target.checked })} /> {l}
                </label>
              ))}
            </div>
          </div>
        )}

        {stage === 7 && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>STAGE 7 · 배포</h2>
            <p className="card-meta" style={{ marginBottom: 12 }}>캐시버스트 + gitignore 예외로 영상이 빠지지 않게 배포합니다.</p>
            {!deployed
              ? <button style={btnP} onClick={() => setDeployed(true)}>🚀 배포 (mock)</button>
              : <div className="note" style={{ borderColor: 'var(--accent)' }}>✅ 배포 완료 — 최종 영상 흐름이 이렇게 마무리됩니다. (실제 연동은 B단계에서)</div>}
          </div>
        )}
      </div>

      {/* 컴펌 게이트 */}
      <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button style={btn} disabled={stage === 0} onClick={() => goStage(stage - 1)}>◀ 이전</button>
        <div className="card-meta" style={{ fontSize: 12 }}>
          {gateOk ? '이 단계 조건 충족 — 컴펌하면 다음이 열립니다.' : '게이트 조건 미충족 (필수 항목을 채우세요).'}
        </div>
        {stage < STAGES.length - 1
          ? <button style={{ ...btnP, opacity: gateOk ? 1 : 0.4, cursor: gateOk ? 'pointer' : 'not-allowed' }} disabled={!gateOk} onClick={confirmStage}>✅ 이 단계 컴펌 →</button>
          : <button style={{ ...btnP, opacity: deployed ? 1 : 0.4 }} disabled={!deployed}>🎬 최종 완료</button>}
      </div>

      <div className="note" style={{ marginTop: 16, opacity: 0.85 }}>
        🧩 이 화면은 <code>cf-video-production</code> 스킬의 <b>게이트형 파이프라인</b>을 그대로 UI로 옮긴 MVP입니다. 흐름·게이트가 맞으면 다음(B)에서 실제 생성(Element·kling)·저장을 연동합니다.
      </div>
    </>
  );
}
