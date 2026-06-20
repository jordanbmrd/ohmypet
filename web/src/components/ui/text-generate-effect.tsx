import { motion } from "framer-motion";
import { type ElementType } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Aceternity-derived text generate effect — adapted to framer-motion and the
 * OhMyPet light palette. Words fade up and de-blur one after another as the
 * block scrolls into view.
 */
export function TextGenerateEffect({
  words,
  className,
  as: Tag = "p",
  filter = true,
  duration = 0.6,
  stagger = 0.06,
}: {
  words: string;
  className?: string;
  as?: ElementType;
  filter?: boolean;
  duration?: number;
  stagger?: number;
}) {
  const wordsArray = words.split(" ");

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ staggerChildren: stagger }}
      >
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                y: "0.3em",
                filter: filter ? "blur(8px)" : "blur(0px)",
              },
              show: {
                opacity: 1,
                y: "0em",
                filter: "blur(0px)",
              },
            }}
            transition={{ duration, ease }}
          >
            {word}
            {idx < wordsArray.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
