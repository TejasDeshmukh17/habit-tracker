import React, { useMemo } from "react";

export default function StreakCounter({ habits }) {
  // Get unique completion dates across all habits
  const uniqueDates = useMemo(() => {
    const allDates = habits.flatMap((h) =>
      (h.completedDates || []).map(
        (d) => new Date(d).setHours(0, 0, 0, 0) // normalize time
      )
    );
    return Array.from(new Set(allDates)).sort((a, b) => b - a);
  }, [habits]);

  // Calculate streak
  const streak = useMemo(() => {
    if (uniqueDates.length === 0) return 0;

    let count = 1;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const diff = (currentDate - uniqueDates[i]) / (1000 * 60 * 60 * 24);

      if (diff === 0) {
        // today done, check next
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diff === 1) {
        // yesterday done
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break; // gap found, streak ends
      }
    }

    return count;
  }, [uniqueDates]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
    if (uniqueDates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
      
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  }, [uniqueDates]);

  // Get motivational message based on streak
  const getMessage = () => {
    if (streak === 0) return "Start your journey today!";
    if (streak === 1) return "Great start! Keep going!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire!";
    if (streak < 100) return "Incredible dedication!";
    return "Legendary streak!";
  };

  return (
    <div style={styles.container}>
      {/* Main Streak Card */}
      <div style={styles.streakCard}>
        <div style={styles.streakHeader}>
          <div style={styles.iconContainer}>
            <span style={styles.fireIcon}>🔥</span>
          </div>
          <div style={styles.streakInfo}>
            <h3 style={styles.title}>Current Streak</h3>
            <p style={styles.message}>{getMessage()}</p>
          </div>
        </div>
        
        <div style={styles.streakDisplay}>
          <div style={styles.streakNumber}>{streak}</div>
          <div style={styles.streakLabel}>day{streak !== 1 ? "s" : ""}</div>
        </div>

        {/* Streak Progress Ring */}
        <div style={styles.progressRing}>
          <svg style={styles.progressSvg} viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(streak % 30) * (339.3 / 30)} 339.3`}
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          <div style={styles.progressCenter}>
            <span style={styles.progressText}>{streak % 30}/30</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Longest Streak */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{longestStreak}</div>
            <div style={styles.statLabel}>Best Streak</div>
          </div>
        </div>

        {/* Total Days */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{uniqueDates.length}</div>
            <div style={styles.statLabel}>Total Days</div>
          </div>
        </div>

        {/* Total Habits */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{habits.length}</div>
            <div style={styles.statLabel}>Active Habits</div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      {streak > 0 && (
        <div style={styles.badgesSection}>
          <h4 style={styles.badgesTitle}>Achievements Unlocked</h4>
          <div style={styles.badges}>
            {streak >= 1 && (
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>🌟</span>
                <span style={styles.badgeText}>First Day</span>
              </div>
            )}
            {streak >= 7 && (
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>⭐</span>
                <span style={styles.badgeText}>1 Week</span>
              </div>
            )}
            {streak >= 30 && (
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>💫</span>
                <span style={styles.badgeText}>1 Month</span>
              </div>
            )}
            {streak >= 100 && (
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>👑</span>
                <span style={styles.badgeText}>100 Days!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  streakCard: {
    background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
    padding: "28px 24px",
    borderRadius: "20px",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(249, 115, 22, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  streakHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  iconContainer: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  fireIcon: {
    fontSize: "36px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  streakInfo: {
    flex: 1,
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "4px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  message: {
    fontSize: "14px",
    opacity: 0.95,
    fontWeight: "500",
  },
  streakDisplay: {
    textAlign: "center",
    marginBottom: "20px",
  },
  streakNumber: {
    fontSize: "72px",
    fontWeight: "800",
    lineHeight: 1,
    textShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
    letterSpacing: "-2px",
  },
  streakLabel: {
    fontSize: "18px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginTop: "8px",
    opacity: 0.9,
  },
  progressRing: {
    width: "120px",
    height: "120px",
    margin: "0 auto",
    position: "relative",
  },
  progressSvg: {
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)",
  },
  progressCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  progressText: {
    fontSize: "16px",
    fontWeight: "700",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  statCard: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  },
  statIcon: {
    fontSize: "32px",
    lineHeight: 1,
  },
  statContent: {
    textAlign: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    marginTop: "4px",
  },
  badgesSection: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  badgesTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(234, 88, 12, 0.1))",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "2px solid rgba(249, 115, 22, 0.2)",
  },
  badgeIcon: {
    fontSize: "20px",
  },
  badgeText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ea580c",
  },
};

// Add keyframes for pulse animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }
  `;
  document.head.appendChild(style);
}