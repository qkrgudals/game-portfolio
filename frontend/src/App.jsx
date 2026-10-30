import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h2>GAME PORTFOLIO</h2>

        <nav>
          <a href="#home">홈</a>
          <a href="#games">게임 소개</a>
          <a href="#ranking">랭킹</a>
        </nav>
      </header>

      <main id="home" className="hero">
        <h1>GAME PORTFOLIO</h1>

        <p>
          Unity 게임과 웹 서비스를 연결하는
          풀스택 게임 포트폴리오
        </p>

        <button type="button">
          게임 살펴보기
        </button>
      </main>

      <section id="games" className="section">
        <h2>MY GAMES</h2>
        <p>개발한 Unity 게임을 소개할 예정입니다.</p>
      </section>

      <section id="ranking" className="section">
        <h2>RANKING</h2>
        <p>게임 플레이 기록과 랭킹을 표시할 예정입니다.</p>
      </section>
    </div>
  );
}

export default App;