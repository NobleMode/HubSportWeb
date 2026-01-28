/**
 * Resolves the full URL for an image.
 *
 * @param {string} datePath - The image path or URL from the database
 * @returns {string} The resolved full URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL (e.g. Unsplash), return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it's a relative path (e.g. /uploads/...), prepend the API URL
  // We assume the API URL is http://localhost:5000/api, so we need the base url http://localhost:5000
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Extract base URL (remove /api if present)
  // This logic is simple: if VITE_API_URL ends with /api, remove it.
  // Note: Local uploads are served at /uploads, which is at the root level, not under /api
  const baseUrl = apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;

  // Ensure path starts with /
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${baseUrl}${cleanPath}`;
};
