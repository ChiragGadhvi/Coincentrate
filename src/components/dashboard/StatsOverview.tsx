import { motion } from "framer-motion";
import { Coins, Zap, TrendingUp, Flame } from "lucide-react";
import { Profile } from "@/pages/Dashboard";

interface StatsOverviewProps {
  profile: Profile;
}

const StatsOverview = ({ profile }: StatsOverviewProps) => {
  const stats = [
    {
      icon: Coins,
      label: "Daily Focus Coins",
      value: profile.daily_coins,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      label: "Total XP",
      value: profile.total_xp.toLocaleString(),
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: TrendingUp,
      label: "Level",
      value: profile.level,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${profile.current_streak} days`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all"
        >
          <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;
