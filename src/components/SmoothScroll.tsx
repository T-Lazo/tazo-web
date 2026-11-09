"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Same setup as raea.io: Lenis defaults (lerp 0.1, smoothed wheel, native touch)
// plus smooth in-page anchor links.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
