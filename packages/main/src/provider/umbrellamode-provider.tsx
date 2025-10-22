import { createContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Widget } from "../widget/widget";
import { UserAction } from "../types";
import {
  trackButtonClick,
  isClickableElement,
} from "../utils/track-button-click";
import {
  handleInputEvent,
  handleBlurEvent,
  cleanupInputTracking,
  isTextInputElement,
} from "../utils/track-input";
import { trackFormSubmission, isFormElement } from "../utils/track-form";
import { trackSelectChange, isSelectElement } from "../utils/track-select";
import {
  createThrottledScrollHandler,
  resetScrollTracking,
} from "../utils/track-scroll";
import {
  interceptFetch,
  interceptXHR,
  restoreNetworkInterceptors,
} from "../utils/track-network";
import {
  handleMouseEnter,
  handleMouseLeave,
  cleanupHoverTracking,
  isHoverableElement,
} from "../utils/track-hover";

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

  // Comprehensive user action tracking
  useEffect(() => {
    if (!isOpen) {
      // Clean up when widget is closed
      cleanupInputTracking();
      cleanupHoverTracking();
      restoreNetworkInterceptors();
      return;
    }

    // Helper function to check if element is within widget
    const isWithinWidget = (element: Element): boolean => {
      const widgetContainer = document.querySelector(
        "[data-umbrellamode-widget]"
      );
      if (widgetContainer && widgetContainer.contains(element)) return true;
      if (element.getRootNode() !== document) return true;
      return false;
    };

    // Click tracking
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as Element;

      if (!isClickableElement(target) || isWithinWidget(target)) return;

      try {
        const userAction = trackButtonClick(event);
        addUserAction(userAction);
      } catch (error) {
        console.warn("Failed to track button click:", error);
      }
    };

    // Input tracking (debounced)
    const handleInput = (event: Event) => {
      const target = event.target as Element;
      if (!isTextInputElement(target) || isWithinWidget(target)) return;

      handleInputEvent(event, addUserAction);
    };

    // Input tracking (blur)
    const handleBlur = (event: Event) => {
      const target = event.target as Element;
      if (!isTextInputElement(target) || isWithinWidget(target)) return;

      handleBlurEvent(event, addUserAction);
    };

    // Form submission tracking
    const handleFormSubmit = (event: Event) => {
      const target = event.target as Element;
      if (!isFormElement(target) || isWithinWidget(target)) return;

      trackFormSubmission(event)
        .then(addUserAction)
        .catch((error) => {
          console.warn("Failed to track form submission:", error);
        });
    };

    // Select change tracking
    const handleSelectChange = (event: Event) => {
      const target = event.target as Element;
      if (!isSelectElement(target) || isWithinWidget(target)) return;

      try {
        const userAction = trackSelectChange(event);
        addUserAction(userAction as UserAction);
      } catch (error) {
        console.warn("Failed to track select change:", error);
      }
    };

    // Scroll tracking
    resetScrollTracking();
    const handleScroll = createThrottledScrollHandler((action) => {
      addUserAction(action as UserAction);
    }, 500);

    // Network request tracking
    interceptFetch((action) => {
      addUserAction(action as UserAction);
    });
    interceptXHR((action) => {
      addUserAction(action as UserAction);
    });

    // Hover tracking
    const handleMouseEnterEvent = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!isHoverableElement(target) || isWithinWidget(target)) return;

      handleMouseEnter(event, (action) => {
        addUserAction(action as UserAction);
      });
    };

    const handleMouseLeaveEvent = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!isHoverableElement(target) || isWithinWidget(target)) return;

      handleMouseLeave(event, (action) => {
        addUserAction(action as UserAction);
      });
    };

    // Add all event listeners
    document.addEventListener("click", handleGlobalClick, true);
    document.addEventListener("input", handleInput, true);
    document.addEventListener("blur", handleBlur, true);
    document.addEventListener("submit", handleFormSubmit, true);
    document.addEventListener("change", handleSelectChange, true);
    document.addEventListener("mouseenter", handleMouseEnterEvent, true);
    document.addEventListener("mouseleave", handleMouseLeaveEvent, true);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Clean up all listeners
      document.removeEventListener("click", handleGlobalClick, true);
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("blur", handleBlur, true);
      document.removeEventListener("submit", handleFormSubmit, true);
      document.removeEventListener("change", handleSelectChange, true);
      document.removeEventListener("mouseenter", handleMouseEnterEvent, true);
      document.removeEventListener("mouseleave", handleMouseLeaveEvent, true);
      window.removeEventListener("scroll", handleScroll);

      // Clean up tracking utilities
      cleanupInputTracking();
      cleanupHoverTracking();
      restoreNetworkInterceptors();
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
