import { FormSubmitActionData, BaseElementInfo } from "../types";
import { hashFormData, shouldExcludeField } from "./hash-value";

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
 * Check if an element is a form
 */
export function isFormElement(element: Element): boolean {
  return element.tagName.toLowerCase() === "form";
}

/**
 * Collect form data from all form fields
 */
function collectFormData(form: HTMLFormElement): Record<string, string> {
  const formData: Record<string, string> = {};
  const formDataObj = new FormData(form);

  // Get all form elements
  const elements = form.elements;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    // Skip elements without names
    if (!element.name) continue;

    // Skip disabled elements
    if (element.disabled) continue;

    // Skip file inputs (we don't want to hash file contents)
    if (element.type === "file") continue;

    // Get the value
    let value = "";
    if (element.type === "checkbox" || element.type === "radio") {
      const input = element as HTMLInputElement;
      value = input.checked ? input.value || "true" : "false";
    } else if (element.tagName.toLowerCase() === "select") {
      const select = element as HTMLSelectElement;
      if (select.multiple) {
        const selectedOptions = Array.from(select.selectedOptions);
        value = selectedOptions.map((option) => option.value).join(",");
      } else {
        value = select.value;
      }
    } else {
      value = element.value || "";
    }

    // Only include non-empty values or checkboxes/radios
    if (value || element.type === "checkbox" || element.type === "radio") {
      formData[element.name] = value;
    }
  }

  return formData;
}

/**
 * Check if form validation passes
 */
function isFormValid(form: HTMLFormElement): boolean {
  // Check if form has validation errors
  const invalidElements = form.querySelectorAll(":invalid");
  if (invalidElements.length > 0) {
    return false;
  }

  // Check for custom validation attributes
  const requiredElements = form.querySelectorAll("[required]");
  for (let i = 0; i < requiredElements.length; i++) {
    const element = requiredElements[i] as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    if (!element.value || element.value.trim() === "") {
      return false;
    }
  }

  return true;
}

/**
 * Track form submission
 */
export async function trackFormSubmission(
  event: Event
): Promise<FormSubmitActionData & { timestamp: string }> {
  const form = event.target as HTMLFormElement;
  const rect = form.getBoundingClientRect();

  // Get base element info
  const baseElementInfo: BaseElementInfo = {
    tagName: form.tagName,
    selector: generateSelector(form),
    id: form.id || undefined,
    className: form.className || "",
    position: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    },
    attributes: extractAttributes(form),
  };

  // Collect and hash form data
  const rawFormData = collectFormData(form);

  // Filter out sensitive fields before hashing
  const filteredFormData: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawFormData)) {
    if (!shouldExcludeField(key)) {
      filteredFormData[key] = value;
    }
  }

  const hashedFormData = await hashFormData(filteredFormData);

  // Count total fields (including excluded ones)
  const fieldCount = Object.keys(rawFormData).length;

  // Check form validation
  const isValid = isFormValid(form);

  return {
    type: "form_submit",
    timestamp: new Date().toISOString(),
    element: {
      ...baseElementInfo,
      action: form.action || undefined,
      method: form.method || "get",
      fieldCount,
    },
    formData: hashedFormData,
    isValid,
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}
