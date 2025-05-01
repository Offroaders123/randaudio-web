import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import WavEncoder from "wav-encoder";

/**
 * Converts a Uint8Array of PCM bytes into audio by mapping each byte to a frequency.
 * Each frequency becomes a short tone in the output buffer.
 * @param {Uint8Array} pcmData - The raw PCM byte data.
 * @param {number} sampleRate - Audio sample rate (e.g. 44100).
 * @returns {import("wav-encoder").AudioData}
 */
function pcmToToneAudio(pcmData, sampleRate = 44100) {
  const toneDuration = 0.1; // seconds per tone
  const samplesPerTone = Math.floor(sampleRate * toneDuration);
  const totalSamples = samplesPerTone * pcmData.length;

  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  pcmData.forEach((byte, i) => {
    const freq = 200 + (byte / 255) * 1800; // Map 0-255 to 200Hz–2000Hz
    for (let t = 0; t < samplesPerTone; t++) {
      const sampleIndex = i * samplesPerTone + t;
      const phase = (2 * Math.PI * freq * t) / sampleRate;
      const sample = Math.sin(phase) * 0.3;
      left[sampleIndex] = sample;
      right[sampleIndex] = sample;
    }
  });

  return {
    sampleRate,
    channelData: [left, right]
  };
}

// Sample PCM data — you can replace this with your own buffer
const examplePCM = Uint8Array.from({ length: 30 }, () => Math.floor(Math.random() * 256));

const toneAudio = pcmToToneAudio(examplePCM);

const wavBuffer = Buffer.from(await WavEncoder.encode(toneAudio));

await writeFile(join(import.meta.dirname, "pcm-tones.wav"), wavBuffer);
