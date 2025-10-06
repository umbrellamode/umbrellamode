# Umbrella Mode

Umbrella Mode is a powerful browser automation and DOM interaction library that provides a clean, type-safe API for programmatically controlling web pages. Built with TypeScript and designed for modern web applications, Umbrella Mode makes it easy to automate user interactions, test web interfaces, and build sophisticated browser-based workflows.

## What is Umbrella Mode?

Umbrella Mode is built around the **Actor** class - a comprehensive DOM interaction library that provides methods for clicking, typing, scrolling, and element manipulation. The library uses native DOM APIs and properly handles React components by bypassing synthetic events, making it reliable across different web frameworks and applications.

## Key Features

- 🎯 **Type-safe API** - Full TypeScript support with comprehensive type definitions
- ⚡ **Framework agnostic** - Works with React, Vue, Angular, and vanilla JavaScript
- 🚀 **Native DOM events** - Uses real browser events, not synthetic ones
- 📱 **Comprehensive actions** - Click, type, scroll, focus, blur, clear, and element manipulation
- 🔄 **Async/await support** - Modern JavaScript patterns for clean code
- 🎭 **Human-like simulation** - Optional typing simulation for realistic user behavior
- 📏 **Viewport awareness** - Built-in viewport detection and scroll management
- ⏱️ **Element waiting** - Wait for elements to appear with configurable timeouts
- 🎯 **Precise scrolling** - Multiple scroll methods for different use cases

## Installation

```bash
# Install the director package
pnpm add umbrellamode

# Or if using npm
npm install umbrellamode

# Or if using yarn
yarn add umbrellamode
```

## Get Started

### Basic Usage

The Actor class is the core of Umbrella Mode. It provides a comprehensive set of methods for interacting with web pages:

```typescript
import { Actor } from "umbrellamode";

// Create an actor instance
const actor = new Actor();

// Basic interactions
await actor.click({ selector: '#submit-button' });
await actor.type({ selector: '#username', text: 'john.doe', simulateTyping: false });
await actor.clear({ selector: '#search-input' });
```

### Clicking Elements

```typescript
// Click a button
await actor.click({ selector: '#submit-button' });

// Click using data attributes
await actor.click({ selector: '[data-testid="save-btn"]' });

// Click a link
await actor.click({ selector: 'a[href="/dashboard"]' });
```

### Typing Text

```typescript
// Fast typing (recommended for most cases)
await actor.type({
  selector: '#username',
  text: 'john.doe@example.com',
  simulateTyping: false
});

// Simulated typing (slower, more human-like)
await actor.type({
  selector: '#message',
  text: 'Hello world!',
  simulateTyping: true
});

// Convenience method for fast typing
await actor.typeFast({ selector: '#password', text: 'secret123' });
```

### Scrolling

```typescript
// Scroll to specific coordinates
await actor.scrollTo({ x: 0, y: 500 });

// Scroll to an element
await actor.scrollToElement({ selector: '#section-3' });

// Scroll by relative amounts
await actor.scrollBy({ x: 0, y: 200 });

// Scroll page by viewport height
await actor.scrollPageDown({});
await actor.scrollPageUp({});

// Scroll to top/bottom
await actor.scrollToTop();
await actor.scrollToBottom();
```

### Element State and Visibility

```typescript
// Wait for an element to appear
await actor.waitForElement({ selector: '.loading-spinner' });

// Check if element is visible
const isVisible = actor.isElementInViewport({ selector: '#hero-section' });

// Get current scroll position
const position = actor.getScrollPosition({});
console.log(`Scrolled to: ${position.x}, ${position.y}`);
```

### Focus Management

```typescript
// Focus an element
await actor.focus({ selector: '#email-input' });

// Remove focus (blur)
await actor.blur({ selector: '#search-input' });
```

## Advanced Usage

### Working with Forms

```typescript
// Fill out a complete form
await actor.typeFast({ selector: '#firstName', text: 'John' });
await actor.typeFast({ selector: '#lastName', text: 'Doe' });
await actor.typeFast({ selector: '#email', text: 'john@example.com' });
await actor.click({ selector: '#submit' });

// Wait for success message
await actor.waitForElement({ selector: '.success-message' });
```

### Dynamic Content Handling

```typescript
// Wait for dynamically loaded content
await actor.waitForElement({ 
  selector: '[data-testid="dynamic-content"]',
  timeout: 10000 // 10 seconds
});

// Check if content is visible before interacting
if (actor.isElementInViewport({ selector: '.important-section' })) {
  await actor.click({ selector: '.cta-button' });
}
```

### Scroll-based Interactions

```typescript
// Scroll to find an element, then interact
await actor.scrollToElement({ selector: '#hidden-section' });
await actor.click({ selector: '#action-button' });

// Scroll through a list
for (let i = 0; i < 5; i++) {
  await actor.scrollPageDown({});
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
}
```

## Error Handling

Umbrella Mode provides clear error messages for common issues:

```typescript
try {
  await actor.click({ selector: '#non-existent-button' });
} catch (error) {
  console.error('Element not found:', error.message);
  // Output: "Element not found with selector: #non-existent-button"
}
```

## Best Practices

1. **Use specific selectors**: Prefer `data-testid` attributes over CSS classes
2. **Handle async operations**: Always use `await` with Actor methods
3. **Wait for elements**: Use `waitForElement` for dynamically loaded content
4. **Check visibility**: Use `isElementInViewport` before interacting with elements
5. **Use fast typing**: Set `simulateTyping: false` for better performance unless human-like behavior is needed

## Monorepo Structure

This project uses a monorepo structure with the following packages:

- `packages/director/` - Core Umbrella Mode library (Actor class)
- `packages/ui/` - Shared UI components (shadcn/ui)
- `apps/web/` - Example web application

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint
```

## License

Apache-2.0
