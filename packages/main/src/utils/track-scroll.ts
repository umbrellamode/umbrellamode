import { ScrollActionData } from "../types";

/**
 * Scroll tracking state
 */
let lastScrollPosition = { x: 0, y: 0 };
let lastScrollTime = Date.now();
let trackedMilestones = new Set<number>();

/**
 * Calculate scroll depth as percentage of page
 */
function calculateScrollDepth(): number {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  const maxScroll = documentHeight - windowHeight;

  if (maxScroll <= 0) {
    return 100; // Page fits in viewport
  }

  const scrollPercentage = (scrollTop / maxScroll) * 100;
  return Math.min(Math.max(scrollPercentage, 0), 100);
}

/**
 * Calculate scroll direction
 */
function calculateScrollDirection(): "up" | "down" | "left" | "right" {
  const currentX = window.scrollX;
  const currentY = window.scrollY;

  const deltaX = currentX - lastScrollPosition.x;
  const deltaY = currentY - lastScrollPosition.y;

  // Determine primary direction based on larger delta
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    return deltaY > 0 ? "down" : "up";
  } else {
    return deltaX > 0 ? "right" : "left";
  }
}

/**
 * Calculate scroll velocity (pixels per second)
 */
function calculateScrollVelocity(): number {
  const currentTime = Date.now();
  const timeDelta = currentTime - lastScrollTime;

  if (timeDelta === 0) return 0;

  const currentX = window.scrollX;
  const currentY = window.scrollY;

  const deltaX = currentX - lastScrollPosition.x;
  const deltaY = currentY - lastScrollPosition.y;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const velocity = (distance / timeDelta) * 1000; // Convert to pixels per second

  // Update tracking variables
  lastScrollPosition = { x: currentX, y: currentY };
  lastScrollTime = currentTime;

  return velocity;
}

/**
 * Check if current scroll position is a milestone
 */
function isScrollMilestone(depthPercentage: number): boolean {
  const milestones = [25, 50, 75, 100];

  for (const milestone of milestones) {
    if (depthPercentage >= milestone && !trackedMilestones.has(milestone)) {
      trackedMilestones.add(milestone);
      return true;
    }
  }

  return false;
}

/**
 * Track scroll event
 */
export function trackScrollEvent(): ScrollActionData & { timestamp: string } {
  const depthPercentage = calculateScrollDepth();
  const direction = calculateScrollDirection();
  const velocity = calculateScrollVelocity();
  const isMilestone = isScrollMilestone(depthPercentage);

  return {
    type: "scroll",
    timestamp: new Date().toISOString(),
    depthPercentage,
    position: {
      x: window.scrollX,
      y: window.scrollY,
    },
    direction,
    velocity,
    isMilestone,
    viewport: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}

/**
 * Reset scroll tracking state (call when widget opens)
 */
export function resetScrollTracking(): void {
  lastScrollPosition = { x: window.scrollX, y: window.scrollY };
  lastScrollTime = Date.now();
  trackedMilestones.clear();

  // Track initial scroll position as milestone if applicable
  const initialDepth = calculateScrollDepth();
  if (initialDepth > 0) {
    isScrollMilestone(initialDepth);
  }
}

/**
 * Throttle function for scroll events
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime)
      );
    }
  };
}

/**
 * Create throttled scroll handler
 */
export function createThrottledScrollHandler(
  callback: (action: ScrollActionData & { timestamp: string }) => void,
  throttleDelay: number = 500
): () => void {
  const throttledHandler = throttle(() => {
    try {
      const action = trackScrollEvent();
      callback(action);
    } catch (error) {
      console.warn("Failed to track scroll event:", error);
    }
  }, throttleDelay);

  return throttledHandler;
}
