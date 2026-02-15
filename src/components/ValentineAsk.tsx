import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useHoverSound } from "../hooks/useHoverSound";
import kanyeImg from "../assets/pictures/kanye.jpg";

interface ValentineAskProps {
    onYes: () => void;
}

export default function ValentineAsk({ onYes }: ValentineAskProps) {
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [yesScale, setYesScale] = useState(1);
    const [dodgeCount, setDodgeCount] = useState(0);
    const playHover = useHoverSound();

    const dodgeNo = useCallback(() => {
        const maxX = window.innerWidth > 600 ? 200 : 100;
        const maxY = window.innerWidth > 600 ? 150 : 80;
        const newX = (Math.random() - 0.5) * maxX * 2;
        const newY = (Math.random() - 0.5) * maxY * 2;
        setNoPosition({ x: newX, y: newY });
        setDodgeCount((prev) => prev + 1);
        setYesScale((prev) => Math.min(prev + 0.15, 2.0));
    }, []);

    const dodgeMessages = [
        "hell no!",
        "are you sure?",
        "seriously?",
        "cmon bruh",
        "Please?? 🥹",
        "I'll cry... 😭",
        "PLEASE 😭😭",
        "nooooo 💀",
    ];

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-pink-200 border-4 border-black rounded-lg p-8 sm:p-10 w-full max-w-md mx-auto text-center"
            style={{ boxShadow: "6px 6px 0px #000" }}
        >
            {/* Kanye Valentine Image */}
            <div
                className="mb-6 mx-auto w-48 sm:w-56 border-4 border-black rounded-lg overflow-hidden"
                style={{ boxShadow: "4px 4px 0px #000" }}
            >
                <img
                    src={kanyeImg}
                    alt="Will you be my valentine?"
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                {/* Yes Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: yesScale }}
                    onMouseEnter={playHover}
                    onClick={onYes}
                    className="bg-green-300 hover:bg-green-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors z-10"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: "4px 4px 0px #000",
                    }}
                >
                    yes ofc my love!
                </motion.button>

                {/* No Button (dodges!) */}
                <motion.button
                    animate={{ x: noPosition.x, y: noPosition.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={() => { playHover(); dodgeNo(); }}
                    onClick={dodgeNo}
                    className="bg-red-300 hover:bg-red-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors z-10"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: "4px 4px 0px #000",
                        fontSize: `${Math.max(14 - dodgeCount * 1.5, 6)}px`,
                    }}
                >
                    {dodgeMessages[Math.min(dodgeCount, dodgeMessages.length - 1)]}
                </motion.button>
            </div>
        </motion.div>
    );
}
