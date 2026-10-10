/**
 * A tiny synthesiser built on the Web Audio API.
 *
 * Every sound is generated in code, so the site never depends on audio files
 * that could go missing. The AudioContext is only created after an explicit
 * user interaction (browsers block audio before that anyway).
 *
 * To add a sound: add a name to `SoundName` and a recipe to `recipes`.
 */

export type SoundName =
  | "open"
  | "start"
  | "tap"
  | "whoosh"
  | "success"
  | "wrong"
  | "complete"
  | "tick"
  | "reveal"
  | "envelope"
  | "celebrate";

type AudioContextConstructor = typeof AudioContext;

interface ToneOptions {
  type?: OscillatorType;
  gain?: number;
  attack?: number;
  endFrequency?: number;
  detune?: number;
}

interface NoiseOptions {
  filter?: BiquadFilterType;
  from: number;
  to?: number;
  q?: number;
  gain?: number;
  attack?: number;
}

function getAudioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const legacy = (window as unknown as { webkitAudioContext?: AudioContextConstructor })
    .webkitAudioContext;
  return window.AudioContext ?? legacy ?? null;
}

class SoundEngine {
  private context: AudioContext | null = null;
  private output: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  /** Creates or resumes the audio context. Call from a user gesture. */
  unlock(): boolean {
    try {
      if (!this.context) {
        const Ctor = getAudioContextConstructor();
        if (!Ctor) return false;

        const context = new Ctor();
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -16;
        compressor.knee.value = 14;
        compressor.ratio.value = 4;

        const output = context.createGain();
        output.gain.value = 0.75;
        output.connect(compressor);
        compressor.connect(context.destination);

        const length = context.sampleRate * 2;
        const buffer = context.createBuffer(1, length, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

        this.context = context;
        this.output = output;
        this.noiseBuffer = buffer;
      }

      if (this.context.state === "suspended") {
        this.context.resume().catch(() => undefined);
      }
      return true;
    } catch {
      return false;
    }
  }

  play(name: SoundName) {
    if (!this.context || !this.output) return;
    if (this.context.state === "suspended") {
      this.context.resume().catch(() => undefined);
    }
    try {
      recipes[name](this, this.context.currentTime + 0.02);
    } catch {
      // Sound is a bonus – never let it break the experience.
    }
  }

  tone(frequency: number, start: number, duration: number, options: ToneOptions = {}) {
    const { context, output } = this;
    if (!context || !output) return;

    const oscillator = context.createOscillator();
    oscillator.type = options.type ?? "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    if (options.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, start + duration);
    }
    if (options.detune) oscillator.detune.value = options.detune;

    const envelope = context.createGain();
    const peak = options.gain ?? 0.1;
    const attack = options.attack ?? 0.01;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  noise(start: number, duration: number, options: NoiseOptions) {
    const { context, output, noiseBuffer } = this;
    if (!context || !output || !noiseBuffer) return;

    const source = context.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = context.createBiquadFilter();
    filter.type = options.filter ?? "bandpass";
    filter.frequency.setValueAtTime(options.from, start);
    if (options.to) filter.frequency.exponentialRampToValueAtTime(options.to, start + duration);
    filter.Q.value = options.q ?? 1;

    const envelope = context.createGain();
    const peak = options.gain ?? 0.08;
    const attack = options.attack ?? duration * 0.4;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    source.start(start, Math.random() * 1.5);
    source.stop(start + duration + 0.05);
  }
}

const NOTE = {
  A1: 55,
  E2: 82.41,
  A2: 110,
  G4: 392,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  A5: 880,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
  A6: 1760,
  C7: 2093,
} as const;

const recipes: Record<SoundName, (engine: SoundEngine, t: number) => void> = {
  // A low cinematic swell with a sparkle on top.
  open(engine, t) {
    engine.tone(NOTE.A1, t, 2.8, { gain: 0.22, attack: 0.9 });
    engine.tone(NOTE.E2, t, 2.6, { gain: 0.12, attack: 1, detune: 4 });
    engine.noise(t, 1.8, { filter: "lowpass", from: 300, to: 2400, gain: 0.05, attack: 1.2 });
    [NOTE.A5, NOTE.E6, NOTE.A6].forEach((note, i) =>
      engine.tone(note, t + 0.9 + i * 0.18, 1.6, { type: "triangle", gain: 0.035, attack: 0.02 }),
    );
  },
  start(engine, t) {
    engine.noise(t, 0.7, { filter: "bandpass", from: 400, to: 3800, q: 0.8, gain: 0.09 });
    engine.tone(NOTE.A2, t, 1.4, { gain: 0.16, attack: 0.15 });
    engine.tone(NOTE.E5, t + 0.2, 0.9, { type: "triangle", gain: 0.06 });
    engine.tone(NOTE.A5, t + 0.32, 1.2, { type: "triangle", gain: 0.05 });
  },
  tap(engine, t) {
    engine.tone(NOTE.E5, t, 0.12, { type: "triangle", gain: 0.06 });
  },
  whoosh(engine, t) {
    engine.noise(t, 0.6, { filter: "bandpass", from: 250, to: 3200, q: 0.7, gain: 0.08 });
  },
  success(engine, t) {
    engine.tone(NOTE.G5, t, 0.5, { type: "triangle", gain: 0.11 });
    engine.tone(NOTE.D6, t + 0.09, 0.7, { type: "triangle", gain: 0.09 });
    engine.tone(NOTE.G6, t + 0.17, 0.9, { gain: 0.03 });
  },
  wrong(engine, t) {
    engine.tone(330, t, 0.16, { gain: 0.08, endFrequency: 290 });
    engine.tone(262, t + 0.15, 0.28, { gain: 0.08, endFrequency: 220 });
  },
  complete(engine, t) {
    [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((note, i) =>
      engine.tone(note, t + i * 0.08, 0.9 + i * 0.12, { type: "triangle", gain: 0.08 }),
    );
    engine.noise(t + 0.35, 0.5, { filter: "highpass", from: 5000, gain: 0.03 });
  },
  // A projector-style tick for the countdown.
  tick(engine, t) {
    engine.noise(t, 0.05, { filter: "highpass", from: 2500, gain: 0.12, attack: 0.004 });
    engine.tone(150, t, 0.22, { gain: 0.2, endFrequency: 70 });
  },
  reveal(engine, t) {
    engine.tone(55, t, 1.6, { gain: 0.28, endFrequency: 40, attack: 0.02 });
    engine.noise(t, 1.4, { filter: "lowpass", from: 600, to: 7000, gain: 0.07, attack: 0.1 });
    [NOTE.C6, NOTE.E6, NOTE.G6, NOTE.C7].forEach((note, i) =>
      engine.tone(note, t + 0.1 + i * 0.07, 2.4, { gain: 0.035, attack: 0.03 }),
    );
  },
  envelope(engine, t) {
    engine.noise(t, 0.18, { filter: "bandpass", from: 2400, to: 3600, q: 1.4, gain: 0.07 });
    engine.noise(t + 0.2, 0.35, { filter: "bandpass", from: 1600, to: 4200, q: 1, gain: 0.05 });
  },
  celebrate(engine, t) {
    engine.noise(t, 0.12, { filter: "bandpass", from: 900, gain: 0.16, attack: 0.005 });
    engine.noise(t + 0.18, 0.12, { filter: "bandpass", from: 1200, gain: 0.12, attack: 0.005 });
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6].forEach((note, i) =>
      engine.tone(note, t + 0.12 + i * 0.07, 1 + i * 0.1, { type: "triangle", gain: 0.07 }),
    );
    engine.tone(NOTE.C7, t + 0.6, 1.8, { gain: 0.03 });
  },
};

export const soundEngine = new SoundEngine();
