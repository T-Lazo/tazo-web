"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { useLoader, type HeadlineGlide } from "@/components/loader/Loader";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false }
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false }
);

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" as const },
  },
};

// The headline's motion while the loading screen hands over to it (see loader/Loader.tsx)
function handoffMotion(hold: boolean, g: HeadlineGlide | null) {
  if (g?.moving) {
    const duration = g.durationMs / 1000;
    return {
      animate: { opacity: [0, 1, 1], x: 0, y: 0, scale: 1 },
      transition: {
        default: { duration, ease: g.ease },
        opacity: { duration, times: g.fadeInTimes, ease: "linear" as const },
      },
    };
  }
  if (g) return { animate: { opacity: 0, x: g.x, y: g.y, scale: g.scale }, transition: { duration: 0 } };
  return { animate: { opacity: hold ? 0 : 1, x: 0, y: 0, scale: 1 }, transition: { duration: 0 } };
}

export default function Hero() {
  const phrases = [
    "building software",
    "breaking hardware",
    "reading docs I'll forget",
    "studying",
    "procrastinating",
    "doomscrolling",
    "playing guitar",
    "learning how to surf",
    "playing chess",
    "on the game",
    "learning something new",
    "editing a video",
    "reading",
    "listening to a podcast",
    "watching tech videos",
    "building something",
    "travelling somewhere",
    "making a commit",
  ];

  const [index, setIndex] = useState(0);
  // Hold the entrance animations until the loading screen says so
  const { revealed, holdHeadline, headlineGlide } = useLoader();
  // When the loading screen flies its own copy of the headline into place, the real one skips
  // its own entrance and glides home together with the copy instead.
  const [handedOff, setHandedOff] = useState(false);
  if (holdHeadline && !handedOff) setHandedOff(true);

  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const glowX = useSpring(rawX, { stiffness: 1500, damping: 25, mass: 0.3 }); //more stiffness = less lag, more damping = more lag
  const glowY = useSpring(rawY, { stiffness: 1500, damping: 25, mass: 0.3 });
  const [glowVisible, setGlowVisible] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(e.clientX - rect.left - 130);
        rawY.set(e.clientY - rect.top - 130);
      }}
      onMouseEnter={() => setGlowVisible(true)}
      onMouseLeave={() => setGlowVisible(false)}
    >

      {/* Cursor glow — clipped to hero by overflow-hidden */}
      <motion.div
        className="absolute z-[15] rounded-full pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: 260,
          height: 260,
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(120,255,170,0.13) 0%, transparent 65%)",
          mixBlendMode: "screen",
          opacity: glowVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ShaderGradient — full bleed background */}
      <div className="absolute inset-0 z-0 pointer-events-none" data-preload="canvas">
        {/* lazyLoad off: otherwise the canvas unmounts off-screen and restarts on scroll back */}
        <ShaderGradientCanvas style={{ width: "100%", height: "100%" }} lazyLoad={false}>
          <ShaderGradient
            type="waterPlane"
            animate="on"
            uTime={0.2}
            uStrength={2.5}
            uDensity={1.2}
            uFrequency={5.5}
            uAmplitude={0}
            positionX={0}
            positionY={0.9}
            positionZ={0}
            rotationX={50}
            rotationY={0}
            rotationZ={-60}
            color1="#0D1A14"
            color2="#1D6142"
            color3="#060E09"
            brightness={1.1}
            lightType="3d"
            envPreset="city"
            grain="on"
            cameraZoom={1}
          />
        </ShaderGradientCanvas>
      </div>

      {/* Dark vignette overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-canvas/50" />

      {/* Hero content */}
      <motion.div
        className="relative z-20 text-center px-6 select-none"
        variants={stagger}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
      >
        {/* The negative margin cancels the gap letter-spacing leaves after the last letter,
            which would otherwise pull the line slightly off-centre */}
        <motion.div className="mb-8 font-sans text-xs uppercase" variants={fadeUp}>
          <span className="text-dim tracking-[0.25em] mr-[-0.25em]">
            <a
              href="https://software-engineering.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              ISE Student
            </a>
            {" · University of Limerick"}
          </span>
        </motion.div>

        <motion.h1
          data-loader-headline
          className="text-7xl md:text-[7.5rem] lg:text-[9rem] font-serif font-bold tracking-tight text-white leading-none mb-8"
          {...(handedOff
            ? { variants: undefined, ...handoffMotion(holdHeadline, headlineGlide) }
            : { variants: fadeUp })}
        >
          Hey, I&apos;m TJ.
        </motion.h1>

        <motion.div
          className="flex flex-col items-center gap-1.5 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
        >
          <span className="text-sm tracking-wide" style={{ color: "rgba(232,232,232,0.45)" }}>
            I&apos;m currently
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              className="text-base md:text-lg font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Bottom fade into solid section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-40 pointer-events-none bg-gradient-to-b from-transparent to-canvas" />

      {/* Scroll label — the journey's dot peeks in just below it and acts as the cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-dim text-[10px] tracking-[0.3em] uppercase font-sans">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
