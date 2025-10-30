import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Profile } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onTaskAdded: () => void;
  userId: string;
}

const AddTaskDialog = ({ open, onClose, profile, onTaskAdded, userId }: AddTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [duration, setDuration] = useState([30]);
  const [coinBid, setCoinBid] = useState([10]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (coinBid[0] > profile.daily_coins) {
      toast.error("Not enough coins for this bid!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("tasks")
        .insert([{
          user_id: userId,
          title,
          description: description || null,
          category: category as any,
          duration_minutes: duration[0],
          coin_bid: coinBid[0],
          status: "pending" as any,
        }]);

      if (error) throw error;

      // Deduct coins from profile
      await supabase
        .from("profiles")
        .update({ daily_coins: profile.daily_coins - coinBid[0] })
        .eq("id", profile.id);

      toast.success("Task added! Time to focus.");
      onTaskAdded();
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("other");
    setDuration([30]);
    setCoinBid([10]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to focus on?"
              required
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="bg-background/50 border-white/10 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="study">📚 Study</SelectItem>
                <SelectItem value="fitness">💪 Fitness</SelectItem>
                <SelectItem value="personal">🏠 Personal</SelectItem>
                <SelectItem value="creative">🎨 Creative</SelectItem>
                <SelectItem value="other">📌 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration: {duration[0]} minutes</Label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={5}
              max={120}
              step={5}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Coin Bid: {coinBid[0]} coins
              <span className="text-muted-foreground text-sm ml-2">
                (Available: {profile.daily_coins})
              </span>
            </Label>
            <Slider
              value={coinBid}
              onValueChange={setCoinBid}
              min={5}
              max={Math.min(profile.daily_coins, 50)}
              step={5}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground">
              💰 Win: +{coinBid[0] * 2} coins | 💀 Fail: -{Math.floor(coinBid[0] / 2)} coins
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={loading || !title}
              className="flex-1"
            >
              {loading ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
