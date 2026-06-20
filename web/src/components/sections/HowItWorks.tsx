import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { steps } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ProcessStage } from "@/components/ProcessStage";

const ease = [0.16, 1, 0.3, 1] as const;

/** True once the viewport is at the `lg` breakpoint (≥1024px). */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function HowItWorks() {
  const desktop = useIsDesktop();
  const [active, setActive] = useState(0);

  // One stable ref for both scroll-progress and in-view detection.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  // Mobile drives the same morph with a self-animated value.
  const mobileProgress = useMotionValue(0);
  const progress = desktop ? scrollYProgress : mobileProgress;

  // Highlight the active step from scroll progress (desktop).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!desktop) return;
    setActive(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
  });

  // Mobile: gently cycle steps while in view…
  useEffect(() => {
    if (desktop || !inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 2800);
    return () => clearInterval(t);
  }, [desktop, inView]);

  // …and ease the morph toward the active step.
  useEffect(() => {
    if (desktop) return;
    const target = steps.length > 1 ? active / (steps.length - 1) : 0;
    const controls = animate(mobileProgress, target, { duration: 0.9, ease });
    return () => controls.stop();
  }, [desktop, active, mobileProgress]);

  return (
    <section
      id="process"
      ref={ref}
      className={desktop ? "relative h-[400vh]" : "py-28"}
    >
      <div
        className={
          desktop
            ? "sticky top-0 flex h-screen items-center overflow-hidden"
            : ""
        }
      >
        <div className={`mx-auto w-full max-w-7xl ${desktop ? "px-10" : "px-6"}`}>
          <Reveal>
            <p className="eyebrow mb-5">Le procédé</p>
            <h2 className="display max-w-xl text-[clamp(2.2rem,4.5vw,3.4rem)]">
              Trois gestes,
              <br />
              <span className="italic text-accent">une œuvre.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            {/* Interactive step list with a champagne progress rail */}
            <div className="relative order-2 pl-8 lg:order-1">
              <span className="absolute left-[10px] top-2 bottom-2 w-px bg-hairline" />
              <motion.span
                className="absolute left-[10px] top-2 bottom-2 w-px origin-top bg-accent"
                style={{ scaleY: progress }}
              />

              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <div
                    key={s.no}
                    onMouseEnter={() => !desktop && setActive(i)}
                    className="relative py-7"
                  >
                    <span className="absolute -left-8 top-9 grid h-5 w-5 -translate-x-[6px] place-items-center">
                      <motion.span
                        className="h-2.5 w-2.5 rounded-full ring-4 ring-canvas"
                        animate={{
                          backgroundColor: on
                            ? "var(--color-accent)"
                            : "var(--color-ink-faint)",
                          scale: on ? 1.25 : 1,
                        }}
                        transition={{ duration: 0.4, ease }}
                      />
                    </span>

                    <motion.span
                      className="display text-sm"
                      animate={{ color: on ? "var(--color-accent)" : "var(--color-ink-faint)" }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {s.no}
                    </motion.span>
                    <motion.h3
                      className="mt-1 text-xl font-medium"
                      animate={{ opacity: on ? 1 : 0.45 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {s.title}
                    </motion.h3>
                    <motion.p
                      className="mt-2 max-w-md text-ink-soft"
                      animate={{ opacity: on ? 1 : 0.4 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {s.body}
                    </motion.p>
                  </div>
                );
              })}
            </div>

            {/* The morphing artwork */}
            <div className="order-1 h-[440px] sm:h-[520px] lg:order-2">
              <ProcessStage progress={progress} active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
