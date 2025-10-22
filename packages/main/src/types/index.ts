export * from "./actor.types";
export * from "./director.types";

/**
 * Base element information shared across all action types
 */
export interface BaseElementInfo {
  /** HTML tag name */
  tagName: string;
  /** Unique CSS selector for the element */
  selector: string;
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
}

/**
 * Viewport information shared across all action types
 */
export interface ViewportInfo {
  scrollX: number;
  scrollY: number;
  width: number;
  height: number;
}

/**
 * Click action data
 */
export interface ClickActionData {
  type: "click";
  element: BaseElementInfo & {
    /** Text content of the element */
    text: string;
  };
  viewport: ViewportInfo;
}

/**
 * Input action data
 */
export interface InputActionData {
  type: "input";
  element: BaseElementInfo & {
    /** Input field name */
    name?: string;
    /** Input field type */
    inputType?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Associated label text */
    label?: string;
  };
  /** Hashed input value */
  value: {
    hash: string;
    length: number;
    isEmpty: boolean;
  };
  /** Trigger that caused this action (debounce or blur) */
  trigger: "debounce" | "blur";
  viewport: ViewportInfo;
}

/**
 * Form submission action data
 */
export interface FormSubmitActionData {
  type: "form_submit";
  element: BaseElementInfo & {
    /** Form action URL */
    action?: string;
    /** Form method */
    method?: string;
    /** Number of fields in the form */
    fieldCount: number;
  };
  /** Hashed form data */
  formData: Record<string, { hash: string; length: number; isEmpty: boolean }>;
  /** Whether form validation passed */
  isValid: boolean;
  viewport: ViewportInfo;
}

/**
 * Select change action data
 */
export interface SelectChangeActionData {
  type: "select_change";
  element: BaseElementInfo & {
    /** Select field name */
    name?: string;
    /** Associated label text */
    label?: string;
    /** Number of options */
    optionCount: number;
    /** Whether multiple selection is allowed */
    isMultiple: boolean;
  };
  /** Selected option(s) */
  selectedOptions: Array<{
    text: string;
    value: string;
  }>;
  viewport: ViewportInfo;
}

/**
 * Scroll action data
 */
export interface ScrollActionData {
  type: "scroll";
  /** Scroll depth as percentage of page */
  depthPercentage: number;
  /** Scroll position */
  position: {
    x: number;
    y: number;
  };
  /** Scroll direction */
  direction: "up" | "down" | "left" | "right";
  /** Scroll velocity (pixels per second) */
  velocity: number;
  /** Whether this is a milestone (25%, 50%, 75%, 100%) */
  isMilestone: boolean;
  viewport: ViewportInfo;
}

/**
 * Network request action data
 */
export interface NetworkRequestActionData {
  type: "network_request";
  /** Request URL (sanitized) */
  url: string;
  /** HTTP method */
  method: string;
  /** Response status code */
  statusCode?: number;
  /** Request duration in milliseconds */
  duration: number;
  /** Request size in bytes */
  requestSize?: number;
  /** Response size in bytes */
  responseSize?: number;
  /** Whether request was successful */
  isSuccess: boolean;
  /** Error message if request failed */
  error?: string;
  viewport: ViewportInfo;
}

/**
 * Union type for all user actions
 */
export type UserAction = (
  | ClickActionData
  | InputActionData
  | FormSubmitActionData
  | SelectChangeActionData
  | ScrollActionData
  | NetworkRequestActionData
) & {
  /** ISO timestamp when the action occurred */
  timestamp: string;
};
