import type { PCMPlugin } from "./pcm.ts";

export const sineWavePlugin: PCMPlugin<{ frequency?: number; }> = (options) => {
  const sampleRate = options.sampleRate ?? 44100;
  const duration = options.duration ?? 1;
  const frequency = options.frequency ?? 440;
  
  const totalSamples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    buffer[i] = Math.sin(2 * Math.PI * frequency * t) * 0.5;
  }

  return {
    sampleRate,
    channelData: [buffer, buffer]
  };
};
