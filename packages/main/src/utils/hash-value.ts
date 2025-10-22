/**
 * Privacy-preserving hashing utility for user input values
 */

/**
 * Simple SHA-256 implementation for hashing sensitive values
 * This is a basic implementation - in production, consider using a more robust crypto library
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a value for privacy while preserving useful metadata
 */
export async function hashValue(
  value: string,
  salt?: string
): Promise<{
  hash: string;
  length: number;
  isEmpty: boolean;
}> {
  if (!value || value.trim() === "") {
    return {
      hash: "",
      length: 0,
      isEmpty: true,
    };
  }

  const valueToHash = salt ? `${value}${salt}` : value;
  const hash = await sha256(valueToHash);

  return {
    hash,
    length: value.length,
    isEmpty: false,
  };
}

/**
 * Hash multiple values at once for form data
 */
export async function hashFormData(
  data: Record<string, string>,
  salt?: string
): Promise<Record<string, { hash: string; length: number; isEmpty: boolean }>> {
  const hashedData: Record<
    string,
    { hash: string; length: number; isEmpty: boolean }
  > = {};

  for (const [key, value] of Object.entries(data)) {
    hashedData[key] = await hashValue(value, salt);
  }

  return hashedData;
}

/**
 * Check if a field should be excluded from hashing (passwords, tokens, etc.)
 */
export function shouldExcludeField(
  fieldName: string,
  fieldType?: string
): boolean {
  const excludedNames = [
    "password",
    "passwd",
    "pwd",
    "secret",
    "token",
    "key",
    "auth",
    "authorization",
    "credit",
    "card",
    "ssn",
    "social",
    "cvv",
    "cvc",
  ];

  const excludedTypes = ["password"];

  const nameLower = fieldName.toLowerCase();
  const typeLower = fieldType?.toLowerCase() || "";

  return (
    excludedNames.some((excluded) => nameLower.includes(excluded)) ||
    excludedTypes.includes(typeLower)
  );
}

/**
 * Sanitize URL by removing sensitive query parameters
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = [
      "password",
      "token",
      "key",
      "secret",
      "auth",
      "authorization",
      "credit",
      "card",
      "ssn",
    ];

    // Remove sensitive query parameters
    sensitiveParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
