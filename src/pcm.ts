import WavEncoder, { type AudioData } from "wav-encoder";

export type SoundPlugin = (opts: { length: number; sampleRate: number; channels: number; }) => Float32Array[];

export interface BuildOptions {
  /** in seconds */
  duration: number;
  /** default 44100 */
  sampleRate?: number;
  /** default 2 */
  channels?: number;
}

export function buildSound(plugin: SoundPlugin, { duration, sampleRate = 44100, channels = 2 }: BuildOptions): AudioData {
  const totalSamples: number = Math.floor(duration * sampleRate);

  const channelData: Float32Array[] = plugin({
    length: totalSamples,
    sampleRate,
    channels
  });

  if (channelData.length !== channels) {
    throw new Error(`Plugin returned ${channelData.length} channels but expected ${channels}`);
  }

  return {
    sampleRate,
    channelData
  };
}

/**
 * Encodes a Float32Array of audio samples to a WAV Blob using wav-encoder.
 */
export function encodeWav(audioData: AudioData): Blob {
  const wavBuffer: ArrayBuffer = WavEncoder.encode.sync(audioData);
  return new Blob([wavBuffer], { type: "audio/wav" });
}
