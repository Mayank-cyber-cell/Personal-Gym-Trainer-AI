import { motion, AnimatePresence } from 'framer-motion';
import { RepCounterState } from '@/lib/repCounter';
import { cn } from '@/lib/utils';
import { RotateCcw, Target, Edit2, Check, Trophy, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useFitness } from '@/contexts/FitnessContext';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playRepSound, playGoalAchievedSound } from '@/lib/soundEffects';

interface RepCounterProps {
  repState: RepCounterState;
  exercise: string;
  onReset: () => void;
}

export const RepCounter = ({ repState, exercise, onReset }: RepCounterProps) => {
  const { getRepGoal, setRepGoal } = useFitness();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hasTriggeredCelebration = useRef(false);
  const prevRepCount = useRef(repState.count);
  
  const supportsRepCounting = ['squat', 'pushup', 'lunge', 'deadlift', 'shoulderpress', 'bicepcurl'].includes(exercise);
  const currentGoal = getRepGoal(exercise);
  const completionPercentage = Math.min((repState.count / currentGoal) * 100, 100);
  const isGoalReached = repState.count >= currentGoal;

  // Play sound on rep completion
  useEffect(() => {
    if (repState.count > prevRepCount.current && soundEnabled) {
      playRepSound();
    }
    prevRepCount.current = repState.count;
  }, [repState.count, soundEnabled]);

  // Trigger celebration when goal is reached
  useEffect(() => {
    if (isGoalReached && !hasTriggeredCelebration.current && repState.count > 0) {
      hasTriggeredCelebration.current = true;
      setShowCelebration(true);
      
      if (soundEnabled) {
        playGoalAchievedSound();
      }
      
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#10b981', '#34d399', '#6ee7b7']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#10b981', '#34d399', '#6ee7b7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
      
      // Also fire a burst from center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#34d399', '#fbbf24', '#f59e0b']
      });

      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [isGoalReached, repState.count]);

  // Reset celebration trigger when rep count resets
  useEffect(() => {
    if (repState.count === 0) {
      hasTriggeredCelebration.current = false;
      setShowCelebration(false);
    }
  }, [repState.count]);

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      setRepGoal(exercise, newGoal);
    }
    setIsEditingGoal(false);
    setGoalInput('');
  };

  const handleEditGoal = () => {
    setGoalInput(currentGoal.toString());
    setIsEditingGoal(true);
  };

  if (!supportsRepCounting) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground text-sm">
          Rep counting not available for this exercise
        </p>
      </div>
    );
  }

  const exerciseTips: Record<string, string> = {
    squat: "Go down until your thighs are parallel to the ground",
    pushup: "Lower your chest close to the ground, then push up",
    lunge: "Step forward and lower until your knee is at 90°",
    deadlift: "Hinge at hips, keep back straight, drive through heels",
    shoulderpress: "Press weights overhead until arms are fully extended",
    bicepcurl: "Curl weights up, keep elbows close to your body",
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Rep Counter</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Large Rep Count Display */}
      <div className="text-center mb-4 relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={repState.count}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              "text-6xl font-bold",
              isGoalReached ? "text-primary" : "gradient-text"
            )}
          >
            {repState.count}
          </motion.div>
        </AnimatePresence>
        
        {/* Celebration Message */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="flex items-center justify-center gap-2 mt-2"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold text-primary">Goal Achieved!</span>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-muted-foreground mt-1">
          {isGoalReached && !showCelebration ? "Goal reached!" : !isGoalReached ? "reps completed" : ""}
        </p>
      </div>

      {/* Goal Progress */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Goal</span>
          </div>
          {isEditingGoal ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-16 h-7 text-sm"
                min={1}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal()}
              />
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleSaveGoal}>
                <Check className="w-4 h-4 text-primary" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{repState.count}/{currentGoal}</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleEditGoal}>
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {completionPercentage.toFixed(0)}% complete
        </p>
      </div>

      {/* Current State Indicator */}
      <div className="flex justify-center gap-4">
        <div
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            repState.currentState === 'up'
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-muted text-muted-foreground"
          )}
        >
          UP
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            repState.currentState === 'neutral'
              ? "bg-amber-500/20 text-amber-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          MOVING
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            repState.currentState === 'down'
              ? "bg-accent text-accent-foreground scale-110"
              : "bg-muted text-muted-foreground"
          )}
        >
          DOWN
        </div>
      </div>

      {/* Exercise-specific tips */}
      <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground text-center">
        <p>{exerciseTips[exercise]}</p>
      </div>
    </div>
  );
};
