"use client";

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";

export default function Game() {
  const [input, setInput] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const encouragingMessages = [
    (text: string) => `"${text}" is simmering, but not quite done!`,
    (text: string) => `Wow, "${text}" is a tasty guess!`,
    (text: string) => `"${text}" is an interesting ingredient!`,
    (text: string) => `"${text}" is, sadly, not Paneer.`,
    (text: string) => `"${text}?" Really? Why not Paneer?`,
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      if (value && value.toLowerCase() !== "paneer") {
        const randomIndex = Math.floor(
          Math.random() * encouragingMessages.length
        );
        const messageGenerator = encouragingMessages[randomIndex];
        setEncouragement(messageGenerator(value));
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 2500);
      }
    }, 400);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempts(attempts + 1);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    if (input.toLowerCase() === "paneer") {
      setHasWon(true);
    } else {
      setEncouragement("Not quite the right ingredient!");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);

      setInput("");
      inputRef.current?.focus();
    }
  };

  const resetGame = () => {
    setInput("");
    setHasWon(false);
    setAttempts(0);
    setEncouragement(null);
    setShowMessage(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#fae6bb] text-[#110d0a] font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif] text-base">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-8xl font-bold mb-10 text-[#e73413] text-center">
          TYPE PANEER TO WIN
        </h1>

        {!hasWon ? (
          <>
            <p className="text-center mb-10 text-4xl leading-relaxed">
              There are no secrets, no easter eggs. Just paneer.
            </p>
            <form onSubmit={handleSubmit} className="w-full mb-8">
              <div className="relative w-full flex flex-col md:flex-row gap-6 md:gap-0">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    ref={inputRef}
                    className="w-full p-8 border-2 border-[#e0d5c5] rounded-2xl bg-white md:rounded-r-none text-2xl outline-none transition-all focus:border-[#e73413] focus:shadow-[0_0_0_2px_rgba(231,52,19,0.1)]"
                    placeholder="Enter paneer here..."
                    autoFocus
                  />

                  {encouragement && (
                    <div
                      className={`absolute -top-28 left-0 right-0 text-center p-6 bg-white text-[#110d0a] border-2 border-[#f0e0c9] rounded-2xl transition-all duration-300 shadow-md z-10 ${
                        showMessage
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                    >
                      <span className="font-medium text-base">
                        {encouragement}
                      </span>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-white border-l-transparent border-r-transparent drop-shadow-sm"></div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#e73413] text-white border-none rounded-2xl md:rounded-l-none p-5 text-2xl font-bold cursor-pointer transition-all hover:bg-[#d62800] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Paneer me
                </button>
              </div>
            </form>

            {attempts > 0 && (
              <p className="mt-6 text-2xl text-gray-500">
                Attempts: {attempts}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center w-full animate-[popIn_0.5s_ease-out]">
            <div className="bg-[#fef8ee] border-2 border-[#f0e0c9] rounded-2xl p-8 w-full">
              <h2 className="text-3xl mb-6 text-center">
                Congratulations! You typed paneer after {attempts}{" "}
                {attempts === 1 ? "attempt" : "attempts"}!
              </h2>
              <p className="text-2xl text-gray-500 leading-relaxed pt-6 border-t border-dashed border-[#e0d5c5]">
                Paneer is a fresh cheese common in South Asian cuisine.
                It&apos;s made by curdling milk with a fruit or vegetable acid
                like lemon juice.
              </p>
            </div>
            <button
              onClick={resetGame}
              className="mt-8 bg-white text-[#e73413] border-2 border-[#e73413] rounded-2xl py-5 px-10 text-3xl font-bold cursor-pointer transition-all hover:bg-[rgba(231,52,19,0.05)]"
            >
              Type &apos;paneer&apos; again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
