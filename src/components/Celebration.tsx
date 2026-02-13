import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

export default function Celebration() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative z-10">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={300}
                recycle={true}
                colors={["#FFB6C1", "#FF69B4", "#FF1493", "#89CFF0", "#C3B1E1", "#FDFD96", "#98FB98"]}
            />

            <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="bg-pink-200 border-4 border-black rounded-lg p-8 sm:p-10 w-full max-w-md mx-auto text-center"
                style={{ boxShadow: "6px 6px 0px #000" }}
            >
                {/* Celebration Hearts */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl sm:text-8xl mb-6"
                >
                    💖
                </motion.div>

                <h2
                    className="text-sm sm:text-lg text-black mb-4 leading-relaxed"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    I knew you'd say yes!
                </h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl sm:text-4xl mb-4"
                >
                    💕🥰💕
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-xs sm:text-sm text-black leading-relaxed"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    Happy Valentine's Day, my love!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="mt-6 flex justify-center gap-2 text-2xl"
                >
                    {["💖", "✨", "💕", "✨", "💖"].map((emoji, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.15,
                            }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
