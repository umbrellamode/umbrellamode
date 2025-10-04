import u from "umbrellajs";

const ActionType = {
  CLICK: "click",
  TYPE: "type",
};

type ActionType = (typeof ActionType)[keyof typeof ActionType];

export class Actor {
  async click(selector: string) {
    // Click the element
    const elements = u(selector);
    elements.trigger("click");
  }

  async type(selector: string, text: string) {
    // Type the text into the element
    const elements = u(selector);
    elements.trigger("type", text);
  }
}
