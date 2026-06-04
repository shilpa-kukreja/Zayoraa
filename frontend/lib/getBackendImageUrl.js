/**
 * Builds a full URL for uploads served by the Express backend.
 * Handles absolute URLs and avoids double-prefixing the backend base.
 */
export function getBackendImageUrl(path) {
  if (!path) return "/placeholder.png";
  const value = String(path).trim();
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return base ? `${base}${normalized}` : normalized;
}
