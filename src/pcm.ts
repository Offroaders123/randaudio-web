import WavEncoder, { type AudioData } from "wav-encoder";

export interface PCMPluginOptions {
  sampleRate?: number;
  duration?: number;
}

export type PCMPlugin = (options: PCMPluginOptions) => AudioData;

export function buildSound(plugin: PCMPlugin, options: PCMPluginOptions): AudioData {
  return plugin(options);
}

/**
 * Encodes a Float32Array of audio samples to a WAV Blob using wav-encoder.
 */
export function encodeWav(audioData: AudioData): Blob {
  const wavBuffer: ArrayBuffer = WavEncoder.encode.sync(audioData);
  return new Blob([wavBuffer], { type: "audio/wav" });
}
