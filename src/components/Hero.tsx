"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

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

export default function Hero() {
  const phrases = [
    "building software",
    "breaking hardware",
    "reading docs I'll forget",
    "studying",
    "procrastinating",
    "doomscrolling",
  ];

  const [index, setIndex] = useState(0);

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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
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
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
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
        animate="show"
      >
        <motion.span
          className="block text-dim text-xs tracking-[0.25em] uppercase mb-8 font-sans"
          variants={fadeUp}
        >
          ISE Student · University of Limerick
        </motion.span>

        <motion.h1
          className="text-7xl md:text-[7.5rem] lg:text-[9rem] font-serif font-bold tracking-tight text-white leading-none mb-8"
          variants={fadeUp}
        >
          Hey, I'm TJ.
        </motion.h1>

        <motion.div
          className="flex flex-col items-center gap-1.5 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-dim text-[10px] tracking-[0.3em] uppercase font-sans">
          Scroll
        </span>
        <motion.div
          className="w-px h-10 bg-dim/40"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
