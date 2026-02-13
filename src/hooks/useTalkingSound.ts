import { useCallback, useEffect, useRef } from "react";
import talkingMp3 from "../assets/sound/talking.mp3";

const SEGMENT_DURATION = 1.5; // seconds

export function useTalkingSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef(false);
  const segmentCountRef = useRef(0);
  const initStartedRef = useRef(false);

  /**
   * Must be called from a direct user-gesture handler (click, etc.)
   * to satisfy browser autoplay policy. Creates & resumes the
   * AudioContext, then fetches + decodes the MP3.
   */
  const init = useCallback(async () => {
    if (initStartedRef.current) {
      // Already initialized — just make sure context is running
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return;
    }
    initStartedRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Resume immediately — we're inside a click handler so this works
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const res = await fetch(talkingMp3);
      const arr = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arr);

      bufferRef.current = decoded;
      segmentCountRef.current = Math.floor(
        decoded.duration / SEGMENT_DURATION
      );
    } catch (err) {
      console.warn("Failed to load talking sound:", err);
    }
  }, []);

  const playSegment = useCallback(() => {
    const ctx = audioCtxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer || segmentCountRef.current === 0) return;

    // Throttle: skip if a segment is already playing
    if (isPlayingRef.current) return;

    // Don't attempt to play if context isn't running
    if (ctx.state !== "running") return;

    isPlayingRef.current = true;

    const idx = Math.floor(Math.random() * segmentCountRef.current);
    const offset = idx * SEGMENT_DURATION;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0, offset, SEGMENT_DURATION);

    sourceRef.current = source;

    source.onended = () => {
      isPlayingRef.current = false;
    };

    // Safety fallback: reset flag even if onended doesn't fire
    setTimeout(() => {
      isPlayingRef.current = false;
    }, SEGMENT_DURATION * 1000 + 100);
  }, []);

  const stop = useCallback(() => {
    try {
      sourceRef.current?.stop();
    } catch {
      // Already stopped
    }
    sourceRef.current = null;
    isPlayingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        sourceRef.current?.stop();
      } catch {
        // Already stopped
      }
      audioCtxRef.current?.close();
    };
  }, []);

  return { playSegment, stop, init };
}
