import { SelectChangeActionData, BaseElementInfo } from "../types";

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
 * Get associated label for a select element
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
 * Check if an element is a select element
 */
export function isSelectElement(element: Element): boolean {
  return element.tagName.toLowerCase() === "select";
}

/**
 * Get selected options from a select element
 */
function getSelectedOptions(
  select: HTMLSelectElement
): Array<{ text: string; value: string }> {
  const selectedOptions: Array<{ text: string; value: string }> = [];

  if (select.multiple) {
    // Multi-select: get all selected options
    const selectedElements = Array.from(select.selectedOptions);
    selectedElements.forEach((option) => {
      selectedOptions.push({
        text: option.textContent?.trim() || "",
        value: option.value,
      });
    });
  } else {
    // Single select: get the selected option
    const selectedIndex = select.selectedIndex;
    if (selectedIndex >= 0 && select.options[selectedIndex]) {
      const option = select.options[selectedIndex];
      selectedOptions.push({
        text: option.textContent?.trim() || "",
        value: option.value,
      });
    }
  }

  return selectedOptions;
}

/**
 * Track select change
 */
export function trackSelectChange(
  event: Event
): SelectChangeActionData & { timestamp: string } {
  const select = event.target as HTMLSelectElement;
  const rect = select.getBoundingClientRect();

  // Get base element info
  const baseElementInfo: BaseElementInfo = {
    tagName: select.tagName,
    selector: generateSelector(select),
    id: select.id || undefined,
    className: select.className || "",
    position: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    },
    attributes: extractAttributes(select),
  };

  // Get selected options
  const selectedOptions = getSelectedOptions(select);

  // Count total options
  const optionCount = select.options.length;

  return {
    type: "select_change",
    timestamp: new Date().toISOString(),
    element: {
      ...baseElementInfo,
      name: select.name || undefined,
      label: getAssociatedLabel(select),
      optionCount,
      isMultiple: select.multiple,
    },
    selectedOptions,
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}
