import type { SoundPlugin } from "./pcm.ts";

export function pcmToTones(pcmData: Uint8Array): SoundPlugin {
  return ({ length, sampleRate, channels }) => {
    const samplesPerTone: number = Math.floor(length / pcmData.length);

    const output: Float32Array[] = Array.from({ length: channels }, () => new Float32Array(length));

    pcmData.forEach((byte, i) => {
      const freq: number = 200 + (byte / 255) * 1800; // 200Hz–2000Hz

      for (let t: number = 0; t < samplesPerTone; t++) {
        const sampleIndex: number = i * samplesPerTone + t;
        const phase: number = (2 * Math.PI * freq * t) / sampleRate;
        const sample: number = Math.sin(phase) * 0.3;

        for (let c: number = 0; c < channels; c++) {
          output[c]![sampleIndex] = sample;
        }
      }
    });

    return output;
  };
}
