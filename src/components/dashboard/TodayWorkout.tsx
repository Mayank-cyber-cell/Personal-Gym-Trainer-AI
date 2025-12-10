import { useFitness } from '@/contexts/FitnessContext';
import { Button } from '@/components/ui/button';
import { Play, Clock, Flame, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TodayWorkout = () => {
  const { workoutPlan } = useFitness();
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayWorkout = workoutPlan?.days.find(d => d.day === today);

  if (!todayWorkout || todayWorkout.exercises.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Workout</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">Rest Day</p>
          <p className="text-sm text-muted-foreground">
            Recovery is just as important as training!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{today}</p>
            <h3 className="text-xl font-bold">{todayWorkout.focus}</h3>
          </div>
          <Link to="/workout">
            <Button variant="hero" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          </Link>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">{todayWorkout.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-sm">{todayWorkout.caloriesBurned} cal</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{todayWorkout.exercises.length} exercises</span>
          </div>
        </div>
      </div>

      {/* Exercise Preview */}
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-3">Exercises</p>
        <div className="space-y-2">
          {todayWorkout.exercises.slice(0, 4).map((exercise, index) => (
            <div 
              key={exercise.id}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">{exercise.muscleGroup}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {exercise.sets} × {exercise.reps}
              </span>
            </div>
          ))}
          {todayWorkout.exercises.length > 4 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              +{todayWorkout.exercises.length - 4} more exercises
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
