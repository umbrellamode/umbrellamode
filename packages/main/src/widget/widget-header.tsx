import { XIcon } from "lucide-react";
import { div } from "motion/react-client";
import { useUmbrellaMode } from "../provider/use-umbrellamode";

interface WidgetHeaderProps {
  agentName: string;
}

export const WidgetHeader = ({ agentName }: WidgetHeaderProps) => {
  const { close } = useUmbrellaMode();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
        height: 60,
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{agentName}</p>
      <button
        aria-label="Close"
        style={{
          background: "transparent",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          color: "#999",
          padding: 0,
          lineHeight: 1,
        }}
        onClick={close}
      >
        <XIcon />
      </button>
    </div>
  );
};
