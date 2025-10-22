import { useContext } from "react";
import { UmbrellaModeContext } from "./umbrellamode-provider";

/**
 * Arguments for identifying a user or person.
 * At least one identifier (userId, anonymousId, deviceId, email, phone, or oauth) should be provided.
 */
export interface IdentifyArgs {
  /** Unique user identifier */
  userId?: string;
  /** Anonymous user identifier for tracking before authentication */
  anonymousId?: string;
  /** Device identifier for cross-session tracking */
  deviceId?: string;
  /** User's email address */
  email?: string;
  /** User's phone number */
  phone?: string;
  /** OAuth provider information */
  oauth?: {
    /** OAuth provider name (e.g., 'google', 'github') */
    provider: string;
    [key: string]: any;
  };
  /** Additional custom attributes about the user */
  traits?: Record<string, any>;
  /** ISO 8601 timestamp of when the identify event occurred */
  timestamp?: string;
  /** Custom key for deduplication of identify events */
  dedupeKey?: string;
}

interface UseUmbrellaModeReturn {
  open: () => Promise<void>;
  close: () => Promise<void>;
  isOpen: boolean;
  isClosed: boolean;
  isLoading: boolean;
}

export const useUmbrellaMode = (): UseUmbrellaModeReturn => {
  const context = useContext(UmbrellaModeContext);
  if (!context) {
    throw new Error(
      "useUmbrellaMode must be used within a UmbrellaModeProvider"
    );
  }

  return {
    open: () => context.open(),
    close: () => context.close(),
    isOpen: context.isOpen,
    isClosed: context.isClosed,
    isLoading: context.isLoading,
  };
};
