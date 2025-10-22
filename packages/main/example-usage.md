# Button Click Tracking Usage Example

## How to Use

```tsx
import { UmbrellaModeProvider, useUmbrellaMode } from '@umbrellamode/main';

function App() {
  return (
    <UmbrellaModeProvider apiKey="your-api-key">
      <MainApp />
    </UmbrellaModeProvider>
  );
}

function MainApp() {
  const { userActions, clearUserActions, isOpen } = useUmbrellaMode();

  return (
    <div>
      <h1>My App</h1>
      
      {/* These buttons will be tracked when widget is open */}
      <button>Click me!</button>
      <a href="#">Link button</a>
      <div role="button" style={{ cursor: 'pointer' }}>
        Custom clickable
      </div>
      
      {/* Debug panel to see tracked actions */}
      {isOpen && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Tracked Actions ({userActions.length})</h3>
          <button onClick={clearUserActions}>Clear Actions</button>
          <pre>{JSON.stringify(userActions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## What Gets Tracked

When the UmbrellaMode widget is open, the system automatically tracks:

- **All clickable elements**: `<button>`, `<a>`, elements with `role="button"`, and elements with click handlers
- **Comprehensive metadata** for each click:
  - Element details (tag, text, ID, classes, position, dimensions)
  - Unique CSS selector for the element
  - All element attributes
  - Viewport information (scroll position, window size)
  - Precise timestamp

## Features

- **Memory management**: Keeps last 1000 actions (FIFO)
- **Widget exclusion**: Doesn't track clicks within the widget itself
- **Shadow DOM support**: Properly excludes shadow DOM interactions
- **Error handling**: Gracefully handles tracking failures
- **Performance optimized**: Only tracks when widget is open

## API

```tsx
const { 
  userActions,        // Array of UserAction objects
  addUserAction,      // Manually add an action
  clearUserActions,   // Clear all tracked actions
  isOpen             // Whether widget is currently open
} = useUmbrellaMode();
```

## UserAction Type

```tsx
interface UserAction {
  type: 'click';
  timestamp: string; // ISO format
  element: {
    tagName: string;
    selector: string; // Unique CSS selector
    text: string;
    id?: string;
    className: string;
    position: { x: number; y: number; width: number; height: number };
    attributes: Record<string, string>;
  };
  viewport: {
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
  };
}
```
