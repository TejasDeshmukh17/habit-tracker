import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WeeklySummary({ habits }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const { weekData, weekStats } = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));

    // Generate array for this week's days
    const data = days.map((day, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));

      const total = habits.length;
      const completed = habits.filter((h) =>
        h.completedDates?.some(
          (d) => new Date(d).setHours(0, 0, 0, 0) === dayStart.getTime()
        )
      ).length;

      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { day, progress: percent, completed, total };
    });

    // Calculate weekly stats
    const totalCompletions = data.reduce((sum, d) => sum + d.completed, 0);
    const avgCompletion = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.progress, 0) / data.length) : 0;
    const perfectDays = data.filter(d => d.progress === 100).length;

    return {
      weekData: data,
      weekStats: { totalCompletions, avgCompletion, perfectDays }
    };
  }, [habits]);

  const getWeekMessage = () => {
    const { avgCompletion } = weekStats;
    if (avgCompletion === 0) return "Let's start building habits!";
    if (avgCompletion < 30) return "Every step counts!";
    if (avgCompletion < 60) return "Good progress this week!";
    if (avgCompletion < 80) return "You're doing great!";
    if (avgCompletion < 100) return "Almost perfect week!";
    return "Perfect week! Amazing!";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={styles.tooltip}>
          <div style={styles.tooltipDay}>{data.day}</div>
          <div style={styles.tooltipProgress}>{data.progress}% Complete</div>
          <div style={styles.tooltipDetail}>{data.completed}/{data.total} habits</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      {/* Main Chart Card */}
      <div style={styles.chartCard}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.chartIcon}>📊</span>
          </div>
          <div style={styles.headerInfo}>
            <h3 style={styles.title}>Weekly Summary</h3>
            <p style={styles.message}>{getWeekMessage()}</p>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34, 197, 94, 0.05)" }} />
              <Bar 
                dataKey="progress" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Average Completion */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{weekStats.avgCompletion}%</div>
            <div style={styles.statLabel}>Avg Complete</div>
          </div>
        </div>

        {/* Total Completions */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✨</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{weekStats.totalCompletions}</div>
            <div style={styles.statLabel}>Completions</div>
          </div>
        </div>

        {/* Perfect Days */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💯</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{weekStats.perfectDays}</div>
            <div style={styles.statLabel}>Perfect Days</div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div style={styles.breakdownCard}>
        <h4 style={styles.breakdownTitle}>Daily Breakdown</h4>
        <div style={styles.dailyList}>
          {weekData.map((data, index) => (
            <div key={index} style={styles.dailyItem}>
              <div style={styles.dailyDay}>
                <span style={styles.dayIcon}>{data.progress === 100 ? '✅' : data.progress > 0 ? '🔄' : '⭕'}</span>
                <span style={styles.dayName}>{data.day}</span>
              </div>
              <div style={styles.dailyProgress}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${data.progress}%`,
                      background: data.progress === 100 
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                        : data.progress > 0 
                        ? 'linear-gradient(90deg, #fb923c, #f97316)'
                        : '#e2e8f0'
                    }}
                  />
                </div>
                <span style={styles.progressText}>{data.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "16px",
  },
  chartCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  iconContainer: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(34, 197, 94, 0.2)",
  },
  chartIcon: {
    fontSize: "28px",
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "4px",
  },
  message: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  chartContainer: {
    marginTop: "8px",
  },
  tooltip: {
    background: "#1e293b",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  tooltipDay: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: "4px",
  },
  tooltipProgress: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#22c55e",
    marginBottom: "2px",
  },
  tooltipDetail: {
    fontSize: "12px",
    color: "#94a3b8",
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
  breakdownCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  breakdownTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
  },
  dailyList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  dailyItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  dailyDay: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "80px",
  },
  dayIcon: {
    fontSize: "18px",
  },
  dayName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  dailyProgress: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  progressBar: {
    flex: 1,
    height: "8px",
    background: "#f1f5f9",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    minWidth: "42px",
    textAlign: "right",
  },
};