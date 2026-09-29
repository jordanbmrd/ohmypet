import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STUDIO_STEPS = ["Photo", "Thème", "Création", "Commande"] as const;

/** Hairline progress rail: 01 Photo · 02 Thème · 03 Création · 04 Commande. */
export function Stepper({
  current,
  onSelect,
  maxReachable,
}: {
  current: number;
  maxReachable: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="grid grid-cols-4 border-t border-hairline">
      {STUDIO_STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const reachable = i <= maxReachable && i !== current;
        return (
          <li key={label} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 -top-px h-px transition-colors duration-500",
                done || active ? "bg-ink" : "bg-transparent",
              )}
            />
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-2 pt-4 text-left text-xs transition-colors disabled:cursor-default sm:text-sm",
                active ? "text-ink" : done ? "text-ink-soft hover:text-ink" : "text-ink-faint",
              )}
            >
              <span className="display text-base sm:text-lg">
                {done ? <Check className="h-4 w-4" /> : `0${i + 1}`}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
