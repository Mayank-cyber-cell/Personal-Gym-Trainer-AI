export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'strength' | 'general_fitness';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'home' | 'gym' | 'none';
  dietPreference: 'veg' | 'non_veg' | 'vegan' | 'indian' | 'western';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  steps: string[];
  reps: string;
  sets: number;
  equipment: string;
  homeAlternative: string;
  intensity: 'low' | 'medium' | 'high';
  videoUrl?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: number; // in minutes
  caloriesBurned: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  days: WorkoutDay[];
  difficulty: string;
  createdAt: Date;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  recipe?: string;
}

export interface DailyDiet {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  preWorkout: Meal;
  postWorkout: Meal;
  snacks: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface ProgressEntry {
  date: Date;
  weight: number;
  bodyFat?: number;
  workoutsCompleted: number;
  caloriesBurned: number;
  waterIntake: number;
  sleepHours: number;
  notes?: string;
}

export interface BodyCalculations {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  bodyFat: number;
  idealWeight: { min: number; max: number };
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  dailyWater: number;
}

export interface MotivationalQuote {
  quote: string;
  author?: string;
  type: 'inspiring' | 'funny' | 'savage';
}

export interface WorkoutSession {
  id: string;
  date: Date;
  exercise: string;
  reps: number;
  formScore: number;
  duration: number; // in seconds
  notes?: string;
}

export interface RepGoal {
  exercise: string;
  targetReps: number;
}
