import { createContext, useState, useCallback } from "react";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isClosed = !isOpen;

  const open = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      alert("Opening umbrella mode");
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
      <div className="relative flex flex-col">
        {children}
        <Widget />
      </div>
    </UmbrellaModeContext.Provider>
  );
};
