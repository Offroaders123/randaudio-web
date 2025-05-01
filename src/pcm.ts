import WavEncoder, { type AudioData } from "wav-encoder";

export interface PCMPluginOptions {
  sampleRate?: number;
  duration?: number;
}

export type PCMPlugin<T extends object = {}> = (options: PCMPluginOptions & T) => AudioData;

export function buildSound<T extends PCMPlugin>(plugin: T, options: Parameters<T>[0]): AudioData {
  return plugin(options);
}

/**
 * Encodes a Float32Array of audio samples to a WAV Blob using wav-encoder.
 */
export function encodeWav(audioData: AudioData): Blob {
  const wavBuffer: ArrayBuffer = WavEncoder.encode.sync(audioData);
  return new Blob([wavBuffer], { type: "audio/wav" });
}
