"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import About from "./About";
import Projects from "./Projects";
import Socials from "./Socials";

export default function TabbedInterface() {
    const [activeTab, setActiveTab] = useState<"about" | "projects" | "socials">("about");

    const tabs = [
        { id: "about", label: "About" },
        { id: "projects", label: "Projects" },
        { id: "socials", label: "Socials" }
    ] as const;

    return (
        <div className="w-full max-w-4xl relative z-10">
            {/* Tabs Header */}
            <div className="flex justify-center mb-12">
                <div className="glass rounded-full p-1.5 flex items-center space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-earth-medium ${activeTab === tab.id
                                ? "text-earth-deep"
                                : "text-earth-medium hover:text-earth-light"
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-earth-cream rounded-full mix-blend-normal"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "about" && <About />}
                        {activeTab === "projects" && <Projects />}
                        {activeTab === "socials" && <Socials />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
