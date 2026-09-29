import { useState } from "react";
import { Link } from "react-router-dom";
import { products, type ProductKey } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { FocusCard } from "@/components/ui/focus-cards";
import { productMocks } from "@/components/ProductShowcase";
import { ArrowRight } from "lucide-react";

const ctaByKey: Record<ProductKey, string> = {
  print: "Commander le tirage",
  mug: "Commander la tasse",
  case: "Commander la coque",
};

export function Products() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="tirages" className="border-y border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5">L'objet</p>
            <h2 className="display text-[clamp(2.2rem,4.5vw,3.4rem)]">
              Du fichier <span className="italic text-accent">au mur.</span>
            </h2>
            <p className="mt-6 text-ink-soft">
              Le portrait ne reste pas dans votre téléphone. Trois supports,
              imprimés avec un soin d'atelier et livrés chez vous.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {products.map((p, i) => {
            const Mock = productMocks[p.key];
            return (
              <Reveal key={p.key} delay={i * 0.1}>
                <FocusCard
                  index={i}
                  hovered={hovered}
                  setHovered={setHovered}
                  className="h-full"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-canvas">
                    {/* visual */}
                    <div className="relative h-[300px] overflow-hidden sm:h-[320px]">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                          background:
                            "radial-gradient(100% 80% at 50% 100%, rgba(168,133,79,0.1), transparent 55%)",
                        }}
                      />
                      <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03] h-full">
                        <Mock />
                      </div>
                    </div>

                    {/* meta */}
                    <div className="flex flex-1 flex-col border-t border-hairline p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium">{p.name}</h3>
                        <span className="display whitespace-nowrap text-lg text-ink">
                          {p.price}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-soft">{p.detail}</p>

                      <Link
                        to={`/creer?produit=${p.key}`}
                        className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-ink transition-colors duration-300 group-hover:text-accent"
                      >
                        {ctaByKey[p.key]}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                </FocusCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
