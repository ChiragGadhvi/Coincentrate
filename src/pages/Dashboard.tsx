import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import TaskList from "@/components/dashboard/TaskList";
import FocusTimer from "@/components/dashboard/FocusTimer";
import Analytics from "@/components/dashboard/Analytics";

export interface Profile {
  id: string;
  username: string | null;
  daily_coins: number;
  total_xp: number;
  level: number;
  current_streak: number;
  best_streak: number;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  coin_bid: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load tasks
      await loadTasks();
    } catch (error: any) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user!.id)
      .order("coin_bid", { ascending: false });

    if (error) {
      toast.error("Failed to load tasks");
      return;
    }

    setTasks(data || []);
  };

  const handleStartTask = (task: Task) => {
    setActiveTask(task);
    setShowTimer(true);
  };

  const handleTimerComplete = async (success: boolean) => {
    if (!activeTask || !profile) return;

    try {
      if (success) {
        // Award coins and XP
        const coinsEarned = activeTask.coin_bid * 2;
        const xpEarned = activeTask.duration_minutes * 2;

        await supabase
          .from("profiles")
          .update({
            daily_coins: profile.daily_coins + coinsEarned,
            total_xp: profile.total_xp + xpEarned,
            current_streak: profile.current_streak + 1,
            best_streak: Math.max(profile.current_streak + 1, profile.best_streak),
          })
          .eq("id", user!.id);

        // Mark task as completed
        await supabase
          .from("tasks")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", activeTask.id);

        // Log focus session
        await supabase
          .from("focus_sessions")
          .insert({
            user_id: user!.id,
            task_id: activeTask.id,
            duration_minutes: activeTask.duration_minutes,
            coins_earned: coinsEarned,
            xp_earned: xpEarned,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        toast.success(`You crushed it! Coins +${coinsEarned} 💸`);
      } else {
        // Deduct coins for failing
        const coinsLost = Math.floor(activeTask.coin_bid / 2);

        await supabase
          .from("profiles")
          .update({
            daily_coins: Math.max(0, profile.daily_coins - coinsLost),
            current_streak: 0,
          })
          .eq("id", user!.id);

        // Mark task as failed
        await supabase
          .from("tasks")
          .update({ status: "failed" })
          .eq("id", activeTask.id);

        toast.error(`Focus slipped. Coins -${coinsLost}. Tomorrow's another round.`);
      }

      // Reload data
      await loadUserData();
    } catch (error) {
      toast.error("Failed to update progress");
      console.error(error);
    } finally {
      setShowTimer(false);
      setActiveTask(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your focus dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <DashboardHeader profile={profile} onSignOut={() => supabase.auth.signOut()} />
      
      <div className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <StatsOverview profile={profile} />
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskList 
                tasks={tasks}
                profile={profile}
                onStartTask={handleStartTask}
                onTasksChange={loadTasks}
                userId={user!.id}
              />
            </div>
            
            <div>
              <Analytics userId={user!.id} />
            </div>
          </div>
        </motion.div>
      </div>

      {showTimer && activeTask && (
        <FocusTimer
          task={activeTask}
          onComplete={handleTimerComplete}
          onClose={() => {
            setShowTimer(false);
            setActiveTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
