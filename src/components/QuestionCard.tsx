import { motion } from "framer-motion";
import type { Question } from "../questions";

interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    totalQuestions: number;
    onAnswer: () => void;
}

const CARD_COLORS = [
    "bg-pink-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-yellow-200",
];

const BUTTON_COLORS = [
    "bg-pink-300 hover:bg-pink-400",
    "bg-blue-300 hover:bg-blue-400",
    "bg-purple-300 hover:bg-purple-400",
    "bg-yellow-300 hover:bg-yellow-400",
    "bg-green-300 hover:bg-green-400",
];

export default function QuestionCard({
    question,
    questionIndex,
    totalQuestions,
    onAnswer,
}: QuestionCardProps) {
    const cardColor = CARD_COLORS[questionIndex % CARD_COLORS.length];

    return (
        <motion.div
            key={questionIndex}
            initial={{ x: 300, opacity: 0, rotate: 3 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -3 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`${cardColor} border-4 border-black rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto`}
            style={{ boxShadow: "6px 6px 0px #000" }}
        >
            {/* Progress Hearts */}
            <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: totalQuestions }, (_, i) => (
                    <span
                        key={i}
                        className={`text-lg transition-all duration-300 ${i <= questionIndex ? "scale-110" : "opacity-30 scale-90"
                            }`}
                    >
                        {i <= questionIndex ? "💖" : "🤍"}
                    </span>
                ))}
            </div>

            {/* Question */}
            <h2
                className="text-sm sm:text-base text-center mb-6 leading-relaxed text-black"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                {question.question}
            </h2>

            {/* Answer Buttons */}
            <div className="flex flex-col gap-3">
                {question.answers.map((answer, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, x: 4 }}
                        whileTap={{ scale: 0.97, y: 2, boxShadow: "2px 2px 0px #000" }}
                        onClick={onAnswer}
                        className={`${BUTTON_COLORS[i % BUTTON_COLORS.length]} border-3 border-black rounded-md px-4 py-3 text-xs sm:text-sm text-black text-left cursor-pointer transition-colors`}
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            boxShadow: "4px 4px 0px #000",
                            lineHeight: "1.6",
                        }}
                    >
                        {answer}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
