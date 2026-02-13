import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FloatingHearts from "./components/FloatingHearts";
import TextType from "./components/TextType";
import ColorQuestion from "./components/ColorQuestion";
import BirthdayQuestion from "./components/BirthdayQuestion";
import ValentineAsk from "./components/ValentineAsk";
import Celebration from "./components/Celebration";
import characterImg from "./assets/pictures/8bit me.png";
import { useTalkingSound } from "./hooks/useTalkingSound";

/**
 * Flow steps:
 * 0: Intro typing ("psst, hey!", "you found the secret!", etc.)
 * 1: Color question (multiple choice)
 * 2: Transition typing ("that was too easy..")
 * 3: Birthday question (calendar picker)
 * 4: Transition typing ("alright, you won't get this one..")
 * 5: Valentine ask (Yes / dodging No)
 * 6: Celebration
 */
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [step, setStep] = useState<Step>(0);
  const { playSegment, init: initAudio } = useTalkingSound();

  const goNext = () => setStep((prev) => Math.min(prev + 1, 6) as Step);

  return (
    <div
      onClick={initAudio}
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
                <TextType
                  text={[
                    "psst, hey!",
                    "you found the secret!",
                    "but i need to make sure its really you.",
                    "you need to answer some questions...",
                  ]}
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
              </CharacterBubble>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 12 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                onClick={() => { initAudio(); goNext(); }}
                className="mt-6 bg-purple-300 hover:bg-purple-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  boxShadow: "4px 4px 0px #000",
                }}
              >
                I'm ready! 💪
              </motion.button>
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
                <TextType
                  text={[
                    "that was too easy..",
                    "whens my birthday?",
                  ]}
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
              </CharacterBubble>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                onClick={() => { initAudio(); goNext(); }}
                className="mt-6 bg-yellow-300 hover:bg-yellow-400 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  boxShadow: "4px 4px 0px #000",
                }}
              >
                I know this! 📅
              </motion.button>
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
                <TextType
                  text={[
                    "alright, you won't get this one..",
                    "this one is really hard.. click the button",
                  ]}
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
              </CharacterBubble>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                onClick={() => { initAudio(); goNext(); }}
                className="mt-6 bg-pink-400 hover:bg-pink-500 border-3 border-black rounded-md px-8 py-4 text-sm text-black cursor-pointer transition-colors"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  boxShadow: "4px 4px 0px #000",
                }}
              >
                💕
              </motion.button>
            </motion.div>
          )}

          {/* Step 5: Valentine Ask */}
          {step === 5 && (
            <ValentineAsk key="valentine" onYes={goNext} />
          )}

          {/* Step 6: Celebration */}
          {step === 6 && (
            <Celebration key="celebration" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
