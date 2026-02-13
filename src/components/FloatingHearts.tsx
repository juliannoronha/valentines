import { useMemo } from "react";
import heartImg from "../assets/pictures/heart.png";

interface Heart {
    id: number;
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
                <img
                    key={heart.id}
                    src={heartImg}
                    alt=""
                    className="absolute animate-float-up"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                        width: `${heart.size}px`,
                        height: `${heart.size}px`,
                        imageRendering: "pixelated",
                        bottom: "-40px",
                    }}
                />
            ))}
        </div>
    );
}
