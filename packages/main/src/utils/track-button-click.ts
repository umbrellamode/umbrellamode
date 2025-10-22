import { UserAction } from "../types";

/**
 * Generates a unique CSS selector for an element
 */
function generateSelector(element: Element): string {
  // If element has an ID, use it
  if (element.id) {
    return `#${element.id}`;
  }

  // Build selector path from element to root
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    // Add class names if present
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

    // Add nth-child if needed for uniqueness
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
 * Extracts all attributes from an element
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
 * Checks if an element is clickable (button, link, or has click handlers)
 */
export function isClickableElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  // Standard clickable elements
  if (["button", "a"].includes(tagName)) {
    return true;
  }

  // Elements with button role
  if (element.getAttribute("role") === "button") {
    return true;
  }

  // Elements with click handlers (check for common event attributes)
  const clickAttributes = ["onclick", "data-click", "data-action"];
  if (clickAttributes.some((attr) => element.hasAttribute(attr))) {
    return true;
  }

  // Elements with cursor pointer style
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.cursor === "pointer") {
    return true;
  }

  return false;
}

/**
 * Tracks a button click and returns detailed user action data
 */
export function trackButtonClick(event: MouseEvent): UserAction {
  const element = event.target as Element;
  const rect = element.getBoundingClientRect();

  return {
    type: "click",
    timestamp: new Date().toISOString(),
    element: {
      tagName: element.tagName,
      selector: generateSelector(element),
      text: element.textContent?.trim() || "",
      id: element.id || undefined,
      className: element.className || "",
      position: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      },
      attributes: extractAttributes(element),
    },
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}
