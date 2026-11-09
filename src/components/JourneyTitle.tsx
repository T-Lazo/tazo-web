"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { journeyConfig } from "@/data/journey";

const cfg = journeyConfig.title;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Large faint title behind the start of the journey. It sits a little above where the ball rests,
 * so the ball rolls down across it, then drifts up slower than the road (parallax) and fades out
 * on the way to the first milestone, which has extra road before it so they never overlap.
 */
export default function JourneyTitle({
  camY,
  start,
  toFirst,
  height,
  reduce,
}: {
  camY: MotionValue<number>;
  start: number; // camera y before the journey begins
  toFirst: MotionValue<number>; // 0 at the start of the road → 1 at the first milestone
  height: number; // screen height
  reduce: boolean;
}) {
  const y = useTransform(camY, (c) => (reduce ? 0 : (c - start) * cfg.speed));
  const opacity = useTransform(toFirst, (p) =>
    reduce ? 1 : 1 - clamp01((p - cfg.fadeOut[0]) / (cfg.fadeOut[1] - cfg.fadeOut[0]))
  );

  const letters =
    cfg.style === "outline"
      ? { color: "transparent", WebkitTextStroke: `1px rgba(212, 175, 55, ${Math.min(cfg.opacity * 3, 1)})` }
      : { color: `rgba(232, 232, 232, ${cfg.opacity})` };

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 flex flex-col items-center px-4 text-center"
      style={{ top: height * 0.2, y, opacity }}
    >
      <p
        className="mb-3 font-sans text-[11px] uppercase tracking-[0.35em] md:text-xs"
        style={{ color: journeyConfig.accent, opacity: 0.8 }}
      >
        {cfg.eyebrow}
      </p>
      <h2
        className="max-w-[14ch] font-serif text-[15vw] font-bold leading-[0.95] tracking-tight md:text-[min(10vw,9.5rem)]"
        style={letters}
      >
        {cfg.text}
      </h2>
    </motion.div>
  );
}
