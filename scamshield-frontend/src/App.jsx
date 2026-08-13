import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import CheckScam from "./pages/CheckScam";
import ReportScam from "./pages/ReportScam";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("scamshield_logged_in_user"));
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("scamshield_logged_in_user");
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          🛡️ ScamShield
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/check-scam">Check Scam</Link>
          <Link to="/report-scam">Report Scam</Link>
          <Link to="/reports">Reports</Link>

          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "14px",
                  color: "#947cff",
                  fontWeight: "600",
                  background: "#192238",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid #303b53",
                }}
              >
                👤 {currentUser.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "rgba(255, 63, 85, 0.2)",
                  border: "1px solid #ff3f55",
                  color: "#ff6678",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check-scam" element={<CheckScam />} />
        <Route path="/report-scam" element={<ReportScam />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>

      {/* Footer */}
      <footer>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "white", marginBottom: "10px" }}>
            🛡️ ScamShield
          </div>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "#727e96" }}>
            Empowering communities to stay safe from online frauds, phishing links, and fake job scams.
          </p>
          <p style={{ margin: "15px 0 0", fontSize: "12px", color: "#505a70" }}>
            © {new Date().getFullYear()} ScamShield Protection Platform. All rights reserved. Emergency Cyber Fraud Helpline: 1930
          </p>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;