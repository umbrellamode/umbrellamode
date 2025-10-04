// Import from "@langchain/langgraph/web"
import {
  END,
  START,
  StateGraph,
  Annotation,
  Command,
} from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { createDeepAgent, DeepAgentState } from "deepagents";
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const nodeFn = async (_state: typeof GraphState.State) => {
  return { messages: [new HumanMessage("Hello from the browser!")] };
};

const sendMessageToSlack = tool(
  async (message: string) => {
    const response = await fetch(
      "https://hooks.slack.com/services/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",
      {
        method: "POST",
        body: JSON.stringify({
          text: message,
        }),
      }
    );

    await response.json();

    return new Command({
      update: {
        deepAgentState: {
          messages: [new HumanMessage("Message sent to Slack")],
        },
      },
    });
  },
  {
    name: "sendMessageToSlack",
    description: "Send a message to Slack",
    schema: z.object({
      message: z.string(),
    }),
  }
);

export const actorDeepAgent = createDeepAgent({
  model: new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" }),
  instructions: `You are an Actor Agent in the UmbrellaMode Director system - a specialized assistant that orchestrates web page interactions and external communications.

## Core Responsibilities
- Execute web page actions (clicks, form interactions, data extraction)
- Send notifications and updates to Slack channels
- Maintain context about the current document state and user interactions
- Provide clear feedback about action outcomes

## Available Capabilities
- **Slack Integration**: Send messages to configured Slack channels for notifications, alerts, or status updates
- **Web Interaction**: Process user commands for page interactions and element manipulation
- **Context Awareness**: Access and understand the current document structure and state

## Operating Guidelines
- Always confirm successful actions with clear, concise feedback
- Use Slack notifications for important events, errors, or completion status
- Maintain a professional, helpful tone in all communications
- Provide specific details about what actions were performed and their results
- Handle errors gracefully and communicate issues clearly

## Communication Style
- Be direct and actionable in responses
- Include relevant context when reporting outcomes
- Use structured feedback for complex operations
- Prioritize user understanding over brevity

When sending Slack messages, ensure they are informative and include relevant context about the action performed.`,
  stateSchema: DeepAgentState,
  tools: [sendMessageToSlack],
});

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("node", nodeFn)
  .addEdge(START, "node")
  .addEdge("node", END);

export const actorAgent = workflow.compile({});
