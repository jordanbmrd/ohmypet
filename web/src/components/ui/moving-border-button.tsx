import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Aceternity "Moving Border" button — adapted to the OhMyPet palette.
 * A gold glow continuously travels along the button's edge so the CTA reads
 * as the primary action without breaking the editorial-light look.
 */
export interface MovingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  duration?: number;
  containerClassName?: string;
  borderClassName?: string;
}

export const MovingBorderButton = React.forwardRef<
  HTMLButtonElement,
  MovingBorderButtonProps
>(
  (
    {
      borderRadius = "9999px",
      duration = 2800,
      children,
      containerClassName,
      borderClassName,
      className,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      style={{ borderRadius }}
      className={cn(
        "relative h-14 overflow-hidden bg-transparent p-[1.5px] transition-transform duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        containerClassName,
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-24 w-24 bg-[radial-gradient(var(--color-accent-soft)_35%,transparent_60%)] opacity-90",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center gap-2 whitespace-nowrap bg-ink px-8 font-sans text-[0.95rem] font-medium text-canvas antialiased backdrop-blur-xl",
          className,
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </button>
  ),
);
MovingBorderButton.displayName = "MovingBorderButton";

const MovingBorder = ({
  children,
  duration = 2800,
  rx,
  ry,
  ...rest
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}) => {
  const pathRef = React.useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  // SVG geometry calls throw while the button is display:none (e.g. the nav
  // CTA on mobile); an exception here would stall framer-motion's frame loop
  // and freeze every other animation on the page.
  const safe = <T,>(fn: () => T | undefined, fallback: T): T => {
    try {
      return fn() ?? fallback;
    } catch {
      return fallback;
    }
  };

  useAnimationFrame((time) => {
    const length = safe(() => pathRef.current?.getTotalLength(), 0);
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => safe(() => pathRef.current?.getPointAtLength(val).x, 0),
  );
  const y = useTransform(
    progress,
    (val) => safe(() => pathRef.current?.getPointAtLength(val).y, 0),
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...rest}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
