import { DirectorConfig } from "../../types/director.types";
import { DocumentNotFoundError } from "../utils";
import { captureDocumentContext } from "./helpers/capture-document-context";

class Director {
  private document: Document | null = null;

  constructor(args: DirectorConfig = {}) {
    // We need to capture the context of the html page that we are on
    this.document = captureDocumentContext();
  }

  async act(message: string) {
    this.#validateDocumentContext();

    console.log(`Acting... ${message}`);
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
