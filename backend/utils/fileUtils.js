import fs from "fs/promises";
import path from "path";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

export function resolveUploadPath(fileUrl) {
  if (!fileUrl || typeof fileUrl !== "string") return null;

  const normalized = fileUrl.replace(/\\/g, "/").trim();
  if (!normalized) return null;

  const uploadsIdx = normalized.indexOf("/uploads/");
  const relativePath =
    uploadsIdx >= 0
      ? normalized.slice(uploadsIdx + 1)
      : normalized.replace(/^\/+/, "");

  if (!relativePath.startsWith("uploads/")) return null;

  const absolutePath = path.resolve(process.cwd(), relativePath);
  if (
    absolutePath !== UPLOADS_ROOT &&
    !absolutePath.startsWith(UPLOADS_ROOT + path.sep)
  ) {
    return null;
  }

  return absolutePath;
}

export async function deleteUploadFile(fileUrl) {
  const filePath = resolveUploadPath(fileUrl);
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Failed to delete file:", filePath, err.message);
    }
  }
}

export async function deleteUploadFiles(fileUrls = []) {
  const unique = [...new Set(fileUrls.filter(Boolean))];
  await Promise.all(unique.map(deleteUploadFile));
}

export function collectProductImages(product) {
  if (!product) return [];

  const urls = [];
  if (product.thumbImg) urls.push(product.thumbImg);
  if (Array.isArray(product.galleryImg)) urls.push(...product.galleryImg);
  if (Array.isArray(product.variant)) {
    product.variant.forEach((variant) => {
      if (variant?.image) urls.push(variant.image);
    });
  }

  return urls;
}

export function diffRemovedFiles(oldUrls = [], newUrls = []) {
  const newSet = new Set(newUrls.filter(Boolean));
  return oldUrls.filter((url) => url && !newSet.has(url));
}
