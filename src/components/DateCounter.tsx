import { useState, useEffect } from "react";
import { motion } from "motion/react";

const TOGETHER_SINCE = new Date(2025, 5, 23); // June 23, 2025

function getTimeSince(start: Date) {
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30.44);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  return { totalDays, months, hours, minutes };
}

export default function DateCounter() {
  const [time, setTime] = useState(() => getTimeSince(TOGETHER_SINCE));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeSince(TOGETHER_SINCE));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { label: "Months", value: time.months },
    { label: "Days", value: time.totalDays },
    { label: "Hours", value: time.hours },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.5 }}
      className="bg-yellow-200 border-4 border-black rounded-lg p-6 sm:p-8 lg:col-span-2"
      style={{ boxShadow: "6px 6px 0px #000" }}
    >
      {/* Header */}
      <h3
        className="text-xs sm:text-sm text-black text-center mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        we've been together for...
      </h3>

      {/* Counter blocks */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
        {blocks.map((block) => (
          <motion.div
            key={block.label}
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="bg-white border-3 border-black rounded-md px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[80px]"
            style={{ boxShadow: "4px 4px 0px #000" }}
          >
            <p
              className="text-xl sm:text-2xl text-black font-bold mb-1"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {block.value.toLocaleString()}
            </p>
            <p
              className="text-[7px] sm:text-[8px] text-black/60"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {block.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footnote */}
      <p
        className="text-center text-[8px] text-black/50 mt-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        and counting...
      </p>
    </motion.div>
  );
}
