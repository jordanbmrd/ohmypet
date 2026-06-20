import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { PosterFrame } from "@/components/PosterFrame";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AnimatedTooltip, type TooltipItem } from "@/components/ui/animated-tooltip";

const ease = [0.16, 1, 0.3, 1] as const;

const proof: TooltipItem[] = [
  { id: 1, name: "Gustave", designation: "Édition Royale", color: "var(--color-royalty)" },
  { id: 2, name: "Java", designation: "Couverture Magazine", color: "var(--color-magazine)" },
  { id: 3, name: "Nala", designation: "Édition Héros", color: "var(--color-superhero)" },
  { id: 4, name: "Orion", designation: "Explorateur Spatial", color: "var(--color-space)" },
  { id: 5, name: "Pixel", designation: "Grand Chef", color: "var(--color-chef)" },
];
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.1 + i * 0.09, ease },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-32 lg:px-10 lg:pt-40">
      {/* soft champagne aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,133,79,0.28), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left — editorial statement */}
        <div className="relative">
          <motion.p
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="eyebrow mb-6"
          >
            Atelier de portraits · Chiens & chats
          </motion.p>

          <h1 className="display text-[clamp(3.2rem,8vw,6.4rem)]">
            <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
              Votre compagnon,
            </motion.span>
            <motion.span
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="block italic text-accent"
            >
              en œuvre d'art.
            </motion.span>
          </h1>

          <TextGenerateEffect
            words="Transformez une simple photo en portrait d'exception généré par IA : couverture de magazine, portrait royal, superhéros. Puis recevez-le imprimé et encadré chez vous."
            className="mt-7 block max-w-md text-lg leading-relaxed text-ink-soft"
          />

          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MovingBorderButton className="group">
              Créer mon portrait
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MovingBorderButton>
            <a href="#themes">
              <Button size="lg" variant="outline">
                Voir les thèmes
              </Button>
            </a>
          </motion.div>

          <motion.div
            custom={5}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-soft"
          >
            <AnimatedTooltip items={proof} />
            <div className="flex flex-col gap-1">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <span>
                <strong className="font-semibold text-ink">4,9/5</strong> · Satisfaction garantie
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right — floated poster trio */}
        <div className="relative h-[460px] sm:h-[560px]">
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="absolute left-0 top-10 w-[52%]"
          >
            <div className="animate-float [animation-delay:-2s]">
              <PosterFrame accent="var(--color-royalty)" label="Royal" image="/themes/royalty_portrait.png" ratio="aspect-[4/5]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ duration: 1, delay: 0.45, ease }}
            className="absolute right-0 top-0 z-10 w-[56%]"
          >
            <div className="animate-float">
              <PosterFrame
                accent="var(--color-magazine)"
                label="Magazine"
                caption="Couverture · Star de la mode"
                image="/themes/magazine_cover.png"
                ratio="aspect-[4/5]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="absolute bottom-0 left-1/2 z-20 w-[50%] -translate-x-1/3"
          >
            <div className="animate-float [animation-delay:-4s]">
              <PosterFrame accent="var(--color-space)" label="Cosmos" image="/themes/space_explorer.png" ratio="aspect-[4/5]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
