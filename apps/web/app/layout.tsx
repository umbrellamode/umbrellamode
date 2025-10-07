import { Geist, Geist_Mono } from "next/font/google";

import "@umbrellamode/ui/globals.css";
import { Providers } from "@/components/providers";
import { UmbrellaModeProvider } from "umbrellamode";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UmbrellaModeProvider apiKey={process.env.UMBRELLAMODE_API_KEY!}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </UmbrellaModeProvider>
  );
}
