import { useState } from "react";
import { motion, useMotionValue } from "motion/react";
import type { PanInfo } from "motion/react";
import { Image } from "lucide-react";

interface PhotoCarouselProps {
  images?: string[];
}

const PLACEHOLDER_COUNT = 4;
const GAP = 16;
const DRAG_BUFFER = 30;
const VELOCITY_THRESHOLD = 500;
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function PhotoCarousel({ images = [] }: PhotoCarouselProps) {
  const [position, setPosition] = useState(0);
  const x = useMotionValue(0);

  const hasImages = images.length > 0;
  const itemCount = hasImages ? images.length : PLACEHOLDER_COUNT;

  // Responsive item sizing — the card itself constrains the width
  const itemWidth = 260;
  const itemHeight = 220;
  const trackItemOffset = itemWidth + GAP;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      return Math.max(0, Math.min(next, itemCount - 1));
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.35 }}
      className="bg-blue-200 border-4 border-black rounded-lg p-6 sm:p-8"
      style={{ boxShadow: "6px 6px 0px #000" }}
    >
      {/* Header */}
      <h3
        className="text-xs sm:text-sm text-black mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Our Memories
      </h3>

      {/* Carousel track */}
      <div className="relative overflow-hidden rounded-lg border-3 border-black bg-white/30 mb-5">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: -trackItemOffset * Math.max(itemCount - 1, 0),
            right: 0,
          }}
          style={{ gap: `${GAP}px`, x }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={SPRING_OPTIONS}
        >
          {Array.from({ length: itemCount }).map((_, index) => (
            <motion.div
              key={index}
              className="shrink-0 bg-white border-3 border-black rounded-md flex items-center justify-center overflow-hidden"
              style={{ width: itemWidth, height: itemHeight }}
            >
              {hasImages ? (
                <img
                  src={images[index]}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "auto" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Image size={40} className="text-black/15" />
                  <p
                    className="text-[8px] text-black/30"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                    Photo {index + 1}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: itemCount }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setPosition(index)}
            className="w-3 h-3 border-2 border-black rounded-full cursor-pointer transition-colors"
            style={{
              backgroundColor: position === index ? "#000" : "#fff",
            }}
            animate={{ scale: position === index ? 1.3 : 1 }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
