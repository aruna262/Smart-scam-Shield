import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("⚠️ Please fill in all required registration fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match. Please re-enter.");
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem("scamshield_users") || "[]");
      
      const existingUser = storedUsers.find(
        (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (existingUser) {
        setError("⚠️ An account with this email address already exists. Please login instead.");
        return;
      }

      const newUser = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        registeredAt: new Date().toISOString(),
      };

      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem("scamshield_users", JSON.stringify(updatedUsers));

      // Auto login newly registered user
      const userPayload = {
        name: newUser.name,
        email: newUser.email,
        token: "user-token-" + Date.now(),
      };
      localStorage.setItem("scamshield_logged_in_user", JSON.stringify(userPayload));

      setSuccess("🎉 Account created successfully! Logging you in...");
      if (onLoginSuccess) onLoginSuccess(userPayload);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setError("❌ Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🛡️</div>

        <h1>Create Account</h1>

        <p>Join ScamShield and stay protected</p>

        <form onSubmit={handleRegister}>
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Create a strong password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "rgba(255, 63, 85, 0.15)",
                border: "1px solid #ff3f55",
                borderRadius: "6px",
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
                padding: "10px",
                background: "rgba(46, 204, 113, 0.15)",
                border: "1px solid #2ecc71",
                borderRadius: "6px",
                color: "#2ecc71",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          <button type="submit" className="auth-button">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;