import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { themes } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PosterFrame } from "@/components/PosterFrame";
import { FocusCard } from "@/components/ui/focus-cards";
import { MovingBorderButton } from "@/components/ui/moving-border-button";


export function Themes() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="themes"
      className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36"
    >
      <Reveal>
        <div className="flex flex-col items-baseline justify-between gap-4 sm:flex-row">
          <div>
            <p className="eyebrow mb-5">La collection</p>
            <h2 className="display text-[clamp(2.2rem,4.5vw,3.4rem)]">
              Cinq univers, <span className="italic text-accent">signés.</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Chaque thème est interprété sur mesure d'après votre photo. Survolez
            une œuvre révélant le caractère de votre compagnon, sublimé.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-12">
        {themes.map((t, i) => (
          <Reveal key={t.key} delay={(i % 3) * 0.08} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <FocusCard index={i} hovered={hovered} setHovered={setHovered}>
              <Link
                to={`/creer?theme=${t.key}`}
                aria-label={`Créer un portrait ${t.title}`}
                className="group block"
              >
                <PosterFrame
                  accent={t.accentVar}
                  label={t.subtitle}
                  image={t.image}
                  ratio="aspect-[4/5]"
                  className="transition-transform duration-500 group-hover:-translate-y-1.5"
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{t.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{t.blurb}</p>
                  </div>
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: t.accentVar }}
                  />
                </div>
              </Link>
            </FocusCard>
          </Reveal>
        ))}

      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-ink-soft">
            Un thème vous parle&nbsp;? Lancez le vôtre en quelques secondes.
          </p>
          <MovingBorderButton className="group" onClick={() => navigate("/creer")}>
            Créer mon portrait
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MovingBorderButton>
        </div>
      </Reveal>
    </section>
  );
}
