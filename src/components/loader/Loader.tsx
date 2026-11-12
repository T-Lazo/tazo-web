"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { loaderConfig, type LoaderLook } from "@/data/loader";
import { looks, type LookDef } from "./looks";
import { measureReadiness } from "./readiness";

// The loading screen shell: waits for the page (see readiness.ts), applies the time limits,
// remembers whether this session has seen the intro, lets a click/scroll/key skip it, and runs
// the exit. What's drawn on it is a "look" from ./looks, picked in src/data/loader.ts.

const SEEN_KEY = "loader:intro-seen";
const EASE_MS = 160; // how quickly the shown progress catches up with the real progress
const CATCH_UP_MS = 500; // after the time limit, the fill gets this long to reach 100%
const SKIP_MS = 300; // fade-out length when the visitor skips
const CANVAS = "rgb(13, 26, 20)"; // --color-canvas
const FALLBACK: LookDef = { Component: null, minMs: 0, holdMs: 0, exitMs: 300 };

const enabled =
  (loaderConfig.firstVisit !== "none" || loaderConfig.reload !== "none") &&
  (process.env.NODE_ENV === "production" || loaderConfig.inDev);

type Phase = "loading" | "exiting" | "done";

// A look that flies its own copy of the headline onto the hero's can move the real headline
// along with it: first placed exactly over the copy (hidden), then gliding home in lockstep
export type HeadlineGlide = {
  // Offset from the headline's own spot to where the copy is
  x: number;
  y: number;
  scale: number;
  // false: sit at the offset, hidden. true: glide home over `durationMs`, fading in early on.
  moving: boolean;
  durationMs: number;
  ease: [number, number, number, number];
  // Keyframe times for its opacity 0 → 1 → 1 over the glide
  fadeInTimes: number[];
};

type LoaderState = {
  // false until the hero should start its entrance animations
  revealed: boolean;
  // true while a look is flying its own copy of the headline onto the hero's: the hero keeps
  // its real headline hidden (and skips its entrance) until the loader has gone
  holdHeadline: boolean;
  // Set while the real headline is being flown in with the look's copy
  headlineGlide: HeadlineGlide | null;
};
const LoaderContext = createContext<LoaderState>({
  revealed: true,
  holdHeadline: false,
  headlineGlide: null,
});
export const useLoader = () => useContext(LoaderContext);

export default function Loader({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const progress = useMotionValue(0);
  // The dark screen is in the server HTML so nothing flashes before it; the look is picked
  // once the browser can read the session flag.
  const [phase, setPhase] = useState<Phase>(enabled ? "loading" : "done");
  const [look, setLook] = useState<LookDef | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [revealedEarly, setRevealedEarly] = useState(false);
  const [headlineGlide, setHeadlineGlide] = useState<HeadlineGlide | null>(null);
  // The overlay stays up a couple of frames after "done", so whatever it hands over to (e.g. the
  // real headline) is already painted before it disappears: no one-frame gap.
  const [removed, setRemoved] = useState(!enabled);
  // Read through a ref so the effect below runs once (re-running it would mark the intro as seen)
  const reduceRef = useRef(reduce);
  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).has("intro");
    if (!enabled && !forced) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage blocked: treat every load as a first visit
    }
    const mode = forced || !seen ? "firstVisit" : "reload";
    const name: LoaderLook | "none" = loaderConfig[mode];
    const def = name === "none" ? FALLBACK : looks[name];
    const maxWait = name === "none" ? 0 : loaderConfig.maxWaitMs[mode];

    let fontsReady = !document.fonts;
    document.fonts?.ready.then(() => (fontsReady = true));

    let raf = 0;
    let startedAt = 0;
    let last = 0;
    let shown = 0;
    let real = 0;
    let fullAt: number | null = null;
    let finished = false;

    const finish = (skip: boolean) => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      removeSkip();
      setSkipped(skip);
      setPhase("exiting");
    };
    const skip = () => finish(true);

    const tick = (now: number) => {
      if (!startedAt) {
        startedAt = last = now;
        setLook(def);
        setPhase("loading");
        setRemoved(false);
      }
      real = Math.max(real, measureReadiness(fontsReady)); // never goes backwards
      // performance.now() counts from the start of page load, so the cap includes hydration
      const timedOut = now >= maxWait;
      const paced = def.minMs ? (now - startedAt) / def.minMs : 1;
      const target = timedOut ? 1 : Math.min(real, paced);
      // Ease towards the target by elapsed time, not per frame, so slow devices (where the
      // shaders make each frame take a while) still finish on time
      const dt = now - last;
      last = now;
      shown = reduceRef.current ? target : shown + (target - shown) * (1 - Math.exp(-dt / EASE_MS));
      // Snap when close, and at the latest shortly after the time limit
      if (target - shown < 0.002 || now >= maxWait + CATCH_UP_MS) shown = target;
      progress.set(shown);

      if (shown >= 1) {
        fullAt ??= now;
        if (now - fullAt >= def.holdMs) return finish(false);
      }
      raf = requestAnimationFrame(tick);
    };

    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const removeSkip = () => events.forEach((e) => window.removeEventListener(e, skip));
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeSkip();
    };
  }, [progress]);

  // No scrolling the page behind it
  const showing = phase !== "done";
  useEffect(() => {
    if (!lenis) return;
    if (showing) lenis.stop();
    else lenis.start();
  }, [lenis, showing]);

  useEffect(() => {
    if (showing || removed) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setRemoved(true));
    });
    return () => cancelAnimationFrame(id);
  }, [showing, removed]);

  const def = look ?? FALLBACK;
  // The look runs its own exit, unless the visitor skipped or asked for reduced motion
  const custom = !!def.customExit && !skipped && !reduce;
  const exiting = phase === "exiting";
  const leaving = phase !== "loading";
  const done = useCallback(() => setPhase("done"), []);
  const reveal = useCallback(() => setRevealedEarly(true), []);
  const glideHeadline = useCallback((g: HeadlineGlide) => setHeadlineGlide(g), []);

  // Safety net: never leave the screen up if a look forgets to call onExited
  useEffect(() => {
    if (!exiting || !custom) return;
    const id = setTimeout(done, def.exitMs + 1500);
    return () => clearTimeout(id);
  }, [exiting, custom, def.exitMs, done]);

  const state: LoaderState = {
    revealed: phase === "done" || revealedEarly,
    holdHeadline: showing && !!def.handsOffHeadline && !skipped && !reduce,
    headlineGlide,
  };

  const Look = def.Component;
  const exitS = (skipped ? SKIP_MS : def.exitMs) / 1000;

  return (
    <LoaderContext.Provider value={state}>
      {children}
      {!removed && (
        <motion.div
          data-loader
          role="status"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={false}
          // Always a value (Framer won't start an animation from `animate={undefined}`), and keyed
          // on "not loading" rather than "exiting" so it stays faded during the last two frames
          animate={{
            opacity: leaving && !custom ? 0 : 1,
            // On a custom exit the look's own backdrop takes over
            backgroundColor: leaving && custom ? "rgba(13, 26, 20, 0)" : CANVAS,
          }}
          transition={custom ? { duration: 0 } : { duration: exitS, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (exiting && !custom) done();
          }}
        >
          <span className="sr-only">Loading</span>
          {Look && (
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              // On a plain fade-out the look leaves first, so the hero comes up behind an empty screen
              animate={{ opacity: leaving && !custom ? 0 : 1 }}
              transition={{
                duration: leaving ? Math.min(exitS, 0.35) : reduce ? 0 : 0.4,
                ease: leaving ? "easeIn" : "easeOut",
              }}
            >
              <Look
                progress={progress}
                reduce={reduce}
                exiting={leaving && custom}
                reveal={reveal}
                glideHeadline={glideHeadline}
                onExited={done}
              />
            </motion.div>
          )}
        </motion.div>
      )}
      {/* Without JavaScript it would never go away */}
      <noscript>
        <style>{"[data-loader]{display:none}"}</style>
      </noscript>
    </LoaderContext.Provider>
  );
}
