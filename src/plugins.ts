import type { AudioData } from "wav-encoder";
import type { PCMPlugin } from "./pcm.ts";

/**
 * Converts a Uint8Array of PCM bytes into audio by mapping each byte to a frequency.
 * Each frequency becomes a short tone in the output buffer.
 */
export const pcmToTones: PCMPlugin = ({ sampleRate = 44100 }): AudioData => {
  // Sample PCM data — you can replace this with your own buffer
  const pcmData: Uint8Array<ArrayBuffer> = Uint8Array.from({ length: 30 }, () => Math.floor(Math.random() * 256));
  const toneDuration: number = 0.1; // seconds per tone
  const samplesPerTone: number = Math.floor(sampleRate * toneDuration);
  const totalSamples: number = samplesPerTone * pcmData.length;

  const left: Float32Array<ArrayBuffer> = new Float32Array(totalSamples);
  const right: Float32Array<ArrayBuffer> = new Float32Array(totalSamples);

  pcmData.forEach((byte, i) => {
    const freq: number = 200 + (byte / 255) * 1800; // Map 0-255 to 200Hz–2000Hz
    for (let t: number = 0; t < samplesPerTone; t++) {
      const sampleIndex: number = i * samplesPerTone + t;
      const phase: number = (2 * Math.PI * freq * t) / sampleRate;
      const sample: number = Math.sin(phase) * 0.3;
      left[sampleIndex] = sample;
      right[sampleIndex] = sample;
    }
  });

  return {
    sampleRate,
    channelData: [left, right]
  };
}

/**
 * Generates audio tones based on the Fibonacci sequence.
 * Each Fibonacci number is mapped to a frequency and rendered as a short tone.
 */
export const fibonacciTones: PCMPlugin = ({ sampleRate = 44100 }): AudioData => {
  const fibLength: number = 30;
  const toneDuration: number = 0.1; // seconds per tone
  const samplesPerTone: number = Math.floor(sampleRate * toneDuration);

  // Step 1: Generate Fibonacci sequence
  const fibonacci: number[] = [];
  for (let i: number = 0; i < fibLength; i++) {
    if (i === 0) fibonacci.push(0);
    else if (i === 1) fibonacci.push(1);
    else fibonacci.push(fibonacci[i - 1]! + fibonacci[i - 2]!);
  }

  // Step 2: Normalize Fibonacci numbers to fit within a reasonable frequency range
  const maxFib: number = Math.max(...fibonacci);
  const minFreq: number = 200;   // base frequency
  const maxFreq: number = 2000;  // upper limit

  const totalSamples: number = samplesPerTone * fibLength;
  const left: Float32Array<ArrayBuffer> = new Float32Array(totalSamples);
  const right: Float32Array<ArrayBuffer> = new Float32Array(totalSamples);

  fibonacci.forEach((num, i) => {
    // Map Fibonacci number to frequency
    const freq: number = minFreq + (num / maxFib) * (maxFreq - minFreq);

    for (let t: number = 0; t < samplesPerTone; t++) {
      const sampleIndex: number = i * samplesPerTone + t;
      const phase: number = (2 * Math.PI * freq * t) / sampleRate;
      const sample: number = Math.sin(phase) * 0.3;
      left[sampleIndex] = sample;
      right[sampleIndex] = sample;
    }
  });

  return {
    sampleRate,
    channelData: [left, right]
  };
}
