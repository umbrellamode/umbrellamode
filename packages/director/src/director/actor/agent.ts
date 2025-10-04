// Import from "@langchain/langgraph/web"
import { END, START, StateGraph, Annotation } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const ActionItem = z.object({
  type: z.string(),
  selector: z.string(),
});
type ActionItemType = z.infer<typeof ActionItem>;

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  documentContext: Annotation<string>({
    reducer: (x, y) => x + y,
  }),
  actionList: Annotation<ActionItemType[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const nodeFn = async (_state: typeof GraphState.State) => {
  return {
    messages: [new HumanMessage("Hello from the browser!")],
    selector: "Hello from the browser!",
  };
};

const determineSelector = tool(
  async (input: { selector: string }) => {
    return input.selector;
  },
  {
    name: "determineSelector",
    description: "Determine the selector of the element to click",
    schema: z.object({
      selector: z.string(),
    }),
  }
);

const determineActionType = tool(
  async (input: { actionType: string }) => {
    return input.actionType;
  },
  {
    name: "getAction",
    description: "Get the action to perform",
    schema: z.object({
      actionType: z.string(),
    }),
  }
);

const updateActionList = tool(
  async (input: { actionType: string; selector: string }) => {
    return {
      type: input.actionType,
      selector: input.selector,
    };
  },
  {
    name: "constructAction",
    description: "Construct the action to perform",
    schema: z.object({
      action: z.string(),
    }),
  }
);

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("node", nodeFn)
  .addEdge(START, "node")
  .addEdge("node", END);

export const actorAgent = workflow.compile({});
