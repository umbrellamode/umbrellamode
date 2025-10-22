import { HoverActionData, BaseElementInfo } from "../types";

/**
 * Hover tracking state
 */
const hoverTimers = new Map<Element, number>();
const hoverStartTimes = new Map<Element, number>();

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
 * Get associated label for an element
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
 * Check if an element is hoverable (has meaningful content or is interactive)
 */
export function isHoverableElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  // Interactive elements
  if (["button", "a", "input", "select", "textarea"].includes(tagName)) {
    return true;
  }

  // Elements with click handlers
  const clickAttributes = ["onclick", "data-click", "data-action"];
  if (clickAttributes.some((attr) => element.hasAttribute(attr))) {
    return true;
  }

  // Elements with meaningful text content
  const textContent = element.textContent?.trim();
  if (textContent && textContent.length > 0) {
    return true;
  }

  // Elements with images
  if (element.querySelector("img")) {
    return true;
  }

  // Elements with specific roles
  const role = element.getAttribute("role");
  if (role && ["button", "link", "menuitem", "tab"].includes(role)) {
    return true;
  }

  // Elements with title or aria-label
  if (element.hasAttribute("title") || element.hasAttribute("aria-label")) {
    return true;
  }

  return false;
}

/**
 * Track hover completion
 */
export function trackHoverCompletion(
  element: Element,
  callback: (action: HoverActionData & { timestamp: string }) => void
): void {
  const startTime = hoverStartTimes.get(element);
  if (!startTime) return;

  const duration = Date.now() - startTime;
  const rect = element.getBoundingClientRect();

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

  const action: HoverActionData & { timestamp: string } = {
    type: "hover",
    timestamp: new Date().toISOString(),
    element: {
      ...baseElementInfo,
      text: element.textContent?.trim() || "",
      label: getAssociatedLabel(element),
    },
    duration,
    isLongHover: duration >= 5000, // 5 seconds
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  callback(action);
}

/**
 * Handle mouse enter event
 */
export function handleMouseEnter(
  event: MouseEvent,
  callback: (action: HoverActionData & { timestamp: string }) => void
): void {
  const element = event.target as Element;

  // Clear any existing timer for this element
  const existingTimer = hoverTimers.get(element);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  // Record start time
  hoverStartTimes.set(element, Date.now());

  // Set timer for 5 seconds
  const timer = window.setTimeout(() => {
    trackHoverCompletion(element, callback);
    hoverTimers.delete(element);
    hoverStartTimes.delete(element);
  }, 5000);

  hoverTimers.set(element, timer);
}

/**
 * Handle mouse leave event
 */
export function handleMouseLeave(
  event: MouseEvent,
  callback: (action: HoverActionData & { timestamp: string }) => void
): void {
  const element = event.target as Element;

  // Clear timer
  const existingTimer = hoverTimers.get(element);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    hoverTimers.delete(element);
  }

  // Track hover completion if it was a meaningful duration (at least 1 second)
  const startTime = hoverStartTimes.get(element);
  if (startTime) {
    const duration = Date.now() - startTime;
    if (duration >= 1000) {
      // Only track hovers that lasted at least 1 second
      trackHoverCompletion(element, callback);
    }
    hoverStartTimes.delete(element);
  }
}

/**
 * Clean up hover tracking (call when widget closes)
 */
export function cleanupHoverTracking(): void {
  hoverTimers.forEach((timer) => {
    window.clearTimeout(timer);
  });
  hoverTimers.clear();
  hoverStartTimes.clear();
}
