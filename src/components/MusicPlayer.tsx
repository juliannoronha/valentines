import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useHoverSound } from "../hooks/useHoverSound";

import cover1 from "../assets/sound/background1/cover.png";
import audio1 from "../assets/sound/background1/background.mp3";
import cover2 from "../assets/sound/background2/cover.jpg";
import audio2 from "../assets/sound/background2/background.mp3";
import cover3 from "../assets/sound/background3/cover.jpg";
import audio3 from "../assets/sound/background3/background.mp3";
import cover4 from "../assets/sound/background4/cover.jpg";
import audio4 from "../assets/sound/background4/background.mp3";
import cover5 from "../assets/sound/background5/cover.jpg";
import audio5 from "../assets/sound/background5/background.mp3";
import cover6 from "../assets/sound/background6/cover.jpg";
import audio6 from "../assets/sound/background6/background.mp3";
import cover9 from "../assets/sound/background9/cover.png";
import audio9 from "../assets/sound/background9/background.mp3";

interface MusicPlayerProps {
  bgRef: React.RefObject<HTMLAudioElement | null>;
}

interface Track {
  src: string;
  cover: string;
  title: string;
}

const TRACKS: Track[] = [
  { src: audio1, cover: cover1, title: "Golden - KPop Demon Hunters" },
  { src: audio2, cover: cover2, title: "Sinta - Rob Deniel" },
  { src: audio3, cover: cover3, title: "Favorite Girl - Justin Bieber" },
  { src: audio4, cover: cover4, title: "Just The Way You Are - Bruno Mars" },
  { src: audio5, cover: cover5, title: "Pano - Zack Tabudlo" },
  { src: audio6, cover: cover6, title: "Uhaw - Dilaw" },
  { src: audio9, cover: cover9, title: "Song 7" },
];

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer({ bgRef }: MusicPlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playHover = useHoverSound();

  const track = TRACKS[trackIndex];

  // Sync with audio element events
  useEffect(() => {
    const audio = bgRef.current;
    if (!audio) return;

    setIsPlaying(!audio.paused);
    if (isFinite(audio.duration)) setDuration(audio.duration);

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [bgRef, trackIndex]);

  const switchTrack = useCallback(
    (newIndex: number) => {
      const audio = bgRef.current;
      if (!audio) return;

      const wasPlaying = !audio.paused;
      audio.src = TRACKS[newIndex].src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setTrackIndex(newIndex);

      if (wasPlaying) {
        audio.play();
      }
    },
    [bgRef]
  );

  const togglePlayPause = useCallback(() => {
    const audio = bgRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [bgRef]);

  const skipBack = useCallback(() => {
    const prev = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    switchTrack(prev);
  }, [trackIndex, switchTrack]);

  const skipForward = useCallback(() => {
    const next = (trackIndex + 1) % TRACKS.length;
    switchTrack(next);
  }, [trackIndex, switchTrack]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotate: -2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
      className="bg-pink-200 border-4 border-black rounded-lg p-6 sm:p-8"
      style={{ boxShadow: "6px 6px 0px #000" }}
    >
      {/* Cover Art */}
      <div
        className="mb-5 border-3 border-black rounded-md overflow-hidden"
        style={{ boxShadow: "4px 4px 0px #000" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={track.cover}
            src={track.cover}
            alt="Album cover"
            className="w-full h-40 sm:h-48 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>

      {/* Song Info */}
      <p
        className="text-[8px] text-black/60 mb-1"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Now Playing
      </p>
      <AnimatePresence mode="wait">
        <motion.h3
          key={track.title}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-xs sm:text-sm text-black mb-5"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {track.title}
        </motion.h3>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-4 bg-white border-3 border-black rounded-md overflow-hidden">
          <motion.div
            className="h-full bg-pink-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </div>
        <div
          className="flex justify-between mt-2 text-[8px] text-black/60"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {/* Skip Back */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 2, boxShadow: "2px 2px 0px #000" }}
          onMouseEnter={playHover}
          onClick={skipBack}
          className="bg-blue-200 hover:bg-blue-300 border-3 border-black rounded-md p-3 cursor-pointer transition-colors"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          <SkipBack size={18} className="text-black" fill="black" />
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 2, boxShadow: "2px 2px 0px #000" }}
          onMouseEnter={playHover}
          onClick={togglePlayPause}
          className="bg-purple-300 hover:bg-purple-400 border-3 border-black rounded-md p-4 cursor-pointer transition-colors"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          {isPlaying ? (
            <Pause size={22} className="text-black" fill="black" />
          ) : (
            <Play size={22} className="text-black" fill="black" />
          )}
        </motion.button>

        {/* Skip Forward */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 2, boxShadow: "2px 2px 0px #000" }}
          onMouseEnter={playHover}
          onClick={skipForward}
          className="bg-blue-200 hover:bg-blue-300 border-3 border-black rounded-md p-3 cursor-pointer transition-colors"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          <SkipForward size={18} className="text-black" fill="black" />
        </motion.button>
      </div>

      {/* Footnote */}
      <p
        className="text-center text-[8px] text-black/50 mt-5"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        songs that remind me of you ❤️
      </p>
    </motion.div>
  );
}
