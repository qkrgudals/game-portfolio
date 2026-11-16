
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import MyPage from "./components/MyPage";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 랭킹 상태
  const [rankings, setRankings] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState("");


  // 로그인 상태 복원
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

  // 랭킹 페이지에 들어가면 최신 기록 조회
  useEffect(() => {
    if (page !== "ranking") return;

    const controller = new AbortController();

    const fetchRankings = async () => {
      setRankingLoading(true);
      setRankingError("");

      try {
        const response = await fetch("/api/records/ranking", {
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("랭킹 조회에 실패했습니다.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("올바르지 않은 랭킹 데이터입니다.");
        }

        setRankings(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setRankingError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRankingLoading(false);
        }
      }
    };

    fetchRankings();

    return () => controller.abort();
  }, [page]);

  // 로그인 성공
  const handleLoginSuccess = (data) => {
    setUser(data);
    setPage("home");
  };

  // 로그아웃
const handleLogout = async () => {
  if (logoutLoading) return;

  setLogoutLoading(true);

  try {
    // CSRF 토큰 발급
    const csrfResponse = await fetch("/api/auth/csrf", {
      credentials: "same-origin",
    });

    if (!csrfResponse.ok) {
      throw new Error("보안 토큰 발급 실패");
    }

    const { csrfToken } = await csrfResponse.json();

    // 로그아웃 요청
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error("로그아웃 실패");
    }

    setUser(null);
    setPage("home");
  } catch (error) {
    console.error(error);
    alert("로그아웃에 실패했습니다.");
  } finally {
    setLogoutLoading(false);
  }
};

  // 회원탈퇴 성공
  const handleDeleteSuccess = () => {
    setUser(null);
    setPage("home");
    alert("회원탈퇴가 완료되었습니다.");
  };

  // 마이페이지 이동
  const goMyPage = () => {
    if (!user) {
      setPage("login");
      return;
    }

    setPage("mypage");
  };

  // PC 게임 다운로드
  const handleGameDownload = () => {
   const downloadUrl =
      "https://drive.google.com/file/d/1OYPlhlJQuU7Nbn1cmS6wZjHKLkpRKIhV/view";

    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      {/* 상단 메뉴 */}
      <header className="header">
        <h2
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          GAME PORTFOLIO
        </h2>

        <nav>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setPage("home");
            }}
          >
            홈
          </a>

          <a
            href="#games"
            onClick={(e) => {
              e.preventDefault();
              setPage("games");
            }}
          >
            게임 소개
          </a>

          <a
            href="#ranking"
            onClick={(e) => {
              e.preventDefault();
              setPage("ranking");
            }}
          >
            랭킹
          </a>
        </nav>

        <div className="auth-menu">
          {authLoading ? (
            <span>로그인 확인 중...</span>
          ) : user ? (
            <>
              <span>{user.username}님</span>

              <button type="button" onClick={goMyPage}>
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

      {/* 홈 화면 */}
      {page === "home" && (
        <main className="home-page">
          <section className="game-hero">
            <div className="game-icon">🎮</div>

            <h1>UNITY GAME</h1>

            <p>
              PC에서 즐기는 오펜스 + 디펜스
              스테이지 게임
            </p>

            <button
              type="button"
              className="download-button"
              onClick={handleGameDownload}
            >
              ↓ 게임 다운로드 (PC)
            </button>
          </section>

          <div className="home-cards">
            <div
              className="home-card"
              onClick={() => setPage("ranking")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPage("ranking");
                }
              }}
            >
              <div className="card-icon">🏆</div>
              <h3>실시간 랭킹</h3>
              <p>최고 클리어 스테이지 순위 확인</p>
            </div>

            <div
              className="home-card"
              onClick={goMyPage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goMyPage();
                }
              }}
            >
              <div className="card-icon">👤</div>
              <h3>마이페이지</h3>
              <p>내 플레이 기록 확인</p>
            </div>
          </div>
        </main>
      )}

      {/* 게임 소개 */}
      {page === "games" && (
        <main className="game-page">
          <section className="game-intro">
            <div className="game-preview">
              <img
                src="/images/unity-game.png"
                alt="Unity 오펜스 디펜스 게임 플레이 화면"
                className="game-preview-image"
              />
            </div>

            <div className="game-info">
              <h1>오펜스 + 디펜스 게임</h1>

              <div className="game-tags">
                <span>Unity 3D</span>
                <span>C#</span>
                <span>PC</span>
              </div>

              <p>
                직접 조작하는 캐릭터와 자동으로
                전투하는 유닛을 이용해 적의 공격을
                막고, 적의 본진을 공략하는
                스테이지 기반 전략 게임입니다.
              </p>

              <button
                type="button"
                className="download-button"
                onClick={handleGameDownload}
              >
                ↓ 게임 다운로드 (PC)
              </button>
            </div>
          </section>
        </main>
      )}

      {/* 랭킹 */}
      {page === "ranking" && (
        <main className="ranking-page">
          <section className="ranking-container">
            <div className="ranking-icon">🏆</div>

            <h1>실시간 랭킹</h1>

            <p>
              최고 클리어 스테이지 기준 순위입니다.
              같은 스테이지라면 클리어 시간이 짧은 순서입니다.
            </p>

            {rankingLoading ? (
              <p>랭킹을 불러오는 중...</p>
            ) : rankingError ? (
              <p role="alert">{rankingError}</p>
            ) : (
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>닉네임</th>
                    <th>최고 스테이지</th>
                    <th>클리어 시간</th>
                  </tr>
                </thead>

                <tbody>
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        아직 등록된 게임 기록이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    rankings.map((ranking) => (
                      <tr key={ranking.rank}>
                        <td>
                          {ranking.rank === 1
                            ? "🥇"
                            : ranking.rank === 2
                            ? "🥈"
                            : ranking.rank === 3
                            ? "🥉"
                            : `${ranking.rank}위`}
                        </td>

                        <td>{ranking.username}</td>

                        <td>Stage {ranking.stage}</td>

                        <td>
                          {Number(ranking.clearTime).toFixed(2)}초
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </section>
        </main>
      )}

      {/* 로그인 */}
      {page === "login" && (
        <main className="auth-page">
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSignupClick={() => setPage("signup")}
          />
        </main>
      )}

      {/* 회원가입 */}
      {page === "signup" && (
        <main className="auth-page">
          <Signup
            onSuccess={() => setPage("login")}
            onLoginClick={() => setPage("login")}
          />
        </main>
      )}

      {/* 마이페이지 */}
      {page === "mypage" && (
        user ? (
          <main className="mypage-page">
            <MyPage
              onBack={() => setPage("home")}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </main>
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
    </div>
  );
}

export default App;
