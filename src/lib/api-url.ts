/**
 * Get the appropriate API base URL based on the environment
 * - Client-side: Returns empty string (uses relative URLs to avoid CORS)
 * - Server-side: Returns full URL for SSR/SSG
 */
export function getApiBaseUrl(): string {
  // Client-side: use relative URLs
  if (typeof window !== "undefined") {
    return "";
  }

  // Server-side: use absolute URL
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

/**
 * Build a full API URL
 * @param path - API path (e.g., "/api/blog")
 * @returns Full URL for server-side, relative URL for client-side
 */
export function getApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
