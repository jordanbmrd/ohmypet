import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { faqs } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { cn } from "@/lib/utils";

export function FAQ() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28 lg:py-36">
      <Reveal>
        <p className="eyebrow mb-5 text-center">Questions</p>
        <h2 className="display mb-14 text-center text-[clamp(2rem,4vw,3rem)]">
          Ce qu'il faut <span className="italic text-accent">savoir.</span>
        </h2>
      </Reveal>

      <div className="border-t border-hairline">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-medium">{f.q}</span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-ink-soft transition-transform duration-300",
                      isOpen && "rotate-45 text-accent",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-400 ease-out",
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl text-ink-soft">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-ink-soft">
            Tout est clair&nbsp;? Il ne reste plus qu'à essayer, sans carte bancaire.
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
