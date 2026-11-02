
import { useState } from "react";

function Signup({ onSuccess, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원가입 실패");
      }

      setMessage("회원가입 성공!");
      onSuccess?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <h2>회원가입</h2>

      <form className="auth-form" onSubmit={handleSignup}>
        <label htmlFor="signup-username">닉네임</label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={50}
          required
        />

        <label htmlFor="signup-email">이메일</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={100}
          required
        />

        <label htmlFor="signup-password">비밀번호</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <p>
        이미 계정이 있나요?{" "}
        <button
          type="button"
          className="auth-link"
          onClick={onLoginClick}
        >
          로그인
        </button>
      </p>
    </section>
  );
}

export default Signup;
