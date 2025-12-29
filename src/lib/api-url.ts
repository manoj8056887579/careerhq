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

  // Server-side: determine the base URL
  // Priority: NEXT_PUBLIC_API_URL > VERCEL_URL > localhost
  
  // 1. Check if NEXT_PUBLIC_API_URL is explicitly set and not localhost
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. In Vercel production, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Fallback to localhost for development
  return "http://localhost:3000";
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
