import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { steps } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ProcessStage } from "@/components/ProcessStage";

const ease = [0.16, 1, 0.3, 1] as const;

export function HowItWorks() {
  const [active, setActive] = useState(0);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
  });

  return (
    <section
      id="process"
      ref={ref}
      className="relative h-[300vh] lg:h-[400vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 pt-24 pb-14 lg:justify-center lg:px-10 lg:pt-0 lg:pb-0">
          <Reveal>
            <p className="eyebrow mb-5">Le procédé</p>
            <h2 className="display max-w-xl text-[clamp(1.7rem,4.5vw,3.4rem)]">
              Trois gestes,
              <br />
              <span className="italic text-accent">une œuvre.</span>
            </h2>
          </Reveal>

          {/* Mobile layout — fills the remaining viewport height */}
          <div className="flex flex-1 flex-col items-center justify-center gap-7 lg:hidden">
            <div className="h-[320px] w-full">
              <ProcessStage progress={scrollYProgress} active={active} />
            </div>

            <div className="relative min-h-[96px] w-full overflow-hidden">
              {steps.map((s, i) => (
                <motion.div
                  key={s.no}
                  className="absolute inset-0"
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <span className="display text-sm text-accent">{s.no}</span>
                  <h3 className="mt-1 text-lg font-medium">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{s.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 rounded-full bg-accent"
                  animate={{ width: i === active ? 20 : 6, opacity: i === active ? 1 : 0.3 }}
                  transition={{ duration: 0.4, ease }}
                />
              ))}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="mt-12 hidden items-center gap-20 lg:grid lg:grid-cols-[1fr_0.9fr]">
            <div className="relative pl-8">
              <span className="absolute left-[10px] top-2 bottom-2 w-px bg-hairline" />
              <motion.span
                className="absolute left-[10px] top-2 bottom-2 w-px origin-top bg-accent"
                style={{ scaleY: scrollYProgress }}
              />

              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <div
                    key={s.no}
                    onMouseEnter={() => setActive(i)}
                    className="relative py-7"
                  >
                    <span className="absolute -left-8 top-9 grid h-5 w-5 -translate-x-[6px] place-items-center">
                      <motion.span
                        className="h-2.5 w-2.5 rounded-full ring-4 ring-canvas"
                        animate={{
                          backgroundColor: on ? "var(--color-accent)" : "var(--color-ink-faint)",
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

            <div className="h-[520px]">
              <ProcessStage progress={scrollYProgress} active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
