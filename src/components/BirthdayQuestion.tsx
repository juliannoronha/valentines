import { useState } from "react";
import { motion } from "framer-motion";

interface BirthdayQuestionProps {
    onCorrect: () => void;
}

const CORRECT_DATE = "2003-09-07";

export default function BirthdayQuestion({ onCorrect }: BirthdayQuestionProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

    const handleSubmit = () => {
        if (!selectedDate) return;

        if (selectedDate === CORRECT_DATE) {
            setFeedback("correct");
            setTimeout(() => onCorrect(), 1000);
        } else {
            setFeedback("wrong");
            setTimeout(() => {
                setFeedback(null);
            }, 1500);
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0, rotate: 3 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -3 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="bg-yellow-200 border-4 border-black rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto text-center"
            style={{ boxShadow: "6px 6px 0px #000" }}
        >
            <h2
                className="text-xs sm:text-sm mb-2 leading-relaxed text-black"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                whens my birthday? 🎂
            </h2>

            <p
                className="text-[10px] text-gray-600 mb-6"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                pick the date!
            </p>

            {/* Calendar Picker */}
            <div className="flex flex-col items-center gap-4">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setFeedback(null);
                    }}
                    className="bg-white border-3 border-black rounded-md px-4 py-3 text-xs text-black w-full max-w-[250px] cursor-pointer"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: "4px 4px 0px #000",
                    }}
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    onClick={handleSubmit}
                    disabled={!selectedDate || feedback === "correct"}
                    className="bg-blue-300 hover:bg-blue-400 border-3 border-black rounded-md px-6 py-3 text-xs text-black cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        boxShadow: "4px 4px 0px #000",
                    }}
                >
                    Submit 📅
                </motion.button>
            </div>

            {/* Feedback */}
            {feedback && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-xs ${feedback === "wrong" ? "text-red-600" : "text-green-700"
                        }`}
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    {feedback === "wrong"
                        ? "hmm, that's not right! 🤔"
                        : "you remembered! 🥹💖"}
                </motion.p>
            )}
        </motion.div>
    );
}
