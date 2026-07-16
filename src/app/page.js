'use client';

import { useEffect, useState } from 'react';
import NewProjectModal from '@/components/NewProjectModal';

// 보관 프로젝트(7차 파티 리빌·8차 스위트 호텔) 홈 카드 노출 여부 — 페이지 자체는 유지
const SHOW_ARCHIVED = false;

const STATUS_LABEL = {
  draft: '작성 중',
  generating: '생성 중',
  review: '검수 중',
  done: '완료',
};

// 엔진별 컬러 태그 — 작업물이 어느 영상 엔진으로 제작됐는지 홈에서 바로 구분
const ENGINE_TAG = {
  kling: { label: '⚙ Kling 3.0', bg: '#3F51B5' },          // 인디고 — 컷 단위 · 얼굴 픽셀 락 · 시리즈물
  seedance: { label: '🎥 Seedance 2.0', bg: '#FF7043' },    // 오렌지 — 원테이크 · 카메라 안무 · 네이티브 오디오
  both: { label: '🆚 Kling vs Seedance', bg: '#26A69A' },   // 두 엔진 비교 프로젝트
};

function EngineChip({ e }) {
  const t = ENGINE_TAG[e];
  if (!t) return null;
  return (
    <span style={{ background: t.bg, color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
      {t.label}
    </span>
  );
}

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
        <a className="btn btn-primary" href="/create">
          + 새 프로젝트
        </a>
      </div>

      {/* 엔진 태그 범례 */}
      <div className="note" style={{ padding: '8px 12px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12 }}>
        <b style={{ fontSize: 12 }}>엔진 구분</b>
        <EngineChip e="kling" /><span style={{ color: 'var(--text-dim)' }}>컷 단위 · 얼굴 픽셀 락 · 시리즈물</span>
        <EngineChip e="seedance" /><span style={{ color: 'var(--text-dim)' }}>원테이크 · 카메라 안무 · 네이티브 오디오</span>
        <EngineChip e="both" /><span style={{ color: 'var(--text-dim)' }}>동일 원작 비교</span>
      </div>

      {/* 고정 — 제품 데이터 레지스트리 */}
      <a
        href="/products"
        className="card"
        style={{ display: 'block', borderColor: '#4CAF50', marginBottom: 20 }}
      >
        <div className="card-title">📦 제품 데이터 레지스트리</div>
        <div className="card-meta">
          영상 제작용 제품 단일 소스 — 색상별 <strong>360 스프라이트 URL · Element ID · 스펙(사이즈) · 비교 프롬프트</strong>를 여기서 채워나갑니다.
          <br />
          등록된 제품은 어떤 CF 프로젝트에서든 Element 락·사이즈 정확도에 자동 활용.
        </div>
        <div className="card-foot">
          <span className="badge badge-review">4종 시드 · 채워나가는 중</span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 완성 스토리보드 프로젝트 */}
      <a
        href="/storyboard"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🎬 요기보 20초 단편 CF</div>
        <div className="card-meta">
          지친 직장인 → 요기보 휴식 · 10컷 컷분할 스토리보드 · 9:16 · 모델 A · 아보카도 그린 Pod
          <br />
          클릭하면 <strong>이렇게 짜여진 스토리보드</strong>를 볼 수 있어요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-review">스토리보드 완료</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 2차 테스트 프로젝트 (티렉스 캐릭터) — 숨김 처리 (페이지는 유지, 홈 카드만 비노출) */}
      {false && (
        <a
          href="/storyboard2"
          className="card"
          style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
        >
          <div className="card-title">🦖 티렉스 × 요기보 — 9초 캐릭터 단편 CF</div>
          <div className="card-meta">
            2차 테스트 · 티렉스 캐릭터 · 9:16 · 3컷 ~9초 · 제품 Yogibo Max(오렌지) · cf-video-production 방식
            <br />
            여름 물놀이(에너지) → Yogibo Max 안착 → 로고. 진행상황을 확인하세요.
          </div>
          <div className="card-foot">
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">스토리보드 기획 · 캐릭터 이미지 대기</span></span>
            <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
          </div>
        </a>
      )}

      {/* 고정 — 3차 프로젝트 (10주년) */}
      <a
        href="/storyboard3"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🎉 요기보 10주년 — 12초 CF (시네마틱)</div>
        <div className="card-meta">
          3차 테스트 · 제품 중심 · 9:16 · ~14초 · 9컷 · 10.mp4 리얼 다큐 기법 모방 · cf-video-production 게이트
          <br />
          CUT1–5 영상 완료(레드카펫 2비트 + 컬러 퍼레이드) · 러프컷 15초 연결 확인 단계. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 4 · CUT1–5 영상</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 4차 프로젝트 (가족편) */}
      <a
        href="/storyboard4"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">👨‍👩‍👧 가족 요기보 Max — 15초 라이프스타일 CF</div>
        <div className="card-meta">
          4차 · newvideo.mp4(가족편) 기반 · 9:16 · 15초 · 가족 3인(부인·남편·여아) · 제품 Yogibo Max 아쿠아블루 · 웜 필믹 톤
          <br />
          레퍼런스 분석 완료 · STAGE 1 캐스트 락(부인 후보 선택) 단계. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 1 · 등장인물</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 6차 프로젝트 (맥스 컬러 스와이프) */}
      <a
        href="/storyboard6"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🎨 맥스 컬러 스와이프 — 15초 CF "너의 컬러를 골라봐"</div>
        <div className="card-meta">
          6차 · IG 릴스 · 9:16 · 15초 · 같은 구도에서 맥스 18색 비트 교체 · 캐스트 = 가족 CF 부인 재사용 · 컬러칩 레지스트리 실전 투입
          <br />
          기획·스토리보드 확정 · 베이스 스틸(2cr) 생성 컨펌 대기. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 3 · 베이스 스틸 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 7차 프로젝트 (파티 리빌 & 불꽃놀이) */}
      {SHOW_ARCHIVED && (
      <a
        href="/storyboard7"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🎆 파티 리빌 & 리버 불꽃놀이 — 브랜드 무드필름</div>
        <div className="card-meta">
          7차 · 9:16 · 10초 · 인물 없음 · 10주년 파티 — 블루 커튼 리빌→파스텔 파티(메이트)→벽면 로고→10주년 케이크→강 불꽃놀이→yogibo 로고 불꽃 · 6섹션
          <br />
          카메라 동선(마케터 영상)+키비주얼 2종(커튼·케이크) 확보 · STAGE 0 확정. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="seedance" /><span className="badge badge-generating">STAGE 0 · 스펙 컨펌 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>
      )}

      {/* 고정 — 13차 프로젝트 (클레이 미니어처 팝업스토어) */}
      <a
        href="/storyboard13"
        className="card"
        style={{ display: 'block', borderColor: '#FF7043', marginBottom: 20 }}
      >
        <div className="card-title">🏖 클레이 미니어처 — 바다 팝업스토어 메이킹</div>
        <div className="card-meta">
          13차 · 9:16 · 4~5초 · 첫/끝 프레임 방식 · 미니어처 인부들이 요기보 제품을 배치해 바다 컨셉 팝업스토어를 완성하는 과정 · 완성 키비주얼 = 끝 프레임
          <br />
          컨셉 정의 완료 · 구조 시안 A/B/C 컨펌 대기. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 0 · 구조 컨펌 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 12차 프로젝트 (엔진 비교) */}
      <a
        href="/storyboard12"
        className="card"
        style={{ display: 'block', borderColor: '#26A69A', marginBottom: 20 }}
      >
        <div className="card-title">🆚 요기보 단편 CF — Kling vs Seedance 엔진 비교</div>
        <div className="card-meta">
          12차 · 동일 원작(15s·10컷)을 두 엔진으로 각각 제작 — 연출 충실도·캐스팅·비용·통제력 비교 · 모델 교체 + 색상 차별화(아쿠아블루 시안)
          <br />
          v1~v3 실측(원본 복제→70% 한계→세그먼트 분할) · v4 = 경계 스틸 게이트(start+end_image) 설계 확정. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="both" /><span className="badge badge-draft">STAGE 3 · P0 경계 스틸 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 11차 프로젝트 (가족 4탄 · 무비나잇) */}
      <a
        href="/storyboard11"
        className="card"
        style={{ display: 'block', borderColor: '#5C6BC0', marginBottom: 20 }}
      >
        <div className="card-title">🌙 가족 요기보 4탄 — &quot;저녁의 자리&quot; (무비나잇)</div>
        <div className="card-meta">
          11차 · 시리즈 4번째 장(쉼) · 9:16 · ~13초 · 시리즈 최초 저녁 룩 · 엄마+딸(3탄 캐스팅 재사용) · 맥스+팟+서포트 아지트
          <br />
          A안 확정(2026-07-11) · 5컷 컷보드+프롬프트 초안 완료 · C1 저조도 스틸 게이트 대기. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-draft">STAGE 3 · C1 스틸 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 10차 프로젝트 (가족 3탄 놀이) */}
      <a
        href="/storyboard10"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🧸 가족 요기보 3탄 — "노는 자리" (유아기 놀이)</div>
        <div className="card-meta">
          10차 · 시리즈 3부작 완결 · 9:16 · 20초 · 아빠 재등장으로 가족 3인 완성 · 제품 노출 최다(맥스 네이비·팟·스퀴지보·메이트) · Kling 3.0
          <br />
          A안 확정 · 6컷 초안 · 첫 게이트 = 아이(2~3살) 캐스팅 스틸. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 2 · 컷 구성 컨펌 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 9차 프로젝트 (가족 2탄 사계절) */}
      <a
        href="/storyboard9"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🌱 가족 요기보 2탄 — "함께 자라는 자리" (사계절 성장)</div>
        <div className="card-meta">
          9차 · 1탄 공식 후속 · 9:16 · 15초 · 같은 거실·같은 맥스 고정 구도에서 계절과 아기만 자라는 몽타주 · 주연 엄마(wife-c3)+아기 · Kling 3.0
          <br />
          스토리·5컷 확정 · 에셋 전부 1탄 재사용 · C1(봄) 베이스 스틸 게이트 대기. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="kling" /><span className="badge badge-generating">STAGE 3 · 봄 베이스 스틸 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>

      {/* 고정 — 8차 프로젝트 (요기보 스위트 호텔 파티) */}
      {SHOW_ARCHIVED && (
      <a
        href="/storyboard8"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🏨 요기보 스위트 — 호텔 파티 원테이크 (10주년)</div>
        <div className="card-meta">
          8차 · 9:16 · 15초(시안) · 마케터 6씬 프롬프트 기반 · 스위트 도어→파티→케이크 오빗→창가→야경 틸트업→로고 불꽃 피날레
          <br />
          프롬프트 분석 완료(강점/리스크 3) · STAGE 0 결정 대기: 게스트 처리·케이크 레퍼런스. 진행상황을 확인하세요.
        </div>
        <div className="card-foot">
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><EngineChip e="seedance" /><span className="badge badge-generating">STAGE 0 · 게스트·케이크 컨펌 대기</span></span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>
      )}

      {/* 고정 — 5차 (10주년 축하 커튼 리빌) · 숨김처리 (요청: 2026-07-03) — 복구 시 아래 false→true
      {false && (
      <a
        href="/storyboard5"
        className="card"
        style={{ display: 'block', borderColor: 'var(--accent)', marginBottom: 20 }}
      >
        <div className="card-title">🎉 요기보 10주년 축하 — 커튼 리빌 (5초)</div>
        <div className="card-meta">
          리프레시용 짧은 축하 영상 · 9:16 · ~5초 · 커튼 열리며 10주년 케이크 등장 + 골드 컨페티·빵빠레
          <br />
          커튼 열리며 케이크 등장 + 컨페티/빵빠레 · <strong>5초 영상 완료</strong>.
        </div>
        <div className="card-foot">
          <span className="badge badge-review">영상 완료</span>
          <span className="card-meta" style={{ fontSize: 12 }}>열기 →</span>
        </div>
      </a>
      )}
      */}

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
