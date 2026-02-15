import { useState } from "react";
import { motion } from "framer-motion";
import { useHoverSound } from "../hooks/useHoverSound";
import { useCorrectSound } from "../hooks/useCorrectSound";
import ans1 from "../assets/pictures/question1/ans1.jpg";
import ans2 from "../assets/pictures/question1/ans2.jpg";
import ans3 from "../assets/pictures/question1/ans3.png";
import ans4 from "../assets/pictures/question1/ans4.png";

interface CarQuestionProps {
    onCorrect: () => void;
}

const cars = [
    { id: "ans1", src: ans1 },
    { id: "ans2", src: ans2 },
    { id: "ans3", src: ans3 },
    { id: "ans4", src: ans4 },
];

const CORRECT_ANSWER = "ans4";

export default function CarQuestion({ onCorrect }: CarQuestionProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isWrong, setIsWrong] = useState(false);
    const playHover = useHoverSound();
    const playCorrect = useCorrectSound();

    const handleSelect = (id: string) => {
        setSelected(id);

        if (id === CORRECT_ANSWER) {
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
            className="bg-orange-200 border-4 border-black rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto"
            style={{ boxShadow: "6px 6px 0px #000" }}
        >
            <h2
                className="text-xs sm:text-sm text-center mb-6 leading-relaxed text-black"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                which one is my favourite car?
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {cars.map((car) => (
                    <motion.button
                        key={car.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, y: 2 }}
                        onMouseEnter={playHover}
                        onClick={() => handleSelect(car.id)}
                        disabled={selected !== null}
                        className={`border-3 border-black rounded-md overflow-hidden cursor-pointer transition-all disabled:cursor-not-allowed ${selected === car.id && car.id === CORRECT_ANSWER
                                ? "ring-4 ring-green-500 ring-offset-2"
                                : ""
                            } ${selected === car.id && car.id !== CORRECT_ANSWER
                                ? "ring-4 ring-red-500 ring-offset-2 animate-shake"
                                : ""
                            }`}
                        style={{
                            boxShadow:
                                selected === car.id
                                    ? "2px 2px 0px #000"
                                    : "4px 4px 0px #000",
                        }}
                    >
                        <img
                            src={car.src}
                            alt={car.id}
                            className="w-full h-28 sm:h-36 object-cover"
                        />
                    </motion.button>
                ))}
            </div>

            {selected && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center mt-4 text-xs ${isWrong ? "text-red-600" : "text-green-700"
                        }`}
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    {isWrong
                        ? "NOPE. not that one 😭"
                        : "hmm okay..."}
                </motion.p>
            )}
        </motion.div>
    );
}
