import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Coins, 
  Timer, 
  TrendingUp, 
  Zap, 
  Target,
  Award,
  Bell,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {/* <Coins className="w-8 h-8 text-primary" /> */}
            <img src="/coin2.png" alt="Coincentrate" className="w-8 h-8" />
            <span className="text-2xl font-bold text-glow">Coincentrate</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="hero" onClick={() => navigate("/auth")}>
              Start for Free <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
              Bid Your Focus.<br />Win Your Day.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Gamify your productivity. Invest time like currency and master your focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/auth")}
              >
                Start for Free <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="glass" 
                size="xl"
                onClick={() => scrollToSection("how-it-works")}
              >
                See How It Works
              </Button>
            </div>
            {/* Product Hunt Badge */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://www.producthunt.com/products/coincentrate?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-coincentrate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1032931&theme=dark&t=1761910893708"
                  alt="Coincentrate - Gamify your productivity | Product Hunt"
                  style={{ width: "100%", maxWidth: 250, height: "auto" }}
                  width={250}
                  height={54}
                />
              </a>
            </div>
          </motion.div>

          {/* Animated mockup visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass-card p-8 rounded-2xl glow-primary max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Focus Coins</p>
                    <p className="text-2xl font-bold text-primary">100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-secondary">7 Days 🔥</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { title: "Complete Project Proposal", bid: 30, time: "45 min" },
                  { title: "Study React Patterns", bid: 25, time: "30 min" },
                  { title: "Morning Workout", bid: 20, time: "20 min" },
                ].map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass-card p-4 rounded-lg flex items-center justify-between hover:border-primary/30 cursor-pointer transition-all"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">{task.bid}</span>
                      <Coins className="w-4 h-4 text-primary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Coincentrate Works</h2>
            <p className="text-xl text-muted-foreground">Turn your time into a strategic game</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Coins,
                step: "1",
                title: "Bid Time with Focus Coins",
                description: "Spend your daily Focus Coins wisely on tasks. Higher bids mean higher stakes.",
              },
              {
                icon: Timer,
                step: "2",
                title: "Start Your Focus Session",
                description: "Timer locks in your effort. Stay focused and committed to the challenge.",
              },
              {
                icon: TrendingUp,
                step: "3",
                title: "Earn Coins + XP",
                description: "Win rewards for staying consistent. Build streaks and level up your focus skills.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-8 rounded-xl text-center hover:glow-primary transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
                  <item.icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Features that Power Your Focus</h2>
            <p className="text-xl text-muted-foreground">Because productivity should feel like a challenge, not a chore</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Coins,
                title: "Daily Focus Coins",
                description: "Treat your time like currency. Every day is a fresh investment opportunity.",
              },
              {
                icon: Timer,
                title: "Smart Timer",
                description: "Immersive countdown to keep you in the zone with beautiful animations.",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Track how your focus improves over time with detailed insights.",
              },
              {
                icon: Zap,
                title: "Streaks & Badges",
                description: "Turn consistency into rewards. Unlock achievements and level titles.",
              },
              {
                icon: Target,
                title: "Smart Task Bidding",
                description: "Prioritize what matters most by investing your coins strategically.",
              },
              {
                icon: Award,
                title: "Level System",
                description: "Progress from Focus Novice to Time Strategist and beyond.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-2xl text-center glow-primary"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
              Your Time is the Real Currency
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every minute counts. Start investing it wisely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/auth")}
              >
                Start Focusing Now <Zap className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 coincentrate. Master your focus, one bid at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
