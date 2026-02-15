import { motion } from "motion/react";
import MusicPlayer from "./MusicPlayer";
import PhotoCarousel from "./PhotoCarousel";

interface DashboardProps {
  bgRef: React.RefObject<HTMLAudioElement | null>;
}

export default function Dashboard({ bgRef }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MusicPlayer bgRef={bgRef} />
        <PhotoCarousel />
      </div>
    </motion.div>
  );
}
