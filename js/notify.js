// Generates the "order ready" bell tone with the Web Audio API, so no
// external audio file is needed. This is called ONLY from devices whose
// role is "waiter" (see deviceRole.js) — kitchen/bar screens never call it,
// since they're the ones marking food ready in the first place.

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone(ctx, freq, startAt, duration, peak) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

// A two-note "ding-dong" bell, distinct from any other sound in the app.
function playReadyBell() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    tone(ctx, 880, now, 0.32, 0.2);
    tone(ctx, 659.25, now + 0.16, 0.42, 0.2);
  } catch {
    // Audio can be blocked until the first user gesture on the page —
    // fail silently rather than breaking the UI.
  }
}

export { playReadyBell };
