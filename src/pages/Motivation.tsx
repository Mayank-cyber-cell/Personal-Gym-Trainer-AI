import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { getDailyQuote, getProgressCelebration } from '@/lib/motivationEngine';
import { MotivationalQuote } from '@/types/fitness';
import { useFitness } from '@/contexts/FitnessContext';
import { 
  RefreshCw, 
  Sparkles, 
  Laugh, 
  Flame,
  Copy,
  Check,
  Trophy,
  Target,
  Zap,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const quoteTypes = [
  { type: 'inspiring' as const, label: 'Inspiring', icon: Sparkles, color: 'text-primary bg-primary/20' },
  { type: 'funny' as const, label: 'Funny', icon: Laugh, color: 'text-yellow-500 bg-yellow-500/20' },
  { type: 'savage' as const, label: 'Savage', icon: Flame, color: 'text-accent bg-accent/20' },
];

const achievements = [
  { icon: Trophy, title: 'First Workout', description: 'Complete your first workout', unlocked: true },
  { icon: Target, title: 'Goal Setter', description: 'Set your fitness goals', unlocked: true },
  { icon: Zap, title: '7-Day Streak', description: 'Workout 7 days in a row', unlocked: false },
  { icon: Heart, title: 'Hydration Hero', description: 'Hit water goal 5 days', unlocked: false },
  { icon: Flame, title: 'Calorie Crusher', description: 'Burn 5000 calories total', unlocked: false },
  { icon: Sparkles, title: 'Transformation', description: 'Reach your ideal weight', unlocked: false },
];

const Motivation = () => {
  const { progressHistory } = useFitness();
  const [selectedType, setSelectedType] = useState<'inspiring' | 'funny' | 'savage'>('inspiring');
  const [quotes, setQuotes] = useState<MotivationalQuote[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    generateQuotes();
  }, [selectedType]);

  const generateQuotes = () => {
    const newQuotes = Array.from({ length: 6 }, () => getDailyQuote(selectedType));
    setQuotes(newQuotes);
  };

  const copyQuote = (quote: string, index: number) => {
    navigator.clipboard.writeText(quote);
    setCopied(index);
    toast({
      title: "Copied!",
      description: "Quote copied to clipboard",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const streakDays = progressHistory.filter((_, i, arr) => {
    if (i === 0) return true;
    const curr = new Date(arr[i].date);
    const prev = new Date(arr[i - 1].date);
    const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }).length;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Motivation Hub</h1>
          <p className="text-muted-foreground">Get inspired, stay motivated</p>
        </div>

        {/* Streak Banner */}
        <div className="glass-card p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-4xl font-bold gradient-text">{streakDays} Days</p>
              <p className="text-sm text-muted-foreground mt-1">Keep the momentum going! 🔥</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Flame className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Quote Type Selector */}
        <div className="flex gap-2 mb-6">
          {quoteTypes.map((qt) => {
            const Icon = qt.icon;
            return (
              <Button
                key={qt.type}
                variant={selectedType === qt.type ? 'default' : 'outline'}
                onClick={() => setSelectedType(qt.type)}
                className="flex-1"
              >
                <Icon className="w-4 h-4 mr-2" />
                {qt.label}
              </Button>
            );
          })}
        </div>

        {/* Quotes Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Quotes
            </h2>
            <Button variant="ghost" size="sm" onClick={generateQuotes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {quotes.map((quote, index) => {
              const typeConfig = quoteTypes.find(qt => qt.type === selectedType);
              const Icon = typeConfig?.icon || Sparkles;
              
              return (
                <div 
                  key={index}
                  className="glass-card-hover p-5 group relative"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                    typeConfig?.color
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <blockquote className="text-lg font-medium leading-relaxed mb-4">
                    "{quote.quote}"
                  </blockquote>

                  <button
                    onClick={() => copyQuote(quote.quote, index)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg"
                  >
                    {copied === index ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border text-center transition-all",
                    achievement.unlocked 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-muted/50 border-border opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
                    achievement.unlocked 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {achievement.unlocked && (
                    <span className="inline-block mt-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      ✓ Unlocked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Tips */}
        <div className="glass-card p-6 mt-6">
          <h2 className="font-semibold mb-4">Daily Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💪</span>
              </div>
              <div>
                <p className="font-medium text-sm">Focus on form over weight</p>
                <p className="text-xs text-muted-foreground">Better form = better results and fewer injuries</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🥗</span>
              </div>
              <div>
                <p className="font-medium text-sm">Eat protein with every meal</p>
                <p className="text-xs text-muted-foreground">Helps with muscle recovery and keeps you full</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💧</span>
              </div>
              <div>
                <p className="font-medium text-sm">Stay hydrated throughout the day</p>
                <p className="text-xs text-muted-foreground">Water boosts energy and aids recovery</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Motivation;
