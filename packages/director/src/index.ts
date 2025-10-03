import { DirectorConfig } from "../types/director.types";

class Director {
  constructor(args: DirectorConfig = {}) {}

  async act(message: string) {
    console.log(`Acting... ${message}`);
  }
}

export { Director };
