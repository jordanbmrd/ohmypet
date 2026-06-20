import { ValidationError } from "./errors.js";

export type ImageFormat = "jpeg" | "png";

/**
 * Decode a base64 image (with or without data-URI prefix), validate it is a
 * real JPEG/PNG via magic bytes, and return the raw buffer + detected format.
 */
export function decodeAndValidateImage(imageBase64: string): {
  buffer: Buffer;
  format: ImageFormat;
} {
  const stripped = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  let buffer: Buffer;
  try {
    buffer = Buffer.from(stripped, "base64");
  } catch {
    throw new ValidationError("imageBase64 is not valid base64");
  }

  if (buffer.length < 8) {
    throw new ValidationError("Image is too small or empty");
  }

  // Max ~6MB decoded — keeps upload latency and payload sane.
  if (buffer.length > 6 * 1024 * 1024) {
    throw new ValidationError("Image exceeds 6MB limit");
  }

  const format = detectImageFormat(buffer);
  if (!format) {
    throw new ValidationError("Image must be a JPEG or PNG");
  }

  return { buffer, format };
}

/** Detect JPEG/PNG from a raw buffer's magic bytes; null if neither. */
export function detectImageFormat(buf: Buffer): ImageFormat | null {
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "png";
  }
  return null;
}
