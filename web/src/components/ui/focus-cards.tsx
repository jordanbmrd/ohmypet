import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity-derived focus cards — adapted to the OhMyPet light palette.
 * Hovering one card keeps it crisp while the rest dim, recede and soften,
 * focusing attention without leaving the minimalist canvas.
 *
 * State is owned by the parent so any content (here, a PosterFrame) can sit
 * inside a card. Pass the shared `hovered` index + setter to each card.
 */
export function FocusCard({
  index,
  hovered,
  setHovered,
  className,
  children,
}: {
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  className?: string;
  children: ReactNode;
}) {
  const dimmed = hovered !== null && hovered !== index;

  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "transition-all duration-500 ease-out will-change-transform",
        dimmed
          ? "scale-[0.97] opacity-55 blur-[2px]"
          : "scale-100 opacity-100 blur-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
