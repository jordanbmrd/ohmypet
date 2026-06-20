import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a path to a file in `public/` against the Vite base URL so assets
 * load correctly when the app is served from a sub-path (e.g. GitHub Pages
 * at /ohmypet/). Pass paths relative to `public/`, with or without a leading slash.
 */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
