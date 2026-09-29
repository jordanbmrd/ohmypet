import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { themes, products, type ProductKey } from "@/lib/content";
import { generatePortrait, isDemoMode, type Species } from "@/lib/api";
import type { PreparedPhoto } from "@/lib/image";
import { Stepper } from "@/components/studio/Stepper";
import { PhotoStep } from "@/components/studio/PhotoStep";
import { ThemeStep } from "@/components/studio/ThemeStep";
import { GeneratingStep } from "@/components/studio/GeneratingStep";
import { ResultStep, type Portrait } from "@/components/studio/ResultStep";

type Step = 0 | 1 | 2 | 3;

const headings: Record<Step, { eyebrow: string; title: string; accent: string }> = {
  0: { eyebrow: "L'atelier · Étape 1", title: "Commençons par", accent: "une photo." },
  1: { eyebrow: "L'atelier · Étape 2", title: "Choisissez", accent: "son univers." },
  2: { eyebrow: "L'atelier · Étape 3", title: "L'œuvre prend", accent: "forme." },
  3: { eyebrow: "L'atelier · Étape 4", title: "Voici son", accent: "portrait." },
};

export function Studio() {
  const [params] = useSearchParams();
  const initialTheme = themes.some((t) => t.key === params.get("theme")) ? params.get("theme") : null;
  const productParam = params.get("produit");
  const initialProduct: ProductKey = products.some((p) => p.key === productParam)
    ? (productParam as ProductKey)
    : "print";

  const [step, setStep] = useState<Step>(0);
  const [photo, setPhoto] = useState<PreparedPhoto | null>(null);
  const [species, setSpecies] = useState<Species>("dog");
  const [themeKey, setThemeKey] = useState<string | null>(initialTheme);
  const [portraits, setPortraits] = useState<Portrait[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [step]);

  const generate = async () => {
    if (!photo || !themeKey) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setStep(2);
    try {
      const result = await generatePortrait(
        { imageBase64: photo.base64, theme: themeKey, petSpecies: species },
        controller.signal,
      );
      // One generation runs at a time, so `portraits` is current here.
      setPortraits([...portraits, { ...result, themeKey }]);
      setActiveIndex(portraits.length);
      setStep(3);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message);
    }
  };

  const goTo = (index: number) => {
    abortRef.current?.abort();
    setError(null);
    setStep(index >= 2 ? 3 : (index as Step));
  };

  const heading = headings[step];
  const theme = themes.find((t) => t.key === themeKey) ?? themes[0];
  const maxReachable = portraits.length ? 3 : photo ? 1 : 0;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 pt-32 lg:px-10 lg:pt-40">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow mb-5">{heading.eyebrow}</p>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">
            {heading.title} <span className="italic text-accent">{heading.accent}</span>
          </h1>
        </div>
        {isDemoMode && (
          <p className="flex max-w-sm items-start gap-2 rounded-card border border-hairline bg-surface p-4 text-xs text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Version de démonstration : le portrait affiché est l'exemple du thème choisi, et le paiement est désactivé.
          </p>
        )}
      </div>

      <Stepper current={step} maxReachable={maxReachable} onSelect={goTo} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12"
        >
          {step === 0 && (
            <PhotoStep
              photo={photo}
              species={species}
              onPhoto={setPhoto}
              onSpecies={setSpecies}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <ThemeStep
              selected={themeKey}
              onSelect={setThemeKey}
              onBack={() => setStep(0)}
              onGenerate={generate}
            />
          )}
          {step === 2 && photo && (
            <GeneratingStep
              photoURL={photo.previewURL}
              theme={theme}
              error={error}
              onRetry={generate}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && portraits.length > 0 && (
            <ResultStep
              portraits={portraits}
              activeIndex={activeIndex}
              onActivate={setActiveIndex}
              initialProduct={initialProduct}
              onOtherTheme={() => setStep(1)}
              onRegenerate={generate}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
