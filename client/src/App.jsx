import React, { useState } from "react";
import Habits from "./Habits"; // ✅ Import habits dashboard

const API_BASE = "http://localhost:5000";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        setMessage("Login successful ✅");
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        setMessage("Registration successful ✅ Now you can log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("⚠️ Network error. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Logged out successfully 👋");
  };

  // ✅ If logged in, show Habits Dashboard
  if (token) {
    return <Habits onLogout={handleLogout} />;
  }

  return (
    <div style={styles.page}>
      {/* Animated background elements */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      
      <div style={styles.card}>
        {/* Logo/Icon */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🎯</span>
          </div>
        </div>

        <h1 style={styles.title}>Habit Tracker</h1>
        <p style={styles.subtitle}>Build better habits, one day at a time</p>

        {/* Login/Register Tabs */}
        <div style={styles.toggleRow}>
          <button
            style={{ ...styles.toggleBtn, ...(isLogin ? styles.activeTab : {}) }}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            style={{
              ...styles.toggleBtn,
              ...(!isLogin ? styles.activeTab : {}),
            }}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            style={{
              ...styles.primaryBtn,
              ...(isLoading ? styles.primaryBtnDisabled : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loadingSpinner}>⏳ Processing...</span>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </div>

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes("⚠️") ? styles.messageError : styles.messageSuccess)
          }}>
            {message}
          </div>
        )}

        {/* Additional info */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              style={styles.footerLink}
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>

      {/* Bottom credits */}
      <div style={styles.credits}>
        <p style={styles.creditsText}>DSA • Web Dev • Discipline 🔥</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    color: "#e5e7eb",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent)",
    top: "-250px",
    right: "-250px",
    filter: "blur(80px)",
  },
  bgCircle2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(118, 75, 162, 0.4), transparent)",
    bottom: "-200px",
    left: "-200px",
    filter: "blur(80px)",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px 32px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    zIndex: 10,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  },
  logoIcon: {
    fontSize: "40px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "32px",
    textAlign: "center",
    fontWeight: "400",
  },
  toggleRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
    background: "#f1f5f9",
    padding: "4px",
    borderRadius: "12px",
  },
  toggleBtn: {
    flex: 1,
    padding: "10px 0",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeTab: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "18px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    background: "#ffffff",
    color: "#1e293b",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  primaryBtn: {
    marginTop: "8px",
    padding: "14px 0",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  primaryBtnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  loadingSpinner: {
    display: "inline-block",
  },
  message: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
  },
  messageSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #6ee7b7",
  },
  messageError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#64748b",
  },
  footerLink: {
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  credits: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
  },
  creditsText: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default App;