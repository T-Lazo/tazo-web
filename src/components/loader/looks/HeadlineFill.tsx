"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import type { LookProps } from "./index";

// The hero headline as a faint outline that fills with gold-to-green liquid as the page loads,
// with a gold glow behind it that brightens as it fills. When it's full, it glides onto the real
// headline (fading to white on the way) and the hero comes up around it.
//
// The hero marks its headline with `data-loader-headline`; this copies its text, size and
// letter-spacing so the handoff lines up exactly.

const HEADLINE = "[data-loader-headline]";
const FALLBACK_TEXT = "Hey, I'm TJ.";

const FILL = "linear-gradient(150deg, #D4AF37 0%, #006850 100%)"; // the journey orb's gold → deep green
const SURFACE = "rgba(246, 233, 184, 0.9)"; // thin cream line on the liquid's surface
const GHOST = "rgba(232, 232, 232, 0.22)"; // outline of the empty letters
const BACKDROP = "radial-gradient(120% 75% at 50% 0%, #1b4428 0%, #12301e 42%, #0d1a14 100%)";
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

const OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GLIDE: [number, number, number, number] = [0.65, 0, 0.35, 1];
// Room above and below the line box on every layer, so the gradient (which only paints inside
// its box) reaches the descenders of "y", "," and "J". Symmetric, so the centre doesn't move.
const PAD = 0.25; // em
const PAUSE_MS = 420; // beat between "full" and the glide
const GLIDE_MS = 1000;
// The real headline glides home underneath this copy, in lockstep. It turns fully visible in
// the first part of the glide (hidden under the copy); the copy then fades out over the rest,
// which is also what turns gold-to-green into white. So there's no swap at the end: the glide
// finishes on the real headline, in its own spot.
// Keep REAL_IN's middle value below COPY_OUT's, so the copy never fades over a half-visible
// real headline (that would dim the text mid-glide)
const REAL_IN = [0, 0.3, 1]; // real headline: opacity 0 → 1 by 30% of the glide
const COPY_OUT = [0, 0.45, 1]; // copy: opacity 1 until 45%, then → 0

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

// Points along the liquid's surface: two sine waves drifting in opposite directions
function wave(W: number, level: number, amp: number, t: number, lift: number) {
  const pts: string[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const y = level + amp * (Math.sin(u * 6.9 + t * 2.6) + 0.5 * Math.sin(u * 16 - t * 1.7)) - lift;
    pts.push(`${(u * W).toFixed(1)}px ${y.toFixed(1)}px`);
  }
  return pts;
}

type Headline = {
  text: string;
  fontSize: number;
  letterSpacing: number;
  width: number;
  multiLine: boolean;
};

// Read the hero headline's text, size and spacing (the look only ever renders in the browser)
function readHeadline(): Headline | null {
  const h1 = document.querySelector<HTMLElement>(HEADLINE);
  if (!h1) return null;
  const cs = getComputedStyle(h1);
  const fontSize = parseFloat(cs.fontSize);
  const lineHeight = parseFloat(cs.lineHeight) || fontSize;
  const letterSpacing = parseFloat(cs.letterSpacing) || 0;
  const box = h1.getBoundingClientRect();
  return {
    text: h1.textContent?.trim() || FALLBACK_TEXT,
    fontSize,
    letterSpacing,
    width: box.width,
    multiLine: box.height > lineHeight * 1.5,
  };
}

const sameHeadline = (a: Headline | null, b: Headline | null) =>
  !!a && !!b && a.text === b.text && a.fontSize === b.fontSize && a.letterSpacing === b.letterSpacing &&
  Math.abs(a.width - b.width) < 0.5 && a.multiLine === b.multiLine;

// The glyphs' own extent, not the element's box (the hero's h1 box can be wider than its text)
function textRect(el: Element) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect();
}

export default function HeadlineFill({
  progress,
  reduce,
  exiting,
  reveal,
  glideHeadline,
  onExited,
}: LookProps) {
  const [h, setH] = useState(readHeadline);
  const ghostRef = useRef<HTMLSpanElement>(null);

  // Stay in sync with the real headline: its size changes with the window (it's a different
  // size at each breakpoint) and its width changes when the web font arrives
  useEffect(() => {
    const h1 = document.querySelector(HEADLINE);
    if (!h1) return;
    let alive = true;
    const update = () => {
      if (!alive) return;
      const next = readHeadline();
      setH((prev) => (sameHeadline(prev, next) ? prev : next));
    };
    const ro = new ResizeObserver(update);
    ro.observe(h1);
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  const [glide, setGlide] = useState<{ x: number; y: number; scale: number } | null>(null);
  const landedRef = useRef(false);
  const wordRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const fontSize = h?.fontSize ?? 96;
  const finalSpacing = h?.letterSpacing ?? -0.025 * fontSize;
  // Letters start spread out and draw together. Skipped when the headline wraps (e.g. on a
  // phone), where wider spacing would reflow the lines mid-animation.
  const startSpacing = h?.multiLine ? finalSpacing : 0.14 * fontSize;

  useAnimationFrame((time) => {
    const word = wordRef.current;
    const fill = fillRef.current;
    const edge = edgeRef.current;
    if (!word || !fill || !edge) return;
    // The fill waits for the letters to settle in before it rises
    const gate = reduce ? 1 : easeOut(clamp((time - 450) / 700));
    const f = progress.get() * gate;
    const t = time / 1000;
    const H = word.offsetHeight;
    const W = word.offsetWidth;
    const E = fontSize; // one line (line-height is 1)
    const lines = Math.max(1, Math.round((H - 2 * PAD * E) / E));
    // From below the descenders of the last line to above the capitals of the first; the
    // surface calms as it fills
    const level = PAD * E + E * ((lines - 1 + 1.25) - (lines - 1 + 1.37) * f);
    const amp = reduce ? 0 : E * 0.03 * (1 - f * f) * Math.min(1, f * 10);
    const line = Math.max(1.5, E * 0.012);
    const top = wave(W, level, amp, t, 0);
    const bottom = `${(H + E).toFixed(1)}px`;
    fill.style.clipPath = `polygon(${top.join(",")},${W}px ${bottom},0px ${bottom})`;
    const upper = wave(W, level, amp, t, line);
    edge.style.clipPath = `polygon(${upper.join(",")},${top.reverse().join(",")})`;
    if (glowRef.current) glowRef.current.style.opacity = String(0.2 + 0.8 * f);
  });

  // Exit: a beat, then glide onto the real headline while the hero comes up around it
  useEffect(() => {
    if (!exiting) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        reveal();
        const ghost = ghostRef.current;
        const word = wordRef.current;
        const h1 = document.querySelector(HEADLINE);
        if (ghost && word && h1) {
          // Line the text up with the real headline's text. The copy is kept at the same size,
          // so the scale is normally exactly 1; it only corrects for a size change in the last
          // moment before the glide.
          const a = textRect(ghost);
          const b = textRect(h1);
          const from = parseFloat(getComputedStyle(word).fontSize);
          const to = parseFloat(getComputedStyle(h1).fontSize);
          const dx = b.left + b.width / 2 - (a.left + a.width / 2);
          const dy = b.top + b.height / 2 - (a.top + a.height / 2);
          const scale = from && to ? to / from : 1;
          const real = {
            x: -dx,
            y: -dy,
            scale: 1 / scale,
            durationMs: GLIDE_MS,
            ease: GLIDE,
            fadeInTimes: REAL_IN,
          };
          // Put the real headline exactly over the copy (still hidden), give that two frames to
          // apply, then start both glides in the same render so they move as one
          glideHeadline({ ...real, moving: false });
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              setGlide({ x: dx, y: dy, scale });
              glideHeadline({ ...real, moving: true });
            })
          );
        } else {
          setGlide({ x: 0, y: 0, scale: 1 });
        }
        // Fallback in case the glide's completion is never reported
        timers.push(setTimeout(land, GLIDE_MS + 400));
      }, PAUSE_MS)
    );
    return () => timers.forEach(clearTimeout);
    // `land` only uses refs and stable callbacks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting, reveal, onExited]);

  // Landed: the copy has faded out and the real headline is home, so the loader can go
  function land() {
    if (landedRef.current) return;
    landedRef.current = true;
    onExited();
  }

  const text = h?.text ?? FALLBACK_TEXT;
  const layer = "pointer-events-none absolute inset-0 py-[0.25em]";
  const gliding = glide !== null;

  return (
    <>
      {/* Backdrop: green radial light and grain, like the hero */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: BACKDROP }}
        animate={{ opacity: gliding ? 0 : 1 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: GRAIN, opacity: 0.2 }}
        />
      </motion.div>

      {/* Gold glow behind the headline, brighter as it fills */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: Math.max((h?.width ?? 600) * 1.5, 360), height: fontSize * 4.5 }}
        animate={{ opacity: gliding ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          ref={glowRef}
          className="size-full"
          style={{
            opacity: 0.2,
            background: "radial-gradient(closest-side, rgba(212, 175, 55, 0.38), rgba(212, 175, 55, 0))",
          }}
        />
      </motion.div>

      {/* The glide (and the final fade over the real headline) lives on its own wrapper, so
          its "animation complete" can't be confused with the entrance's */}
      <motion.div
        initial={false}
        animate={
          gliding
            ? { x: glide.x, y: glide.y, scale: glide.scale, opacity: [1, 1, 0] }
            : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{
          default: { duration: GLIDE_MS / 1000, ease: GLIDE },
          opacity: { duration: GLIDE_MS / 1000, times: COPY_OUT, ease: "linear" },
        }}
        onAnimationComplete={() => {
          if (gliding) land();
        }}
      >
        <motion.div
          ref={wordRef}
          aria-hidden
          className="relative select-none text-center font-serif font-bold"
          style={{
            fontSize,
            lineHeight: 1,
            // One line: sized to its text. Wrapped: the same width as the real headline, so the
            // lines break in the same places
            width: h?.multiLine ? h.width : undefined,
            whiteSpace: h?.multiLine ? "normal" : "nowrap",
          }}
          initial={
            reduce
              ? false
              : { opacity: 0, filter: "blur(14px)", y: 14, letterSpacing: `${startSpacing}px` }
          }
          animate={{
            opacity: 1,
            // Keep this key listed (Framer animates a dropped key back to `initial`), but clear the
            // filter once in focus: even blur(0px) makes the browser draw the text differently
            filter: "blur(0px)",
            letterSpacing: `${finalSpacing}px`,
            y: 0,
            transitionEnd: { filter: "none" },
          }}
          transition={{
            letterSpacing: { duration: 1.7, ease: OUT },
            opacity: { duration: 0.9, ease: "easeOut" },
            filter: { duration: 1.2, ease: OUT },
            y: { duration: 1.3, ease: OUT },
          }}
        >
          {/* Empty letters */}
          <motion.span
            ref={ghostRef}
            className="block"
            style={{ color: "transparent", WebkitTextStroke: `1px ${GHOST}`, padding: `${PAD}em 0` }}
            animate={{ opacity: gliding ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {text}
          </motion.span>
          {/* The liquid */}
          <span
            ref={fillRef}
            className={`${layer} bg-clip-text`}
            style={{ color: "transparent", backgroundImage: FILL, clipPath: "inset(100% 0 0 0)" }}
          >
            {text}
          </span>
          {/* Its surface line */}
          <span ref={edgeRef} className={layer} style={{ color: SURFACE, clipPath: "inset(100% 0 0 0)" }}>
            {text}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}
