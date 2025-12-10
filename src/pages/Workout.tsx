import { useState } from 'react';
import { useFitness } from '@/contexts/FitnessContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Flame,
  Dumbbell,
  Home,
  Play,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exercise } from '@/types/fitness';
import { getVideoForExercise, ExerciseVideo } from '@/lib/exerciseVideos';
import { ExerciseVideoModal, WatchDemoButton } from '@/components/workout/ExerciseVideoModal';
import { useFavoriteExercises } from '@/hooks/useFavoriteExercises';
import { FavoriteExercises, FavoriteButton } from '@/components/workout/FavoriteExercises';
import { useVoiceCues, getVoiceCueMessages } from '@/hooks/useVoiceCues';
import { VoiceCueButton, VoiceToggleButton } from '@/components/workout/VoiceCueButton';

const ExerciseCard = ({ 
  exercise, 
  index,
  isCompleted,
  onToggle,
  onWatchDemo,
  isFavorite,
  onToggleFavorite,
  onSpeak,
  isSpeaking
}: { 
  exercise: Exercise; 
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
  onWatchDemo: (video: ExerciseVideo) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const video = getVideoForExercise(exercise.id);

  return (
    <div className={cn(
      "glass-card overflow-hidden transition-all duration-300",
      isCompleted && "opacity-60"
    )}>
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            isCompleted 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-primary/20"
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
        </button>
        
        <div className="flex-1">
          <h4 className={cn(
            "font-semibold",
            isCompleted && "line-through"
          )}>
            {exercise.name}
          </h4>
          <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Cue Button */}
          <VoiceCueButton 
            onSpeak={onSpeak}
            isSpeaking={isSpeaking}
            compact
          />

          {video && (
            <>
              <FavoriteButton 
                isFavorite={isFavorite} 
                onToggle={onToggleFavorite} 
              />
              <WatchDemoButton 
                video={video} 
                onWatch={() => onWatchDemo(video)} 
                compact 
              />
            </>
          )}
          
          <div className="text-right">
            <p className="font-medium">{exercise.sets} × {exercise.reps}</p>
            <p className="text-xs text-muted-foreground capitalize">{exercise.intensity}</p>
          </div>

          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-4">
          <div className="space-y-4">
            {/* Video Demo Section */}
            {video && (
              <div>
                <p className="text-sm font-medium mb-2">Watch Demo:</p>
                <WatchDemoButton 
                  video={video} 
                  onWatch={() => onWatchDemo(video)} 
                />
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">How to perform:</p>
              <ol className="space-y-2">
                {exercise.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-medium">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{exercise.equipment}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Alt: {exercise.homeAlternative}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Workout = () => {
  const { workoutPlan, regenerateWorkoutPlan } = useFitness();
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavoriteExercises();
  const { speak, isEnabled: voiceEnabled, toggle: toggleVoice, isSpeaking, persona, setPersona } = useVoiceCues();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today;
  });
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<ExerciseVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [speakingExerciseId, setSpeakingExerciseId] = useState<string | null>(null);

  const selectedWorkout = workoutPlan?.days.find(d => d.day === selectedDay);

  const toggleExercise = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const handleWatchDemo = (video: ExerciseVideo) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleToggleFavorite = (video: ExerciseVideo) => {
    toggleFavorite(video);
  };

  const handleSpeakExercise = (exercise: Exercise) => {
    setSpeakingExerciseId(exercise.id);
    const formTip = exercise.steps[0] || 'Maintain proper form throughout the movement.';
    const messages = getVoiceCueMessages(persona);
    speak(messages.exerciseAnnouncement(
      exercise.name,
      exercise.sets,
      exercise.reps,
      formTip
    ));
    setTimeout(() => setSpeakingExerciseId(null), 4000);
  };

  const completedCount = selectedWorkout?.exercises.filter(e => completedExercises.has(e.id)).length || 0;
  const totalExercises = selectedWorkout?.exercises.length || 0;
  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Workout Plan</h1>
            <p className="text-muted-foreground">{workoutPlan?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <VoiceToggleButton 
              isEnabled={voiceEnabled} 
              onToggle={toggleVoice}
              persona={persona}
              onPersonaChange={setPersona}
            />
            <Button variant="outline" onClick={regenerateWorkoutPlan}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {workoutPlan?.days.map((day) => (
            <button
              key={day.day}
              onClick={() => {
                setSelectedDay(day.day);
                setCompletedExercises(new Set());
              }}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-xl transition-all",
                selectedDay === day.day
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-card/80"
              )}
            >
              <p className="font-medium text-sm">{day.day.slice(0, 3)}</p>
              <p className={cn(
                "text-xs mt-1",
                selectedDay === day.day ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {day.exercises.length > 0 ? day.focus.split(' ')[0] : 'Rest'}
              </p>
            </button>
          ))}
        </div>

        {/* Favorite Exercises Section */}
        <FavoriteExercises
          favorites={favorites}
          onRemove={removeFavorite}
          onWatch={handleWatchDemo}
        />

        {selectedWorkout && (
          <>
            {/* Workout Stats */}
            {selectedWorkout.exercises.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedWorkout.focus}</h2>
                  {progress === 100 && (
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{completedCount}/{totalExercises}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedWorkout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-accent" />
                    <span className="text-sm">{selectedWorkout.caloriesBurned} cal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedWorkout.exercises.length} exercises</span>
                  </div>
                </div>
              </div>
            )}

            {/* Exercises List */}
            {selectedWorkout.exercises.length > 0 ? (
              <div className="space-y-3">
                {selectedWorkout.exercises.map((exercise, index) => {
                  const video = getVideoForExercise(exercise.id);
                  return (
                    <ExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      isCompleted={completedExercises.has(exercise.id)}
                      onToggle={() => toggleExercise(exercise.id)}
                      onWatchDemo={handleWatchDemo}
                      isFavorite={video ? isFavorite(video.exerciseId) : false}
                      onToggleFavorite={() => video && handleToggleFavorite(video)}
                      onSpeak={() => handleSpeakExercise(exercise)}
                      isSpeaking={speakingExerciseId === exercise.id}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedWorkout.focus}</h3>
                <p className="text-muted-foreground">
                  Take this time to recover. Your muscles grow during rest!
                </p>
              </div>
            )}
          </>
        )}

        {/* Video Modal */}
        <ExerciseVideoModal
          video={selectedVideo}
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Workout;
