import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { themes } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { PosterFrame } from "@/components/PosterFrame";
import { cn } from "@/lib/utils";

export function ThemeStep({
  selected,
  onSelect,
  onBack,
  onGenerate,
}: {
  selected: string | null;
  onSelect: (key: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-5">
        {themes.map((t) => {
          const active = selected === t.key;
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(t.key)}
              className="group text-left"
            >
              <div className="relative">
                <PosterFrame
                  accent={t.accentVar}
                  label={t.subtitle}
                  image={t.image}
                  className={cn(
                    "p-2 transition-all duration-500",
                    active
                      ? "-translate-y-1.5 ring-2 ring-ink"
                      : "group-hover:-translate-y-1 group-hover:ring-hairline-strong",
                  )}
                />
                <span
                  className={cn(
                    "absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-canvas transition-all duration-300",
                    active ? "scale-100 opacity-100" : "scale-75 opacity-0",
                  )}
                >
                  <Check className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.accentVar }} />
                <h3 className="text-[0.95rem] font-medium">{t.title}</h3>
              </div>
              <p className="mt-1 hidden text-sm text-ink-soft sm:block">{t.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8">
        <Button variant="ghost" onClick={onBack} className="px-0">
          <ArrowLeft className="h-4 w-4" />
          Changer de photo
        </Button>
        <Button size="lg" disabled={!selected} onClick={onGenerate} className="group">
          <Sparkles className="h-4 w-4" />
          Créer le portrait
        </Button>
      </div>
    </div>
  );
}
