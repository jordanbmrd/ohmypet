import { useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Aceternity-derived resizable navbar — adapted to framer-motion and the
 * OhMyPet light palette. As the page scrolls past the fold the bar contracts
 * into a floating, frosted pill that lifts off the canvas.
 */
export function ResizableNavbar({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
      <motion.nav
        initial={false}
        animate={{ maxWidth: scrolled ? "52rem" : "80rem" }}
        transition={{ type: "spring", stiffness: 220, damping: 32 }}
        className={cn(
          "flex h-15 w-full items-center justify-between rounded-full px-4 py-2.5 transition-colors duration-500 sm:px-6",
          scrolled
            ? "border border-hairline bg-canvas/70 shadow-[0_12px_40px_-22px_rgba(20,17,13,0.45)] backdrop-blur-xl"
            : "border border-transparent",
        )}
      >
        {children}
      </motion.nav>
    </header>
  );
}
