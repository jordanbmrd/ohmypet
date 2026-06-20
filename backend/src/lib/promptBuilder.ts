import type { PetSpecies } from "../types/job.js";

/**
 * The 5 Phase-1 themes. Keep keys in sync with the iOS `PosterTheme` enum.
 */
export const THEMES = [
  "magazine_cover",
  "royalty_portrait",
  "superhero",
  "space_explorer",
  "chef",
] as const;

export type Theme = (typeof THEMES)[number];

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value);
}

/**
 * Fidelity clause appended to every prompt. This is what keeps gpt-image-1's
 * edit faithful to the source pet (breed, face, fur, ears, markings).
 */
const FIDELITY =
  "Keep the pet's breed, face, fur color, ears and markings perfectly recognizable and identical to the source photo.";

const PROMPTS: Record<Theme, (species: string) => string> = {
  magazine_cover: (s) =>
    `Vogue magazine cover featuring this ${s} as a luxury high-fashion model. Dramatic professional studio lighting, clean editorial background, designer accessories, elegant "VOGUE" masthead at the top with cover typography and coverlines, high-end glossy fashion photography, ultra sharp, photorealistic.`,
  royalty_portrait: (s) =>
    `Regal royal oil painting portrait of this ${s} dressed as a king. 17th century Dutch Golden Age style, velvet robe, golden crown, ornate gilded frame, Rembrandt lighting, rich textures, museum quality.`,
  superhero: (s) =>
    `Epic comic-book superhero version of this ${s} with a flowing cape. Dramatic city skyline at sunset, dynamic heroic pose, bold saturated colors, Marvel-style cinematic illustration.`,
  space_explorer: (s) =>
    `This ${s} as an astronaut floating in outer space wearing a NASA spacesuit and helmet. Earth reflected in the helmet visor, cinematic lighting, photorealistic, ultra detailed.`,
  chef: (s) =>
    `This ${s} as a distinguished French chef wearing a white toque and chef jacket. Professional Michelin-star kitchen background, warm lighting, charming expression, portrait photography.`,
};

export function buildPrompt(theme: Theme, species: PetSpecies): {
  text: string;
} {
  return {
    text: `${PROMPTS[theme](species)} ${FIDELITY}`,
  };
}
