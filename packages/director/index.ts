import { HelloFunctionArgs, HelloFunctionResponse } from "./types";

/**
 * Greet a person with a custom message.
 * @param args - The arguments containing the name to greet
 * @returns A response object with the greeting message
 */
export function hello(args: HelloFunctionArgs): HelloFunctionResponse {
  console.log(`Hello, ${args.name}!`);
  return {
    message: `Hello, ${args.name}!`,
  };
}
