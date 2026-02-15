import { useCallback, useEffect, useRef } from "react";
import correctMp3 from "../assets/sound/correct.mp3";

export function useCorrectSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const rawDataRef = useRef<ArrayBuffer | null>(null);

  // Pre-fetch raw audio data on mount (no AudioContext or user gesture needed)
  useEffect(() => {
    fetch(correctMp3)
      .then((res) => res.arrayBuffer())
      .then((arr) => {
        rawDataRef.current = arr;
      })
      .catch((err) => console.warn("Failed to fetch correct sound:", err));
  }, []);

  const play = useCallback(async () => {
    try {
      // Lazily create AudioContext on user gesture (click) so browsers allow it
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Decode on first play (clone buffer since decodeAudioData detaches it)
      if (!bufferRef.current && rawDataRef.current) {
        bufferRef.current = await ctx.decodeAudioData(
          rawDataRef.current.slice(0)
        );
      }

      const buffer = bufferRef.current;
      if (!buffer) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.value = 0.6;
      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(0, 0, 2);
    } catch (err) {
      console.warn("Failed to play correct sound:", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return play;
}
