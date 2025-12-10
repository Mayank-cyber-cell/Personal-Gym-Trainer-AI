import { useState, useCallback, useRef, useEffect } from 'react';

export type VoicePersona = 'coach' | 'drill-sergeant' | 'zen-master';

interface PersonaConfig {
  name: string;
  rate: number;
  pitch: number;
  volume: number;
  icon: string;
}

export const VOICE_PERSONAS: Record<VoicePersona, PersonaConfig> = {
  'coach': {
    name: 'Coach',
    rate: 1,
    pitch: 1,
    volume: 1,
    icon: '🏋️'
  },
  'drill-sergeant': {
    name: 'Drill Sergeant',
    rate: 1.15,
    pitch: 0.85,
    volume: 1,
    icon: '🎖️'
  },
  'zen-master': {
    name: 'Zen Master',
    rate: 0.85,
    pitch: 1.1,
    volume: 0.9,
    icon: '🧘'
  }
};

interface VoiceCueOptions {
  persona?: VoicePersona;
}

export const useVoiceCues = (options: VoiceCueOptions = {}) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('voiceCuesEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [persona, setPersona] = useState<VoicePersona>(() => {
    const saved = localStorage.getItem('voicePersona');
    return (saved as VoicePersona) || options.persona || 'coach';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('voiceCuesEnabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('voicePersona', persona);
  }, [persona]);

  const speak = useCallback((text: string, force = false) => {
    if (!isEnabled && !force) return;
    
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const config = VOICE_PERSONAS[persona];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Natural')
    ) || voices.find(voice => 
      voice.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isEnabled, persona]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    speak,
    stop,
    isEnabled,
    isSpeaking,
    toggle,
    setIsEnabled,
    persona,
    setPersona
  };
};

// Persona-specific message generators
const createPersonaMessages = (persona: VoicePersona) => ({
  restStart: (duration: number) => {
    switch (persona) {
      case 'drill-sergeant':
        return `Drop and recover, soldier! You've got ${duration} seconds. Hydrate and stay sharp!`;
      case 'zen-master':
        return `Breathe deeply. Allow ${duration} seconds of peaceful restoration. Feel your energy returning.`;
      default:
        return `Rest time. Take ${duration} seconds to recover. Stay hydrated and breathe deeply.`;
    }
  },
  
  restEnd: () => {
    switch (persona) {
      case 'drill-sergeant':
        return `Time's up! On your feet! No excuses, let's go!`;
      case 'zen-master':
        return `Gently return your focus. Your next movement awaits with calm intention.`;
      default:
        return `Rest complete. Get ready for your next set. Stay focused and maintain good form.`;
    }
  },
  
  restWarning: (seconds: number) => {
    switch (persona) {
      case 'drill-sergeant':
        return `${seconds} seconds! Move it!`;
      case 'zen-master':
        return `${seconds} peaceful seconds remain.`;
      default:
        return `${seconds} seconds remaining.`;
    }
  },
  
  exerciseAnnouncement: (
    name: string, 
    sets: number, 
    reps: number | string, 
    tips?: string
  ) => {
    const repText = typeof reps === 'number' ? `${reps} reps` : reps;
    
    switch (persona) {
      case 'drill-sergeant':
        return `Listen up! ${name}! ${sets} sets, ${repText}! ${tips ? `Remember: ${tips}` : 'Give me everything you got!'}`;
      case 'zen-master':
        return `Mindfully prepare for ${name}. ${sets} sets of ${repText}. ${tips ? `Focus on: ${tips}` : 'Move with intention and grace.'}`;
      default:
        return `Next exercise: ${name}. ${sets} sets of ${repText}. ${tips ? `Tip: ${tips}` : 'You got this!'}`;
    }
  },
  
  workoutStart: (focus: string, exerciseCount: number) => {
    switch (persona) {
      case 'drill-sergeant':
        return `Attention! ${focus} workout begins now! ${exerciseCount} exercises! No surrender!`;
      case 'zen-master':
        return `Welcome to your ${focus} practice. ${exerciseCount} mindful exercises await. Center yourself and begin.`;
      default:
        return `Starting ${focus} workout. ${exerciseCount} exercises ahead. Let's crush it!`;
    }
  },
  
  workoutComplete: () => {
    switch (persona) {
      case 'drill-sergeant':
        return `Outstanding performance, soldier! Mission accomplished! Now hit the showers!`;
      case 'zen-master':
        return `Namaste. Your practice is complete. Honor your body's effort and rest peacefully.`;
      default:
        return `Congratulations! Workout complete. Great job today. Remember to stretch and recover.`;
    }
  },
  
  exerciseComplete: (name: string) => {
    switch (persona) {
      case 'drill-sergeant':
        return `${name} crushed! That's what I'm talking about!`;
      case 'zen-master':
        return `${name} complete. Acknowledge your accomplishment with gratitude.`;
      default:
        return `${name} complete. Well done!`;
    }
  }
});

// Export a function that returns messages based on persona
export const getVoiceCueMessages = (persona: VoicePersona) => createPersonaMessages(persona);

// Default messages (coach persona) for backwards compatibility
export const VoiceCueMessages = createPersonaMessages('coach');
