import { ArrowUp, SendIcon } from "lucide-react";
import { widgetBackground, widgetPadding } from "./widger-container";
import { Button } from "./components/button";

export const WidgetInput = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 0,
        padding: `${widgetPadding}px`,
        gap: 8,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <input
        type="text"
        placeholder="Ask anything..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#000000",
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontVariantLigatures: "none",
        }}
      />
      <Button size="icon">
        <ArrowUp size={16} />
      </Button>
    </div>
  );
};
