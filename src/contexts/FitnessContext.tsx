import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, WorkoutPlan, DailyDiet, ProgressEntry, BodyCalculations, WorkoutSession, RepGoal } from '@/types/fitness';
import { calculateBodyMetrics } from '@/lib/calculators';
import { generateWorkoutPlan } from '@/lib/workoutGenerator';
import { generateDietPlan } from '@/lib/dietGenerator';

interface FitnessContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DailyDiet | null;
  bodyCalculations: BodyCalculations | null;
  progressHistory: ProgressEntry[];
  addProgressEntry: (entry: ProgressEntry) => void;
  workoutSessions: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => void;
  repGoals: RepGoal[];
  setRepGoal: (exercise: string, targetReps: number) => void;
  getRepGoal: (exercise: string) => number;
  isOnboarded: boolean;
  completeOnboarding: (profile: UserProfile) => void;
  regenerateWorkoutPlan: () => void;
  regenerateDietPlan: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DailyDiet | null>(null);
  const [bodyCalculations, setBodyCalculations] = useState<BodyCalculations | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [repGoals, setRepGoals] = useState<RepGoal[]>([]);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitforge_profile');
    const savedProgress = localStorage.getItem('fitforge_progress');
    const savedSessions = localStorage.getItem('fitforge_sessions');
    const savedGoals = localStorage.getItem('fitforge_rep_goals');
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsOnboarded(true);
      
      const calculations = calculateBodyMetrics(profile);
      setBodyCalculations(calculations);
      setWorkoutPlan(generateWorkoutPlan(profile));
      setDietPlan(generateDietPlan(profile, calculations));
    }
    
    if (savedProgress) {
      setProgressHistory(JSON.parse(savedProgress));
    }
    
    if (savedSessions) {
      setWorkoutSessions(JSON.parse(savedSessions));
    }

    if (savedGoals) {
      setRepGoals(JSON.parse(savedGoals));
    }
  }, []);

  const completeOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('fitforge_profile', JSON.stringify(profile));
    
    const calculations = calculateBodyMetrics(profile);
    setBodyCalculations(calculations);
    setWorkoutPlan(generateWorkoutPlan(profile));
    setDietPlan(generateDietPlan(profile, calculations));
    setIsOnboarded(true);
  };

  const addProgressEntry = (entry: ProgressEntry) => {
    const newHistory = [...progressHistory, entry];
    setProgressHistory(newHistory);
    localStorage.setItem('fitforge_progress', JSON.stringify(newHistory));
  };

  const addWorkoutSession = (session: WorkoutSession) => {
    const newSessions = [...workoutSessions, session];
    setWorkoutSessions(newSessions);
    localStorage.setItem('fitforge_sessions', JSON.stringify(newSessions));
  };

  const setRepGoal = (exercise: string, targetReps: number) => {
    const existingIndex = repGoals.findIndex(g => g.exercise === exercise);
    let newGoals: RepGoal[];
    if (existingIndex >= 0) {
      newGoals = [...repGoals];
      newGoals[existingIndex] = { exercise, targetReps };
    } else {
      newGoals = [...repGoals, { exercise, targetReps }];
    }
    setRepGoals(newGoals);
    localStorage.setItem('fitforge_rep_goals', JSON.stringify(newGoals));
  };

  const getRepGoal = (exercise: string): number => {
    const goal = repGoals.find(g => g.exercise === exercise);
    return goal?.targetReps || 10; // Default goal is 10 reps
  };

  const regenerateWorkoutPlan = () => {
    if (userProfile) {
      setWorkoutPlan(generateWorkoutPlan(userProfile));
    }
  };

  const regenerateDietPlan = () => {
    if (userProfile && bodyCalculations) {
      setDietPlan(generateDietPlan(userProfile, bodyCalculations));
    }
  };

  return (
    <FitnessContext.Provider
      value={{
        userProfile,
        setUserProfile,
        workoutPlan,
        dietPlan,
        bodyCalculations,
        progressHistory,
        addProgressEntry,
        workoutSessions,
        addWorkoutSession,
        repGoals,
        setRepGoal,
        getRepGoal,
        isOnboarded,
        completeOnboarding,
        regenerateWorkoutPlan,
        regenerateDietPlan,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
