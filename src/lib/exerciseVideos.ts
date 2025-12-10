// Exercise demo video library with curated YouTube videos
// Using free fitness tutorial videos from popular fitness channels

export interface ExerciseVideo {
  exerciseId: string;
  exerciseName: string;
  youtubeId: string;
  title: string;
  channel: string;
}

// Curated list of exercise demo videos from popular fitness channels
export const exerciseVideos: Record<string, ExerciseVideo> = {
  // Chest exercises
  'bench-press': {
    exerciseId: 'bench-press',
    exerciseName: 'Barbell Bench Press',
    youtubeId: 'rT7DgCr-3pg',
    title: 'How To Bench Press For Chest Growth',
    channel: 'Jeff Nippard',
  },
  'incline-db-press': {
    exerciseId: 'incline-db-press',
    exerciseName: 'Incline Dumbbell Press',
    youtubeId: '8iPEnn-ltC8',
    title: 'Incline Dumbbell Press Form',
    channel: 'ScottHermanFitness',
  },
  'cable-flyes': {
    exerciseId: 'cable-flyes',
    exerciseName: 'Cable Flyes',
    youtubeId: 'Iwe6AmxVf7o',
    title: 'Cable Chest Fly Tutorial',
    channel: 'Renaissance Periodization',
  },

  // Back exercises
  'deadlift': {
    exerciseId: 'deadlift',
    exerciseName: 'Conventional Deadlift',
    youtubeId: 'op9kVnSso6Q',
    title: 'How To Deadlift Properly',
    channel: 'Alan Thrall',
  },
  'pull-ups': {
    exerciseId: 'pull-ups',
    exerciseName: 'Pull-ups',
    youtubeId: 'eGo4IYlbE5g',
    title: 'Perfect Pull Up Form',
    channel: 'Jeremy Ethier',
  },
  'barbell-row': {
    exerciseId: 'barbell-row',
    exerciseName: 'Barbell Row',
    youtubeId: 'FWJR5Ve8bnQ',
    title: 'Barbell Row Form Guide',
    channel: 'Jeff Nippard',
  },

  // Shoulder exercises
  'ohp': {
    exerciseId: 'ohp',
    exerciseName: 'Overhead Press',
    youtubeId: '_RlRDWO2jfg',
    title: 'Overhead Press Tutorial',
    channel: 'Alan Thrall',
  },
  'lateral-raises': {
    exerciseId: 'lateral-raises',
    exerciseName: 'Lateral Raises',
    youtubeId: '3VcKaXpzqRo',
    title: 'Perfect Lateral Raise Form',
    channel: 'Jeff Nippard',
  },

  // Leg exercises
  'squat': {
    exerciseId: 'squat',
    exerciseName: 'Barbell Back Squat',
    youtubeId: 'bEv6CCg2BC8',
    title: 'How To Squat For Your Body',
    channel: 'Jeff Nippard',
  },
  'rdl': {
    exerciseId: 'rdl',
    exerciseName: 'Romanian Deadlift',
    youtubeId: 'JCXUYuzwNrM',
    title: 'Romanian Deadlift Guide',
    channel: 'Jeff Nippard',
  },
  'leg-press': {
    exerciseId: 'leg-press',
    exerciseName: 'Leg Press',
    youtubeId: 'IZxyjW7MPJQ',
    title: 'Leg Press Form Tips',
    channel: 'Renaissance Periodization',
  },

  // Arm exercises
  'barbell-curl': {
    exerciseId: 'barbell-curl',
    exerciseName: 'Barbell Curl',
    youtubeId: 'kwG2ipFRgfo',
    title: 'Barbell Curl Technique',
    channel: 'Jeff Nippard',
  },
  'tricep-dips': {
    exerciseId: 'tricep-dips',
    exerciseName: 'Tricep Dips',
    youtubeId: '6kALZikXxLc',
    title: 'How To Do Dips Properly',
    channel: 'Jeremy Ethier',
  },

  // Core exercises
  'plank': {
    exerciseId: 'plank',
    exerciseName: 'Plank Hold',
    youtubeId: 'ASdvN_XEl_c',
    title: 'Perfect Plank Form',
    channel: 'Jeff Cavaliere',
  },
  'hanging-leg-raise': {
    exerciseId: 'hanging-leg-raise',
    exerciseName: 'Hanging Leg Raises',
    youtubeId: 'hdng3Nm1x_E',
    title: 'Hanging Leg Raise Tutorial',
    channel: 'Jeff Nippard',
  },

  // Home alternatives
  'push-ups': {
    exerciseId: 'push-ups',
    exerciseName: 'Push-ups',
    youtubeId: 'IODxDxX7oi4',
    title: 'Perfect Push Up Form',
    channel: 'Jeremy Ethier',
  },
  'pike-push-ups': {
    exerciseId: 'pike-push-ups',
    exerciseName: 'Pike Push-ups',
    youtubeId: 'sposDXWEB0A',
    title: 'Pike Push Up Tutorial',
    channel: 'Calisthenicmovement',
  },
  'bulgarian-split-squat': {
    exerciseId: 'bulgarian-split-squat',
    exerciseName: 'Bulgarian Split Squats',
    youtubeId: '2C-uNgKwPLE',
    title: 'Bulgarian Split Squat Guide',
    channel: 'Jeff Nippard',
  },
};

export const getVideoForExercise = (exerciseId: string): ExerciseVideo | null => {
  // First try exact match
  if (exerciseVideos[exerciseId]) {
    return exerciseVideos[exerciseId];
  }
  
  // Try to find by name match (for home alternatives)
  const normalizedId = exerciseId.toLowerCase().replace(/\s+/g, '-');
  return exerciseVideos[normalizedId] || null;
};

export const getVideoUrl = (youtubeId: string): string => {
  return `https://www.youtube.com/embed/${youtubeId}`;
};

export const getThumbnailUrl = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
};
