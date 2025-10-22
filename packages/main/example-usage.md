# Comprehensive User Action Tracking

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
      
      {/* All these interactions will be tracked when widget is open */}
      
      {/* Click tracking */}
      <button>Click me!</button>
      <a href="#">Link button</a>
      <div role="button" style={{ cursor: 'pointer' }}>
        Custom clickable
      </div>
      
      {/* Input tracking */}
      <input type="text" placeholder="Type here..." />
      <textarea placeholder="Multi-line input"></textarea>
      
      {/* Form tracking */}
      <form>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
      
      {/* Select tracking */}
      <select name="country">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </select>
      
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

### 1. **Click Actions**
- All clickable elements: `<button>`, `<a>`, elements with `role="button"`, and elements with click handlers
- Element details, position, attributes, and viewport info

### 2. **Input Actions** 
- Text inputs, textareas, and contenteditable elements
- Triggered on blur or 1 second after typing stops (debounced)
- **Privacy**: Input values are hashed (SHA-256) for privacy
- Captures field metadata: name, type, placeholder, label

### 3. **Form Submission Actions**
- Form submissions with validation status
- **Privacy**: All field values are hashed
- Captures form metadata: action URL, method, field count

### 4. **Select Change Actions**
- Dropdown/select element changes
- Captures selected options and field metadata
- Supports both single and multi-select

### 5. **Scroll Actions**
- Scroll depth as percentage of page
- Throttled to every 500ms for performance
- Tracks milestones: 25%, 50%, 75%, 100%
- Captures scroll direction and velocity

### 6. **Network Request Actions**
- Intercepts fetch() and XMLHttpRequest calls
- Captures: URL, method, status, duration, request/response sizes
- **Privacy**: URLs are sanitized (removes sensitive query params)
- Excludes widget's own API calls and analytics URLs

## Privacy Features

- **Hashed Values**: All user input is hashed with SHA-256
- **Excluded Fields**: Passwords, tokens, and sensitive fields are excluded
- **Sanitized URLs**: Sensitive query parameters are removed
- **No Auth Headers**: Authentication headers are not captured
- **Widget Exclusion**: No tracking within the widget itself

## Features

- **Memory Management**: Keeps last 1000 actions (FIFO)
- **Performance Optimized**: Only tracks when widget is open
- **Error Resilient**: Graceful handling of tracking failures
- **Shadow DOM Support**: Properly excludes shadow DOM interactions
- **Debounced Input**: Smart input tracking with 1-second debounce
- **Throttled Scroll**: Efficient scroll tracking with throttling

## API

```tsx
const { 
  userActions,        // Array of UserAction objects
  addUserAction,      // Manually add an action
  clearUserActions,   // Clear all tracked actions
  isOpen             // Whether widget is currently open
} = useUmbrellaMode();
```

## UserAction Types

```tsx
// Union type for all actions
type UserAction = (
  | ClickActionData
  | InputActionData
  | FormSubmitActionData
  | SelectChangeActionData
  | ScrollActionData
  | NetworkRequestActionData
) & {
  timestamp: string; // ISO format
};

// Example: Input Action
interface InputActionData {
  type: "input";
  element: {
    tagName: string;
    selector: string;
    name?: string;
    inputType?: string;
    placeholder?: string;
    label?: string;
    // ... position, attributes, etc.
  };
  value: {
    hash: string;        // SHA-256 hash of input value
    length: number;      // Original length
    isEmpty: boolean;    // Whether field was empty
  };
  trigger: "debounce" | "blur";
  viewport: ViewportInfo;
}

// Example: Network Request Action
interface NetworkRequestActionData {
  type: "network_request";
  url: string;           // Sanitized URL
  method: string;
  statusCode?: number;
  duration: number;      // Milliseconds
  requestSize?: number;  // Bytes
  responseSize?: number; // Bytes
  isSuccess: boolean;
  error?: string;
  viewport: ViewportInfo;
}
```

## Action Type Examples

```tsx
// Click action
{
  type: "click",
  timestamp: "2024-01-15T10:30:00.000Z",
  element: {
    tagName: "BUTTON",
    selector: "#submit-btn",
    text: "Submit Form",
    className: "btn btn-primary",
    // ... position, attributes
  },
  viewport: { scrollX: 0, scrollY: 100, width: 1920, height: 1080 }
}

// Input action (privacy-preserved)
{
  type: "input",
  timestamp: "2024-01-15T10:30:05.000Z",
  element: {
    tagName: "INPUT",
    selector: "input[name='email']",
    name: "email",
    inputType: "email",
    placeholder: "Enter your email",
    label: "Email Address"
  },
  value: {
    hash: "a1b2c3d4e5f6...", // SHA-256 hash
    length: 15,
    isEmpty: false
  },
  trigger: "blur"
}

// Scroll milestone
{
  type: "scroll",
  timestamp: "2024-01-15T10:30:10.000Z",
  depthPercentage: 50,
  position: { x: 0, y: 500 },
  direction: "down",
  velocity: 120,
  isMilestone: true
}

// Network request
{
  type: "network_request",
  timestamp: "2024-01-15T10:30:15.000Z",
  url: "https://api.example.com/users",
  method: "POST",
  statusCode: 201,
  duration: 250,
  requestSize: 1024,
  responseSize: 512,
  isSuccess: true
}
```
