import React, { FormEvent, ChangeEvent } from "react";
import { useGameContext } from "./GameContext";
import EncouragementBubble from "./EncouragementBubble";

const PaneerInput: React.FC = () => {
  const {
    input,
    setInput,
    setHasWon,
    attempts,
    setAttempts,
    setEncouragement,
    inputRef,
    typingTimerRef,
    encouragingMessages,
  } = useGameContext();

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
        setEncouragement(messageGenerator(value), true);

        setTimeout(() => {
          setEncouragement("", false);
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
      setEncouragement(`${input} is not paneer.`, true);

      setTimeout(() => {
        setEncouragement("", false);
      }, 1500);

      setInput("");
      inputRef.current?.focus();
    }
  };

  return (
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
            <EncouragementBubble />
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
        <p className="mt-6 text-2xl text-gray-500">Attempts: {attempts}</p>
      )}
    </>
  );
};

export default PaneerInput;
