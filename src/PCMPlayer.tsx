import { createSignal } from "solid-js";
import type { AudioData } from "wav-encoder";
import { buildSound, encodeWav } from "./pcm.ts";
import { pcmToTones } from "./plugins.ts";

export default function PCMPlayer() {
  const [audioSrc, setAudioSrc] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal<boolean>(false);

  function handleGenerate(): void {
    setLoading(true);

    // Sample PCM data — you can replace this with your own buffer
    const examplePCM: Uint8Array<ArrayBuffer> = Uint8Array.from({ length: 30 }, () => Math.floor(Math.random() * 256));
    const toneAudio: AudioData = buildSound(pcmToTones(examplePCM), {
      duration: 4, // 4 seconds total
      sampleRate: 44100,
      channels: 2
    });
    const wavBuffer: Blob = encodeWav(toneAudio);

    setAudioSrc(URL.createObjectURL(wavBuffer));
    setLoading(false);
  }

  return (
    <div style="display: grid; gap: 1em; justify-content: start; justify-items: start;">
      <button
        onclick={handleGenerate}
        disabled={loading()}>
        {loading() ? "Generating..." : "Generate & Play WAV"}
      </button>
      <audio
        controls
        src={audioSrc() ?? undefined}
      />
    </div>
  );
}
