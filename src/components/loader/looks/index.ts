import type { ComponentType } from "react";
import type { MotionValue } from "framer-motion";
import type { LoaderLook } from "@/data/loader";
import type { HeadlineGlide } from "../Loader";
import HeadlineFill from "./HeadlineFill";
import NameFill from "./NameFill";

// What every look is given.
export type LookProps = {
  // 0 → 1 as the page loads (already smoothed, and stretched to at least `minMs`)
  progress: MotionValue<number>;
  // The visitor asked for reduced motion: show something still
  reduce: boolean;
  // Only for looks with `customExit`: true when it's time to run the exit
  exiting: boolean;
  // Only for looks with `customExit`: start the hero's entrance now (otherwise it starts when
  // the loader is gone)
  reveal: () => void;
  // Only for looks with `handsOffHeadline`: place the hero's real headline over the look's copy
  // (moving: false), then fly it home with the copy (moving: true)
  glideHeadline: (g: HeadlineGlide) => void;
  // Only for looks with `customExit`: call when the exit has finished
  onExited: () => void;
};

export type LookDef = {
  // Drawn in the middle of the dark screen. null = just the dark screen.
  Component: ComponentType<LookProps> | null;
  // Shortest time it plays, even if everything is already cached
  minMs: number;
  // Pause at 100% before the exit starts
  holdMs: number;
  // Exit length (the fade, or roughly how long a custom exit takes)
  exitMs: number;
  // The look animates its own exit and calls onExited. Without it, the screen just fades.
  // (Skipping or reduced motion always uses the plain fade.)
  customExit?: boolean;
  // The look flies its headline onto the hero's real one, so the hero keeps that hidden
  handsOffHeadline?: boolean;
};

export const looks: Record<LoaderLook, LookDef> = {
  headlineFill: {
    Component: HeadlineFill,
    minMs: 1900,
    holdMs: 0,
    exitMs: 1450,
    customExit: true,
    handsOffHeadline: true,
  },
  nameFill: { Component: NameFill, minMs: 1400, holdMs: 350, exitMs: 800 },
  fade: { Component: null, minMs: 0, holdMs: 0, exitMs: 500 },
};
