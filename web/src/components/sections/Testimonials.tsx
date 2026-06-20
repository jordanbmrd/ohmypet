import { Star } from "lucide-react";
import { testimonials } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { PosterFrame } from "@/components/PosterFrame";

const tilt = ["-rotate-2", "rotate-1", "-rotate-1"];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      {/* soft champagne aura behind the gallery wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,133,79,0.22), transparent)",
        }}
      />

      <Reveal>
        <div className="mb-16 text-center">
          <p className="eyebrow mb-5">Ils ont fait encadrer</p>
          <h2 className="display mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.4rem)]">
            Leurs compagnons, <span className="italic text-accent">au mur.</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12}>
            <figure className="group flex h-full flex-col items-center text-center">
              {/* the framed portrait they received */}
              <div
                className={`w-[78%] transition-transform duration-500 ease-out ${tilt[i % tilt.length]} group-hover:rotate-0 group-hover:-translate-y-1`}
              >
                <PosterFrame
                  accent={t.accent}
                  label={t.pet}
                  image={t.image}
                  ratio="aspect-[4/5]"
                />
              </div>

              {/* theme chip */}
              <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: t.accent }}
                />
                Édition {t.theme}
              </span>

              <div className="mt-4 flex">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>

              <blockquote className="display mt-4 max-w-sm text-lg leading-snug text-ink">
                « {t.quote} »
              </blockquote>

              <figcaption className="mt-5">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-ink-soft">{t.detail}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
