/**
 * Centralized Vercel Blob URL Resolver
 * Resolves relative asset paths (e.g. '/resume.pdf', '/info/logos/nvidia.svg')
 * to full Edge CDN URLs dynamically.
 */

export const BLOB_BASE_URL =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  "https://ps2zjncditdyfyag.public.blob.vercel-storage.com";

export function getBlobUrl(pathName: string | null | undefined): string {
  if (!pathName) return "";
  if (pathName.startsWith("http://") || pathName.startsWith("https://")) {
    return pathName;
  }
  const cleanPath = pathName.startsWith("/") ? pathName : `/${pathName}`;
  return `${BLOB_BASE_URL}${cleanPath}`;
}
