import { div } from "motion/react-client";
import { WidgetInput } from "./widget-input";
import { PoweredBy } from "./powered-by";
import { widgetPadding } from "./widger-container";

export const WidgetFooter = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 4,
        padding: `${widgetPadding}px`,
      }}
    >
      <WidgetInput />
      <PoweredBy />
    </div>
  );
};
