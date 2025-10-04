"use client";

import { DirectorConfig } from "../../types/director.types";
import { DocumentNotFoundError } from "../utils";
import { Actor } from "./actor";
import { actorAgent } from "./actor/agent";
import { captureDocumentContext } from "./helpers/capture-document-context";

class Director extends Actor {
  private document: Document | null = null;

  constructor(args: DirectorConfig = {}) {
    super();
    // We need to capture the context of the html page that we are on
    this.document = captureDocumentContext();
  }

  async act(selector: string) {
    this.#validateDocumentContext();

    // Use the Runnable
    const finalState = await actorAgent.invoke({ messages: [] });

    console.log("Actor Agent: ", finalState);

    // await super.click(selector);
  }

  async logDocumentContext() {
    this.#validateDocumentContext();

    console.log(this.document);
  }

  #validateDocumentContext() {
    if (!this.document) {
      throw new DocumentNotFoundError(
        "Document context not found. Please ensure the page is loaded."
      );
    }
  }
}

export { Director };
