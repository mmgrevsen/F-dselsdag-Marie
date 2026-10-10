"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clapperboard, Popcorn } from "lucide-react";
import { experience, resolvedDetails } from "@/config/experience";
import { useMotionPrefs } from "@/components/ui";
import { useMediaQuery } from "@/lib/useMediaQuery";

const { invitation, event } = experience;

/**
 * Den fysiske biografbillet: varmt ivory-papir, dybe røde detaljer,
 * tynde guldkanter, perforerede kanter og en diskret 3D-hældning på desktop.
 */
export function CinemaTicket({ glowing = false }: { glowing?: boolean }) {
  const { reduce, transition } = useMotionPrefs();
  const details = resolvedDetails(event);
  const containerRef = useRef<HTMLDivElement>(null);
  // 3D-hældning kun på pegeredskaber med hover (altså ikke touch),
  // og aldrig når brugeren har bedt om mindre bevægelse.
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const tiltEnabled = !reduce && finePointer;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), {
    stiffness: 140,
    damping: 18,
  });


  const handlePointerMove = (fraction: { x: number; y: number }) => {
    pointerX.set(fraction.x);
    pointerY.set(fraction.y);
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full max-w-[32rem]"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: reduce ? 0 : 54, rotate: reduce ? 0 : -4, scale: reduce ? 1 : 0.94 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={transition(1.1)}
      onPointerMove={
        tiltEnabled
          ? (eventArg) => {
              const bounds = containerRef.current?.getBoundingClientRect();
              if (!bounds) return;
              handlePointerMove({
                x: (eventArg.clientX - bounds.left) / bounds.width - 0.5,
                y: (eventArg.clientY - bounds.top) / bounds.height - 0.5,
              });
            }
          : undefined
      }
      onPointerLeave={
        tiltEnabled
          ? () => {
              pointerX.set(0);
              pointerY.set(0);
            }
          : undefined
      }
    >
      <motion.article
        aria-label={`${invitation.kicker}: ${invitation.headline}`}
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        animate={{
          boxShadow: glowing
            ? "0 50px 110px -40px rgba(216,180,114,0.75), 0 0 0 1px rgba(216,180,114,0.5)"
            : "0 44px 90px -44px rgba(0,0,0,0.95), 0 0 0 1px rgba(216,180,114,0.22)",
        }}
        transition={{ duration: 0.8 }}
        className="paper relative overflow-hidden rounded-[4px]"
      >
        {/* Tynd guldkant indvendigt */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[9px] rounded-[2px] border border-[#b4914f]/45"
        />
        {/* Perforerede kanter */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[7px]"
          style={{
            background:
              "radial-gradient(circle at 0 50%, #06050a 0 3.5px, rgba(92,20,32,0.18) 3.5px 4.5px, transparent 4.5px) 0 0 / 7px 14px repeat-y",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[7px]"
          style={{
            background:
              "radial-gradient(circle at 100% 50%, #06050a 0 3.5px, rgba(92,20,32,0.18) 3.5px 4.5px, transparent 4.5px) 0 0 / 7px 14px repeat-y",
          }}
        />

        <div className="relative px-5 pt-6 pb-5 sm:px-9 sm:pt-9 sm:pb-8">
          {/* Toplinje: brand + filmrulle */}
          <header className="flex items-center justify-between gap-3 border-b border-[#5c1420]/20 pb-4">
            <p className="font-display text-base font-bold tracking-[0.2em] text-[#5c1420] sm:text-lg">
              {invitation.brand}
            </p>
            <FilmReel />
          </header>

          <p className="mt-5 font-sans text-[0.58rem] font-semibold tracking-[0.3em] text-[#8a6c3c] uppercase sm:text-[0.68rem] sm:tracking-[0.36em]">
            {invitation.kicker}
          </p>

          <h2 className="mt-3 font-display text-[clamp(1.75rem,9vw,2.9rem)] font-bold leading-[1.04] tracking-[0.04em] text-[#5c1420] uppercase">
            {invitation.headline}
          </h2>

          <div
            aria-hidden
            className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#b4914f]/70 to-transparent"
          />

          <p className="mt-4 font-display text-[0.95rem] font-semibold tracking-[0.14em] text-[#2d1c17] uppercase sm:text-base">
            {invitation.subline}
          </p>

          <p className="mt-3 text-pretty font-letter text-[1.05rem] leading-relaxed text-[#2d1c17]/90 sm:text-[1.12rem]">
            {invitation.body}
          </p>

          <p className="mt-4 flex items-center gap-2 font-letter text-[1rem] text-[#5c1420] italic sm:text-[1.05rem]">
            <Popcorn className="size-4 shrink-0 text-[#8a6c3c]" aria-hidden />
            {invitation.from}
          </p>

          {/* Valgfrit informationsfelt — vises kun når noget er udfyldt */}
          {details.length > 0 ? (
            <section className="mt-6 rounded-[2px] border border-[#b4914f]/40 bg-[#efe3d1]/60 px-4 py-4">
              <h3 className="font-sans text-[0.55rem] font-semibold tracking-[0.3em] text-[#8a6c3c] uppercase">
                {invitation.detailsHeading}
              </h3>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {details.map((detail) => (
                  <div key={detail.key} className="flex flex-col gap-0.5">
                    <dt className="font-sans text-[0.52rem] tracking-[0.26em] text-[#8a6c3c] uppercase">
                      {detail.label}
                    </dt>
                    <dd className="font-letter text-[1.02rem] leading-snug text-[#2d1c17]">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {/* Afrivningskant */}
          <div aria-hidden className="relative mt-6 h-5 sm:mt-7">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-[#5c1420]/30" />
            <span className="absolute -left-7 top-1/2 size-5 -translate-y-1/2 rounded-full bg-ink shadow-[inset_-2px_0_6px_rgba(0,0,0,0.6)] sm:-left-11" />
            <span className="absolute -right-7 top-1/2 size-5 -translate-y-1/2 rounded-full bg-ink shadow-[inset_2px_0_6px_rgba(0,0,0,0.6)] sm:-right-11" />
          </div>

          <footer className="mt-4 flex items-center justify-between gap-3">
            <p className="font-sans text-[0.55rem] font-semibold tracking-[0.26em] text-[#5c1420] uppercase sm:text-[0.62rem] sm:tracking-[0.3em]">
              {invitation.validity}
            </p>
            <Clapperboard className="size-5 shrink-0 text-[#8a6c3c]" aria-hidden />
          </footer>
        </div>
      </motion.article>
    </motion.div>
  );
}

/** Lille animeret filmrulle som dekorativ detalje. */
function FilmReel() {
  return (
    <span
      aria-hidden
      className="relative flex size-9 items-center justify-center rounded-full border border-[#5c1420]/35 sm:size-10"
    >
      <span className="reel-spin absolute inset-1 rounded-full border border-dashed border-[#8a6c3c]/70" />
      <span className="size-1.5 rounded-full bg-[#5c1420]" />
    </span>
  );
}
