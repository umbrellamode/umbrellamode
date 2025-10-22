import { createContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Widget } from "../widget/widget";
import { UserAction } from "../types";
import {
  trackButtonClick,
  isClickableElement,
} from "../utils/track-button-click";

interface UmbrellaModeContextInterface {
  apiKey: string;
  baseUrl?: string;
  open: () => Promise<void>;
  close: () => Promise<void>;
  isOpen: boolean;
  isClosed: boolean;
  isLoading: boolean;
  userActions: UserAction[];
  addUserAction: (action: UserAction) => void;
  clearUserActions: () => void;
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
  const [userActions, setUserActions] = useState<UserAction[]>([]);

  const isClosed = !isOpen;

  // User action management
  const addUserAction = useCallback((action: UserAction) => {
    setUserActions((prev) => {
      const newActions = [...prev, action];
      // Keep only the last 1000 actions (FIFO)
      return newActions.length > 1000 ? newActions.slice(-1000) : newActions;
    });
  }, []);

  const clearUserActions = useCallback(() => {
    setUserActions([]);
  }, []);

  // Global click listener for tracking user actions
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as Element;

      // Skip if target is not a clickable element
      if (!isClickableElement(target)) return;

      // Skip if click is within the widget (shadow DOM or widget container)
      const widgetContainer = document.querySelector(
        "[data-umbrellamode-widget]"
      );
      if (widgetContainer && widgetContainer.contains(target)) return;

      // Skip if click is within shadow DOM
      if (target.getRootNode() !== document) return;

      try {
        const userAction = trackButtonClick(event);
        addUserAction(userAction);
      } catch (error) {
        console.warn("Failed to track button click:", error);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [isOpen, addUserAction]);

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
        userActions,
        addUserAction,
        clearUserActions,
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
          {isOpen && (
            <div data-umbrellamode-widget>
              <Widget agentName="Umbrella Mode" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </UmbrellaModeContext.Provider>
  );
};
