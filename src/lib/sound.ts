/**
 * Let, lokal lydmotor bygget på Web Audio API.
 *
 * Der indlæses ingen eksterne lydfiler — alle effekter synthesiseres,
 * så oplevelsen aldrig afhænger af assets, der kan forsvinde.
 * Lyden er slået fra, indtil brugeren selv aktiverer den.
 */

export type SoundName =
  | "projector"
  | "whoosh"
  | "impact"
  | "tick"
  | "reveal"
  | "success";

type Ctx = AudioContext & { createGain: () => GainNode };

export class SoundEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private projectorNodes: { source: AudioBufferSourceNode; gain: GainNode } | null =
    null;
  private noiseBuffer: AudioBuffer | null = null;

  /** Kaldes kun efter en eksplicit brugerhandling. */
  async enable(): Promise<void> {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC() as Ctx;
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        /* ignoreres — oplevelsen må aldrig blokere på lyd */
      }
    }
  }

  disable(): void {
    this.stopProjector();
    if (this.ctx && this.ctx.state === "running") {
      void this.ctx.suspend().catch(() => undefined);
    }
  }

  dispose(): void {
    this.stopProjector();
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    if (ctx) void ctx.close().catch(() => undefined);
  }

  private get ready(): { ctx: Ctx; master: GainNode } | null {
    if (!this.ctx || !this.master || this.ctx.state !== "running") return null;
    return { ctx: this.ctx, master: this.master };
  }

  private getNoiseBuffer(ctx: Ctx): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  play(name: SoundName): void {
    const ready = this.ready;
    if (!ready) return;
    const { ctx, master } = ready;
    const now = ctx.currentTime;

    switch (name) {
      case "projector":
        this.startProjector();
        return;
      case "whoosh": {
        const source = ctx.createBufferSource();
        source.buffer = this.getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(220, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.55);
        filter.Q.value = 0.9;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.22, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        source.connect(filter).connect(gain).connect(master);
        source.start(now);
        source.stop(now + 0.75);
        return;
      }
      case "impact": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.45, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
        osc.connect(gain).connect(master);
        osc.start(now);
        osc.stop(now + 1.15);

        const noise = ctx.createBufferSource();
        noise.buffer = this.getNoiseBuffer(ctx);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.value = 900;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        noise.connect(noiseFilter).connect(noiseGain).connect(master);
        noise.start(now);
        noise.stop(now + 0.5);
        return;
      }
      case "tick": {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
        osc.connect(gain).connect(master);
        osc.start(now);
        osc.stop(now + 0.3);
        return;
      }
      case "reveal": {
        [196, 294, 392, 494].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          const gain = ctx.createGain();
          const start = now + index * 0.07;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.12, start + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
          osc.connect(gain).connect(master);
          osc.start(start);
          osc.stop(start + 1.7);
        });
        return;
      }
      case "success": {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.value = freq;
          const gain = ctx.createGain();
          const start = now + index * 0.09;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.16, start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
          osc.connect(gain).connect(master);
          osc.start(start);
          osc.stop(start + 1);
        });
        return;
      }
    }
  }

  startProjector(): void {
    const ready = this.ready;
    if (!ready || this.projectorNodes) return;
    const { ctx, master } = ready;
    const now = ctx.currentTime;

    const source = ctx.createBufferSource();
    source.buffer = this.getNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 480;
    filter.Q.value = 0.6;

    const flicker = ctx.createOscillator();
    flicker.type = "sawtooth";
    flicker.frequency.value = 24;
    const flickerGain = ctx.createGain();
    flickerGain.gain.value = 0.035;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 1.2);

    flicker.connect(flickerGain).connect(gain.gain);
    source.connect(filter).connect(gain).connect(master);
    source.start(now);
    flicker.start(now);

    this.projectorNodes = { source, gain };
  }

  stopProjector(): void {
    const nodes = this.projectorNodes;
    this.projectorNodes = null;
    if (!nodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      nodes.gain.gain.cancelScheduledValues(now);
      nodes.gain.gain.setValueAtTime(Math.max(nodes.gain.gain.value, 0.0001), now);
      nodes.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      nodes.source.stop(now + 0.45);
    } catch {
      /* noden kan allerede være stoppet */
    }
  }
}
