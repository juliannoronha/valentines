import { useState } from "react";
import { motion, useMotionValue } from "motion/react";
import type { PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHoverSound } from "../hooks/useHoverSound";

import img1 from "../assets/pictures/carousel/img1.jpg";
import img2 from "../assets/pictures/carousel/img2.jpg";
import img3 from "../assets/pictures/carousel/img3.jpg";
import img4 from "../assets/pictures/carousel/img4.jpg";
import img5 from "../assets/pictures/carousel/img5.jpg";
import img6 from "../assets/pictures/carousel/img6.jpeg";
import img7 from "../assets/pictures/carousel/img7.jpeg";

const CAROUSEL_IMAGES = [img1, img2, img3, img4, img5, img6, img7];

interface PhotoCarouselProps {
  images?: string[];
}
const GAP = 16;
const DRAG_BUFFER = 30;
const VELOCITY_THRESHOLD = 500;
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function PhotoCarousel({ images = CAROUSEL_IMAGES }: PhotoCarouselProps) {
  const [position, setPosition] = useState(0);
  const x = useMotionValue(0);
  const playHover = useHoverSound();

  const itemCount = images.length;

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
        some of my favorite memories:3
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
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="shrink-0 bg-white border-3 border-black rounded-md flex items-center justify-center overflow-hidden"
              style={{ width: itemWidth, height: itemHeight }}
            >
              <img
                src={src}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation: arrows + dots */}
      <div className="flex items-center justify-center gap-3">
        {/* Left arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, y: 2, boxShadow: "2px 2px 0px #000" }}
          onMouseEnter={playHover}
          onClick={() => setPosition((p) => Math.max(0, p - 1))}
          className="bg-white hover:bg-blue-100 border-3 border-black rounded-md p-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ boxShadow: "4px 4px 0px #000" }}
          disabled={position === 0}
        >
          <ChevronLeft size={16} className="text-black" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
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

        {/* Right arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, y: 2, boxShadow: "2px 2px 0px #000" }}
          onMouseEnter={playHover}
          onClick={() => setPosition((p) => Math.min(itemCount - 1, p + 1))}
          className="bg-white hover:bg-blue-100 border-3 border-black rounded-md p-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ boxShadow: "4px 4px 0px #000" }}
          disabled={position === itemCount - 1}
        >
          <ChevronRight size={16} className="text-black" />
        </motion.button>
      </div>
    </motion.div>
  );
}
