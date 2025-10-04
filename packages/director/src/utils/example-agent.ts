"use client";

// Import from "@langchain/langgraph/web"
import { END, START, StateGraph, Annotation } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { createDeepAgent, DeepAgentState } from "deepagents";
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { b } from "../../baml_client";

const extendedStateSchema = z.object({
  topic: z.string(),
  joke: z.string(),
});

const ActorAgentState = DeepAgentState.extend(extendedStateSchema.shape);

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const nodeFn = async (_state: typeof GraphState.State) => {
  return { messages: [new HumanMessage("Hello from the browser!")] };
};

const sendMessageToSlack = tool(
  async (input: { message: string }) => {
    const response = await fetch("URL_HERE", {
      method: "POST",
      body: JSON.stringify({
        text: input.message,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Slack webhook failed: ${response.status} ${response.statusText}`
      );
    }

    // Slack webhooks may return empty responses or non-JSON
    const responseText = await response.text();

    return `Message sent to Slack: "${input.message}"`;
  },
  {
    name: "sendMessageToSlack",
    description: "Send a message to Slack",
    schema: z.object({
      message: z.string(),
    }),
  }
);

const tellJoke = tool(
  async (input: { topic: string }) => {
    // const response = await b.TellJoke(input.topic);

    const response = {
      joke: "Why did the chicken cross the road? To get to the other side.",
    };

    console.log("Joke response:", response);

    if (!response.joke) {
      throw new Error("No joke returned");
    }

    return `Here's a joke about ${input.topic}: ${response.joke}`;
  },
  {
    name: "tellJoke",
    description: "Tell a joke",
    schema: z.object({
      topic: z.string(),
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
- **Joke Telling**: Generate and tell jokes on any topic using the tellJoke tool

## Operating Guidelines
- Always confirm successful actions with clear, concise feedback
- Use Slack notifications for important events, errors, or completion status
- Maintain a professional, helpful tone in all communications
- Provide specific details about what actions were performed and their results
- Handle errors gracefully and communicate issues clearly
- When telling jokes, use the tellJoke tool with a specific topic parameter
- Keep track of topics and jokes in your responses for context

## Communication Style
- Be direct and actionable in responses
- Include relevant context when reporting outcomes
- Use structured feedback for complex operations
- Prioritize user understanding over brevity

When sending Slack messages, ensure they are informative and include relevant context about the action performed.`,
  stateSchema: ActorAgentState,
  tools: [sendMessageToSlack, tellJoke],
});

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("node", nodeFn)
  .addEdge(START, "node")
  .addEdge("node", END);

export const exampleAgent = workflow.compile({});
