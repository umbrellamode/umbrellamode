"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UmbrellaModeProvider } from "../../../packages/main/src/provider/umbrellamode-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UmbrellaModeProvider apiKey={process.env.UMBRELLAMODE_API_KEY!}>
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
