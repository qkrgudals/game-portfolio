
import { useState } from "react";

function Login({ onLoginSuccess, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인 실패");
      }

      onLoginSuccess(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <h2>로그인</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <label htmlFor="login-email">이메일</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        계정이 없나요?{" "}
        <button
          type="button"
          className="auth-link"
          onClick={onSignupClick}
        >
          회원가입
        </button>
      </p>
    </section>
  );
}

export default Login;
