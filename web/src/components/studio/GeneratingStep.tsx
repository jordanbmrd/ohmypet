import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/lib/content";

const messages = [
  "Préparation de la toile…",
  "Étude du regard et du pelage…",
  "Esquisse de la composition…",
  "Mise en lumière…",
  "Application des couleurs…",
  "Derniers coups de pinceau…",
  "Vernis final…",
];

/** Generation takes ~30-90s: an eased progress bar that never quite reaches 100%. */
const EXPECTED_SECONDS = 60;

export function GeneratingStep({
  photoURL,
  theme,
  error,
  onRetry,
  onBack,
}: {
  photoURL: string;
  theme: Theme;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (error) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [error]);

  const progress = 1 - Math.exp(-elapsed / (EXPECTED_SECONDS / 2.2));
  const message = messages[Math.min(messages.length - 1, Math.floor(elapsed / 9))];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="relative w-full max-w-[300px] rounded-card bg-surface p-3 shadow-[0_30px_60px_-30px_rgba(20,17,13,0.35)] ring-1 ring-hairline">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[8px]">
          <img
            src={photoURL}
            alt="Votre photo"
            className="absolute inset-0 h-full w-full object-cover grayscale-[35%]"
          />
          {!error && (
            <>
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{ background: `color-mix(in oklab, ${theme.accentVar} 35%, transparent)` }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/45 to-transparent"
                initial={{ top: "-25%" }}
                animate={{ top: "105%" }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-between px-1 pb-1 pt-3">
          <span className="text-xs text-ink-soft">{theme.title}</span>
          <span className="text-xs text-ink-faint">En atelier</span>
        </div>
      </div>

      {error ? (
        <div role="alert" className="mt-10">
          <AlertCircle className="mx-auto h-6 w-6 text-[color:var(--color-chef)]" />
          <p className="display mt-4 text-2xl">Le pinceau a glissé.</p>
          <p className="mt-2 text-sm text-ink-soft">{error}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Changer de thème
            </Button>
            <Button onClick={onRetry}>
              <RotateCcw className="h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 w-full" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="display text-2xl"
            >
              {message}
            </motion.p>
          </AnimatePresence>
          <div className="mx-auto mt-6 h-px w-full max-w-xs bg-hairline">
            <div
              className="h-px bg-ink transition-[width] duration-1000 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Environ une minute. Restez sur cette page, votre portrait arrive.
          </p>
        </div>
      )}
    </div>
  );
}
