# Contributing to Umbrella Mode

Thank you for your interest in contributing to Umbrella Mode! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/umbrellamode.git
   cd umbrellamode
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/umbrellamode/umbrellamode.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
umbrellamode/
├── apps/
│   └── web/                 # Example web application
├── packages/
│   ├── director/           # Core Umbrella Mode library
│   │   ├── src/
│   │   │   ├── actor/      # Actor class implementation
│   │   │   ├── director/   # Director class (future)
│   │   │   └── utils/      # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── ui/                 # Shared UI components (shadcn/ui)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
├── README.md
├── CONTRIBUTING.md
└── package.json
```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

1. **Bug fixes** - Fix issues in existing functionality
2. **Feature additions** - Add new methods or capabilities to the Actor class
3. **Documentation improvements** - Enhance README, examples, or code comments
4. **Performance optimizations** - Improve speed or efficiency
5. **Type safety improvements** - Enhance TypeScript definitions
6. **Test coverage** - Add or improve tests

### Before You Start

1. **Check existing issues** - Look for similar issues or feature requests
2. **Create an issue** - For significant changes, discuss your approach first
3. **Keep changes focused** - One feature or fix per pull request

## Pull Request Process

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and patterns
- Add appropriate comments for complex logic
- Update documentation if needed
- Add tests for new functionality

### 3. Test Your Changes

```bash
# Run linting
pnpm lint

# Build the project
pnpm build

# Test in the web app
pnpm dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add scrollToElement method to Actor class"
# or
git commit -m "fix: handle edge case in type method for contenteditable elements"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

## Issue Guidelines

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (browser, OS, Node.js version)
5. **Code example** that demonstrates the issue

### Feature Requests

For feature requests, please include:

1. **Use case** - Why is this feature needed?
2. **Proposed API** - How should it work?
3. **Alternatives considered** - What other approaches were considered?
4. **Additional context** - Any other relevant information

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Provide comprehensive type definitions
- Use interfaces for complex parameter objects
- Add JSDoc comments for public methods

### Code Style

- Follow the existing code patterns
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Add comments for complex logic

### Actor Class Guidelines

When adding new methods to the Actor class:

1. **Follow the existing pattern**:
   ```typescript
   async methodName({ selector, ...args }: MethodArgs) {
     // Implementation
   }
   ```

2. **Add comprehensive JSDoc**:
   ```typescript
   /**
    * Brief description of what the method does
    *
    * Longer description with details about behavior,
    * use cases, and any important notes.
    *
    * @param args - Method arguments
    * @param args.selector - CSS selector to target the element
    * @param args.otherParam - Description of other parameters
    *
    * @throws {Error} When element is not found
    *
    * @example
    * ```typescript
    * await actor.methodName({ selector: '#element' });
    * ```
    */
   ```

3. **Add type definitions** in `types/actor.types.ts`
4. **Handle errors gracefully** with descriptive messages
5. **Use native DOM APIs** when possible
6. **Support async operations** with proper await/async

## Testing

### Manual Testing

Test your changes in the web app:

```bash
pnpm dev
```

Navigate to `http://localhost:3000` and test the functionality.

### Test Cases to Consider

- **Element selection** - Test with various CSS selectors
- **Error handling** - Test with non-existent elements
- **Edge cases** - Test with different element types
- **Browser compatibility** - Test in different browsers
- **Performance** - Ensure methods are efficient

## Documentation

### Code Documentation

- Add JSDoc comments for all public methods
- Include usage examples in comments
- Document any breaking changes
- Update type definitions

### README Updates

When adding new features:

1. Update the "Key Features" section if applicable
2. Add examples to the "Get Started" section
3. Include the new method in "Advanced Usage"
4. Update any relevant sections

### Example Documentation Format

```typescript
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
 * ```
 */
```

## Release Process

Releases are handled by maintainers. When your PR is merged:

1. The maintainer will update version numbers
2. Changes will be published to npm
3. Release notes will be created
4. You'll be credited in the release notes

## Getting Help

If you need help:

1. **Check existing issues** and discussions
2. **Create a new issue** with the "question" label
3. **Join our community** (if available)

## Thank You

Thank you for contributing to Umbrella Mode! Your contributions help make browser automation more accessible and powerful for developers worldwide.

---

*This contributing guide is a living document. If you have suggestions for improvements, please open an issue or submit a pull request.*
