
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import MyPage from "./components/MyPage";

function App() {
  // Spring Boot API 연결 상태
  const [apiMessage, setApiMessage] = useState("연결 확인 중...");

  // 현재 페이지
  const [page, setPage] = useState("home");

  // 로그인 사용자 정보
  const [user, setUser] = useState(null);

  // 로그인 상태 확인 중인지 여부
  const [authLoading, setAuthLoading] = useState(true);

  // 로그아웃 처리 중인지 여부
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 선택한 프로젝트 ID
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  // 새로고침 후 로그인 상태 복원
  useEffect(() => {
    const controller = new AbortController();

    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/users/me", {
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("로그인 상태 확인 실패");
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setAuthLoading(false);
        }
      }
    };

    checkLoginStatus();

    return () => controller.abort();
  }, []);

  // 로그인 성공
  const handleLoginSuccess = (data) => {
    setUser(data);
    setPage("home");
  };

  // 로그아웃 (서버 세션 + React 상태 초기화)
  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      setUser(null);
      setPage("home");
    } catch (error) {
      console.error(error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLogoutLoading(false);
    }
  };

  // 회원탈퇴 성공
  const handleDeleteSuccess = () => {
    // UserController에서 회원 삭제 및 세션 종료 완료
    setUser(null);
    setSelectedProjectId(null);
    setPage("home");

    alert("회원탈퇴가 완료되었습니다.");
  };

  // 홈으로 이동
  const goHome = () => {
    setPage("home");
  };

  // 프로젝트 목록으로 이동
  const goProjects = () => {
    setPage("projects");
  };

  // 프로젝트 상세 보기
  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setPage("projectDetail");
  };

  // 마이페이지 이동
  const goMyPage = () => {
    if (!user) {
      setPage("login");
      return;
    }

    setPage("mypage");
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
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
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
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              goProjects();
            }}
          >
            프로젝트
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

        {/* 로그인 / 회원가입 / 마이페이지 메뉴 */}
        <div className="auth-menu">
          {authLoading ? (
            <span>로그인 확인 중...</span>
          ) : user ? (
            <>
              <span>{user.username}님</span>

              <button
                type="button"
                onClick={goMyPage}
              >
                마이페이지
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? "로그아웃 중..." : "로그아웃"}
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

      {/* 로그인 페이지 */}
      {page === "login" && (
        <main>
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSignupClick={() => setPage("signup")}
          />
        </main>
      )}

      {/* 회원가입 페이지 */}
      {page === "signup" && (
        <main>
          <Signup
            onSuccess={() => setPage("login")}
            onLoginClick={() => setPage("login")}
          />
        </main>
      )}

      {/* 프로젝트 목록 페이지 */}
      {page === "projects" && (
        <main>
          <ProjectList
            onSelectProject={handleSelectProject}
          />
        </main>
      )}

      {/* 프로젝트 상세 페이지 */}
      {page === "projectDetail" && (
        <ProjectDetail
          projectId={selectedProjectId}
          onBack={goProjects}
        />
      )}

      {/* 마이페이지 + 회원탈퇴 */}
      {page === "mypage" && (
        user ? (
          <MyPage
            onBack={goHome}
            onDeleteSuccess={handleDeleteSuccess}
          />
        ) : (
          <main className="section">
            <p>로그인이 필요합니다.</p>

            <button
              type="button"
              onClick={() => setPage("login")}
            >
              로그인하기
            </button>
          </main>
        )
      )}

      {/* 기존 홈페이지 */}
      {page === "home" && (
        <>
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
