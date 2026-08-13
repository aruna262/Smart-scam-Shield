import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("⚠️ Please enter both your email address and password.");
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem("scamshield_users") || "[]");

      // Check if matching registered user exists
      const foundUser = storedUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userPayload = {
          name: foundUser.name,
          email: foundUser.email,
          token: "user-token-" + Date.now(),
        };

        localStorage.setItem("scamshield_logged_in_user", JSON.stringify(userPayload));
        setSuccess(`✅ Login successful! Welcome back, ${foundUser.name}.`);
        if (onLoginSuccess) onLoginSuccess(userPayload);

        setTimeout(() => navigate("/"), 800);
      } else {
        const emailExists = storedUsers.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (emailExists) {
          setError("❌ Incorrect password. Please check your password and try again.");
        } else {
          setError("❌ Account not found. No account is registered with this email. Please register first!");
        }
      }
    } catch (err) {
      console.error(err);
      setError("❌ An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🛡️</div>

        <h1>Login to ScamShield</h1>
        <p>Enter your registered credentials to access your account</p>

        <form onSubmit={handleLogin}>
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password *</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "rgba(255, 63, 85, 0.15)",
                border: "1px solid #ff3f55",
                borderRadius: "8px",
                color: "#ff6678",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "rgba(46, 204, 113, 0.15)",
                border: "1px solid #2ecc71",
                borderRadius: "8px",
                color: "#2ecc71",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          <button type="submit" className="auth-button">
            LOGIN NOW
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;