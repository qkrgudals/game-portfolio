
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  // Spring Boot API 연결 상태
  const [apiMessage, setApiMessage] = useState("연결 확인 중...");

  // 현재 페이지
  const [page, setPage] = useState("home");

  // 로그인 사용자 정보 (임시 UI 상태)
  const [user, setUser] = useState(null);

  // Spring Boot API 연결 테스트
  useEffect(() => {
    fetch("/api/test")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API 요청 실패");
        }
        return response.text();
      })
      .then((data) => {
        setApiMessage(data);
      })
      .catch((error) => {
        console.error(error);
        setApiMessage("Spring Boot 연결 실패");
      });
  }, []);

  // 로그인 성공
  const handleLoginSuccess = (data) => {
    setUser(data);
    setPage("home");
  };

  // 로그아웃 (화면 상태만 초기화)
  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  // 홈으로 이동
  const goHome = () => {
    setPage("home");
  };

  // 게임 소개 또는 랭킹으로 이동
  const goToSection = (sectionId) => {
    setPage("home");

    // React가 홈 화면을 표시한 뒤 이동
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header">
        <h2
          onClick={goHome}
          style={{ cursor: "pointer" }}
        >
          GAME PORTFOLIO
        </h2>

        <nav>
          <a
            href="#home"
            onClick={goHome}
          >
            홈
          </a>

          <a
            href="#games"
            onClick={(e) => {
              e.preventDefault();
              goToSection("games");
            }}
          >
            게임 소개
          </a>

          <a
            href="#ranking"
            onClick={(e) => {
              e.preventDefault();
              goToSection("ranking");
            }}
          >
            랭킹
          </a>
        </nav>

        {/* 로그인 / 회원가입 메뉴 */}
        <div className="auth-menu">
          {user ? (
            <>
              <span>{user.username}님</span>

              <button
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPage("login")}
              >
                로그인
              </button>

              <button
                type="button"
                onClick={() => setPage("signup")}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* 페이지별 화면 표시 */}
      {page === "login" ? (
        <main>
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSignupClick={() => setPage("signup")}
          />
        </main>
      ) : page === "signup" ? (
        <main>
          <Signup
            onSuccess={() => setPage("login")}
            onLoginClick={() => setPage("login")}
          />
        </main>
      ) : (
        <>
          {/* 기존 홈페이지 */}
          <main id="home" className="hero">
            <h1>GAME PORTFOLIO</h1>

            <p>
              Unity 게임과 웹 서비스를 연결하는
              풀스택 게임 포트폴리오
            </p>

            <button
              type="button"
              onClick={() => goToSection("games")}
            >
              게임 살펴보기
            </button>
          </main>

          {/* 게임 소개 */}
          <section id="games" className="section">
            <h2>MY GAMES</h2>
            <p>개발한 Unity 게임을 소개할 예정입니다.</p>
          </section>

          {/* 랭킹 */}
          <section id="ranking" className="section">
            <h2>RANKING</h2>
            <p>게임 플레이 기록과 랭킹을 표시할 예정입니다.</p>
          </section>

          {/* Spring Boot API 연결 테스트 */}
          <section className="section">
            <h2>BACKEND CONNECTION</h2>
            <p>{apiMessage}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
