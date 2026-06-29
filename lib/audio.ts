import type { TimerSoundType, AmbientSound } from "@/types";

let ctx: AudioContext | null = null;

/** Lazily created on first user gesture, per browser autoplay policy. */
function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function playTone(
  audioCtx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  peakGain = 0.2
): void {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(peakGain, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playBeep(type: TimerSoundType): void {
  if (type === "silent") return;
  const audioCtx = getAudioContext();
  const now = audioCtx.currentTime;
  if (type === "bell") {
    playTone(audioCtx, 880, now, 0.6, "sine", 0.25);
    playTone(audioCtx, 1320, now + 0.05, 0.5, "sine", 0.12);
  } else if (type === "digital") {
    playTone(audioCtx, 660, now, 0.12, "square", 0.15);
    playTone(audioCtx, 660, now + 0.18, 0.12, "square", 0.15);
    playTone(audioCtx, 660, now + 0.36, 0.12, "square", 0.15);
  }
}

export function playCompletionChime(): void {
  const audioCtx = getAudioContext();
  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    playTone(audioCtx, freq, now + i * 0.1, 0.35, "sine", 0.18);
  });
}

function createNoiseBuffer(audioCtx: AudioContext, kind: "white" | "brown"): AudioBuffer {
  const length = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

export interface AmbientHandle {
  stop: () => void;
  setVolume: (volume: number) => void;
}

export function createAmbientLoop(sound: AmbientSound, volume = 0.3): AmbientHandle | null {
  if (sound === "none") return null;

  const audioCtx = getAudioContext();
  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  let filter: BiquadFilterNode | null = null;

  if (sound === "white") {
    source.buffer = createNoiseBuffer(audioCtx, "white");
  } else if (sound === "brown") {
    source.buffer = createNoiseBuffer(audioCtx, "brown");
  } else if (sound === "rain") {
    source.buffer = createNoiseBuffer(audioCtx, "white");
    filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1000;
  } else {
    // lofi: filtered brown noise approximates a soft room hum
    source.buffer = createNoiseBuffer(audioCtx, "brown");
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
  }

  source.loop = true;
  if (filter) {
    source.connect(filter);
    filter.connect(gain);
  } else {
    source.connect(gain);
  }
  gain.connect(audioCtx.destination);
  source.start();

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
      source.disconnect();
      filter?.disconnect();
      gain.disconnect();
    },
    setVolume: (v: number) => {
      gain.gain.value = v;
    },
  };
}
