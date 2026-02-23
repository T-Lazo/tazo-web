"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="flex flex-col items-center text-center justify-center pt-32 pb-12 md:pt-48 md:pb-16 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <span className="block text-earth-medium text-lg md:text-xl font-medium mb-4 tracking-widest uppercase">
                    ◡̈
                </span>
                <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-earth-cream mb-6">
                    Hey, I'm TJ.
                </h1>
                <p className="text-lg md:text-xl text-earth-medium max-w-2xl mx-auto leading-relaxed">
                    Welcome to my portfolio! 
                </p>
            </motion.div>
        </section>
    );
}
