import React, { useEffect, useState } from "react";
import WeeklySummary from "./WeeklySummary";
import StreakCounter from "./StreakCounter";

const API_BASE = "http://localhost:5000";

function Habits({ onLogout }) {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("habits"); // "habits" | "stats"
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  // 🟢 Load habits when component mounts
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/habits`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHabits(data.habits);
      })
      .catch(() => setMessage("⚠️ Unable to load habits"));
  }, [token]);

  // 🟢 Add new habit
  const addHabit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsAdding(true);

    try {
      const res = await fetch(`${API_BASE}/api/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (data.success) {
        setHabits([data.habit, ...habits]);
        setTitle("");
        setDescription("");
        setMessage("✅ Habit added!");
        setTimeout(() => setMessage(""), 3000);
      } else setMessage(data.message);
    } catch (err) {
      setMessage("⚠️ Server error while adding habit");
    } finally {
      setIsAdding(false);
    }
  };

  // 🟢 Toggle completion
  const toggleHabit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/habits/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setHabits(
          habits.map((h) => (h._id === id ? { ...h, ...data.habit } : h))
        );
      }
    } catch {
      setMessage("⚠️ Could not update habit");
    }
  };

  // 🟢 Delete habit
  const deleteHabit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setHabits(habits.filter((h) => h._id !== id));
        setMessage("🗑️ Habit deleted");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("⚠️ Could not delete habit");
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={styles.page}>
      {/* Animated background elements */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTop}>
              <div style={styles.logoSection}>
                <div style={styles.logoIcon}>🎯</div>
                <div>
                  <h2 style={styles.title}>My Habits</h2>
                  <p style={styles.subtitle}>Track your daily progress</p>
                </div>
              </div>
              <button onClick={onLogout} style={styles.logoutBtn}>
                <span style={styles.logoutIcon}>🚪</span>
                Logout
              </button>
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>Today's Progress</span>
                  <span style={styles.progressPercent}>{completionPercentage}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div 
                    style={{
                      ...styles.progressBarFill,
                      width: `${completionPercentage}%`
                    }}
                  ></div>
                </div>
                <p style={styles.progressText}>
                  {completedCount} of {totalCount} habits completed
                </p>
              </div>
            )}
          </div>

          {/* Tabs: Habits / Stats */}
          <div style={styles.tabsRow}>
            <button
              style={{
                ...styles.tabBtn,
                ...(activePage === "habits" ? styles.activeTab : {}),
              }}
              onClick={() => setActivePage("habits")}
            >
              <span style={styles.tabIcon}>✏️</span>
              Habits
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activePage === "stats" ? styles.activeTab : {}),
              }}
              onClick={() => setActivePage("stats")}
            >
              <span style={styles.tabIcon}>📊</span>
              Statistics
            </button>
          </div>

          {activePage === "habits" && (
            <>
              {/* Add Habit Form */}
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Add New Habit</h3>
                <div style={styles.formContainer}>
                  <div style={styles.inputGroup}>
                    <input
                      style={styles.input}
                      placeholder="Habit title (e.g. Morning Exercise)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <input
                      style={styles.input}
                      placeholder="Description (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={addHabit}
                    style={{
                      ...styles.addBtn,
                      ...(isAdding ? styles.addBtnDisabled : {})
                    }}
                    disabled={isAdding || !title.trim()}
                  >
                    {isAdding ? "Adding..." : "➕ Add Habit"}
                  </button>
                </div>
              </div>

              {message && (
                <div style={{
                  ...styles.message,
                  ...(message.includes("⚠️") ? styles.messageError : styles.messageSuccess)
                }}>
                  {message}
                </div>
              )}

              {/* Habit List */}
              <div style={styles.habitsList}>
                {habits.map((h) => (
                  <div key={h._id} style={styles.habitCard}>
                    <div style={styles.habitCardLeft}>
                      <button
                        onClick={() => toggleHabit(h._id)}
                        style={{
                          ...styles.checkbox,
                          ...(h.completed ? styles.checkboxCompleted : {})
                        }}
                      >
                        {h.completed && <span style={styles.checkmark}>✓</span>}
                      </button>
                      <div style={styles.habitContent}>
                        <h4
                          style={{
                            ...styles.habitTitle,
                            ...(h.completed ? styles.habitTitleCompleted : {})
                          }}
                        >
                          {h.title}
                        </h4>
                        {h.description && (
                          <p style={styles.habitDesc}>{h.description}</p>
                        )}
                      </div>
                    </div>

                    <div style={styles.habitActions}>
                      <button
                        onClick={() => toggleHabit(h._id)}
                        style={{
                          ...styles.actionBtn,
                          ...(h.completed ? styles.actionBtnUndo : styles.actionBtnDone)
                        }}
                      >
                        {h.completed ? "↶ Undo" : "✓ Done"}
                      </button>
                      <button
                        onClick={() => deleteHabit(h._id)}
                        style={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {habits.length === 0 && (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📝</div>
                    <h3 style={styles.emptyTitle}>No habits yet</h3>
                    <p style={styles.emptyText}>
                      Start building better habits by adding your first one above
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {activePage === "stats" && (
            <div style={styles.statsWrapper}>
              <StreakCounter habits={habits} />
              <WeeklySummary habits={habits} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "auto",
  },
  bgCircle1: {
    position: "fixed",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent)",
    top: "-300px",
    right: "-300px",
    filter: "blur(100px)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(118, 75, 162, 0.3), transparent)",
    bottom: "-250px",
    left: "-250px",
    filter: "blur(100px)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    position: "relative",
    zIndex: 10,
  },
  card: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    marginBottom: "28px",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logoIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#dc2626",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    padding: "10px 18px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  logoutIcon: {
    fontSize: "16px",
  },
  progressSection: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(102, 126, 234, 0.2)",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  progressLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },
  progressPercent: {
    fontSize: "20px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  progressBarBg: {
    width: "100%",
    height: "10px",
    background: "rgba(226, 232, 240, 0.8)",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },
  progressText: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  tabsRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
    background: "#f1f5f9",
    padding: "6px",
    borderRadius: "14px",
  },
  tabBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 0",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tabIcon: {
    fontSize: "18px",
  },
  activeTab: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  formCard: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "24px",
    border: "1px solid rgba(102, 126, 234, 0.15)",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    background: "#ffffff",
    color: "#1e293b",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  addBtn: {
    marginTop: "8px",
    padding: "14px 0",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  addBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "20px",
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
  habitsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  habitCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "2px solid #e2e8f0",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  habitCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
  },
  checkbox: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    background: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  checkboxCompleted: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderColor: "#667eea",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  habitTitleCompleted: {
    textDecoration: "line-through",
    color: "#94a3b8",
  },
  habitDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  habitActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  actionBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  actionBtnDone: {
    background: "rgba(34, 197, 94, 0.1)",
    color: "#16a34a",
  },
  actionBtnUndo: {
    background: "rgba(249, 115, 22, 0.1)",
    color: "#ea580c",
  },
  deleteBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(239, 68, 68, 0.1)",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  statsWrapper: {
    marginTop: "8px",
  },
};

export default Habits;