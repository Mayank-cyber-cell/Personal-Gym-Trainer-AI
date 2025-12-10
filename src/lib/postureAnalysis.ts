import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export interface PostureFeedback {
  isCorrect: boolean;
  message: string;
  severity: 'good' | 'warning' | 'error';
  bodyPart: string;
}

export interface ExercisePosture {
  name: string;
  checkPoints: (landmarks: any[]) => PostureFeedback[];
}

// Calculate angle between three points
export const calculateAngle = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
  point3: { x: number; y: number }
): number => {
  const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                  Math.atan2(point1.y - point2.y, point1.x - point2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

// MediaPipe landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

// Exercise-specific posture checks
export const exerciseChecks: Record<string, (landmarks: any[]) => PostureFeedback[]> = {
  squat: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check knee angle (should be around 90 degrees at bottom)
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
    
    if (avgKneeAngle > 160) {
      feedback.push({
        isCorrect: false,
        message: "Go deeper! Bend your knees more.",
        severity: 'warning',
        bodyPart: 'knees'
      });
    } else if (avgKneeAngle < 70) {
      feedback.push({
        isCorrect: false,
        message: "Don't go too deep, protect your knees!",
        severity: 'error',
        bodyPart: 'knees'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Great knee depth!",
        severity: 'good',
        bodyPart: 'knees'
      });
    }
    
    // Check back straightness (hip-shoulder-ear alignment)
    const backAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_EAR]
    );
    
    if (backAngle < 160) {
      feedback.push({
        isCorrect: false,
        message: "Keep your back straight! Don't lean forward too much.",
        severity: 'error',
        bodyPart: 'back'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Back position looks good!",
        severity: 'good',
        bodyPart: 'back'
      });
    }
    
    return feedback;
  },
  
  pushup: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check elbow angle
    const leftElbowAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_ELBOW],
      landmarks[POSE_LANDMARKS.LEFT_WRIST]
    );
    
    if (leftElbowAngle > 160) {
      feedback.push({
        isCorrect: false,
        message: "Lower yourself! Bend your elbows more.",
        severity: 'warning',
        bodyPart: 'arms'
      });
    } else if (leftElbowAngle < 70) {
      feedback.push({
        isCorrect: true,
        message: "Great depth on the push-up!",
        severity: 'good',
        bodyPart: 'arms'
      });
    }
    
    // Check body alignment (should be straight)
    const bodyAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE]
    );
    
    if (bodyAngle < 160) {
      feedback.push({
        isCorrect: false,
        message: "Keep your body straight! Don't let your hips sag.",
        severity: 'error',
        bodyPart: 'core'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Great body alignment!",
        severity: 'good',
        bodyPart: 'core'
      });
    }
    
    return feedback;
  },
  
  plank: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check body alignment
    const bodyAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE]
    );
    
    if (bodyAngle < 165) {
      feedback.push({
        isCorrect: false,
        message: "Your hips are sagging! Engage your core.",
        severity: 'error',
        bodyPart: 'core'
      });
    } else if (bodyAngle > 185) {
      feedback.push({
        isCorrect: false,
        message: "Your hips are too high! Lower them down.",
        severity: 'warning',
        bodyPart: 'core'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Perfect plank position!",
        severity: 'good',
        bodyPart: 'core'
      });
    }
    
    // Check shoulder alignment
    const shoulderHipDiff = Math.abs(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y - 
      landmarks[POSE_LANDMARKS.LEFT_HIP].y
    );
    
    if (shoulderHipDiff > 0.15) {
      feedback.push({
        isCorrect: false,
        message: "Align your shoulders over your elbows.",
        severity: 'warning',
        bodyPart: 'shoulders'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Shoulder position is good!",
        severity: 'good',
        bodyPart: 'shoulders'
      });
    }
    
    return feedback;
  },
  
  lunge: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check front knee angle
    const frontKneeAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE]
    );
    
    if (frontKneeAngle < 80) {
      feedback.push({
        isCorrect: false,
        message: "Front knee too bent! Don't let it go past your toes.",
        severity: 'error',
        bodyPart: 'front knee'
      });
    } else if (frontKneeAngle > 120) {
      feedback.push({
        isCorrect: false,
        message: "Go deeper into the lunge!",
        severity: 'warning',
        bodyPart: 'front knee'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Great lunge depth!",
        severity: 'good',
        bodyPart: 'front knee'
      });
    }
    
    // Check torso uprightness
    const torsoAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      { x: landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x, y: 0 }
    );
    
    if (torsoAngle > 20) {
      feedback.push({
        isCorrect: false,
        message: "Keep your torso upright!",
        severity: 'warning',
        bodyPart: 'torso'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good torso position!",
        severity: 'good',
        bodyPart: 'torso'
      });
    }
    
    return feedback;
  },
  
  deadlift: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check hip hinge angle
    const hipAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE]
    );
    
    if (hipAngle < 90) {
      feedback.push({
        isCorrect: false,
        message: "Don't round your back! Keep it straight.",
        severity: 'error',
        bodyPart: 'back'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good back position!",
        severity: 'good',
        bodyPart: 'back'
      });
    }
    
    // Check knee position
    const kneeAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE]
    );
    
    if (kneeAngle < 100) {
      feedback.push({
        isCorrect: false,
        message: "Don't squat the deadlift! Keep knees slightly bent.",
        severity: 'warning',
        bodyPart: 'knees'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good knee position!",
        severity: 'good',
        bodyPart: 'knees'
      });
    }
    
    return feedback;
  },
  
  shoulderpress: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check elbow position
    const leftElbowAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_ELBOW],
      landmarks[POSE_LANDMARKS.LEFT_WRIST]
    );
    
    if (leftElbowAngle < 80) {
      feedback.push({
        isCorrect: false,
        message: "Press higher! Extend your arms more.",
        severity: 'warning',
        bodyPart: 'arms'
      });
    } else if (leftElbowAngle > 170) {
      feedback.push({
        isCorrect: true,
        message: "Great lockout!",
        severity: 'good',
        bodyPart: 'arms'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good range of motion!",
        severity: 'good',
        bodyPart: 'arms'
      });
    }
    
    // Check for excessive back arch
    const backAngle = calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE]
    );
    
    if (backAngle < 160) {
      feedback.push({
        isCorrect: false,
        message: "Don't lean back! Keep your core tight.",
        severity: 'error',
        bodyPart: 'core'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Core engagement looks good!",
        severity: 'good',
        bodyPart: 'core'
      });
    }
    
    return feedback;
  },
  
  bicepcurl: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check elbow position - should stay close to body
    const elbowShoulderDist = Math.abs(
      landmarks[POSE_LANDMARKS.LEFT_ELBOW].x - 
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x
    );
    
    if (elbowShoulderDist > 0.15) {
      feedback.push({
        isCorrect: false,
        message: "Keep your elbows tucked close to your body!",
        severity: 'warning',
        bodyPart: 'arms'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good elbow position!",
        severity: 'good',
        bodyPart: 'arms'
      });
    }
    
    // Check for body swinging
    const shoulderHipAlignment = Math.abs(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x - 
      landmarks[POSE_LANDMARKS.LEFT_HIP].x
    );
    
    if (shoulderHipAlignment > 0.08) {
      feedback.push({
        isCorrect: false,
        message: "Don't swing! Keep your body still.",
        severity: 'error',
        bodyPart: 'core'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Good form - no swinging!",
        severity: 'good',
        bodyPart: 'core'
      });
    }
    
    return feedback;
  },
  
  general: (landmarks) => {
    const feedback: PostureFeedback[] = [];
    
    // Check overall posture - shoulder alignment
    const shoulderDiff = Math.abs(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y - 
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y
    );
    
    if (shoulderDiff > 0.05) {
      feedback.push({
        isCorrect: false,
        message: "Level your shoulders - one is higher than the other.",
        severity: 'warning',
        bodyPart: 'shoulders'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Shoulders are level!",
        severity: 'good',
        bodyPart: 'shoulders'
      });
    }
    
    // Check hip alignment
    const hipDiff = Math.abs(
      landmarks[POSE_LANDMARKS.LEFT_HIP].y - 
      landmarks[POSE_LANDMARKS.RIGHT_HIP].y
    );
    
    if (hipDiff > 0.05) {
      feedback.push({
        isCorrect: false,
        message: "Level your hips - keep them even.",
        severity: 'warning',
        bodyPart: 'hips'
      });
    } else {
      feedback.push({
        isCorrect: true,
        message: "Hip alignment is good!",
        severity: 'good',
        bodyPart: 'hips'
      });
    }
    
    return feedback;
  }
};

// Initialize PoseLandmarker
export const initializePoseLandmarker = async (): Promise<PoseLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  
  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numPoses: 1
  });
  
  return poseLandmarker;
};

// Draw pose landmarks on canvas
export const drawPoseLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  feedback: PostureFeedback[]
) => {
  const drawingUtils = new DrawingUtils(ctx);
  
  // Draw connections
  drawingUtils.drawConnectors(
    landmarks,
    PoseLandmarker.POSE_CONNECTIONS,
    { color: '#C8FA14', lineWidth: 3 }
  );
  
  // Draw landmarks with feedback colors
  landmarks.forEach((landmark, index) => {
    const relevantFeedback = feedback.find(f => {
      const bodyPartLandmarks: Record<string, number[]> = {
        'knees': [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE],
        'back': [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
        'arms': [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.RIGHT_WRIST],
        'core': [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
        'shoulders': [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
        'hips': [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
        'front knee': [POSE_LANDMARKS.LEFT_KNEE],
        'torso': [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP]
      };
      return bodyPartLandmarks[f.bodyPart]?.includes(index);
    });
    
    let color = '#C8FA14'; // Default lime
    if (relevantFeedback) {
      if (relevantFeedback.severity === 'error') color = '#FF6B6B';
      else if (relevantFeedback.severity === 'warning') color = '#FFB347';
      else if (relevantFeedback.severity === 'good') color = '#4ECDC4';
    }
    
    ctx.beginPath();
    ctx.arc(
      landmark.x * ctx.canvas.width,
      landmark.y * ctx.canvas.height,
      6,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color;
    ctx.fill();
  });
};
