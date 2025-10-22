import { createContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Widget } from "../widget/widget";

interface UmbrellaModeContextInterface {
  apiKey: string;
  baseUrl?: string;
  open: () => Promise<void>;
  close: () => Promise<void>;
  isOpen: boolean;
  isClosed: boolean;
  isLoading: boolean;
}

export const UmbrellaModeContext = createContext<
  UmbrellaModeContextInterface | undefined
>(undefined);

export const UmbrellaModeProvider = ({
  children,
  apiKey,
  baseUrl = "https://api.umbrellamode.com",
}: {
  children: React.ReactNode;
  apiKey: string;
  baseUrl?: string;
}) => {
  const [personId, setPersonId] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isClosed = !isOpen;

  const open = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement actual open logic here
      // This might involve API calls, state updates, etc.
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to open umbrella mode:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const close = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement actual close logic here
      // This might involve API calls, state updates, etc.
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to close umbrella mode:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UmbrellaModeContext.Provider
      value={{
        apiKey,
        baseUrl,
        open,
        close,
        isOpen,
        isClosed,
        isLoading,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <motion.div
          layout
          style={{
            flex: 1,
            overflow: "auto",
          }}
          animate={{
            marginRight: isOpen ? 300 : 0,
          }}
          transition={{
            type: "spring",
            visualDuration: 0.3,
            bounce: 0.15,
          }}
        >
          {children}
        </motion.div>
        <AnimatePresence>
          {isOpen && <Widget agentName="Umbrella Mode" />}
        </AnimatePresence>
      </div>
    </UmbrellaModeContext.Provider>
  );
};
