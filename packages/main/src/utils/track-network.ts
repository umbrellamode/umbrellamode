import { NetworkRequestActionData } from "../types";
import { sanitizeUrl } from "./hash-value";

/**
 * Network request tracking state
 */
let originalFetch: typeof fetch;
let originalXHROpen: typeof XMLHttpRequest.prototype.open;
let originalXHRSend: typeof XMLHttpRequest.prototype.send;

/**
 * Check if a URL should be excluded from tracking
 */
function shouldExcludeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Exclude widget's own API calls
    if (urlObj.hostname.includes("umbrellamode.com")) {
      return true;
    }

    // Exclude common analytics and tracking URLs
    const excludedHosts = [
      "google-analytics.com",
      "googletagmanager.com",
      "facebook.com",
      "doubleclick.net",
      "googlesyndication.com",
      "amazon-adsystem.com",
      "adsystem.amazon.com",
    ];

    if (excludedHosts.some((host) => urlObj.hostname.includes(host))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Get request size from request body
 */
function getRequestSize(body: BodyInit | null | undefined): number | undefined {
  if (!body) return 0;

  if (typeof body === "string") {
    return new TextEncoder().encode(body).length;
  }

  if (body instanceof FormData) {
    // Estimate FormData size (not exact)
    let size = 0;
    for (const [key, value] of body.entries()) {
      size += key.length;
      if (typeof value === "string") {
        size += value.length;
      } else if (value instanceof File) {
        size += value.size;
      }
    }
    return size;
  }

  if (body instanceof ArrayBuffer) {
    return body.byteLength;
  }

  if (body instanceof Blob) {
    return body.size;
  }

  return undefined;
}

/**
 * Track fetch request
 */
export function trackFetchRequest(
  url: string,
  options: RequestInit = {},
  startTime: number,
  callback: (action: NetworkRequestActionData & { timestamp: string }) => void
): (response: Response, error?: Error) => void {
  return (response: Response, error?: Error) => {
    const duration = Date.now() - startTime;
    const method = options.method || "GET";
    const requestSize = getRequestSize(options.body);

    const action: NetworkRequestActionData & { timestamp: string } = {
      type: "network_request",
      timestamp: new Date().toISOString(),
      url: sanitizeUrl(url),
      method: method.toUpperCase(),
      statusCode: response?.status,
      duration,
      requestSize,
      responseSize: response?.headers.get("content-length")
        ? parseInt(response.headers.get("content-length")!)
        : undefined,
      isSuccess: !error && response?.ok,
      error: error?.message,
      viewport: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    callback(action);
  };
}

/**
 * Track XMLHttpRequest
 */
export function trackXHRRequest(
  xhr: XMLHttpRequest,
  url: string,
  method: string,
  startTime: number,
  callback: (action: NetworkRequestActionData & { timestamp: string }) => void
): void {
  const handleComplete = () => {
    const duration = Date.now() - startTime;
    // Note: XMLHttpRequest doesn't have getRequestHeader, we'll estimate size differently
    const requestSize = undefined;

    const action: NetworkRequestActionData & { timestamp: string } = {
      type: "network_request",
      timestamp: new Date().toISOString(),
      url: sanitizeUrl(url),
      method: method.toUpperCase(),
      statusCode: xhr.status,
      duration,
      requestSize,
      responseSize: xhr.getResponseHeader("content-length")
        ? parseInt(xhr.getResponseHeader("content-length")!)
        : undefined,
      isSuccess: xhr.status >= 200 && xhr.status < 400,
      error: xhr.status >= 400 ? `HTTP ${xhr.status}` : undefined,
      viewport: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    callback(action);
  };

  xhr.addEventListener("loadend", handleComplete);
  xhr.addEventListener("error", handleComplete);
  xhr.addEventListener("timeout", handleComplete);
}

/**
 * Intercept fetch requests
 */
export function interceptFetch(
  callback: (action: NetworkRequestActionData & { timestamp: string }) => void
): void {
  if (originalFetch !== undefined) return; // Already intercepted

  originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();

    // Skip excluded URLs
    if (shouldExcludeUrl(url)) {
      return originalFetch(input, init);
    }

    const startTime = Date.now();
    const trackComplete = trackFetchRequest(url, init, startTime, callback);

    try {
      const response = await originalFetch(input, init);
      trackComplete(response);
      return response;
    } catch (error) {
      trackComplete(undefined as any, error as Error);
      throw error;
    }
  };
}

/**
 * Intercept XMLHttpRequest
 */
export function interceptXHR(
  callback: (action: NetworkRequestActionData & { timestamp: string }) => void
): void {
  if (originalXHROpen !== undefined) return; // Already intercepted

  originalXHROpen = XMLHttpRequest.prototype.open;
  originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    user?: string | null,
    password?: string | null
  ) {
    this._umbrellamode_url = url.toString();
    this._umbrellamode_method = method;
    this._umbrellamode_startTime = Date.now();

    return originalXHROpen.call(this, method, url, async, user, password);
  };

  XMLHttpRequest.prototype.send = function (
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    const url = this._umbrellamode_url || "";
    const method = this._umbrellamode_method || "GET";
    const startTime = this._umbrellamode_startTime || Date.now();

    // Skip excluded URLs
    if (!url || shouldExcludeUrl(url)) {
      return originalXHRSend.call(this, body);
    }

    trackXHRRequest(this, url, method, startTime, callback);

    return originalXHRSend.call(this, body);
  };
}

/**
 * Restore original fetch and XMLHttpRequest
 */
export function restoreNetworkInterceptors(): void {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = undefined as any;
  }

  if (originalXHROpen) {
    XMLHttpRequest.prototype.open = originalXHROpen;
    XMLHttpRequest.prototype.send = originalXHRSend;
    originalXHROpen = undefined as any;
    originalXHRSend = undefined as any;
  }
}

// Extend XMLHttpRequest interface for our tracking properties
declare global {
  interface XMLHttpRequest {
    _umbrellamode_url?: string;
    _umbrellamode_method?: string;
    _umbrellamode_startTime?: number;
  }
}
