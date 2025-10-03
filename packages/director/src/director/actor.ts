import u from "umbrellajs";

export class Actor {
  async click(selector: string) {
    // Click the element
    const elements = u(selector);
    elements.trigger("click");
  }
}
