"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import About from "./About";
import Projects from "./Projects";
import Socials from "./Socials";

const tabs = [
  { id: "about",    label: "About"    },
  { id: "projects", label: "Projects" },
  { id: "socials",  label: "Socials"  },
] as const;

type TabId = typeof tabs[number]["id"];

export default function TabbedInterface() {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-20 pb-32">

      {/* Tab bar */}
      <div className="flex gap-8 border-b border-edge mb-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative pb-4 text-sm font-medium outline-none cursor-pointer"
          >
            <span
              className={`transition-colors duration-200 ${
                activeTab === tab.id ? "text-white" : "text-dim hover:text-body"
              }`}
            >
              {tab.label}
            </span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {activeTab === "about"    && <About />}
          {activeTab === "projects" && <Projects />}
          {activeTab === "socials"  && <Socials />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
