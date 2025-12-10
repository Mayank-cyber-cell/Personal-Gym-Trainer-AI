import { UserProfile, WorkoutPlan, WorkoutDay, Exercise } from '@/types/fitness';

const exerciseLibrary: Record<string, Exercise[]> = {
  chest: [
    {
      id: 'bench-press',
      name: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      steps: ['Lie flat on bench', 'Grip bar slightly wider than shoulders', 'Lower bar to chest', 'Press up explosively'],
      reps: '8-12',
      sets: 4,
      equipment: 'Barbell, Bench',
      homeAlternative: 'Push-ups',
      intensity: 'high',
    },
    {
      id: 'incline-db-press',
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Upper Chest',
      steps: ['Set bench to 30-45 degrees', 'Press dumbbells up', 'Lower with control', 'Squeeze at top'],
      reps: '10-12',
      sets: 3,
      equipment: 'Dumbbells, Incline Bench',
      homeAlternative: 'Incline Push-ups',
      intensity: 'medium',
    },
    {
      id: 'cable-flyes',
      name: 'Cable Flyes',
      muscleGroup: 'Chest',
      steps: ['Set cables at chest height', 'Step forward', 'Bring hands together', 'Squeeze chest'],
      reps: '12-15',
      sets: 3,
      equipment: 'Cable Machine',
      homeAlternative: 'Resistance Band Flyes',
      intensity: 'medium',
    },
  ],
  back: [
    {
      id: 'deadlift',
      name: 'Conventional Deadlift',
      muscleGroup: 'Back, Legs',
      steps: ['Stand with feet hip-width', 'Grip bar outside legs', 'Keep back flat', 'Drive through heels', 'Lock out at top'],
      reps: '5-8',
      sets: 4,
      equipment: 'Barbell',
      homeAlternative: 'Single-leg Romanian Deadlift',
      intensity: 'high',
    },
    {
      id: 'pull-ups',
      name: 'Pull-ups',
      muscleGroup: 'Lats, Biceps',
      steps: ['Hang from bar', 'Pull chest to bar', 'Squeeze lats', 'Lower with control'],
      reps: '6-10',
      sets: 4,
      equipment: 'Pull-up Bar',
      homeAlternative: 'Doorway Pull-ups or Rows',
      intensity: 'high',
    },
    {
      id: 'barbell-row',
      name: 'Barbell Row',
      muscleGroup: 'Back',
      steps: ['Hinge at hips', 'Pull bar to lower chest', 'Squeeze shoulder blades', 'Lower slowly'],
      reps: '8-12',
      sets: 4,
      equipment: 'Barbell',
      homeAlternative: 'Resistance Band Rows',
      intensity: 'medium',
    },
  ],
  shoulders: [
    {
      id: 'ohp',
      name: 'Overhead Press',
      muscleGroup: 'Shoulders',
      steps: ['Stand with bar at shoulders', 'Press overhead', 'Lock out arms', 'Lower with control'],
      reps: '6-10',
      sets: 4,
      equipment: 'Barbell',
      homeAlternative: 'Pike Push-ups',
      intensity: 'high',
    },
    {
      id: 'lateral-raises',
      name: 'Lateral Raises',
      muscleGroup: 'Side Delts',
      steps: ['Hold dumbbells at sides', 'Raise to shoulder height', 'Keep slight bend in elbows', 'Lower slowly'],
      reps: '12-15',
      sets: 3,
      equipment: 'Dumbbells',
      homeAlternative: 'Water Bottle Lateral Raises',
      intensity: 'low',
    },
  ],
  legs: [
    {
      id: 'squat',
      name: 'Barbell Back Squat',
      muscleGroup: 'Quads, Glutes',
      steps: ['Bar on upper back', 'Feet shoulder-width', 'Squat to parallel', 'Drive up through heels'],
      reps: '6-10',
      sets: 4,
      equipment: 'Barbell, Squat Rack',
      homeAlternative: 'Bulgarian Split Squats',
      intensity: 'high',
    },
    {
      id: 'rdl',
      name: 'Romanian Deadlift',
      muscleGroup: 'Hamstrings, Glutes',
      steps: ['Hold bar at hips', 'Hinge forward', 'Feel hamstring stretch', 'Return to standing'],
      reps: '8-12',
      sets: 3,
      equipment: 'Barbell',
      homeAlternative: 'Single-leg RDL',
      intensity: 'medium',
    },
    {
      id: 'leg-press',
      name: 'Leg Press',
      muscleGroup: 'Quads',
      steps: ['Sit in machine', 'Feet shoulder-width', 'Lower weight slowly', 'Press up explosively'],
      reps: '10-15',
      sets: 3,
      equipment: 'Leg Press Machine',
      homeAlternative: 'Goblet Squats',
      intensity: 'medium',
    },
  ],
  arms: [
    {
      id: 'barbell-curl',
      name: 'Barbell Curl',
      muscleGroup: 'Biceps',
      steps: ['Stand with bar', 'Curl to shoulders', 'Keep elbows stationary', 'Lower with control'],
      reps: '10-12',
      sets: 3,
      equipment: 'Barbell',
      homeAlternative: 'Resistance Band Curls',
      intensity: 'low',
    },
    {
      id: 'tricep-dips',
      name: 'Tricep Dips',
      muscleGroup: 'Triceps',
      steps: ['Grip parallel bars', 'Lower body', 'Push back up', 'Lock out at top'],
      reps: '8-12',
      sets: 3,
      equipment: 'Dip Station',
      homeAlternative: 'Bench Dips',
      intensity: 'medium',
    },
  ],
  core: [
    {
      id: 'plank',
      name: 'Plank Hold',
      muscleGroup: 'Core',
      steps: ['Forearms on ground', 'Body in straight line', 'Engage core', 'Hold position'],
      reps: '30-60 sec',
      sets: 3,
      equipment: 'None',
      homeAlternative: 'Plank Hold',
      intensity: 'low',
    },
    {
      id: 'hanging-leg-raise',
      name: 'Hanging Leg Raises',
      muscleGroup: 'Lower Abs',
      steps: ['Hang from bar', 'Raise legs to parallel', 'Lower with control', 'Avoid swinging'],
      reps: '10-15',
      sets: 3,
      equipment: 'Pull-up Bar',
      homeAlternative: 'Lying Leg Raises',
      intensity: 'medium',
    },
  ],
};

const workoutSplits = {
  beginner: [
    { day: 'Monday', focus: 'Full Body A', groups: ['chest', 'back', 'legs', 'core'] },
    { day: 'Tuesday', focus: 'Rest / Light Cardio', groups: [] },
    { day: 'Wednesday', focus: 'Full Body B', groups: ['shoulders', 'legs', 'arms', 'core'] },
    { day: 'Thursday', focus: 'Rest / Mobility', groups: [] },
    { day: 'Friday', focus: 'Full Body A', groups: ['chest', 'back', 'legs', 'core'] },
    { day: 'Saturday', focus: 'Active Recovery', groups: [] },
    { day: 'Sunday', focus: 'Rest', groups: [] },
  ],
  intermediate: [
    { day: 'Monday', focus: 'Push (Chest, Shoulders, Triceps)', groups: ['chest', 'shoulders', 'arms'] },
    { day: 'Tuesday', focus: 'Pull (Back, Biceps)', groups: ['back', 'arms'] },
    { day: 'Wednesday', focus: 'Legs & Core', groups: ['legs', 'core'] },
    { day: 'Thursday', focus: 'Rest / Cardio', groups: [] },
    { day: 'Friday', focus: 'Upper Body', groups: ['chest', 'back', 'shoulders'] },
    { day: 'Saturday', focus: 'Lower Body & Core', groups: ['legs', 'core'] },
    { day: 'Sunday', focus: 'Rest', groups: [] },
  ],
  advanced: [
    { day: 'Monday', focus: 'Chest & Triceps', groups: ['chest', 'arms'] },
    { day: 'Tuesday', focus: 'Back & Biceps', groups: ['back', 'arms'] },
    { day: 'Wednesday', focus: 'Legs (Quad Focus)', groups: ['legs', 'core'] },
    { day: 'Thursday', focus: 'Shoulders & Arms', groups: ['shoulders', 'arms'] },
    { day: 'Friday', focus: 'Legs (Hamstring Focus)', groups: ['legs', 'core'] },
    { day: 'Saturday', focus: 'Full Body Power', groups: ['chest', 'back', 'legs'] },
    { day: 'Sunday', focus: 'Rest / Active Recovery', groups: [] },
  ],
};

const selectExercises = (
  groups: string[],
  equipment: string,
  count: number = 2
): Exercise[] => {
  const exercises: Exercise[] = [];
  
  groups.forEach(group => {
    const groupExercises = exerciseLibrary[group] || [];
    const selected = groupExercises.slice(0, count);
    
    selected.forEach(exercise => {
      if (equipment === 'none' || equipment === 'home') {
        exercises.push({
          ...exercise,
          name: exercise.homeAlternative,
          equipment: 'Bodyweight / Home Equipment',
        });
      } else {
        exercises.push(exercise);
      }
    });
  });
  
  return exercises;
};

export const generateWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
  const split = workoutSplits[profile.experienceLevel] || workoutSplits.beginner;
  
  const days: WorkoutDay[] = split.map(dayPlan => {
    const exercises = dayPlan.groups.length > 0
      ? selectExercises(dayPlan.groups, profile.equipment)
      : [];
    
    const duration = exercises.length * 8 + 10; // 8 min per exercise + warmup
    const caloriesBurned = Math.round(duration * 7); // ~7 cal per minute
    
    return {
      day: dayPlan.day,
      focus: dayPlan.focus,
      exercises,
      duration,
      caloriesBurned,
    };
  });

  const goalDescriptions: Record<string, string> = {
    fat_loss: 'High-intensity workouts designed to maximize calorie burn and boost metabolism.',
    muscle_gain: 'Progressive overload focused program to build lean muscle mass.',
    strength: 'Heavy compound movements to increase raw strength and power.',
    general_fitness: 'Balanced program for overall health and fitness improvement.',
  };

  return {
    id: `plan-${Date.now()}`,
    name: `${profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)} ${profile.fitnessGoal.replace('_', ' ').charAt(0).toUpperCase() + profile.fitnessGoal.replace('_', ' ').slice(1)} Program`,
    description: goalDescriptions[profile.fitnessGoal] || goalDescriptions.general_fitness,
    days,
    difficulty: profile.experienceLevel,
    createdAt: new Date(),
  };
};
