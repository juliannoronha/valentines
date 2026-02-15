import { useState } from "react";
import { motion } from "framer-motion";
import { useHoverSound } from "../hooks/useHoverSound";
import { useCorrectSound } from "../hooks/useCorrectSound";

interface ColorQuestionProps {
    onCorrect: () => void;
}

const colors = [
    { name: "Red", color: "bg-red-400", hoverColor: "hover:bg-red-500" },
    { name: "Blue", color: "bg-blue-400", hoverColor: "hover:bg-blue-500" },
    { name: "Purple", color: "bg-purple-400", hoverColor: "hover:bg-purple-500" },
    { name: "Green", color: "bg-green-400", hoverColor: "hover:bg-green-500" },
];

const CORRECT_ANSWER = "Purple";

export default function ColorQuestion({ onCorrect }: ColorQuestionProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isWrong, setIsWrong] = useState(false);
    const playHover = useHoverSound();
    const playCorrect = useCorrectSound();

    const handleSelect = (colorName: string) => {
        setSelected(colorName);

        if (colorName === CORRECT_ANSWER) {
            setIsWrong(false);
            playCorrect();
            setTimeout(() => onCorrect(), 800);
        } else {
            setIsWrong(true);
            setTimeout(() => {
                setSelected(null);
                setIsWrong(false);
            }, 1200);
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0, rotate: 3 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -3 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="bg-purple-200 border-4 border-black rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto"
            style={{ boxShadow: "6px 6px 0px #000" }}
        >
            <h2
                className="text-xs sm:text-sm text-center mb-6 leading-relaxed text-black"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                whats my favorite color?
            </h2>

            {/* Color Grid */}
            <div className="grid grid-cols-2 gap-3">
                {colors.map((c) => (
                    <motion.button
                        key={c.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, y: 2 }}
                        onMouseEnter={playHover}
                        onClick={() => handleSelect(c.name)}
                        disabled={selected !== null}
                        className={`${c.color} ${c.hoverColor} border-3 border-black rounded-md px-4 py-4 text-xs text-black cursor-pointer transition-all disabled:cursor-not-allowed ${selected === c.name && c.name === CORRECT_ANSWER
                            ? "ring-4 ring-green-500 ring-offset-2"
                            : ""
                            } ${selected === c.name && c.name !== CORRECT_ANSWER
                                ? "ring-4 ring-red-500 ring-offset-2 animate-shake"
                                : ""
                            }`}
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            boxShadow: selected === c.name ? "2px 2px 0px #000" : "4px 4px 0px #000",
                        }}
                    >
                        {c.name}
                    </motion.button>
                ))}
            </div>

            {/* Feedback */}
            {selected && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center mt-4 text-xs ${isWrong ? "text-red-600" : "text-green-700"
                        }`}
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    {isWrong ? "wow, you don't know my favorite color? " : "alright, alright.."}
                </motion.p>
            )}
        </motion.div>
    );
}
