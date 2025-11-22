
// Simple synth for sound effects to avoid external asset dependencies
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let ctx: AudioContext | null = null;

const getContext = () => {
  if (!ctx) {
    ctx = new AudioContextClass();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
};

export const playKeyClick = () => {
  const audioCtx = getContext();
  const t = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Click/Thock sound
  osc.type = 'square';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
  
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(t + 0.05);
  
  // Subtle high frequency click for mechanical feel
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(2000, t);
  gain2.gain.setValueAtTime(0.05, t);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
  
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start();
  osc2.stop(t + 0.02);
};

export const playNotification = () => {
  const audioCtx = getContext();
  const t = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, t);
  osc.frequency.setValueAtTime(800, t + 0.1);
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
  gain.gain.linearRampToValueAtTime(0, t + 0.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(t + 0.4);
};
