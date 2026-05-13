let audioCtx = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

export const setMuted = (muted) => {
  isMuted = muted;
};

// Play a single oscillator tone
const playTone = (freq, type, duration, vol) => {
  if (isMuted) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playClick = () => {
  playTone(600, 'sine', 0.1, 0.05);
};

export const playStart = () => {
  const ctx = getCtx();
  if (isMuted) return;
  if (ctx.state === 'suspended') ctx.resume();
  playTone(440, 'sine', 0.15, 0.08);
  setTimeout(() => playTone(660, 'sine', 0.2, 0.08), 100);
};

export const playPause = () => {
  const ctx = getCtx();
  if (isMuted) return;
  if (ctx.state === 'suspended') ctx.resume();
  playTone(660, 'sine', 0.15, 0.08);
  setTimeout(() => playTone(440, 'sine', 0.2, 0.08), 100);
};

export const playComplete = () => {
  const ctx = getCtx();
  if (isMuted) return;
  if (ctx.state === 'suspended') ctx.resume();
  playTone(523.25, 'sine', 0.2, 0.1); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 150); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.4, 0.1), 300); // G5
  setTimeout(() => playTone(1046.50, 'sine', 0.6, 0.1), 450); // C6
};

export const playTaskDone = () => {
  const ctx = getCtx();
  if (isMuted) return;
  if (ctx.state === 'suspended') ctx.resume();
  playTone(880, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(1760, 'sine', 0.2, 0.05), 100);
};

export const playError = () => {
  playTone(150, 'sawtooth', 0.3, 0.05);
};

