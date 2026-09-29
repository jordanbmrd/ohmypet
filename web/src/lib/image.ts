/** Mirrors the iOS ImageService: downscale to 1024px max and encode as JPEG. */
const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.85;
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export type PreparedPhoto = {
  /** Raw base64 JPEG (no data-URI prefix), as the API expects. */
  base64: string;
  /** Data URI for on-page preview. */
  previewURL: string;
};

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Ce fichier n'est pas une image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Cette image est trop lourde (20 Mo maximum).");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "Impossible de lire cette image. Essayez une photo JPEG ou PNG.",
    );
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  // JPEG has no alpha: paint white under transparent PNGs instead of black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const previewURL = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { previewURL, base64: previewURL.slice(previewURL.indexOf(",") + 1) };
}
