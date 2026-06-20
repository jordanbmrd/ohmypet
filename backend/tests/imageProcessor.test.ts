import { describe, it, expect } from "vitest";
import { decodeAndValidateImage } from "../src/lib/imageProcessor.js";

// Minimal valid JPEG header bytes + padding.
const jpegBytes = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  Buffer.alloc(64, 0),
]);
const pngBytes = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(64, 0),
]);

describe("decodeAndValidateImage", () => {
  it("accepts a JPEG", () => {
    const { format } = decodeAndValidateImage(jpegBytes.toString("base64"));
    expect(format).toBe("jpeg");
  });

  it("accepts a PNG with data-uri prefix", () => {
    const dataUri = `data:image/png;base64,${pngBytes.toString("base64")}`;
    const { format } = decodeAndValidateImage(dataUri);
    expect(format).toBe("png");
  });

  it("rejects non-image bytes", () => {
    const garbage = Buffer.alloc(64, 0x41).toString("base64");
    expect(() => decodeAndValidateImage(garbage)).toThrow(/JPEG or PNG/);
  });
});

describe("promptBuilder", () => {
  it("builds a prompt for each theme", async () => {
    const { THEMES, buildPrompt } = await import("../src/lib/promptBuilder.js");
    for (const theme of THEMES) {
      const { text } = buildPrompt(theme, "dog");
      expect(text).toContain("dog");
      expect(text).toContain("identical to the source photo");
    }
  });
});
