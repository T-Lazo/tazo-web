"use client";

import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import { loaderConfig } from "@/data/loader";
import type { LookProps } from "./index";

// Your name as a faint gold outline that fills with liquid gold as the page loads.

const GOLD = "linear-gradient(180deg, #F6DE8D 0%, #D4AF37 50%, #A8841F 100%)";
const OUTLINE = "rgba(212, 175, 55, 0.35)";

// The liquid's surface: one wavelength per tile, transparent above the wave and solid below.
// The mask is 3× the text's height with the wave a third of the way down, so moving it
// vertically raises the level and moving it sideways makes the surface ripple.
const TILE = 140; // px per wavelength
const WAVE_SPEED = 0.05; // px per ms
const WAVE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 300" preserveAspectRatio="none">' +
    '<path d="M0 100 C20 92 40 92 60 100 S100 108 120 100 V300 H0 Z" fill="white"/></svg>'
)}")`;

// Where the surface sits, in text heights from the top: a little below the text when empty,
// a little above it when full, so the wave's crests and troughs never show at either end.
function maskY(p: number) {
  const surface = 1.08 - 1.16 * p;
  return (1 - surface) / 2; // background-position % for a 3×-tall mask
}

const textClass =
  "block whitespace-nowrap px-[0.1em] py-[0.18em] font-serif text-6xl font-bold leading-none tracking-tight sm:text-8xl md:text-[8.5rem]";

export default function NameFill({ progress, reduce }: LookProps) {
  const fillRef = useRef<HTMLSpanElement>(null);

  useAnimationFrame((t) => {
    const el = fillRef.current;
    if (!el || reduce) return;
    const pos = `${-((t * WAVE_SPEED) % TILE)}px ${maskY(progress.get()) * 100}%`;
    el.style.maskPosition = pos;
    el.style.webkitMaskPosition = pos;
  });

  const mask = reduce
    ? {}
    : {
        maskImage: WAVE,
        WebkitMaskImage: WAVE,
        maskSize: `${TILE}px 300%`,
        WebkitMaskSize: `${TILE}px 300%`,
        maskRepeat: "repeat-x",
        WebkitMaskRepeat: "repeat-x",
        maskPosition: `0px ${maskY(0) * 100}%`,
        WebkitMaskPosition: `0px ${maskY(0) * 100}%`,
      };

  return (
    <div aria-hidden className="relative select-none">
      <span className={textClass} style={{ color: "transparent", WebkitTextStroke: `1px ${OUTLINE}` }}>
        {loaderConfig.name}
      </span>
      <span
        ref={fillRef}
        className={`${textClass} absolute inset-0 bg-clip-text`}
        style={{ color: "transparent", backgroundImage: GOLD, ...mask }}
      >
        {loaderConfig.name}
      </span>
    </div>
  );
}
