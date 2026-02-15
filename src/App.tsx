import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FloatingHearts from "./components/FloatingHearts";
import TextType from "./components/TextType";
import ColorQuestion from "./components/ColorQuestion";
import BirthdayQuestion from "./components/BirthdayQuestion";
import ValentineAsk from "./components/ValentineAsk";
import Celebration from "./components/Celebration";
import characterImg from "./assets/pictures/8bit me.png";
import CarQuestion from "./components/CarQuestion";
import MapQuestion from "./components/MapQuestion";
import AnimatedContent from "./components/AnimatedContent";
import { useTalkingSound } from "./hooks/useTalkingSound";
import { useHoverSound } from "./hooks/useHoverSound";
import backgroundMusic from "./assets/sound/background.mp3";

/**
 * Flow steps:
 * 0: Intro typing ("psst, hey!", "you found the secret!", etc.)
 * 1: Color question (multiple choice)
 * 2: Transition typing ("that was too easy..")
 * 3: Birthday question (calendar picker)
 * 4: Transition typing ("alright, that one was too easy...")
 * 5: Car question (image grid)
 * 6: Transition typing ("did you get that on your first try LOL")
 * 7: Map question (image grid)
 * 8: Transition typing after map question
 * 9: Valentine ask (Yes / dodging No)
 * 10: Celebration
 */
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Reusable speech bubble layout: character on left, bubble on right */
function CharacterBubble({
  children,
  bubbleColor = "bg-pink-200",
  tailColor = "#fbcfe8",
}: {
  children: React.ReactNode;
  bubbleColor?: string;
  tailColor?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-4 w-full">
        {/* 8-bit Character */}
        <motion.img
          src={characterImg}
          alt="8-bit character"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 object-contain"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Speech Bubble */}
        <div className="relative flex-1">
          {/* Outer tail (black outline) */}
          <div
            className="absolute left-[-10px] top-1/2 w-0 h-0"
            style={{
              marginTop: "-10px",
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderRight: "12px solid #000",
            }}
          />
          {/* Inner tail (matches bubble bg) */}
          <div
            className="absolute left-[-6px] top-1/2 w-0 h-0"
            style={{
              marginTop: "-6px",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: `8px solid ${tailColor}`,
            }}
          />

          <div
            className={`${bubbleColor} border-4 border-black rounded-lg p-5 sm:p-6`}
            style={{ boxShadow: "5px 5px 0px #000" }}
          >
            <p
              className="text-[8px] text-black/60 mb-2"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Julian
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [step, setStep] = useState<Step>(0);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const { playSegment, init: initAudio } = useTalkingSound();
  const playHover = useHoverSound();

  const bgRef = useRef<HTMLAudioElement | null>(null);
  const startBg = () => {
    if (bgRef.current) return;
    const audio = new Audio(backgroundMusic);
    audio.volume = 0.1;
    audio.loop = true;
    audio.play();
    bgRef.current = audio;
  };

  useEffect(() => setDialogIndex(0), [step]);

  const goNext = () => setStep((prev) => Math.min(prev + 1, 10) as Step);
  const nextDialog = () => setDialogIndex((prev) => prev + 1);

  const step0Lines = [
    "psst, hey!",
    "you found the secret!",
    "but i need to make sure its really you.",
    "you need to answer some questions...",
  ];
  const step2Lines = ["okay.. next question"];
  const step4Lines = [
    "okok that question was WAY too easy",
    "this question is gonna be harder",
  ];
  const step6Lines = [
    "did you get that on your first try LOL",
    "okay - next question",
  ];
  const step8Lines = [
    "wait you actually got that??",
    "okay okay... last question",
  ];

  // Delay button rendering until typing finishes so it doesn't take up layout space
  useEffect(() => {
    setShowButton(false);
    const allLines: Record<number, string[]> = { 0: step0Lines, 2: step2Lines, 4: step4Lines, 6: step6Lines, 8: step8Lines };
    const lines = allLines[step];
    if (!lines) return;
    const line = lines[Math.min(dialogIndex, lines.length - 1)] || "";
    const delay = line.length * 60 + 500;
    const timer = setTimeout(() => setShowButton(true), delay);
    return () => clearTimeout(timer);
  }, [step, dialogIndex]);

  return (
    <div
      onClick={() => { initAudio(); startBg(); }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4 overflow-hidden relative"
    >
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-2xl px-2">
        <AnimatePresence mode="wait">
          {/* Step 0: Intro typing */}
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterBubble bubbleColor="bg-pink-200">
                <AnimatedContent key={`ac0-${dialogIndex}`} distance={15} duration={0.4}>
                  <TextType
                    key={`s0-${dialogIndex}`}
                    text={step0Lines[Math.min(dialogIndex, step0Lines.length - 1)]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1500}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="▌"
                    cursorClassName="text-pink-500"
                    onCharTyped={playSegment}
                    className="text-sm sm:text-base text-black leading-relaxed min-h-[50px]"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  />
                </AnimatedContent>
              </CharacterBubble>

              {showButton && (dialogIndex < step0Lines.length - 1 ? (
                <motion.button
                  key={`skip0-${dialogIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); nextDialog(); }}
                  className="mt-4 text-[10px] text-black cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  skip &gt;&gt;
                </motion.button>
              ) : (
                <motion.button
                  key="action0"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); goNext(); }}
                  className="mt-6 bg-pink-300 hover:bg-pink-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  okay, bet!
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 1: Color Question */}
          {step === 1 && (
            <ColorQuestion key="color" onCorrect={goNext} />
          )}

          {/* Step 2: Transition typing */}
          {step === 2 && (
            <motion.div
              key="transition1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterBubble bubbleColor="bg-blue-200" tailColor="#bfdbfe">
                <AnimatedContent key={`ac2-${dialogIndex}`} distance={15} duration={0.4}>
                  <TextType
                    key={`s2-${dialogIndex}`}
                    text={step2Lines[Math.min(dialogIndex, step2Lines.length - 1)]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1500}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="▌"
                    cursorClassName="text-blue-500"
                    onCharTyped={playSegment}
                    className="text-sm sm:text-base text-black leading-relaxed min-h-[50px]"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  />
                </AnimatedContent>
              </CharacterBubble>

              {showButton && (dialogIndex < step2Lines.length - 1 ? (
                <motion.button
                  key={`skip2-${dialogIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); nextDialog(); }}
                  className="mt-4 text-[10px] text-black cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  skip &gt;&gt;
                </motion.button>
              ) : (
                <motion.button
                  key="action2"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); goNext(); }}
                  className="mt-6 bg-blue-300 hover:bg-blue-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  i'm ready
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 3: Birthday Question */}
          {step === 3 && (
            <BirthdayQuestion key="birthday" onCorrect={goNext} />
          )}

          {/* Step 4: Transition typing */}
          {step === 4 && (
            <motion.div
              key="transition2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterBubble bubbleColor="bg-green-200" tailColor="#bbf7d0">
                <AnimatedContent key={`ac4-${dialogIndex}`} distance={15} duration={0.4}>
                  <TextType
                    key={`s4-${dialogIndex}`}
                    text={step4Lines[Math.min(dialogIndex, step4Lines.length - 1)]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1500}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="▌"
                    cursorClassName="text-green-600"
                    onCharTyped={playSegment}
                    className="text-sm sm:text-base text-black leading-relaxed min-h-[50px]"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  />
                </AnimatedContent>
              </CharacterBubble>

              {showButton && (dialogIndex < step4Lines.length - 1 ? (
                <motion.button
                  key={`skip4-${dialogIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); nextDialog(); }}
                  className="mt-4 text-[10px] text-black cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  skip &gt;&gt;
                </motion.button>
              ) : (
                <motion.button
                  key="action4"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); goNext(); }}
                  className="mt-6 bg-green-300 hover:bg-green-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  yeah right
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 5: Car Question */}
          {step === 5 && (
            <CarQuestion key="car" onCorrect={goNext} />
          )}

          {/* Step 6: Transition typing */}
          {step === 6 && (
            <motion.div
              key="transition3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterBubble bubbleColor="bg-orange-200" tailColor="#fed7aa">
                <AnimatedContent key={`ac6-${dialogIndex}`} distance={15} duration={0.4}>
                  <TextType
                    key={`s6-${dialogIndex}`}
                    text={step6Lines[Math.min(dialogIndex, step6Lines.length - 1)]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1500}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="▌"
                    cursorClassName="text-orange-500"
                    onCharTyped={playSegment}
                    className="text-sm sm:text-base text-black leading-relaxed min-h-[50px]"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  />
                </AnimatedContent>
              </CharacterBubble>

              {showButton && (dialogIndex < step6Lines.length - 1 ? (
                <motion.button
                  key={`skip6-${dialogIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); nextDialog(); }}
                  className="mt-4 text-[10px] text-black cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  skip &gt;&gt;
                </motion.button>
              ) : (
                <motion.button
                  key="action6"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); goNext(); }}
                  className="mt-6 bg-orange-300 hover:bg-orange-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  ...
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 7: Map Question */}
          {step === 7 && (
            <MapQuestion key="map" onCorrect={goNext} />
          )}

          {/* Step 8: Transition typing */}
          {step === 8 && (
            <motion.div
              key="transition4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterBubble bubbleColor="bg-teal-200" tailColor="#99f6e4">
                <AnimatedContent key={`ac8-${dialogIndex}`} distance={15} duration={0.4}>
                  <TextType
                    key={`s8-${dialogIndex}`}
                    text={step8Lines[Math.min(dialogIndex, step8Lines.length - 1)]}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1500}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="▌"
                    cursorClassName="text-teal-500"
                    onCharTyped={playSegment}
                    className="text-sm sm:text-base text-black leading-relaxed min-h-[50px]"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  />
                </AnimatedContent>
              </CharacterBubble>

              {showButton && (dialogIndex < step8Lines.length - 1 ? (
                <motion.button
                  key={`skip8-${dialogIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); nextDialog(); }}
                  className="mt-4 text-[10px] text-black cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  skip &gt;&gt;
                </motion.button>
              ) : (
                <motion.button
                  key="action8"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onMouseEnter={playHover}
                  onClick={() => { initAudio(); goNext(); }}
                  className="mt-6 bg-teal-300 hover:bg-teal-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  ...
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 9: Valentine Ask */}
          {step === 9 && (
            <ValentineAsk key="valentine" onYes={goNext} />
          )}

          {/* Step 10: Celebration */}
          {step === 10 && (
            <Celebration key="celebration" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
