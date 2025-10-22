import { InputActionData, BaseElementInfo, ViewportInfo } from "../types";
import { hashValue, shouldExcludeField } from "./hash-value";

/**
 * Debounce map to track input timers
 */
const debounceTimers = new Map<Element, number>();

/**
 * Generate CSS selector for an element (reused from track-button-click)
 */
function generateSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    if (current.className && typeof current.className === "string") {
      const classes = current.className
        .split(" ")
        .filter((cls) => cls.trim())
        .map((cls) => `.${cls}`)
        .join("");
      if (classes) {
        selector += classes;
      }
    }

    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(" > ");
}

/**
 * Extract all attributes from an element
 */
function extractAttributes(element: Element): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr) {
      attributes[attr.name] = attr.value;
    }
  }

  return attributes;
}

/**
 * Get associated label for an input element
 */
function getAssociatedLabel(element: Element): string | undefined {
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      return label.textContent?.trim() || undefined;
    }
  }

  // Check for parent label
  const parentLabel = element.closest("label");
  if (parentLabel) {
    return parentLabel.textContent?.trim() || undefined;
  }

  return undefined;
}

/**
 * Check if an element is a text input field
 */
export function isTextInputElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  const inputType = (element as HTMLInputElement).type?.toLowerCase();

  // Standard input elements
  if (tagName === "input") {
    const textInputTypes = [
      "text",
      "email",
      "password",
      "search",
      "tel",
      "url",
      "number",
      "date",
      "time",
      "datetime-local",
      "month",
      "week",
    ];
    return textInputTypes.includes(inputType || "text");
  }

  // Textarea elements
  if (tagName === "textarea") {
    return true;
  }

  // Contenteditable elements
  if (element.hasAttribute("contenteditable")) {
    return true;
  }

  return false;
}

/**
 * Track input completion (debounced or on blur)
 */
export async function trackInputCompletion(
  element: Element,
  trigger: "debounce" | "blur"
): Promise<InputActionData & { timestamp: string }> {
  const rect = element.getBoundingClientRect();
  const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
  const value = inputElement.value || "";

  // Get base element info
  const baseElementInfo: BaseElementInfo = {
    tagName: element.tagName,
    selector: generateSelector(element),
    id: element.id || undefined,
    className: element.className || "",
    position: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    },
    attributes: extractAttributes(element),
  };

  // Hash the value (skip if it's a sensitive field)
  const fieldName = inputElement.name || "";
  const fieldType = inputElement.type || "";
  const shouldHash = !shouldExcludeField(fieldName, fieldType);

  const hashedValue = shouldHash
    ? await hashValue(value)
    : { hash: "[EXCLUDED]", length: value.length, isEmpty: value.length === 0 };

  return {
    type: "input",
    timestamp: new Date().toISOString(),
    element: {
      ...baseElementInfo,
      name: fieldName || undefined,
      inputType: fieldType || undefined,
      placeholder: inputElement.placeholder || undefined,
      label: getAssociatedLabel(element),
    },
    value: hashedValue,
    trigger,
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}

/**
 * Handle input event with debouncing
 */
export function handleInputEvent(
  event: Event,
  callback: (action: InputActionData & { timestamp: string }) => void
): void {
  const element = event.target as Element;

  // Clear existing timer for this element
  const existingTimer = debounceTimers.get(element);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Set new timer
  const timer = window.setTimeout(async () => {
    try {
      const action = await trackInputCompletion(element, "debounce");
      callback(action);
    } catch (error) {
      console.warn("Failed to track input completion:", error);
    }
    debounceTimers.delete(element);
  }, 1000); // 1 second debounce

  debounceTimers.set(element, timer);
}

/**
 * Handle blur event (immediate tracking)
 */
export function handleBlurEvent(
  event: Event,
  callback: (action: InputActionData & { timestamp: string }) => void
): void {
  const element = event.target as Element;

  // Clear any pending debounce timer
  const existingTimer = debounceTimers.get(element);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    debounceTimers.delete(element);
  }

  // Track immediately on blur
  trackInputCompletion(element, "blur")
    .then(callback)
    .catch((error) => {
      console.warn("Failed to track input blur:", error);
    });
}

/**
 * Clean up debounce timers (call when widget closes)
 */
export function cleanupInputTracking(): void {
  debounceTimers.forEach((timer) => {
    window.clearTimeout(timer);
  });
  debounceTimers.clear();
}
