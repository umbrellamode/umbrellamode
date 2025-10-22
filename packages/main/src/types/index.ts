export * from "./actor.types";
export * from "./director.types";

/**
 * User action tracking types
 */
export interface UserAction {
  /** Type of user action */
  type: "click";
  /** ISO timestamp when the action occurred */
  timestamp: string;
  /** Element that was clicked */
  element: {
    /** HTML tag name */
    tagName: string;
    /** Unique CSS selector for the element */
    selector: string;
    /** Text content of the element */
    text: string;
    /** Element ID if present */
    id?: string;
    /** Element class names */
    className: string;
    /** Element position and dimensions */
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    /** All element attributes */
    attributes: Record<string, string>;
  };
  /** Viewport information at time of click */
  viewport: {
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
  };
}
