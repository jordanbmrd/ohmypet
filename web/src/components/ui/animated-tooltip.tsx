import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export type TooltipItem = {
  id: number;
  name: string;
  designation: string;
  /** Accent colour for the swatch avatar. */
  color: string;
  /** Optional initials shown inside the swatch (defaults to first letter). */
  initials?: string;
};

/**
 * Aceternity-derived animated tooltip — adapted to framer-motion and a
 * swatch-avatar fallback (we render coloured initials instead of photos).
 * The tooltip springs in above the avatar and tilts to follow the pointer.
 */
export function AnimatedTooltip({ items }: { items: TooltipItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const x = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 12 };
  const rotate = useSpring(useTransform(x, [-60, 60], [-12, 12]), springConfig);
  const translateX = useSpring(useTransform(x, [-60, 60], [-10, 10]), springConfig);

  return (
    <div className="flex items-center">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="group relative -ml-2 first:ml-0"
          style={{ zIndex: items.length - idx }}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          onMouseMove={(e) => {
            const half = e.currentTarget.offsetWidth / 2;
            x.set(e.nativeEvent.offsetX - half);
          }}
        >
          <AnimatePresence mode="popLayout">
            {hovered === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 10 },
                }}
                exit={{ opacity: 0, y: 14, scale: 0.6 }}
                style={{ rotate, translateX, x: "-50%" }}
                className="absolute -top-16 left-1/2 z-50 flex flex-col items-center whitespace-nowrap rounded-xl border border-hairline bg-ink px-4 py-2 text-center shadow-[0_12px_30px_-12px_rgba(20,17,13,0.5)]"
              >
                <div className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent" />
                <div className="text-sm font-medium text-canvas">{item.name}</div>
                <div className="text-xs text-ink-faint">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="grid h-11 w-11 place-items-center rounded-full text-xs font-semibold uppercase tracking-wide text-white ring-2 ring-canvas transition-transform duration-300 group-hover:z-30 group-hover:scale-105"
            style={{
              background: `linear-gradient(150deg, ${item.color}, color-mix(in oklab, ${item.color} 55%, #14110d))`,
            }}
          >
            {item.initials ?? item.name.charAt(0)}
          </div>
        </div>
      ))}
    </div>
  );
}
