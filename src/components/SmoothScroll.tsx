"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import "lenis/dist/lenis.css";

// Same setup as raea.io: Lenis defaults (lerp 0.1, smoothed wheel, native touch)
// plus smooth in-page anchor links. Wheel smoothing is off for reduced-motion users.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <ReactLenis root options={{ autoRaf: true, anchors: true, smoothWheel: !reduce }}>
      {children}
    </ReactLenis>
  );
}
