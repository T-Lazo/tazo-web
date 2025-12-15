"use client";

import { useState } from "react";
import About from "./About";
import Projects from "./Projects";
import Socials from "./Socials";

export default function TabbedInterface() {
    const [activeTab, setActiveTab] = useState<"about" | "projects" | "socials">("about");

    return (
        <div className="w-full max-w-3xl">
            {/* Tabs Header */}
            <div className="flex justify-center gap-12 border-b border-earth-khaki/30 mb-8">
                <button
                    onClick={() => setActiveTab("about")}
                    className={`pb-2 px-6 text-lg font-semibold transition-colors ${activeTab === "about"
                        ? "text-earth-hunter dark:text-earth-khaki border-b-2 border-earth-hunter dark:border-earth-khaki"
                        : "text-earth-umber/60 hover:text-earth-umber"
                        }`}
                >
                    About
                </button>
                <button
                    onClick={() => setActiveTab("projects")}
                    className={`pb-2 px-6 text-lg font-semibold transition-colors ${activeTab === "projects"
                        ? "text-earth-hunter dark:text-earth-khaki border-b-2 border-earth-hunter dark:border-earth-khaki"
                        : "text-earth-umber/60 hover:text-earth-umber"
                        }`}
                >
                    Projects
                </button>
                <button
                    onClick={() => setActiveTab("socials")}
                    className={`pb-2 px-6 text-lg font-semibold transition-colors ${activeTab === "socials"
                        ? "text-earth-hunter dark:text-earth-khaki border-b-2 border-earth-hunter dark:border-earth-khaki"
                        : "text-earth-umber/60 hover:text-earth-umber"
                        }`}
                >
                    Socials
                </button>
            </div>

            {/* Tabs Content */}
            <div>
                {activeTab === "about" && <About />}
                {activeTab === "projects" && <Projects />}
                {activeTab === "socials" && <Socials />}
            </div>
        </div>
    );
}
