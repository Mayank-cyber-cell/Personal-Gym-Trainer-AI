// Sound effects using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playRepSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};

export const playGoalAchievedSound = () => {
  try {
    const ctx = getAudioContext();
    
    // Play a victory fanfare - ascending notes
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const noteDuration = 0.15;
    
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + index * noteDuration;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });

    // Add a final sustained chord
    const chordNotes = [523.25, 659.25, 783.99];
    const chordStart = ctx.currentTime + notes.length * noteDuration;
    
    chordNotes.forEach((freq) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, chordStart);
      gainNode.gain.linearRampToValueAtTime(0.25, chordStart + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, chordStart + 0.5);

      oscillator.start(chordStart);
      oscillator.stop(chordStart + 0.5);
    });
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};
