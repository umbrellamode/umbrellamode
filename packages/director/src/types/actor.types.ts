/**
 * Base interface for actor actions that require a DOM selector
 */
export interface BaseActorActionsArgs {
  /** CSS selector to target the DOM element */
  selector: string;
}

/**
 * Arguments for clicking on an element
 * @example
 * ```typescript
 * await actor.click({ selector: '#submit-button' });
 * await actor.click({ selector: 'button[data-testid="save"]' });
 * ```
 */
export interface ActorClickActionsArgs extends BaseActorActionsArgs {}

/**
 * Arguments for typing text into an input element
 * @example
 * ```typescript
 * // Fast typing (recommended for most cases)
 * await actor.type({
 *   selector: '#username',
 *   text: 'john.doe@example.com',
 *   simulateTyping: false
 * });
 *
 * // Simulated typing (slower, more human-like)
 * await actor.type({
 *   selector: '#message',
 *   text: 'Hello world!',
 *   simulateTyping: true
 * });
 * ```
 */
export interface ActorTypeActionsArgs extends BaseActorActionsArgs {
  /** Text to type into the element */
  text: string;
  /** Whether to simulate human-like typing with delays */
  simulateTyping: boolean;
}

/**
 * Arguments for clearing the content of an input element
 * @example
 * ```typescript
 * await actor.clear({ selector: '#search-input' });
 * await actor.clear({ selector: 'textarea[name="description"]' });
 * ```
 */
export interface ActorClearActionsArgs extends BaseActorActionsArgs {}

/**
 * Arguments for waiting for an element to appear in the DOM
 * @example
 * ```typescript
 * // Wait up to 5 seconds (default)
 * await actor.waitForElement({ selector: '.loading-spinner' });
 *
 * // Wait up to 10 seconds
 * await actor.waitForElement({
 *   selector: '.success-message',
 *   timeout: 10000
 * });
 * ```
 */
export interface ActorWaitForElementActionsArgs extends BaseActorActionsArgs {
  /** Maximum time to wait in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Arguments for scrolling to specific coordinates
 * @example
 * ```typescript
 * await actor.scrollTo({ x: 0, y: 500 });
 * await actor.scrollTo({ x: 100, y: 0 }); // Scroll to top, 100px from left
 * ```
 */
export interface ActorScrollToActionsArgs {
  /** Horizontal scroll position in pixels */
  x: number;
  /** Vertical scroll position in pixels */
  y: number;
}

/**
 * Arguments for scrolling an element into view
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
 * ```
 */
export interface ActorScrollToElementActionsArgs extends BaseActorActionsArgs {
  /** ScrollIntoView options for fine-tuning scroll behavior */
  options?: ScrollIntoViewOptions;
}

/**
 * Arguments for scrolling an element to the top of the viewport
 * @example
 * ```typescript
 * await actor.scrollToElementTop({ selector: '#header' });
 * await actor.scrollToElementTop({ selector: '.navigation' });
 * ```
 */
export interface ActorScrollToElementTopActionsArgs
  extends BaseActorActionsArgs {}

/**
 * Arguments for scrolling an element to the bottom of the viewport
 * @example
 * ```typescript
 * await actor.scrollToElementBottom({ selector: '#footer' });
 * await actor.scrollToElementBottom({ selector: '.contact-info' });
 * ```
 */
export interface ActorScrollToElementBottomActionsArgs
  extends BaseActorActionsArgs {}

/**
 * Arguments for scrolling by relative amounts
 * @example
 * ```typescript
 * // Scroll down 200px
 * await actor.scrollBy({ x: 0, y: 200 });
 *
 * // Scroll right 100px
 * await actor.scrollBy({ x: 100, y: 0 });
 *
 * // Scroll diagonally
 * await actor.scrollBy({ x: 50, y: -100 });
 * ```
 */
export interface ActorScrollByActionsArgs {
  /** Horizontal scroll amount in pixels (positive = right, negative = left) */
  x: number;
  /** Vertical scroll amount in pixels (positive = down, negative = up) */
  y: number;
}

/**
 * Arguments for scrolling down by one viewport height
 * @example
 * ```typescript
 * await actor.scrollPageDown({});
 * ```
 */
export interface ActorScrollPageDownActionsArgs {}

/**
 * Arguments for scrolling up by one viewport height
 * @example
 * ```typescript
 * await actor.scrollPageUp({});
 * ```
 */
export interface ActorScrollPageUpActionsArgs {}

/**
 * Arguments for focusing an element
 * @example
 * ```typescript
 * await actor.focus({ selector: '#email-input' });
 * await actor.focus({ selector: 'input[name="password"]' });
 * ```
 */
export interface ActorFocusActionsArgs extends BaseActorActionsArgs {}

/**
 * Arguments for blurring (removing focus from) an element
 * @example
 * ```typescript
 * await actor.blur({ selector: '#search-input' });
 * await actor.blur({ selector: 'textarea[name="comment"]' });
 * ```
 */
export interface ActorBlurActionsArgs extends BaseActorActionsArgs {}

/**
 * Arguments for fast typing without simulation
 * @example
 * ```typescript
 * await actor.typeFast({ selector: '#username', text: 'john.doe' });
 * await actor.typeFast({ selector: '#password', text: 'secret123' });
 * ```
 */
export interface ActorTypeFastActionsArgs extends BaseActorActionsArgs {
  /** Text to type into the element */
  text: string;
}

/**
 * Arguments for checking if an element is visible in the viewport
 * @example
 * ```typescript
 * const isVisible = actor.isElementInViewport({ selector: '#hero-section' });
 * if (isVisible) {
 *   console.log('Hero section is visible!');
 * }
 * ```
 */
export interface ActorIsElementInViewportActionsArgs
  extends BaseActorActionsArgs {}

/**
 * Arguments for getting the current scroll position
 * @example
 * ```typescript
 * const position = actor.getScrollPosition({});
 * console.log(`Scrolled to: ${position.x}, ${position.y}`);
 * ```
 */
export interface ActorGetScrollPositionActionsArgs {}

/**
 * Actor class for performing DOM interactions and browser automation
 *
 * The Actor provides a comprehensive set of methods for interacting with web pages,
 * including clicking, typing, scrolling, and element manipulation. All methods use
 * native DOM APIs and properly handle React components by bypassing synthetic events.
 *
 * @example
 * ```typescript
 * const actor = new Actor();
 *
 * // Basic interactions
 * await actor.click({ selector: '#submit-button' });
 * await actor.type({ selector: '#username', text: 'john.doe', simulateTyping: false });
 *
 * // Scrolling
 * await actor.scrollToElement({ selector: '#section-3' });
 * await actor.scrollBy({ x: 0, y: 200 });
 *
 * // Element state
 * const isVisible = actor.isElementInViewport({ selector: '#hero' });
 * const position = actor.getScrollPosition({});
 * ```
 */
