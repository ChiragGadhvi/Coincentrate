import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Play, Trash2 } from "lucide-react";
import { Task, Profile } from "@/pages/Dashboard";
import AddTaskDialog from "./AddTaskDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  profile: Profile;
  onStartTask: (task: Task) => void;
  onTasksChange: () => void;
  userId: string;
}

const TaskList = ({ tasks, profile, onStartTask, onTasksChange, userId }: TaskListProps) => {
  const [showAddTask, setShowAddTask] = useState(false);

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task deleted");
      onTasksChange();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      work: "bg-blue-500/20 text-blue-400",
      study: "bg-purple-500/20 text-purple-400",
      fitness: "bg-green-500/20 text-green-400",
      personal: "bg-pink-500/20 text-pink-400",
      creative: "bg-orange-500/20 text-orange-400",
      other: "bg-gray-500/20 text-gray-400",
    };
    return colors[category] || colors.other;
  };

  if (pendingTasks.length === 0) {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Plus className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">No active bids yet</h3>
        <p className="text-muted-foreground mb-6">Time to invest your focus.</p>
        <Button variant="hero" onClick={() => setShowAddTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Task
        </Button>

        <AddTaskDialog
          open={showAddTask}
          onClose={() => setShowAddTask(false)}
          profile={profile}
          onTaskAdded={onTasksChange}
          userId={userId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Tasks</h2>
        <Button variant="hero" onClick={() => setShowAddTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {pendingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 rounded-xl hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      ⏱️ {task.duration_minutes} min
                    </span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      💰 {task.coin_bid} coins
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="hero"
                    size="icon"
                    onClick={() => onStartTask(task)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-muted-foreground">Completed Today</h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card p-4 rounded-lg opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium line-through">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ✓ Earned {task.coin_bid * 2} coins
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddTaskDialog
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        profile={profile}
        onTaskAdded={onTasksChange}
        userId={userId}
      />
    </div>
  );
};

export default TaskList;
