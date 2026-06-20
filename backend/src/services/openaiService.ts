import { GenerationError } from "../lib/errors.js";
import { buildPrompt, type Theme } from "../lib/promptBuilder.js";
import { getOpenAIApiKey } from "./secretsService.js";
import type { ImageFormat } from "../lib/imageProcessor.js";
import type { PetSpecies } from "../types/job.js";

const MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
// "high" gives the best look (validated) but is the slowest; "medium" roughly
// halves latency/cost if generation bumps into the API Gateway timeout.
const QUALITY = process.env.OPENAI_IMAGE_QUALITY ?? "high";
// Portrait poster ratio.
const SIZE = process.env.OPENAI_IMAGE_SIZE ?? "1024x1536";

/**
 * Calls OpenAI gpt-image-1 in edit (image-to-image) mode so the generated
 * poster keeps the input pet recognizable while adopting the themed style.
 * `input_fidelity: high` is what preserves the pet's face/fur/markings.
 * Returns the raw PNG bytes.
 */
export async function generatePoster(params: {
  inputImage: Buffer;
  inputFormat: ImageFormat;
  theme: Theme;
  petSpecies: PetSpecies;
}): Promise<Buffer> {
  const apiKey = await getOpenAIApiKey();
  const { text } = buildPrompt(params.theme, params.petSpecies);

  const mime = params.inputFormat === "jpeg" ? "image/jpeg" : "image/png";
  const filename = params.inputFormat === "jpeg" ? "pet.jpg" : "pet.png";

  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", text);
  form.append("size", SIZE);
  form.append("quality", QUALITY);
  form.append("input_fidelity", "high");
  form.append("image", new Blob([params.inputImage], { type: mime }), filename);

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
  } catch (err) {
    throw new GenerationError(
      `OpenAI request failed: ${(err as Error).message}`,
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    throw new GenerationError(
      `OpenAI images.edits ${res.status}: ${detail.slice(0, 500)}`,
    );
  }

  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new GenerationError("OpenAI returned no image");
  }
  return Buffer.from(b64, "base64");
}
