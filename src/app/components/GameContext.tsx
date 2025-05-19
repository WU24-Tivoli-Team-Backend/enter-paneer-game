"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import { EncouragementMessage, EncouragementGenerator } from "./types";
import { GAME_CONFIG } from "../config/gameConfig";
import { lookupAmusementByName } from "../services/amusementService";

interface GameContextProps {
  input: string;
  setInput: (input: string) => void;
  hasWon: boolean;
  setHasWon: (hasWon: boolean) => void;
  attempts: number;
  setAttempts: (attempts: number) => void;
  encouragement: EncouragementMessage;
  setEncouragement: (text: string, visible: boolean) => void;
  hasPaid: boolean;
  setHasPaid: (hasPaid: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  paymentError: string | null;
  setPaymentError: (error: string | null) => void;
  jwtToken: string | null;
  setJwtToken: (token: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  typingTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  resetGame: () => void;
  encouragingMessages: EncouragementGenerator[];
  amusementId: number;
  isAmusementLoading: boolean;
  amusementError: string | null;
  retryAmusementLookup: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [input, setInput] = useState<string>("");
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [encouragement, setEncouragementState] = useState<EncouragementMessage>(
    {
      text: "",
      visible: false,
    }
  );
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const [amusementId, setAmusementId] = useState<number>(
    GAME_CONFIG.AMUSEMENT_ID || 11
  );
  const [isAmusementLoading, setIsAmusementLoading] = useState<boolean>(true);
  const [amusementError, setAmusementError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAmusementId = async () => {
    try {
      setIsAmusementLoading(true);
      setAmusementError(null);

      console.log("Fetching amusement ID for:", GAME_CONFIG.AMUSEMENT_NAME);
      const result = await lookupAmusementByName(GAME_CONFIG.AMUSEMENT_NAME);

      if (result.success && result.id !== undefined) {
        console.log(`Successfully fetched amusement ID: ${result.id}`);
        setAmusementId(result.id);
        GAME_CONFIG.AMUSEMENT_ID = result.id;
      } else {
        const errorMsg = result.error || "Failed to fetch amusement ID";
        console.error("Amusement lookup failed:", errorMsg);
        setAmusementError(errorMsg);

        if (process.env.NODE_ENV === "development") {
          console.warn("Using fallback amusement ID for development");
          const FALLBACK_AMUSEMENT_ID = 0;
          setAmusementId(FALLBACK_AMUSEMENT_ID);
          GAME_CONFIG.AMUSEMENT_ID = FALLBACK_AMUSEMENT_ID;
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching amusement ID:", errorMsg);
      setAmusementError(errorMsg);

      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Using fallback amusement ID for development due to error"
        );
        const FALLBACK_AMUSEMENT_ID = 0;
        setAmusementId(FALLBACK_AMUSEMENT_ID);
        GAME_CONFIG.AMUSEMENT_ID = FALLBACK_AMUSEMENT_ID;
      }
    } finally {
      setIsAmusementLoading(false);
    }
  };

  useEffect(() => {
    fetchAmusementId();
  }, []);

  const retryAmusementLookup = () => {
    fetchAmusementId();
  };

  const setEncouragement = (text: string, visible: boolean) => {
    setEncouragementState({ text, visible });
  };

  const resetGame = () => {
    setInput("");
    setHasWon(false);
    setAttempts(0);
    setEncouragement("", false);
    setHasPaid(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const encouragingMessages: Array<(text: string) => string> = [
    (text: string) => `"${text}" is simmering, but not quite done!`,
    (text: string) => `Wow, "${text}" is a tasty guess!`,
    (text: string) => `"${text}" is an interesting ingredient!`,
    (text: string) => `"${text}" is, sadly, not Paneer.`,
    (text: string) => `"${text}?" Really? Why not Paneer?`,
  ];

  return (
    <GameContext.Provider
      value={{
        input,
        setInput,
        hasWon,
        setHasWon,
        attempts,
        setAttempts,
        encouragement,
        setEncouragement,
        hasPaid,
        setHasPaid,
        isProcessing,
        setIsProcessing,
        paymentError,
        setPaymentError,
        jwtToken,
        setJwtToken,
        inputRef,
        typingTimerRef,
        resetGame,
        encouragingMessages,
        amusementId,
        isAmusementLoading,
        amusementError,
        retryAmusementLookup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
