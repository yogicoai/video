import './globals.css';

export const metadata = {
  title: 'VideoGen — 영상 프롬프트 스튜디오',
  description: '이미지·스토리보드 기반 Veo 3 영상 프롬프트 생성·관리',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              <span className="brand-dot" />
              VideoGen <span className="brand-sub">Studio</span>
            </div>
            <nav className="topnav">
              <a href="/">프로젝트</a>
              <a href="/ideas">아이디어</a>
              <a href="/storyboard">스토리보드</a>
              <a href="/brand">브랜드</a>
              <a href="/guide">가이드</a>
              <a href="/higgsfield">힉스필드</a>
            </nav>
          </header>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
