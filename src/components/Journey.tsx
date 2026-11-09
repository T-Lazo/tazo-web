"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { flattenJourney, journey, journeyConfig, type Marker } from "@/data/journey";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false }
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false }
);

const markers = flattenJourney(journey);
const found = markers.findIndex((m) => m.current);
const endIndex = found === -1 ? markers.length - 1 : found;

const { ball, camera } = journeyConfig;
const tint = journeyConfig.accent;

// The ball starts this far below the top of the journey's frame. The frame overlaps the hero
// by the same amount, so on load the ball sits half-hidden on the hero's bottom edge.
const START = 64;
const SAMPLE_STEP = 2; // px between precomputed points along the road

// Black-and-white noise tile for the ball's grain overlay
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

type Geometry = {
  vh: number; // screen height the layout was built for
  mobile: boolean;
  width: number;
  height: number;
  cx: number;
  amp: number; // how far the road swings either side of cx
  path: string;
  points: { x: number; y: number }[]; // marker positions in the world
  at: number[]; // distance along the road to each marker
  length: number; // distance to the current marker, where the ball stops
  total: number; // full road length
  samples: Float32Array; // x,y every SAMPLE_STEP px along the road
};

// Lays the road out from the milestone list: one S-bend per marker, alternating sides.
function buildGeometry(width: number, vh: number): Geometry {
  const mobile = width < 768;
  const cx = mobile ? 48 : width / 2;
  const amp = mobile ? 16 : Math.min(journeyConfig.swing, width * 0.16);

  const pts = [{ x: cx, y: 0 }];
  let y = 0;
  markers.forEach((m, i) => {
    const gap = i === 0 ? journeyConfig.firstGap : m.kind === "year" ? journeyConfig.yearSpacing : journeyConfig.stopSpacing;
    y += gap * vh;
    pts.push({ x: cx + (i % 2 === 0 ? -amp : amp), y });
  });

  // Each segment leaves and arrives vertically, so the bends are smooth
  const segs = pts.slice(1).map((p, i) => {
    const a = pts[i];
    const dy = p.y - a.y;
    return `C ${a.x} ${a.y + dy * 0.55} ${p.x} ${p.y - dy * 0.55} ${p.x} ${p.y}`;
  });
  const path = `M ${pts[0].x} ${pts[0].y} ${segs.join(" ")}`;

  // Measure with a throwaway SVG path
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
  const el = document.createElementNS(ns, "path");
  svg.appendChild(el);
  document.body.appendChild(svg);

  const at: number[] = [];
  let partial = `M ${pts[0].x} ${pts[0].y}`;
  for (const s of segs) {
    partial += ` ${s}`;
    el.setAttribute("d", partial);
    at.push(el.getTotalLength());
  }
  el.setAttribute("d", path);
  const total = el.getTotalLength();
  const n = Math.ceil(total / SAMPLE_STEP) + 1;
  const samples = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const p = el.getPointAtLength(Math.min(i * SAMPLE_STEP, total));
    samples[i * 2] = p.x;
    samples[i * 2 + 1] = p.y;
  }
  svg.remove();

  return { vh, mobile, width, height: y + vh, cx, amp, path, points: pts.slice(1), at, length: at[endIndex], total, samples };
}

function pointAt(g: Geometry, dist: number) {
  const last = g.samples.length / 2 - 1;
  const f = clamp(dist / SAMPLE_STEP, 0, last);
  const i = Math.min(Math.floor(f), Math.max(last - 1, 0));
  const t = f - i;
  const s = g.samples;
  return {
    x: s[i * 2] + (s[i * 2 + 2] - s[i * 2]) * t,
    y: s[i * 2 + 1] + (s[i * 2 + 3] - s[i * 2 + 1]) * t,
  };
}

// Scroll distance → distance along the road. Every milestone gets the same scroll budget, and
// within it the ball eases out of one stop and into the next, so it lingers at milestones and
// moves quickly along the empty road between them.
function roadAt(g: Geometry, scrolled: number) {
  const seg = journeyConfig.segmentScroll * g.vh;
  const n = endIndex + 1;
  const s = clamp(scrolled, 0, seg * n);
  const k = Math.min(Math.floor(s / seg), n - 1);
  const t = s / seg - k;
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const e = t + (eased - t) * journeyConfig.dwell;
  const from = k === 0 ? 0 : g.at[k - 1];
  return from + (g.at[k] - from) * e;
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const reduced = useMotionValue(reduce);
  useEffect(() => reduced.set(reduce), [reduced, reduce]);

  const [geo, setGeo] = useState<Geometry | null>(null);
  const [version, setVersion] = useState(0);
  const geoMV = useMotionValue<Geometry | null>(null);
  const sectionTop = useMotionValue(0); // page-absolute
  const vh = useMotionValue(0);

  // ── Scroll → position along the road ────────────────────────────────────────
  // The ball rises with the page until it reaches the middle of the screen, then the section
  // is pinned and further scrolling moves the ball along the road instead of the page.
  const { scrollY } = useScroll();
  const travelled = useTransform(() => scrollY.get() - (sectionTop.get() + START - vh.get() / 2));
  const along = useTransform(() => {
    const g = geoMV.get();
    if (!g) return 0;
    return reduced.get() ? g.length : roadAt(g, travelled.get());
  });
  // Where the ball sits on screen (frame coordinates): from its start spot down to the centre
  const ballFrameY = useTransform(() =>
    reduced.get() ? START : START + clamp(travelled.get(), 0, Math.max(vh.get() / 2 - START, 0))
  );
  const ballX = useTransform(() => {
    const g = geoMV.get();
    return g ? pointAt(g, along.get()).x : 0;
  });
  const ballY = useTransform(() => {
    const g = geoMV.get();
    return g ? pointAt(g, along.get()).y : 0;
  });
  const drawn = useTransform(() => {
    const g = geoMV.get();
    return g ? along.get() / g.total : 0;
  });

  // ── Camera: moves the world so the ball stays near the centre, trailing a little ──
  const camXTarget = useTransform(() => {
    const g = geoMV.get();
    if (!g || g.mobile || reduced.get()) return 0;
    return (g.cx - ballX.get()) * camera.followX;
  });
  const camYTarget = useTransform(() => (reduced.get() ? START : ballFrameY.get() - ballY.get()));
  const camX = useSpring(camXTarget, camera.trail);
  const camY = useSpring(camYTarget, camera.trail);

  // ── Layout ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let lastW = 0;
    let lastH = 0;
    const measure = () => {
      const w = section.clientWidth;
      const h = window.innerHeight;
      sectionTop.set(section.getBoundingClientRect().top + window.scrollY);
      vh.set(h);
      // Ignore small height changes (mobile URL bar showing/hiding)
      if (w === lastW && Math.abs(h - lastH) < 120) return;
      lastW = w;
      lastH = h;
      const g = buildGeometry(w, h);
      geoMV.set(g);
      setGeo(g);
      setVersion((v) => v + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [geoMV, sectionTop, vh]);

  // ── Discrete states (React skips no-op updates) ─────────────────────────────
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [year, setYear] = useState<string | undefined>();
  const sync = () => {
    const g = geoMV.get();
    const d = along.get();
    setAtStart(travelled.get() <= 0);
    setAtEnd(!!g && d >= g.length - 1);
    let label: string | undefined;
    g?.at.forEach((a, i) => {
      if (a <= d + 1) label = markers[i].year;
    });
    setYear(label);
  };
  useMotionValueEvent(along, "change", sync);
  useMotionValueEvent(travelled, "change", sync);
  useMotionValueEvent(geoMV, "change", sync);

  // Pin length: rise to centre + travel the road + a short hold on the last stop
  const sectionHeight = geo
    ? reduce
      ? geo.height + START
      : journeyConfig.segmentScroll * geo.vh * (endIndex + 1) + geo.vh / 2 + START + 0.35 * geo.vh
    : undefined;

  const size = geo?.mobile ? ball.mobileSize : ball.size;

  return (
    <section
      ref={sectionRef}
      aria-label="My journey so far"
      className="pointer-events-none relative z-20"
      style={{ marginTop: -START, height: sectionHeight ?? "250vh" }}
    >
      <div className={`${reduce ? "relative h-full" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        {geo && (
          <motion.div
            className="absolute left-0 top-0"
            style={{ x: camX, y: camY, width: geo.width, height: geo.height }}
          >
            {/* Road: dotted ahead, solid gold behind */}
            <svg aria-hidden width={geo.width} height={geo.height} className="absolute left-0 top-0 overflow-visible">
              <path
                d={geo.path}
                fill="none"
                stroke="currentColor"
                className="text-dim/40"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="0.5 9"
              />
              <motion.path
                d={geo.path}
                fill="none"
                stroke={tint}
                strokeOpacity={0.85}
                strokeWidth={1.5}
                strokeLinecap="round"
                style={{ pathLength: drawn }}
              />
            </svg>

            {markers.map((m, i) => (
              <Milestone
                key={`${m.id}-${version}`}
                marker={m}
                geo={geo}
                point={geo.points[i]}
                at={geo.at[i]}
                along={along}
              />
            ))}

            {/* The ball */}
            <motion.div aria-hidden className="absolute left-0 top-0 z-10" style={{ x: ballX, y: ballY }}>
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ width: size, height: size }}
                animate={atStart && !reduce ? { y: [0, 5, 0] } : { y: 0 }}
                transition={atStart && !reduce ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
              >
                <div
                  className="absolute -inset-[70%] rounded-full"
                  style={{ background: `radial-gradient(circle, ${ball.glow} 0%, transparent 62%)` }}
                />
                {atEnd && !reduce && (
                  <motion.span
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: tint }}
                    animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {/* isolate + mask keeps the WebGL canvas clipped to a circle in Safari too */}
                <div className="relative size-full overflow-hidden rounded-full isolate [mask-image:radial-gradient(white,black)]">
                  <ShaderGradientCanvas
                    style={{ width: "100%", height: "100%" }}
                    lazyLoad={false}
                    pixelDensity={2}
                    pointerEvents="none"
                  >
                    <ShaderGradient {...ball.shader} />
                  </ShaderGradientCanvas>
                  {ball.shadow > 0 && (
                    <>
                      {/* Sphere shading: highlight top-left, falling off to near-black */}
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-multiply"
                        style={{
                          opacity: ball.shadow,
                          background:
                            "radial-gradient(circle at 32% 28%, transparent 0%, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.95) 100%)",
                        }}
                      />
                      {/* Soft dark band slowly circling the ball */}
                      <motion.div
                        className="pointer-events-none absolute -inset-1/4 mix-blend-multiply blur-[6px]"
                        style={{
                          opacity: ball.shadow,
                          background:
                            "conic-gradient(from 0deg, transparent 0%, transparent 50%, rgba(0,0,0,0.85) 66%, transparent 82%, transparent 100%)",
                        }}
                        animate={reduce ? undefined : { rotate: 360 }}
                        transition={{ duration: ball.bandSeconds, repeat: Infinity, ease: "linear" }}
                      />
                    </>
                  )}
                  {ball.grain > 0 && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-overlay"
                      style={{ backgroundImage: GRAIN, backgroundSize: "64px 64px", opacity: ball.grain }}
                    />
                  )}
                </div>
              </motion.div>

              {journeyConfig.yearLabel === "dot" && (
                <AnimatePresence>
                  {year && (
                    <motion.span
                      key={year}
                      className="absolute left-0 -translate-x-1/2 whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.25em]"
                      style={{ bottom: size / 2 + 10, color: tint }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      {year}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
        )}

        {journeyConfig.yearLabel === "sticky" && (
          <div aria-hidden className="absolute inset-x-0 top-6 flex justify-center">
            <AnimatePresence mode="wait">
              {year && (
                <motion.span
                  key={year}
                  className="rounded-full border border-edge bg-canvas/80 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.25em] backdrop-blur"
                  style={{ color: tint }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {year}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function Milestone({
  marker,
  geo,
  point,
  at,
  along,
}: {
  marker: Marker;
  geo: Geometry;
  point: { x: number; y: number };
  at: number;
  along: MotionValue<number>;
}) {
  // 0 → 1 as the ball approaches this marker
  const p = useTransform(along, [at - 260, at], [0, 1]);
  const titleOpacity = useTransform(p, [0, 1], [0.3, 1]);
  const detailOpacity = useTransform(p, [0.35, 1], [0, 1]);
  const detailY = useTransform(p, [0.35, 1], [12, 0]);

  // Ripple once when the ball arrives
  const [arrived, setArrived] = useState(false);
  // (deferred a frame: `along` can change while the parent is rendering)
  useMotionValueEvent(along, "change", (v) => {
    const next = v >= at - 1;
    requestAnimationFrame(() => setArrived(next));
  });

  const isYear = marker.kind === "year";
  const left = !geo.mobile && point.x < geo.cx;
  const nodeSize = isYear ? 14 : 8;

  // Keep text clear of the ball as it passes
  const gap = (geo.mobile ? ball.mobileSize : ball.size) / 2 + 32;
  // On desktop, cap the width so text stays on screen even when the camera has panned away
  const width = Math.max(160, Math.min(320, geo.cx - geo.amp * (1 + camera.followX) - gap - 24));
  const textStyle = geo.mobile
    ? { left: geo.cx + geo.amp + gap, right: 16, top: point.y } // one aligned column on mobile
    : left
      ? { right: geo.width - point.x + gap, top: point.y, width }
      : { left: point.x + gap, top: point.y, width };

  return (
    <>
      {/* Node on the road */}
      <span
        aria-hidden
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dim/50 bg-canvas"
        style={{ left: point.x, top: point.y, width: nodeSize, height: nodeSize }}
      >
        <motion.span className="absolute -inset-px rounded-full" style={{ background: tint, opacity: p }} />
      </span>
      {arrived && (
        <motion.span
          aria-hidden
          className="absolute rounded-full border"
          style={{ left: point.x, top: point.y, width: nodeSize, height: nodeSize, borderColor: tint, x: "-50%", y: "-50%" }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}

      {/* Text beside it */}
      <div
        className={`absolute -translate-y-1/2 ${left ? "text-right" : ""}`}
        style={textStyle}
      >
        <motion.div style={{ opacity: titleOpacity }}>
          {isYear && (
            <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.25em]" style={{ color: tint }}>
              {marker.year}
            </p>
          )}
          <h3 className={`font-serif font-bold leading-tight ${isYear ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
            {marker.title}
          </h3>
        </motion.div>
        <motion.div className="mt-2" style={{ opacity: detailOpacity, y: detailY }}>
          <p className="font-sans text-body">{marker.detail}</p>
          <p className="mt-0.5 font-sans text-sm text-dim">{marker.period}</p>
          {marker.current && (
            <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.25em]" style={{ color: tint }}>
              You are here
            </p>
          )}
        </motion.div>
      </div>
    </>
  );
}
