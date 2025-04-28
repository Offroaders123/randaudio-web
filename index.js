import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import WavEncoder from "wav-encoder";

/** @type {import("wav-encoder").AudioData} */
const whiteNoise1sec = {
  sampleRate: 44100,
  channelData: [
    new Float32Array(44100).map(() => Math.random() - 0.5),
    new Float32Array(44100).map(() => Math.random() - 0.5)
  ]
};

/** @type {Buffer} */
const noise = Buffer.from(await WavEncoder.encode(whiteNoise1sec));

await writeFile(join(import.meta.dirname, "noise.wav"), noise);
