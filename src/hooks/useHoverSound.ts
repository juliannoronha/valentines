import { useCallback, useEffect, useRef } from "react";
import hoverMp3 from "../assets/sound/hover effect.mp3";

const SEGMENT_DURATION = 1.5;

export function useHoverSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const segmentCountRef = useRef(0);
  const initStartedRef = useRef(false);

  const init = useCallback(async () => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const res = await fetch(hoverMp3);
      const arr = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arr);

      bufferRef.current = decoded;
      segmentCountRef.current = Math.floor(decoded.duration / SEGMENT_DURATION);
    } catch (err) {
      console.warn("Failed to load hover sound:", err);
    }
  }, []);

  // Pre-load the buffer on mount so it's ready when needed
  useEffect(() => {
    init();
  }, [init]);

  const play = useCallback(async () => {
    const ctx = audioCtxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer || segmentCountRef.current === 0) return;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const idx = Math.floor(Math.random() * segmentCountRef.current);
    const offset = idx * SEGMENT_DURATION + 0.25;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    source.connect(gain);
    gain.connect(ctx.destination);

    source.start(0, offset, 0.5);
  }, []);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return play;
}
