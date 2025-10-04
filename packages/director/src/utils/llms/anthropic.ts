import { ChatAnthropic } from "@langchain/anthropic";

export const anthropic = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
});
