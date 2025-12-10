import { useState, useCallback, useRef, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { WebcamPoseDetector } from '@/components/posture/WebcamPoseDetector';
import { FeedbackPanel } from '@/components/posture/FeedbackPanel';
import { ExerciseSelector } from '@/components/posture/ExerciseSelector';
import { RepCounter } from '@/components/posture/RepCounter';
import { WorkoutTimer } from '@/components/posture/WorkoutTimer';
import { PostureFeedback } from '@/lib/postureAnalysis';
import { RepCounterState, initialRepState } from '@/lib/repCounter';
import { useFitness } from '@/contexts/FitnessContext';
import { motion } from 'framer-motion';
import { Scan, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PostureAnalysis = () => {
  const { addWorkoutSession } = useFitness();
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [feedback, setFeedback] = useState<PostureFeedback[]>([]);
  const [repState, setRepState] = useState<RepCounterState>(initialRepState);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const formScoresRef = useRef<number[]>([]);

  // Track elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  // Track form scores from feedback
  useEffect(() => {
    if (feedback.length > 0 && isSessionActive) {
      const goodCount = feedback.filter(f => f.severity === 'good').length;
      const score = Math.round((goodCount / feedback.length) * 100);
      formScoresRef.current.push(score);
    }
  }, [feedback, isSessionActive]);

  const handleExerciseChange = useCallback((exercise: string) => {
    setSelectedExercise(exercise);
    setRepState(initialRepState);
    // Reset session when exercise changes
    setIsSessionActive(false);
    setSessionStartTime(null);
    setElapsedTime(0);
    formScoresRef.current = [];
  }, []);

  const handleResetReps = useCallback(() => {
    setRepState(initialRepState);
    // Start new session when reps are reset
    setSessionStartTime(new Date());
    setElapsedTime(0);
    setIsSessionActive(true);
    formScoresRef.current = [];
  }, []);

  const handleSaveSession = useCallback(() => {
    if (repState.count === 0) {
      toast.error('Complete at least 1 rep before saving');
      return;
    }

    const avgFormScore = formScoresRef.current.length > 0
      ? Math.round(formScoresRef.current.reduce((a, b) => a + b, 0) / formScoresRef.current.length)
      : 0;

    addWorkoutSession({
      id: crypto.randomUUID(),
      date: new Date(),
      exercise: selectedExercise,
      reps: repState.count,
      formScore: avgFormScore,
      duration: elapsedTime,
    });

    toast.success(`Session saved: ${repState.count} ${selectedExercise} reps`);
    
    // Reset for new session
    setRepState(initialRepState);
    setSessionStartTime(null);
    setElapsedTime(0);
    setIsSessionActive(false);
    formScoresRef.current = [];
  }, [repState, selectedExercise, elapsedTime, addWorkoutSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-start session on first rep
  useEffect(() => {
    if (repState.count > 0 && !isSessionActive) {
      setSessionStartTime(new Date());
      setIsSessionActive(true);
    }
  }, [repState.count, isSessionActive]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-3 rounded-xl bg-primary/20">
            <Scan className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Posture Analysis</h1>
            <p className="text-muted-foreground">AI-powered real-time form correction with rep counting</p>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">How it works</p>
            <p className="text-muted-foreground">
              Select an exercise, start your camera, and position yourself so your full body is visible. 
              The AI will analyze your form in real-time, count your reps automatically, and provide 
              voice feedback. Supported rep counting: Squat, Push-up, Lunge.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Exercise Selector - Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="glass-card p-4 sticky top-24">
              <ExerciseSelector 
                selected={selectedExercise} 
                onSelect={handleExerciseChange} 
              />
            </div>
          </motion.div>

          {/* Main Camera View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-4">
              <WebcamPoseDetector 
                selectedExercise={selectedExercise}
                onFeedbackUpdate={setFeedback}
                onRepUpdate={setRepState}
              />
            </div>
          </motion.div>

          {/* Right Sidebar - Rep Counter & Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Rep Counter */}
            <RepCounter 
              repState={repState} 
              exercise={selectedExercise}
              onReset={handleResetReps}
            />

            {/* Workout Timer with Rest Alerts */}
            <WorkoutTimer 
              onRestStart={() => toast.info('Rest period started - take a break!')}
              onRestEnd={() => toast.success('Rest over - let\'s go!')}
            />

            {/* Session Save */}
            {isSessionActive && (
              <div className="glass-card p-4">
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={handleSaveSession}
                  disabled={repState.count === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Session ({repState.count} reps)
                </Button>
              </div>
            )}
            
            {/* Feedback Panel */}
            <div className="glass-card p-4">
              <FeedbackPanel feedback={feedback} />
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Tips for Accurate Detection</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium">Good Lighting</p>
                <p className="text-sm text-muted-foreground">
                  Ensure your room is well-lit for the camera to detect your body accurately.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📏</span>
              <div>
                <p className="font-medium">Full Body Visible</p>
                <p className="text-sm text-muted-foreground">
                  Position yourself so your entire body is visible in the frame.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">👕</span>
              <div>
                <p className="font-medium">Contrasting Clothes</p>
                <p className="text-sm text-muted-foreground">
                  Wear clothes that contrast with your background for better detection.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PostureAnalysis;
