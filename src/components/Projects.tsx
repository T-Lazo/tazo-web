type Project = {
  title: string
  description: string
  tags: string[]
  status: "Live" | "In Progress" | "Archived"
}

const projects: Project[] = [
  {
    title: "Pi-hole Network Ad Blocker",
    description: "Deployed Pi-hole on a Raspberry Pi Zero 2W to route all home network DNS through a custom blocklist — ad-free browsing and malicious domain protection across every device. Extended with Tailscale (WireGuard VPN) so the same protection follows me on any network.",
    tags: ["Raspberry Pi", "Linux", "DNS", "Pi-hole", "Tailscale", "WireGuard", "Networking"],
    status: "Live",
  },
  {
    title: "Portfolio Site",
    description: "The site you're looking at. Built with Next.js, Tailwind CSS v4, and Framer Motion. Features a ShaderGradient hero and a minimal dark design system.",
    tags: ["Next.js", "Tailwind CSS v4", "TypeScript", "Framer Motion", "ShaderGradient"],
    status: "In Progress",
  },
]

const statusColour: Record<Project["status"], string> = {
  "Live":        "text-accent border-accent/40",
  "In Progress": "text-dim   border-dim/40",
  "Archived":    "text-dim   border-dim/20",
}

export default function Projects() {
  return (
    <section className="flex flex-col gap-4">
      {projects.map((project) => (
        <div
          key={project.title}
          className="p-6 rounded-xl bg-surface border-l-2 border-l-accent border border-edge hover:bg-edge transition-colors duration-200 group"
        >
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

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md text-xs bg-canvas text-dim border border-edge font-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
