import { useMemo } from "react";

const HEART_EMOJIS = ["💖", "💕", "💗", "💓", "🩷", "✨", "⭐"];

interface Heart {
    id: number;
    emoji: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
}

export default function FloatingHearts() {
    const hearts: Heart[] = useMemo(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
                left: Math.random() * 100,
                delay: Math.random() * 8,
                duration: 6 + Math.random() * 8,
                size: 12 + Math.random() * 20,
            })),
        []
    );

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <span
                    key={heart.id}
                    className="absolute animate-float-up"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                        fontSize: `${heart.size}px`,
                        bottom: "-40px",
                    }}
                >
                    {heart.emoji}
                </span>
            ))}
        </div>
    );
}
