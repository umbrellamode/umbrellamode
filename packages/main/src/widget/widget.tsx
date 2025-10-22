import { WidgetHeader } from "./widget-header";
import { WidgetContainer } from "./widger-container";
import { WidgetMessages } from "./widget-messages";
import { WidgetFooter } from "./widget-footer";

interface WidgetConfig {
  agentName: string;
}

export const Widget = ({ agentName }: WidgetConfig) => {
  return (
    <WidgetContainer>
      <WidgetHeader agentName={agentName} />
      <WidgetMessages />
      <WidgetFooter />
    </WidgetContainer>
  );
};
