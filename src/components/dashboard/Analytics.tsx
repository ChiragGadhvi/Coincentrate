import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  totalSessions: number;
  totalMinutes: number;
  successRate: number;
  weeklyChange: number;
}

const Analytics = ({ userId }: AnalyticsProps) => {
  const [data, setData] = useState<AnalyticsData>({
    totalSessions: 0,
    totalMinutes: 0,
    successRate: 0,
    weeklyChange: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      // Get all sessions
      const { data: sessions, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        return;
      }

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.completed).length;
      const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
      const successRate = (completedSessions / totalSessions) * 100;

      // Calculate this week's minutes
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekSessions = sessions.filter(
        s => new Date(s.started_at) >= oneWeekAgo
      );
      const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);

      setData({
        totalSessions,
        totalMinutes,
        successRate: Math.round(successRate),
        weeklyChange: thisWeekMinutes,
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const stats = [
    {
      icon: Clock,
      label: "Total Focus Time",
      value: `${Math.floor(data.totalMinutes / 60)}h ${data.totalMinutes % 60}m`,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Success Rate",
      value: `${data.successRate}%`,
      color: "text-secondary",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: `${data.weeklyChange} min`,
      color: "text-accent",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Your Analytics</h3>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {data.totalSessions > 0 ? (
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            You've completed{" "}
            <span className="text-primary font-bold">{data.totalSessions}</span>{" "}
            focus sessions. Keep building that streak! 🚀
          </p>
        </div>
      ) : (
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            Complete your first focus session to see your analytics!
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
