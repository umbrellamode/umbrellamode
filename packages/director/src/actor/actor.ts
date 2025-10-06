import {
  ActorClickActionsArgs,
  ActorTypeActionsArgs,
  ActorClearActionsArgs,
  ActorWaitForElementActionsArgs,
  ActorScrollToActionsArgs,
  ActorScrollByActionsArgs,
  ActorScrollToElementActionsArgs,
  ActorScrollToElementTopActionsArgs,
  ActorScrollToElementBottomActionsArgs,
  ActorScrollPageDownActionsArgs,
  ActorScrollPageUpActionsArgs,
  ActorGetScrollPositionActionsArgs,
  ActorIsElementInViewportActionsArgs,
  ActorFocusActionsArgs,
  ActorBlurActionsArgs,
  ActorTypeFastActionsArgs,
} from "../types/actor.types";

export class Actor {
  /**
   * Clicks on an element using native DOM events
   *
   * This method finds the element by selector, focuses it, and dispatches a native
   * click event. It works with all clickable elements including buttons, links,
   * and custom elements with click handlers.
   *
   * @param args - Click action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * // Click a button
   * await actor.click({ selector: '#submit-button' });
   *
   * // Click using data attributes
   * await actor.click({ selector: '[data-testid="save-btn"]' });
   *
   * // Click a link
   * await actor.click({ selector: 'a[href="/dashboard"]' });
   * ```
   */
  async click({ selector }: ActorClickActionsArgs) {
    // Find the element using native DOM methods
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    // Focus the element first to ensure it's interactive
    if (element instanceof HTMLElement) {
      element.focus();
    }

    // Create and dispatch a click event
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    element.dispatchEvent(clickEvent);
  }

  /**
   * Types text into an input element with optional typing simulation
   *
   * This method supports input elements, textareas, and contenteditable elements.
   * It uses native DOM setters to bypass React's synthetic events and properly
   * triggers input and change events. When simulateTyping is true, it types
   * character by character with delays to mimic human behavior.
   *
   * @param args - Type action arguments
   * @param args.selector - CSS selector to target the input element
   * @param args.text - Text to type into the element
   * @param args.simulateTyping - Whether to simulate human-like typing with delays
   *
   * @throws {Error} When element is not found or not a supported input type
   *
   * @example
   * ```typescript
   * // Fast typing (recommended for most cases)
   * await actor.type({
   *   selector: '#username',
   *   text: 'john.doe@example.com',
   *   simulateTyping: false
   * });
   *
   * // Simulated typing for more realistic user interaction
   * await actor.type({
   *   selector: '#message',
   *   text: 'Hello, how are you?',
   *   simulateTyping: true
   * });
   *
   * // Works with different input types
   * await actor.type({ selector: 'input[type="email"]', text: 'test@example.com', simulateTyping: false });
   * await actor.type({ selector: 'textarea[name="comment"]', text: 'Great product!', simulateTyping: false });
   * ```
   */
  async type({ selector, text, simulateTyping }: ActorTypeActionsArgs) {
    // Find the element using native DOM methods
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    // Focus the element first
    if (element instanceof HTMLElement) {
      element.focus();
    }

    // Handle different types of input elements
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      // Store native setter to bypass React's setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      if (simulateTyping) {
        // Clear existing content first
        if (element instanceof HTMLInputElement && nativeInputValueSetter) {
          nativeInputValueSetter.call(element, "");
        } else if (
          element instanceof HTMLTextAreaElement &&
          nativeTextAreaValueSetter
        ) {
          nativeTextAreaValueSetter.call(element, "");
        }

        // Simulate typing character by character
        let currentValue = "";
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (!char) continue;

          currentValue += char;

          // Use native setter to bypass React
          if (element instanceof HTMLInputElement && nativeInputValueSetter) {
            nativeInputValueSetter.call(element, currentValue);
          } else if (
            element instanceof HTMLTextAreaElement &&
            nativeTextAreaValueSetter
          ) {
            nativeTextAreaValueSetter.call(element, currentValue);
          }

          // Dispatch input event
          const inputEvent = new InputEvent("input", {
            data: char,
            inputType: "insertText",
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(inputEvent);

          // Small delay to simulate human typing
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } else {
        // Fast typing - set value directly using native setter
        if (element instanceof HTMLInputElement && nativeInputValueSetter) {
          nativeInputValueSetter.call(element, text);
        } else if (
          element instanceof HTMLTextAreaElement &&
          nativeTextAreaValueSetter
        ) {
          nativeTextAreaValueSetter.call(element, text);
        }

        // Dispatch input event
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(inputEvent);
      }

      // Dispatch final change event
      const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(changeEvent);
    } else if (
      element instanceof HTMLElement &&
      element.contentEditable === "true"
    ) {
      // Handle contenteditable elements
      element.textContent = "";

      if (simulateTyping) {
        // Simulate typing character by character for contenteditable
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (!char) continue;

          // Add the character to the current text content
          element.textContent += char;

          // Dispatch input event with the character data
          const inputEvent = new InputEvent("input", {
            data: char,
            inputType: "insertText",
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(inputEvent);

          // Small delay to simulate human typing
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } else {
        // Fast typing - set text content directly
        element.textContent = text;

        // Dispatch input event
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(inputEvent);
      }
    } else {
      throw new Error(
        `Element with selector "${selector}" is not a supported input element (input, textarea, or contenteditable)`
      );
    }
  }

  /**
   * Clears the content of an input element
   *
   * This method removes all text from input elements, textareas, and contenteditable
   * elements. It properly triggers input and change events to notify React components
   * of the change.
   *
   * @param args - Clear action arguments
   * @param args.selector - CSS selector to target the input element
   *
   * @throws {Error} When element is not found or not a supported input type
   *
   * @example
   * ```typescript
   * // Clear a search input
   * await actor.clear({ selector: '#search-input' });
   *
   * // Clear a textarea
   * await actor.clear({ selector: 'textarea[name="description"]' });
   *
   * // Clear contenteditable div
   * await actor.clear({ selector: '[contenteditable="true"]' });
   * ```
   */
  async clear({ selector }: ActorClearActionsArgs) {
    // Clear the content of an input element
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    if (element instanceof HTMLElement) {
      element.focus();
    }

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.value = "";

      // Dispatch events to notify of the change
      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
      });

      const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(inputEvent);
      element.dispatchEvent(changeEvent);
    } else if (
      element instanceof HTMLElement &&
      element.contentEditable === "true"
    ) {
      element.textContent = "";

      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(inputEvent);
    } else {
      throw new Error(
        `Element with selector "${selector}" is not a supported input element (input, textarea, or contenteditable)`
      );
    }
  }

  /**
   * Waits for an element to appear in the DOM
   *
   * This method uses a MutationObserver to watch for DOM changes and resolves
   * when the target element becomes available. It's useful for waiting for
   * dynamically loaded content or elements that appear after async operations.
   *
   * @param args - Wait for element action arguments
   * @param args.selector - CSS selector to wait for
   * @param args.timeout - Maximum time to wait in milliseconds (default: 5000)
   *
   * @returns Promise that resolves to the found Element
   *
   * @throws {Error} When element is not found within the timeout period
   *
   * @example
   * ```typescript
   * // Wait for a loading spinner to appear
   * await actor.waitForElement({ selector: '.loading-spinner' });
   *
   * // Wait for success message with custom timeout
   * await actor.waitForElement({
   *   selector: '.success-message',
   *   timeout: 10000
   * });
   *
   * // Wait for dynamically loaded content
   * await actor.waitForElement({ selector: '[data-testid="dynamic-content"]' });
   * ```
   */
  async waitForElement({
    selector,
    timeout = 5000,
  }: ActorWaitForElementActionsArgs): Promise<Element> {
    // Wait for an element to appear in the DOM
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Set timeout
      setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(
            `Element with selector "${selector}" not found within ${timeout}ms`
          )
        );
      }, timeout);
    });
  }

  /**
   * Scrolls to specific coordinates on the page
   *
   * This method scrolls the page to the exact pixel coordinates specified.
   * Use this for precise scroll positioning or when you know the exact
   * scroll position you want to reach.
   *
   * @param args - Scroll to action arguments
   * @param args.x - Horizontal scroll position in pixels
   * @param args.y - Vertical scroll position in pixels
   *
   * @example
   * ```typescript
   * // Scroll to top of page
   * await actor.scrollTo({ x: 0, y: 0 });
   *
   * // Scroll to specific position
   * await actor.scrollTo({ x: 0, y: 500 });
   *
   * // Scroll horizontally (for horizontal scrollable content)
   * await actor.scrollTo({ x: 200, y: 0 });
   * ```
   */
  async scrollTo({ x, y }: ActorScrollToActionsArgs) {
    // Scroll to specific coordinates
    window.scrollTo(x, y);
  }

  /**
   * Scrolls to the top of the page
   *
   * Convenience method that scrolls to the very top of the page (0, 0).
   * Equivalent to calling scrollTo({ x: 0, y: 0 }).
   *
   * @example
   * ```typescript
   * await actor.scrollToTop();
   * ```
   */
  async scrollToTop() {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }

  /**
   * Scrolls to the bottom of the page
   *
   * Convenience method that scrolls to the very bottom of the page.
   * Uses document.documentElement.scrollHeight to determine the maximum scroll position.
   *
   * @example
   * ```typescript
   * await actor.scrollToBottom();
   * ```
   */
  async scrollToBottom() {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  /**
   * Scrolls by relative amounts from the current position
   *
   * This method scrolls relative to the current scroll position. Positive values
   * scroll down/right, negative values scroll up/left. Useful for incremental
   * scrolling or when you want to scroll a specific amount regardless of current position.
   *
   * @param args - Scroll by action arguments
   * @param args.x - Horizontal scroll amount in pixels (positive = right, negative = left)
   * @param args.y - Vertical scroll amount in pixels (positive = down, negative = up)
   *
   * @example
   * ```typescript
   * // Scroll down 200px
   * await actor.scrollBy({ x: 0, y: 200 });
   *
   * // Scroll up 100px
   * await actor.scrollBy({ x: 0, y: -100 });
   *
   * // Scroll right 50px
   * await actor.scrollBy({ x: 50, y: 0 });
   *
   * // Scroll diagonally
   * await actor.scrollBy({ x: 100, y: -50 });
   * ```
   */
  async scrollBy({ x, y }: ActorScrollByActionsArgs) {
    // Scroll by relative amounts
    window.scrollBy(x, y);
  }

  /**
   * Scrolls an element into view with customizable options
   *
   * This method scrolls the page so that the specified element becomes visible.
   * It uses the native scrollIntoView API with customizable options for
   * fine-tuning the scroll behavior and positioning.
   *
   * @param args - Scroll to element action arguments
   * @param args.selector - CSS selector to target the element
   * @param args.options - ScrollIntoView options for fine-tuning scroll behavior
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * // Scroll to center of viewport (default)
   * await actor.scrollToElement({ selector: '#section-3' });
   *
   * // Scroll to top of viewport
   * await actor.scrollToElement({
   *   selector: '.important-content',
   *   options: { block: 'start' }
   * });
   *
   * // Scroll to bottom of viewport
   * await actor.scrollToElement({
   *   selector: '#footer',
   *   options: { block: 'end' }
   * });
   *
   * // Smooth scrolling
   * await actor.scrollToElement({
   *   selector: '#hero',
   *   options: { behavior: 'smooth', block: 'center' }
   * });
   * ```
   */
  async scrollToElement({
    selector,
    options = {},
  }: ActorScrollToElementActionsArgs) {
    // Scroll an element into view
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    // Default scroll options for smooth behavior
    const defaultOptions: ScrollIntoViewOptions = {
      behavior: "smooth",
      block: "center",
      inline: "center",
      ...options,
    };

    element.scrollIntoView(defaultOptions);
  }

  /**
   * Scrolls an element to the top of the viewport
   *
   * Convenience method that scrolls the specified element to the top of the
   * viewport. Equivalent to calling scrollToElement with { block: 'start' }.
   *
   * @param args - Scroll to element top action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * await actor.scrollToElementTop({ selector: '#header' });
   * await actor.scrollToElementTop({ selector: '.navigation' });
   * ```
   */
  async scrollToElementTop({ selector }: ActorScrollToElementTopActionsArgs) {
    // Scroll element to the top of the viewport
    await this.scrollToElement({ selector, options: { block: "start" } });
  }

  /**
   * Scrolls an element to the bottom of the viewport
   *
   * Convenience method that scrolls the specified element to the bottom of the
   * viewport. Equivalent to calling scrollToElement with { block: 'end' }.
   *
   * @param args - Scroll to element bottom action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * await actor.scrollToElementBottom({ selector: '#footer' });
   * await actor.scrollToElementBottom({ selector: '.contact-info' });
   * ```
   */
  async scrollToElementBottom({
    selector,
  }: ActorScrollToElementBottomActionsArgs) {
    // Scroll element to the bottom of the viewport
    await this.scrollToElement({ selector, options: { block: "end" } });
  }

  /**
   * Scrolls down by one viewport height
   *
   * Convenience method that scrolls down by the height of the current viewport.
   * Useful for pagination or step-by-step scrolling through content.
   *
   * @param args - Scroll page down action arguments (empty object)
   *
   * @example
   * ```typescript
   * await actor.scrollPageDown({});
   * ```
   */
  async scrollPageDown({}: ActorScrollPageDownActionsArgs) {
    // Scroll down by one viewport height
    const viewportHeight = window.innerHeight;
    await this.scrollBy({ x: 0, y: viewportHeight });
  }

  /**
   * Scrolls up by one viewport height
   *
   * Convenience method that scrolls up by the height of the current viewport.
   * Useful for pagination or step-by-step scrolling through content.
   *
   * @param args - Scroll page up action arguments (empty object)
   *
   * @example
   * ```typescript
   * await actor.scrollPageUp({});
   * ```
   */
  async scrollPageUp({}: ActorScrollPageUpActionsArgs) {
    // Scroll up by one viewport height
    const viewportHeight = window.innerHeight;
    await this.scrollBy({ x: 0, y: -viewportHeight });
  }

  /**
   * Gets the current scroll position of the page
   *
   * Returns the current horizontal and vertical scroll positions in pixels.
   * Useful for tracking scroll state or implementing custom scroll behaviors.
   *
   * @param args - Get scroll position action arguments (empty object)
   *
   * @returns Object containing x and y scroll positions in pixels
   *
   * @example
   * ```typescript
   * const position = actor.getScrollPosition({});
   * console.log(`Current scroll: ${position.x}, ${position.y}`);
   *
   * // Use for conditional logic
   * if (position.y > 1000) {
   *   console.log('User has scrolled past 1000px');
   * }
   * ```
   */
  getScrollPosition({}: ActorGetScrollPositionActionsArgs): {
    x: number;
    y: number;
  } {
    // Get current scroll position
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop,
    };
  }

  /**
   * Checks if an element is currently visible in the viewport
   *
   * This method determines whether the specified element is fully visible within
   * the current viewport. Useful for implementing lazy loading, scroll-based
   * animations, or conditional logic based on element visibility.
   *
   * @param args - Is element in viewport action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @returns True if element is fully visible in viewport, false otherwise
   *
   * @example
   * ```typescript
   * const isVisible = actor.isElementInViewport({ selector: '#hero-section' });
   * if (isVisible) {
   *   console.log('Hero section is visible!');
   * }
   *
   * // Use for lazy loading
   * if (actor.isElementInViewport({ selector: '.lazy-image' })) {
   *   // Load the image
   * }
   * ```
   */
  isElementInViewport({
    selector,
  }: ActorIsElementInViewportActionsArgs): boolean {
    // Check if an element is currently visible in the viewport
    const element = document.querySelector(selector);

    if (!element) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  }

  /**
   * Focuses an element
   *
   * This method sets focus to the specified element, making it the active element
   * for keyboard input. Useful for preparing elements for typing or ensuring
   * proper tab order behavior.
   *
   * @param args - Focus action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * await actor.focus({ selector: '#email-input' });
   * await actor.focus({ selector: 'input[name="password"]' });
   *
   * // Focus before typing
   * await actor.focus({ selector: '#search' });
   * await actor.type({ selector: '#search', text: 'query', simulateTyping: false });
   * ```
   */
  focus({ selector }: ActorFocusActionsArgs) {
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    if (element instanceof HTMLElement) {
      element.focus();
    }
  }

  /**
   * Removes focus from an element
   *
   * This method removes focus from the specified element, which can trigger
   * blur events and validation. Useful for testing form validation or
   * ensuring proper focus management.
   *
   * @param args - Blur action arguments
   * @param args.selector - CSS selector to target the element
   *
   * @throws {Error} When element is not found
   *
   * @example
   * ```typescript
   * await actor.blur({ selector: '#search-input' });
   * await actor.blur({ selector: 'textarea[name="comment"]' });
   *
   * // Test form validation on blur
   * await actor.type({ selector: '#email', text: 'invalid-email', simulateTyping: false });
   * await actor.blur({ selector: '#email' });
   * // Check for validation error
   * ```
   */
  blur({ selector }: ActorBlurActionsArgs) {
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    if (element instanceof HTMLElement) {
      element.blur();
    }
  }

  /**
   * Fast typing without simulation (convenience method)
   *
   * This is a convenience method that calls the type method with simulateTyping
   * set to false. It's equivalent to calling type({ selector, text, simulateTyping: false })
   * but provides a cleaner API for the common case of fast typing.
   *
   * @param args - Type fast action arguments
   * @param args.selector - CSS selector to target the input element
   * @param args.text - Text to type into the element
   *
   * @throws {Error} When element is not found or not a supported input type
   *
   * @example
   * ```typescript
   * // Fast typing for form fields
   * await actor.typeFast({ selector: '#username', text: 'john.doe' });
   * await actor.typeFast({ selector: '#password', text: 'secret123' });
   *
   * // Fast typing for search
   * await actor.typeFast({ selector: '#search', text: 'query' });
   *
   * // Equivalent to:
   * // await actor.type({ selector: '#username', text: 'john.doe', simulateTyping: false });
   * ```
   */
  async typeFast({ selector, text }: ActorTypeFastActionsArgs) {
    return this.type({ selector, text, simulateTyping: false });
  }
}
