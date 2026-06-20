import { asset } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/** Real source photo and its generated result, crossfaded by the morph. */
const PHOTO = asset("/dog-photo.jpg");
const RESULT = asset("/themes/royalty_portrait.png");

/**
 * A hand-drawn note: a few sketched words above a wobbly arrow that
 * "draws itself" toward the artwork. One per step, crossfaded by `show`.
 */
function Annotation({
  show,
  className,
  text,
  arrow,
  reverse = false,
}: {
  show: boolean;
  className: string;
  text: string;
  arrow: React.ReactNode;
  reverse?: boolean;
}) {
  const label = (
    <span className="block font-hand text-lg leading-tight text-accent sm:text-xl">
      {text}
    </span>
  );
  const sketch = (
    <motion.div
      className="text-accent"
      animate={show ? "draw" : "hide"}
      initial={false}
    >
      {arrow}
    </motion.div>
  );
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute z-10 hidden sm:block ${className}`}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
      transition={{ duration: 0.45, ease }}
    >
      {reverse ? (
        <>
          {sketch}
          {label}
        </>
      ) : (
        <>
          {label}
          {sketch}
        </>
      )}
    </motion.div>
  );
}

/** Shared draw-on animation for a sketched stroke. */
const stroke = {
  draw: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease } },
  hide: { pathLength: 0, opacity: 0, transition: { duration: 0.25 } },
};

/**
 * A single artwork that morphs continuously across the process:
 * raw snapshot → styled poster → framed print. Driven by a 0–1 `progress`
 * MotionValue so every transition tracks the scroll frame-by-frame.
 * All action resolves by ~0.8 so the framed result stays on screen.
 * `active` (0–2) drives the hand-drawn annotation for the current step.
 */
export function ProcessStage({
  progress,
  active,
}: {
  progress: MotionValue<number>;
  active: number;
}) {
  const photoOpacity = useTransform(progress, [0, 0.32], [1, 0]);
  const posterOpacity = useTransform(progress, [0.12, 0.4], [0, 1]);
  const cropOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const labelOpacity = useTransform(progress, [0.2, 0.44], [0, 1]);
  const labelY = useTransform(progress, [0.2, 0.44], [12, 0]);
  const rotate = useTransform(progress, [0, 0.3], [-2.5, 0]);
  const matPad = useTransform(progress, [0.5, 0.78], [6, 22]);
  const framePad = useTransform(progress, [0.5, 0.8], [0, 14]);
  const wallOpacity = useTransform(progress, [0.55, 0.85], [0, 1]);

  const shadowY = useTransform(progress, [0, 1], [22, 55]);
  const shadowBlur = useTransform(progress, [0, 1], [45, 90]);
  const shadowSpread = useTransform(progress, [0, 1], [-30, -34]);
  const boxShadow = useMotionTemplate`0 ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(20,17,13,0.5)`;

  return (
    <div className="relative flex h-full items-center justify-center">
      {/* Hand-drawn step notes — one per step, sketched onto the artwork */}
      <Annotation
        show={active === 0}
        className="left-0 top-1 -rotate-3 sm:top-3"
        text="Envoyez une photo de votre animal"
        arrow={
          <svg width="78" height="58" viewBox="0 0 78 58" fill="none">
            <motion.path
              d="M8 6 C 26 22, 44 30, 64 44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
            <motion.path
              d="M64 44 L 51 44 M64 44 L 60 32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
          </svg>
        }
      />
      <Annotation
        show={active === 1}
        className="right-0 top-1 rotate-3 text-right sm:top-3"
        text="Choisissez un thème"
        arrow={
          <svg width="78" height="58" viewBox="0 0 78 58" fill="none" className="ml-auto">
            <motion.path
              d="M70 6 C 52 22, 34 30, 14 44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
            <motion.path
              d="M14 44 L 27 44 M14 44 L 18 32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
          </svg>
        }
      />
      <Annotation
        show={active === 2}
        reverse
        className="bottom-1 left-0 -rotate-3 sm:bottom-3"
        text="Encadré, livré chez vous"
        arrow={
          <svg width="78" height="58" viewBox="0 0 78 58" fill="none">
            <motion.path
              d="M8 52 C 26 36, 44 28, 64 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
            <motion.path
              d="M64 14 L 51 16 M64 14 L 60 26"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              variants={stroke}
            />
          </svg>
        }
      />

      {/* Gallery wall — fades in as it gets framed */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card"
        style={{
          opacity: wallOpacity,
          background:
            "radial-gradient(120% 90% at 50% 25%, rgba(168,133,79,0.10), transparent 60%)",
        }}
      />

      {/* Outer frame (oak) */}
      <motion.div
        className="relative w-[72%] max-w-[280px] rounded-[10px] sm:w-[68%] sm:max-w-[340px]"
        style={{
          padding: framePad,
          rotate,
          boxShadow,
          background: "linear-gradient(145deg, #8a6d44, #6f5630 55%, #4d3c22)",
        }}
      >
        {/* White mat + canvas */}
        <motion.div className="rounded-[8px] bg-surface" style={{ padding: matPad }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6px]">
            {/* Layer A — the candid source photo */}
            <motion.img
              src={PHOTO}
              alt="Photo originale"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: photoOpacity }}
            />
            {/* Layer B — the generated portrait */}
            <motion.img
              src={RESULT}
              alt="Portrait royal généré"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: posterOpacity }}
            />

            {/* Crop marks — only while it's still a raw photo */}
            <motion.div aria-hidden className="absolute inset-3" style={{ opacity: cropOpacity }}>
              {[
                "left-0 top-0 border-l-2 border-t-2",
                "right-0 top-0 border-r-2 border-t-2",
                "left-0 bottom-0 border-l-2 border-b-2",
                "right-0 bottom-0 border-r-2 border-b-2",
              ].map((pos) => (
                <span key={pos} className={`absolute h-4 w-4 border-ink/40 ${pos}`} />
              ))}
            </motion.div>

            {/* "Original" tag (photo) */}
            <motion.div
              className="absolute left-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-canvas backdrop-blur-sm"
              style={{ opacity: cropOpacity }}
            >
              Original
            </motion.div>

            {/* Poster label (styled) */}
            <motion.div
              className="absolute inset-x-0 bottom-0 p-4"
              style={{ opacity: labelOpacity, y: labelY }}
            >
              <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/70">
                OhMyPet · Édition
              </div>
              <div className="display text-2xl text-white">Royal</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
