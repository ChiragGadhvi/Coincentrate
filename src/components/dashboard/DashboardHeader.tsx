import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coins, LogOut } from "lucide-react";
import { Profile } from "@/pages/Dashboard";

interface DashboardHeaderProps {
  profile: Profile;
  onSignOut: () => void;
}

const DashboardHeader = ({ profile, onSignOut }: DashboardHeaderProps) => {
  const getLevelTitle = (level: number) => {
    if (level < 5) return "Focus Novice";
    if (level < 10) return "Time Apprentice";
    if (level < 20) return "Focus Warrior";
    if (level < 30) return "Time Strategist";
    return "Focus Master";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-white/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Coins className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Coincentrate</h1>
              <p className="text-sm text-muted-foreground">
                {profile.username || "Focus Warrior"}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Level {profile.level}</span>
              <span className="text-primary font-bold">{getLevelTitle(profile.level)}</span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
