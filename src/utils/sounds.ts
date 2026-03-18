// ============================================================
// sounds.ts — Web Audio API sounds (no external files needed)
// ============================================================

let ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext)();
  return ctx;
}

// Short click/tick — for +/- day buttons
export function playTick() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.frequency.setValueAtTime(1200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.04);
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    osc.start(c.currentTime); osc.stop(c.currentTime + 0.06);
  } catch { /* ignore */ }
}

// Bamboo/coin throw — for gieo quẻ
export function playGieoQue() {
  try {
    const c = getCtx();
    // Three quick "clink" sounds
    [0, 0.08, 0.18].forEach(delay => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      // Add some noise character via detune
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900 + Math.random()*200, c.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + delay + 0.12);
      osc.detune.setValueAtTime(Math.random()*30-15, c.currentTime + delay);
      gain.gain.setValueAtTime(0.22, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.14);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(c.currentTime + delay); osc.stop(c.currentTime + delay + 0.15);
    });
  } catch { /* ignore */ }
}

// Soft chime — for saving/success
export function playChime() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, c.currentTime);
    osc.frequency.setValueAtTime(1320, c.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(c.currentTime); osc.stop(c.currentTime + 0.5);
  } catch { /* ignore */ }
}
