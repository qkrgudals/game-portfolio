
import { useEffect, useState } from "react";

function MyPage({ onBack, onDeleteSuccess }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 게임 기록
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState("");

  // 회원탈퇴
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  // 회원정보 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchMyInfo = async () => {
      try {
        const response = await fetch("/api/users/me", {
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("회원정보를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMyInfo();

    return () => controller.abort();
  }, []);

  // 내 게임 기록 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchMyRecords = async () => {
      try {
        const response = await fetch("/api/records/me", {
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("게임 기록을 불러오지 못했습니다.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("올바르지 않은 게임 기록 데이터입니다.");
        }

        setRecords(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setRecordsError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRecordsLoading(false);
        }
      }
    };

    fetchMyRecords();

    return () => controller.abort();
  }, []);

  // 회원탈퇴
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setDeleteMessage("비밀번호를 입력해주세요.");
      return;
    }

    const confirmed = window.confirm(
      "정말 회원탈퇴하시겠습니까? 삭제한 계정은 복구할 수 없습니다."
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteMessage("");

    try {
      // CSRF 토큰 발급
      const csrfResponse = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
      });

      if (!csrfResponse.ok) {
        throw new Error("보안 토큰을 가져오지 못했습니다.");
      }

      const { csrfToken } = await csrfResponse.json();

      // 회원탈퇴 요청
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "회원탈퇴에 실패했습니다."
        );
      }

      setPassword("");
      onDeleteSuccess();
    } catch (err) {
      setDeleteMessage(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // 최고 스테이지 계산
  const bestStage =
    records.length > 0
      ? Math.max(...records.map((record) => record.stage))
      : 0;

  // 기록 날짜 표시
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("ko-KR");
  };

  if (loading) {
    return (
      <main className="mypage-container">
        <p>회원정보를 불러오는 중...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mypage-container">
        <p role="alert">{error}</p>
        <button type="button" onClick={onBack}>
          홈으로
        </button>
      </main>
    );
  }

  return (
    <main className="mypage-container">
      <h2>마이페이지</h2>
      <p>내 회원정보와 게임 기록을 확인할 수 있습니다.</p>

      {/* 회원정보 */}
      <div className="mypage-info">
        <div className="mypage-info-row">
          <strong>회원번호</strong>
          <span>{userInfo.userId}</span>
        </div>

        <div className="mypage-info-row">
          <strong>닉네임</strong>
          <span>{userInfo.username}</span>
        </div>

        <div className="mypage-info-row">
          <strong>이메일</strong>
          <span>{userInfo.email}</span>
        </div>
      </div>

      {/* 내 게임 기록 */}
      <section className="mypage-records">
        <h3>내 게임 기록</h3>

        {recordsLoading ? (
          <p>게임 기록을 불러오는 중...</p>
        ) : recordsError ? (
          <p role="alert">{recordsError}</p>
        ) : (
          <>
            <div className="record-summary">
              <div className="record-summary-card">
                <p>최고 클리어 스테이지</p>
                <h3>
                  {bestStage > 0 ? `Stage ${bestStage}` : "-"}
                </h3>
              </div>

              <div className="record-summary-card">
                <p>총 클리어 기록</p>
                <h3>{records.length}회</h3>
              </div>
            </div>

            <h3>최근 플레이 기록</h3>

            <div className="record-table-wrapper">
              <table className="record-table">
                <thead>
                  <tr>
                    <th>스테이지</th>
                    <th>클리어 시간</th>
                    <th>클리어 날짜</th>
                  </tr>
                </thead>

                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        아직 등록된 게임 기록이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id}>
                        <td>Stage {record.stage}</td>
                        <td>
                          {Number(record.clearTime).toFixed(2)}초
                        </td>
                        <td>{formatDate(record.clearedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* 회원탈퇴 */}
      {!showDelete ? (
        <div className="mypage-actions">
          <button type="button" onClick={onBack}>
            홈으로 돌아가기
          </button>

          <button
            type="button"
            className="delete-account-button"
            onClick={() => setShowDelete(true)}
          >
            회원탈퇴
          </button>
        </div>
      ) : (
        <form
          className="delete-account-form"
          onSubmit={handleDelete}
        >
          <h3>회원탈퇴 확인</h3>

          <p>
            탈퇴하면 회원정보가 삭제됩니다.
            계속하려면 현재 비밀번호를 입력해주세요.
          </p>

          <label htmlFor="delete-password">
            현재 비밀번호
          </label>

          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {deleteMessage && (
            <p role="alert">{deleteMessage}</p>
          )}

          <div className="mypage-actions">
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                setShowDelete(false);
                setPassword("");
                setDeleteMessage("");
              }}
            >
              취소
            </button>

            <button
              type="submit"
              className="delete-account-button"
              disabled={deleting}
            >
              {deleting ? "탈퇴 처리 중..." : "회원탈퇴"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export default MyPage;
