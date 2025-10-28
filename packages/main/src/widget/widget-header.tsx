import { XIcon } from "lucide-react";
import { useUmbrellaMode } from "../react";
import { Button } from "./components/button";

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
        height: 60,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
        }}
      >
        {agentName}
      </p>
      <Button variant="ghost" size="icon" onClick={close}>
        <XIcon size={16} />
      </Button>
    </div>
  );
};
