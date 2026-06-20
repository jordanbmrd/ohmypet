import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { Reveal } from "@/components/Reveal";

export function CTA() {
  return (
    <section className="px-6 pb-28 lg:px-10 lg:pb-36">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-ink px-8 py-20 text-center lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(168,133,79,0.6), transparent)",
            }}
          />
          <p className="eyebrow mb-6 text-accent-soft">Votre tour</p>
          <h2 className="display mx-auto max-w-2xl text-[clamp(2.4rem,5vw,4rem)] text-canvas">
            Offrez à votre compagnon
            <span className="italic text-accent-soft"> le portrait qu'il mérite.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ink-faint">
            Un aperçu en quelques secondes. Aucune carte requise pour essayer.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MovingBorderButton
              className="group bg-canvas text-ink"
              borderClassName="bg-[radial-gradient(var(--color-accent)_35%,transparent_60%)]"
            >
              Créer mon portrait
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MovingBorderButton>
            <Button
              size="lg"
              variant="outline"
              className="border-canvas/25 text-canvas hover:bg-canvas hover:text-ink"
            >
              Découvrir les thèmes
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
