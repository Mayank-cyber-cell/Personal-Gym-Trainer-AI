import { useRef, useEffect, useState, useCallback } from 'react';
import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { 
  initializePoseLandmarker, 
  exerciseChecks, 
  drawPoseLandmarks,
  PostureFeedback 
} from '@/lib/postureAnalysis';
import { detectExerciseState, updateRepCount, RepCounterState, initialRepState } from '@/lib/repCounter';
import { cn } from '@/lib/utils';
import { Camera, CameraOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebcamPoseDetectorProps {
  selectedExercise: string;
  onFeedbackUpdate: (feedback: PostureFeedback[]) => void;
  onRepUpdate: (repState: RepCounterState) => void;
}

export const WebcamPoseDetector = ({ 
  selectedExercise, 
  onFeedbackUpdate,
  onRepUpdate
}: WebcamPoseDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number>();
  const lastSpokenRef = useRef<string>('');
  const lastSpeakTimeRef = useRef<number>(0);
  const repStateRef = useRef<RepCounterState>(initialRepState);
  const lastRepCountRef = useRef<number>(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Text-to-speech for feedback
  const speakFeedback = useCallback((feedback: PostureFeedback[]) => {
    if (!isVoiceEnabled) return;
    
    const now = Date.now();
    if (now - lastSpeakTimeRef.current < 3000) return; // Throttle to every 3 seconds
    
    const errorFeedback = feedback.find(f => f.severity === 'error');
    const warningFeedback = feedback.find(f => f.severity === 'warning');
    
    const toSpeak = errorFeedback || warningFeedback;
    if (toSpeak && toSpeak.message !== lastSpokenRef.current) {
      const utterance = new SpeechSynthesisUtterance(toSpeak.message);
      utterance.rate = 1.1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      lastSpokenRef.current = toSpeak.message;
      lastSpeakTimeRef.current = now;
    }
  }, [isVoiceEnabled]);

  // Initialize pose landmarker
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        poseLandmarkerRef.current = await initializePoseLandmarker();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize pose landmarker:', err);
        setError('Failed to load pose detection model');
        setIsLoading(false);
      }
    };
    init();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Start/stop camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      // Stop camera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsCameraOn(false);
    } else {
      // Start camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraOn(true);
            detectPose();
          };
        }
      } catch (err) {
        console.error('Failed to access camera:', err);
        setError('Failed to access camera. Please allow camera permissions.');
      }
    }
  };

  // Pose detection loop
  const detectPose = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !poseLandmarkerRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Detect pose
    const startTimeMs = performance.now();
    const results = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      
      // Get feedback for selected exercise
      const checkFunction = exerciseChecks[selectedExercise] || exerciseChecks.general;
      const feedback = checkFunction(landmarks);
      
      // Draw pose with feedback
      drawPoseLandmarks(ctx, landmarks, feedback);
      
      // Update parent component
      onFeedbackUpdate(feedback);
      
      // Rep counting
      const exerciseState = detectExerciseState(selectedExercise, landmarks);
      repStateRef.current = updateRepCount(exerciseState, repStateRef.current);
      
      // Only update parent if rep count changed
      if (repStateRef.current.count !== lastRepCountRef.current) {
        lastRepCountRef.current = repStateRef.current.count;
        // Announce rep completion
        if (isVoiceEnabled && repStateRef.current.count > 0) {
          const utterance = new SpeechSynthesisUtterance(`${repStateRef.current.count}`);
          utterance.rate = 1.2;
          speechSynthesis.speak(utterance);
        }
      }
      onRepUpdate(repStateRef.current);
      
      // Speak feedback
      speakFeedback(feedback);
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  }, [selectedExercise, onFeedbackUpdate, onRepUpdate, speakFeedback, isVoiceEnabled]);

  // Restart detection when exercise changes
  useEffect(() => {
    if (isCameraOn && poseLandmarkerRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      detectPose();
    }
  }, [selectedExercise, isCameraOn, detectPose]);

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Video/Canvas container */}
      <div className="relative aspect-video bg-card rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            !isCameraOn && "hidden"
          )}
        />
        
        {/* Placeholder when camera is off */}
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
            <Camera className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {isLoading ? 'Loading pose detection model...' : 'Camera is off'}
            </p>
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                Click the button below to start
              </p>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading AI model...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          onClick={toggleCamera}
          disabled={isLoading}
          variant={isCameraOn ? "destructive" : "default"}
          size="lg"
        >
          {isCameraOn ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </>
          )}
        </Button>
        
        <Button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          variant="outline"
          size="lg"
        >
          {isVoiceEnabled ? (
            <>
              <Volume2 className="w-5 h-5 mr-2" />
              Voice On
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 mr-2" />
              Voice Off
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
