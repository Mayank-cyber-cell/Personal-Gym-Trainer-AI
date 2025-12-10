import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Coffee, Volume2, VolumeX, Plus, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useVoiceCues, getVoiceCueMessages } from '@/hooks/useVoiceCues';

interface WorkoutTimerProps {
  onRestStart?: () => void;
  onRestEnd?: () => void;
  nextExerciseName?: string;
  nextExerciseSets?: number;
  nextExerciseReps?: number | string;
}

const REST_DURATIONS = [30, 45, 60, 90, 120];

// Sound effect for rest alert
const playRestAlert = (isStart: boolean) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (isStart) {
      // Rest start - descending tone
      const notes = [880, 660, 440];
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = audioContext.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } else {
      // Rest end - ascending energetic tone
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = 'square';
        const startTime = audioContext.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    }
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};

export const WorkoutTimer = ({ 
  onRestStart, 
  onRestEnd,
  nextExerciseName,
  nextExerciseSets,
  nextExerciseReps
}: WorkoutTimerProps) => {
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [selectedRestDuration, setSelectedRestDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { speak, isEnabled: voiceEnabled, toggle: toggleVoice, isSpeaking, persona } = useVoiceCues();

  // Main workout timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isResting) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isResting]);

  // Rest timer countdown
  useEffect(() => {
    if (isResting && restTime > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            endRest();
            return 0;
          }
          // Warning beep at 5 seconds
          if (prev === 6 && soundEnabled) {
            playWarningBeep();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, [isResting]);

  const playWarningBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 1000;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc.start();
      osc.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  };

  const startRest = useCallback(() => {
    setIsResting(true);
    setRestTime(selectedRestDuration);
    if (soundEnabled) playRestAlert(true);
    if (voiceEnabled) {
      const messages = getVoiceCueMessages(persona);
      speak(messages.restStart(selectedRestDuration));
    }
    onRestStart?.();
  }, [selectedRestDuration, soundEnabled, voiceEnabled, speak, persona, onRestStart]);

  const endRest = useCallback(() => {
    setIsResting(false);
    setRestTime(0);
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
    }
    if (soundEnabled) playRestAlert(false);
    if (voiceEnabled) {
      const messages = getVoiceCueMessages(persona);
      if (nextExerciseName && nextExerciseSets && nextExerciseReps) {
        setTimeout(() => {
          speak(messages.exerciseAnnouncement(
            nextExerciseName,
            nextExerciseSets,
            nextExerciseReps,
            'Keep your core tight and maintain proper form.'
          ));
        }, 500);
      } else {
        speak(messages.restEnd());
      }
    }
    onRestEnd?.();
  }, [soundEnabled, voiceEnabled, speak, persona, nextExerciseName, nextExerciseSets, nextExerciseReps, onRestEnd]);

  const skipRest = () => {
    endRest();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setWorkoutTime(0);
    setIsResting(false);
    setRestTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const restProgress = isResting ? ((selectedRestDuration - restTime) / selectedRestDuration) * 100 : 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Workout Timer</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            title={voiceEnabled ? "Disable voice cues" : "Enable voice cues"}
            className={cn(isSpeaking && "animate-pulse text-primary")}
          >
            <Mic className={cn("w-4 h-4", voiceEnabled ? "text-primary" : "text-muted-foreground")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute sound alerts" : "Enable sound alerts"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-4">
        <motion.div
          key={isResting ? 'rest' : 'work'}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "text-4xl font-mono font-bold",
            isResting ? "text-amber-500" : "text-primary"
          )}
        >
          {isResting ? formatTime(restTime) : formatTime(workoutTime)}
        </motion.div>
        <p className="text-sm text-muted-foreground mt-1">
          {isResting ? "Rest Time" : isRunning ? "Workout Time" : "Ready"}
        </p>
      </div>

      {/* Rest Progress Bar */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500"
                initial={{ width: '0%' }}
                animate={{ width: `${restProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Resting...</span>
              <span>{restTime}s left</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Controls */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={isRunning ? "secondary" : "default"}
          className="flex-1"
          onClick={toggleTimer}
          disabled={isResting}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Start
            </>
          )}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Rest Controls */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Rest Period</span>
        </div>

        {/* Rest Duration Selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {REST_DURATIONS.map((duration) => (
            <Button
              key={duration}
              variant={selectedRestDuration === duration && !showCustomInput ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => {
                setSelectedRestDuration(duration);
                setShowCustomInput(false);
              }}
              disabled={isResting}
            >
              {duration}s
            </Button>
          ))}
          <Button
            variant={showCustomInput ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setShowCustomInput(true)}
            disabled={isResting}
          >
            <Plus className="w-3 h-3 mr-1" />
            Custom
          </Button>
        </div>

        {/* Custom Duration Input */}
        <AnimatePresence>
          {showCustomInput && !isResting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Seconds"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="flex-1"
                  min={5}
                  max={600}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const duration = parseInt(customDuration);
                    if (duration >= 5 && duration <= 600) {
                      setSelectedRestDuration(duration);
                      setShowCustomInput(false);
                      setCustomDuration('');
                    }
                  }}
                  disabled={!customDuration || parseInt(customDuration) < 5 || parseInt(customDuration) > 600}
                >
                  Set
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Enter 5-600 seconds</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest Action Button */}
        {isResting ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={skipRest}
          >
            Skip Rest
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={startRest}
            disabled={!isRunning}
          >
            <Coffee className="w-4 h-4 mr-2" />
            Start Rest ({selectedRestDuration}s)
          </Button>
        )}
      </div>
    </div>
  );
};
