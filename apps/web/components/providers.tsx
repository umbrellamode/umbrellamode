"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UmbrellaModeProvider } from "../../../packages/main/src/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UmbrellaModeProvider
      apiKey={process.env.UMBRELLAMODE_API_KEY!}
      agentKey={process.env.UMBRELLAMODE_AGENT_KEY!}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </UmbrellaModeProvider>
  );
}
