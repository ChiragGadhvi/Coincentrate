import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Pause, Play } from "lucide-react";
import { Task } from "@/pages/Dashboard";

interface FocusTimerProps {
  task: Task;
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

const FocusTimer = ({ task, onComplete, onClose }: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(task.duration_minutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const totalSeconds = task.duration_minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleQuit = () => {
    onComplete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        {/* Close button */}
        <div className="flex justify-end mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQuitConfirm(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Task info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{task.title}</h2>
          <p className="text-muted-foreground">Stay focused. You've got this.</p>
        </motion.div>

        {/* Timer circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-12">
          <svg className="transform -rotate-90 w-full h-full">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * (0.45 * (typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.4 : 160))}`}
              strokeDashoffset={`${2 * Math.PI * (0.45 * (typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.4 : 160)) * (1 - progress / 100)}`}
              className="text-primary transition-all duration-1000 glow-primary"
              strokeLinecap="round"
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-7xl font-bold text-glow mb-2"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="glass"
            size="lg"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowQuitConfirm(true)}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            Give Up
          </Button>
        </div>

        {/* Coins at stake */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 glass-card p-4 rounded-lg inline-block mx-auto"
        >
          <p className="text-sm text-muted-foreground mb-1">Coins at Stake</p>
          <p className="text-2xl font-bold text-primary">
            {task.coin_bid} 💰
          </p>
        </motion.div>
      </div>

      {/* Quit confirmation dialog */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="glass-card p-8 rounded-2xl max-w-md mx-4 text-center glow-primary">
              <h3 className="text-2xl font-bold mb-4">Give up this session?</h3>
              <p className="text-muted-foreground mb-6">
                You'll lose {Math.floor(task.coin_bid / 2)} coins and your streak will reset.
                Are you sure?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowQuitConfirm(false)}
                >
                  Keep Going
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleQuit}
                >
                  Yes, Give Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocusTimer;
