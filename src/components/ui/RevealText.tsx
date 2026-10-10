"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/cn";

const TAGS = {
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  span: motion.span,
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_CINEMATIC } },
};

interface RevealTextProps {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  /** Part of the text to emphasise, e.g. a name. */
  highlight?: string;
  highlightClassName?: string;
  /** Whether the text should be visible. Words reveal one by one when this turns true. */
  show?: boolean;
  delay?: number;
  stagger?: number;
  id?: string;
  tabIndex?: number;
  ref?: React.Ref<HTMLHeadingElement & HTMLParagraphElement>;
}

/**
 * Reveals a line of text word by word. Screen readers get the full sentence at
 * once, while the animated words are hidden from them.
 */
export function RevealText({
  text,
  as = "p",
  className,
  highlight,
  highlightClassName = "text-gold-gradient",
  show = true,
  delay = 0,
  stagger = 0.055,
  id,
  tabIndex,
  ref,
}: RevealTextProps) {
  const Tag = TAGS[as];
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      tabIndex={tabIndex}
      className={cn("outline-none", className)}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            {index > 0 && " "}
            <motion.span className="inline-block will-change-transform" variants={wordVariants}>
              {renderWord(word, highlight, highlightClassName)}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

function renderWord(word: string, highlight: string | undefined, highlightClassName: string) {
  if (!highlight) return word;
  const at = word.indexOf(highlight);
  if (at === -1) return word;
  return (
    <>
      {word.slice(0, at)}
      <span className={highlightClassName}>{highlight}</span>
      {word.slice(at + highlight.length)}
    </>
  );
}
