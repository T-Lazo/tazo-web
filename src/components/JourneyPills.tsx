"use client";

import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { journeyConfig } from "@/data/journey";

const cfg = journeyConfig.background.pills;

// Small seeded RNG so the pills land in the same places on every load (and on server + client)
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);

type PillSpec = {
  x: number;
  y: number; // 0–1 starting position within the wrap band
  speed: number;
  width: number;
  stretch: number; // full length = width × stretch
  brightness: number;
};

/**
 * Background pills for the journey, after GSAP's "mesmerising effects" section.
 * - Start: a scatter of dots, mostly tiny and dim, a few bigger and brighter.
 * - As the ball travels, every dot stretches into a pill (driven by journey progress).
 * - Each pill moves with the camera at a speed matching its depth (parallax), wrapping round.
 * - Near the end of the journey they dim out.
 */
export default function JourneyPills({
  camX,
  camY,
  progress,
  width,
  height,
  mobile,
}: {
  camX: MotionValue<number>;
  camY: MotionValue<number>;
  progress: MotionValue<number>; // 0 at the start of the road → 1 at the current milestone
  width: number;
  height: number; // screen height
  mobile: boolean;
}) {
  const pills = useMemo<PillSpec[]>(() => {
    const r = rng(11);
    const n = mobile ? cfg.mobileCount : cfg.count;
    const scale = mobile ? 0.7 : 1;
    return Array.from({ length: n }, (_, i) => {
      // Most pills are far away (small); depth^1.6 skews the mix towards tiny ones
      const depth = Math.pow(r(), 1.6);
      return {
        x: ((i + 0.15 + r() * 0.7) / n) * width, // evenly spread with jitter, so they don't clump
        y: r(),
        speed: lerp(cfg.speed[0], cfg.speed[1], depth),
        width: lerp(cfg.width[0], cfg.width[1], depth) * scale,
        stretch: lerp(cfg.stretch[0], cfg.stretch[1], r()),
        brightness: lerp(0.25, 1, depth),
      };
    });
  }, [mobile, width]);

  // 0 = dots, 1 = fully stretched
  const stretch = useTransform(progress, (p) => smooth(clamp01((p - cfg.stretchFrom) / (cfg.stretchTo - cfg.stretchFrom))));
  // Visible as dots from the moment the journey comes into view; dims out over the last stretch
  const opacity = useTransform(progress, (p) => cfg.opacity * (1 - smooth(clamp01((p - cfg.fadeFrom) / (1 - cfg.fadeFrom)))));

  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity }}>
      {pills.map((pill, i) => (
        <Pill key={i} pill={pill} camX={camX} camY={camY} stretch={stretch} height={height} />
      ))}
    </motion.div>
  );
}

function Pill({
  pill,
  camX,
  camY,
  stretch,
  height,
}: {
  pill: PillSpec;
  camX: MotionValue<number>;
  camY: MotionValue<number>;
  stretch: MotionValue<number>;
  height: number;
}) {
  const maxLength = pill.width * pill.stretch;
  // Wrap vertically over a band a bit taller than the screen, so each pill keeps coming round
  const span = height + maxLength + 120;
  const y = useTransform(() => {
    const v = pill.y * span + camY.get() * pill.speed;
    return (((v % span) + span) % span) - maxLength - 60;
  });
  const x = useTransform(() => pill.x + camX.get() * pill.speed);
  // Grows downwards from its top, so the pill trails behind as it rises
  const h = useTransform(stretch, (s) => lerp(pill.width, maxLength, s));

  return (
    <motion.span
      className="absolute left-0 top-0 rounded-full"
      style={{
        x,
        y,
        width: pill.width,
        height: h,
        marginLeft: -pill.width / 2,
        opacity: pill.brightness,
        background: `linear-gradient(150deg, ${cfg.colors[0]}, ${cfg.colors[1]})`,
      }}
    />
  );
}
