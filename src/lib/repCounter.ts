import { calculateAngle, POSE_LANDMARKS } from './postureAnalysis';

export type ExerciseState = 'up' | 'down' | 'neutral';

export interface RepCounterState {
  count: number;
  currentState: ExerciseState;
  lastState: ExerciseState;
}

// Thresholds for each exercise
const exerciseThresholds: Record<string, { upAngle: number; downAngle: number }> = {
  squat: { upAngle: 160, downAngle: 100 },
  pushup: { upAngle: 150, downAngle: 90 },
  lunge: { upAngle: 150, downAngle: 100 },
  deadlift: { upAngle: 160, downAngle: 100 },
  shoulderpress: { upAngle: 160, downAngle: 90 },
  bicepcurl: { upAngle: 150, downAngle: 50 },
};

// Detect exercise state based on key angles
export const detectExerciseState = (
  exercise: string,
  landmarks: any[]
): ExerciseState => {
  if (!landmarks || landmarks.length === 0) return 'neutral';

  switch (exercise) {
    case 'squat': {
      const leftKneeAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_HIP],
        landmarks[POSE_LANDMARKS.LEFT_KNEE],
        landmarks[POSE_LANDMARKS.LEFT_ANKLE]
      );
      const rightKneeAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.RIGHT_HIP],
        landmarks[POSE_LANDMARKS.RIGHT_KNEE],
        landmarks[POSE_LANDMARKS.RIGHT_ANKLE]
      );
      const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

      if (avgKneeAngle > exerciseThresholds.squat.upAngle) return 'up';
      if (avgKneeAngle < exerciseThresholds.squat.downAngle) return 'down';
      return 'neutral';
    }

    case 'pushup': {
      const leftElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
        landmarks[POSE_LANDMARKS.LEFT_ELBOW],
        landmarks[POSE_LANDMARKS.LEFT_WRIST]
      );
      const rightElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
        landmarks[POSE_LANDMARKS.RIGHT_WRIST]
      );
      const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

      if (avgElbowAngle > exerciseThresholds.pushup.upAngle) return 'up';
      if (avgElbowAngle < exerciseThresholds.pushup.downAngle) return 'down';
      return 'neutral';
    }

    case 'lunge': {
      const frontKneeAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_HIP],
        landmarks[POSE_LANDMARKS.LEFT_KNEE],
        landmarks[POSE_LANDMARKS.LEFT_ANKLE]
      );

      if (frontKneeAngle > exerciseThresholds.lunge.upAngle) return 'up';
      if (frontKneeAngle < exerciseThresholds.lunge.downAngle) return 'down';
      return 'neutral';
    }

    case 'deadlift': {
      // Track hip hinge - angle between shoulder, hip, and knee
      const leftHipAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
        landmarks[POSE_LANDMARKS.LEFT_HIP],
        landmarks[POSE_LANDMARKS.LEFT_KNEE]
      );
      const rightHipAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS.RIGHT_HIP],
        landmarks[POSE_LANDMARKS.RIGHT_KNEE]
      );
      const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;

      if (avgHipAngle > exerciseThresholds.deadlift.upAngle) return 'up';
      if (avgHipAngle < exerciseThresholds.deadlift.downAngle) return 'down';
      return 'neutral';
    }

    case 'shoulderpress': {
      // Track arm extension above head - elbow angle when pressing
      const leftElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
        landmarks[POSE_LANDMARKS.LEFT_ELBOW],
        landmarks[POSE_LANDMARKS.LEFT_WRIST]
      );
      const rightElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
        landmarks[POSE_LANDMARKS.RIGHT_WRIST]
      );
      const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

      // Check if arms are overhead (wrist above shoulder)
      const leftWristAbove = landmarks[POSE_LANDMARKS.LEFT_WRIST].y < landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y;
      const rightWristAbove = landmarks[POSE_LANDMARKS.RIGHT_WRIST].y < landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y;

      if (avgElbowAngle > exerciseThresholds.shoulderpress.upAngle && (leftWristAbove || rightWristAbove)) return 'up';
      if (avgElbowAngle < exerciseThresholds.shoulderpress.downAngle) return 'down';
      return 'neutral';
    }

    case 'bicepcurl': {
      // Track elbow flexion
      const leftElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
        landmarks[POSE_LANDMARKS.LEFT_ELBOW],
        landmarks[POSE_LANDMARKS.LEFT_WRIST]
      );
      const rightElbowAngle = calculateAngle(
        landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
        landmarks[POSE_LANDMARKS.RIGHT_WRIST]
      );
      const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

      if (avgElbowAngle > exerciseThresholds.bicepcurl.upAngle) return 'down'; // Arms extended = down position
      if (avgElbowAngle < exerciseThresholds.bicepcurl.downAngle) return 'up'; // Arms curled = up position
      return 'neutral';
    }

    default:
      return 'neutral';
  }
};

// Update rep count based on state transitions
export const updateRepCount = (
  currentState: ExerciseState,
  repState: RepCounterState
): RepCounterState => {
  // Count a rep when transitioning from down to up
  if (repState.lastState === 'down' && currentState === 'up') {
    return {
      count: repState.count + 1,
      currentState,
      lastState: currentState,
    };
  }

  // Only update lastState if we have a definitive state (not neutral)
  if (currentState !== 'neutral') {
    return {
      ...repState,
      currentState,
      lastState: currentState,
    };
  }

  return {
    ...repState,
    currentState,
  };
};

// Initial state
export const initialRepState: RepCounterState = {
  count: 0,
  currentState: 'neutral',
  lastState: 'neutral',
};
