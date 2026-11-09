"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  title: string
  description: string
  tags: string[]
  status: "Live" | "In Progress" | "Archived"
  pdfUrl?: string
  images?: string[]
}

const projects: Project[] = [
  {
    title: "Digital Wardrobe",
    description: "Self-hosted digital wardrobe web app where both the site and API run on a Raspberry Pi home server, with your own account and your own AI plugged in via API key. The AI visually analyses photos of your clothes and generates a description for each item, which you can edit manually if it gets one wrong. Those descriptions are the structured data that sorts and organises your wardrobe, and that the AI parses to help put outfits together from what you actually own.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Raspberry Pi", "Self-Hosted", "AI"],
    status: "In Progress",
  },
  {
    title: "Network Monitoring System",
    description: "Distributed network telemetry system built as a team project. Python agents runs on client machine, collects local network metrics, cloud latency, and mobile data, then POST to a central Flask server. Data is stored in Supabase (PostgreSQL) and visualised on a React dashboard. Deployed on a college VM with Gunicorn.",
    tags: ["Python", "Flask", "Supabase", "PostgreSQL", "React", "SQLAlchemy", "Gunicorn", "Virtual Machine"],
    status: "Archived",
    images: ["/network-dashboard.png"], // place your screenshot in /public/
  },
  {
    title: "Pi-hole Network Ad Blocker",
    description: "Deployed Pi-hole on a Raspberry Pi Zero 2W to route all home network DNS through a custom blocklist, providing ad-free browsing and malicious domain protection across every device. Extended with Tailscale so the same protection follows me on any network. Designed and 3D printed a custom enclosure for the Pi.",
    tags: ["Raspberry Pi", "Linux", "DNS", "Pi-hole", "Tailscale", "Networking", "3D Printing"],
    status: "Archived",
    images: [
      "/pihole-dashboard.png", // Pi-hole admin dashboard — place in /public/
      "/pihole-device.jpg",    // photo of the Pi itself — place in /public/
    ],
  },
  {
    title: "Blockchain Ticketing Dapp",
    description: "Ethereum-based event ticketing dapp built primarily to learn how blockchain works under the hood. Tickets are an ERC-20 token, via OpenZeppelin, deployed to the Sepolia testnet. Attendees send SETH to a payable buyTicket() solidity function to purchase one, and can return it to reclaim their SETH. The app Supports wallet creation with password-encrypted keystore export, MetaMask-based purchases and returns, and dedicated doorman and venue views for verifying tickets and tracking sales.",
    tags: ["Solidity", "Web3.js", "MetaMask", "Ethereum", "OpenZeppelin", "ERC-20", "Sepolia Testnet", "JavaScript"],
    status: "Archived",
  },
  {
    title: "Product Analysis & Concept Design",
    description: "Leaving Cert DCG project where I fully analysed an existing product, produced detailed freehand sketches, and compared it against an alternative. Designed an original concept from scratch using SolidWorks CAD, producing orthographic and isometric drawings with full dimensions and material annotations. Achieved a H1 with near-perfect marks.",
    tags: ["SolidWorks", "CAD", "Technical Drawing", "Product Design", "DCG"],
    status: "Archived",
    pdfUrl: "/dcg-project.pdf", // place your PDF in /public/
  },
  {
    title: "Portfolio Site",
    description: "The site you're looking at. Built with Next.js, Tailwind CSS v4, and Framer Motion.",
    tags: ["Next.js", "Tailwind CSS v4", "TypeScript", "Framer Motion", "ShaderGradient"],
    status: "In Progress",
  },
]

const statusColour: Record<Project["status"], string> = {
  "Live": "text-accent border-accent/40",
  "In Progress": "text-dim   border-dim/40",
  "Archived": "text-dim   border-dim/20",
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = project.images ?? [];
  const multi = images.length > 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 flex flex-col w-full max-w-3xl max-h-[80vh] rounded-2xl bg-surface border border-edge overflow-hidden"
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-edge shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold font-serif">{project.title}</h2>
            <span className={`text-xs font-sans px-2.5 py-1 rounded-md border ${statusColour[project.status]}`}>
              {project.status}
            </span>
          </div>
          <button onClick={onClose} className="text-dim hover:text-white transition-colors p-1" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {/* data-lenis-prevent: let this panel scroll natively instead of the page */}
        <div data-lenis-prevent className="overflow-y-auto flex-1 p-4 flex flex-col gap-3">
          {project.pdfUrl && (
            <iframe
              src={project.pdfUrl}
              className="w-full rounded-lg border border-edge"
              style={{ height: "520px" }}
              title={`${project.title} — slides`}
            />
          )}

          {images.length > 0 && (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`${project.title} — photo ${activeImg + 1}`}
                  className="w-full rounded-lg border border-edge object-contain"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {/* Thumbnail strip — only shown when there are multiple images */}
              {multi && (
                <div className="flex gap-2 justify-center pt-1">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setActiveImg(i)}
                      className={`rounded-md overflow-hidden border transition-colors ${i === activeImg ? "border-accent/60" : "border-edge hover:border-dim/40"
                        }`}
                    >
                      <img src={src} alt="" className="w-16 h-10 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, onView }: { project: Project; onView: () => void }) {
  const hasMedia = project.pdfUrl || (project.images && project.images.length > 0);
  const buttonLabel = project.pdfUrl ? "View slides" : "View photos";

  return (
    <div className="p-6 rounded-xl bg-surface border-l-2 border-l-accent border border-edge hover:bg-edge transition-colors duration-200 group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-white font-semibold font-serif text-lg group-hover:text-white/90 transition-colors">
          {project.title}
        </h3>
        <span className={`shrink-0 text-xs font-sans px-2.5 py-1 rounded-md border ${statusColour[project.status]}`}>
          {project.status}
        </span>
      </div>

      <p className="text-body/70 text-sm leading-relaxed font-sans mb-5">
        {project.description}
      </p>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs bg-canvas text-dim border border-edge font-sans">
              {tag}
            </span>
          ))}
        </div>

        {hasMedia && (
          <button
            onClick={onView}
            className="shrink-0 flex items-center gap-1.5 text-xs font-sans text-dim hover:text-white border border-edge hover:border-accent/40 px-3 py-1.5 rounded-md transition-colors"
          >
            {project.pdfUrl ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="1" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3.5 4h5M3.5 6.5h5M3.5 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4" cy="5" r="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 8.5l2.5-2 2 1.5 2-2.5 2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <section className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} onView={() => setActiveProject(project)} />
        ))}
      </section>

      <AnimatePresence>
        {activeProject && (activeProject.pdfUrl || activeProject.images?.length) && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
