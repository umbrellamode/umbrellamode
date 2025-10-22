import { useEffect, useRef, ReactNode, useState } from "react";
import { createPortal } from "react-dom";

// Widget globals CSS content - includes all Tailwind utilities and custom properties
const widgetStyles = `
/* CSS Custom Properties */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

/* Tailwind CSS Utilities */
.fixed { position: fixed; }
.right-0 { right: 0; }
.top-0 { top: 0; }
.h-screen { height: 100vh; }
.w-\\[400px\\] { width: 400px; }
.z-50 { z-index: 50; }
.border-l { border-left-width: 1px; }
.border-gray-200 { border-color: #e5e7eb; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.font-medium { font-weight: 500; }
.bg-gray-50 { background-color: #f9fafb; }
.w-full { width: 100%; }
.justify-between { justify-content: space-between; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.border-b { border-bottom-width: 1px; }
.bg-white { background-color: #ffffff; }
.h-\\[60px\\] { height: 60px; }
.m-0 { margin: 0; }
.font-semibold { font-weight: 600; }
.bg-transparent { background-color: transparent; }
.border-none { border-style: none; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.cursor-pointer { cursor: pointer; }
.text-gray-400 { color: #9ca3af; }
.p-0 { padding: 0; }
.leading-none { line-height: 1; }
.hover\\:text-gray-600:hover { color: #4b5563; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.gap-2 { gap: 0.5rem; }
.max-w-full { max-width: 100%; }
.rounded-none { border-radius: 0; }
.flex-1 { flex: 1 1 0%; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
.font-mono { font-family: 'DM Mono', ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; }
.text-black { color: #000000; }
.gap-1 { gap: 0.25rem; }
.overflow-y-auto { overflow-y: auto; }
.min-h-0 { min-height: 0; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-gray-600 { color: #4b5563; }
.h-5 { height: 1.25rem; }
.bg-red-500 { background-color: #ef4444; }
`;

interface ShadowWidgetRootProps {
  children: ReactNode;
}

export const ShadowWidgetRoot = ({ children }: ShadowWidgetRootProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowContainer, setShadowContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if shadow root already exists
    let shadowRoot = containerRef.current.shadowRoot;

    if (!shadowRoot) {
      // Create shadow root
      shadowRoot = containerRef.current.attachShadow({ mode: "open" });
    }

    // Create a container div inside shadow root
    let shadowContainer = shadowRoot.querySelector(
      "#shadow-widget-container"
    ) as HTMLElement;

    if (!shadowContainer) {
      shadowContainer = document.createElement("div");
      shadowContainer.id = "shadow-widget-container";
      shadowRoot.appendChild(shadowContainer);
    }

    // Inject compiled Tailwind CSS (only if not already present)
    if (!shadowRoot.querySelector("style[data-widget-css]")) {
      const style = document.createElement("style");
      style.setAttribute("data-widget-css", "true");
      style.textContent = widgetStyles;
      shadowRoot.appendChild(style);
    }

    // Add base styles and font imports (only if not already present)
    if (!shadowRoot.querySelector("style[data-widget-base]")) {
      const baseStyle = document.createElement("style");
      baseStyle.setAttribute("data-widget-base", "true");
      baseStyle.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        #shadow-widget-container {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          font-variant-ligatures: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          all: initial;
          display: block;
        }
      `;
      shadowRoot.appendChild(baseStyle);
    }

    console.log("Shadow DOM setup complete", shadowRoot, shadowContainer);
    setShadowContainer(shadowContainer);

    return () => {
      setShadowContainer(null);
    };
  }, []);

  if (!shadowContainer) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          pointerEvents: "none",
        }}
      />
      {createPortal(children, shadowContainer)}
    </>
  );
};
