import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const exercises: Exercise[] = [
  { 
    id: 'squat', 
    name: 'Squat', 
    description: 'Check knee depth and back position',
    icon: '🏋️'
  },
  { 
    id: 'pushup', 
    name: 'Push-up', 
    description: 'Check elbow angle and body alignment',
    icon: '💪'
  },
  { 
    id: 'deadlift', 
    name: 'Deadlift', 
    description: 'Check hip hinge and back position',
    icon: '🔥'
  },
  { 
    id: 'shoulderpress', 
    name: 'Shoulder Press', 
    description: 'Check arm extension and core stability',
    icon: '🙌'
  },
  { 
    id: 'bicepcurl', 
    name: 'Bicep Curl', 
    description: 'Check elbow position and full range',
    icon: '💪'
  },
  { 
    id: 'lunge', 
    name: 'Lunge', 
    description: 'Check knee position and torso alignment',
    icon: '🦵'
  },
  { 
    id: 'plank', 
    name: 'Plank', 
    description: 'Check core engagement and hip position',
    icon: '🧘'
  },
  { 
    id: 'general', 
    name: 'General Posture', 
    description: 'Check overall body alignment',
    icon: '🧍'
  },
];

interface ExerciseSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const ExerciseSelector = ({ selected, onSelect }: ExerciseSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Select Exercise</h3>
      
      <div className="grid gap-2">
        {exercises.map((exercise) => (
          <motion.button
            key={exercise.id}
            onClick={() => onSelect(exercise.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
              selected === exercise.id
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-card/80"
            )}
          >
            <span className="text-2xl">{exercise.icon}</span>
            <div>
              <p className="font-medium">{exercise.name}</p>
              <p className={cn(
                "text-xs",
                selected === exercise.id 
                  ? "text-primary-foreground/80" 
                  : "text-muted-foreground"
              )}>
                {exercise.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
