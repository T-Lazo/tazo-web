type Project = {
  title: string
  description: string
  tags: string[]
  status: string
}

const projects: Project[] = [
  {
    title: "Pi-hole Network Ad Blocker",
    description: "Deployed Pi-hole on a Raspberry Pi Zero 2W to route all home network DNS through a custom blocklist — ad-free and malicious domain protection across every device. Extended with Tailscale (WireGuard VPN) so the same protection follows me on any network, anywhere.",
    tags: ["Raspberry Pi", "Linux", "DNS", "Pi-hole", "Tailscale", "WireGuard", "Networking"],
    status: "Live",
  },
  {
    title: "Portfolio Site",
    description: "The site you're looking at. Built with Next.js and Tailwind CSS v4 on an Earth Deep glassmorphism design system. Animations coming in a future update.",
    tags: ["Next.js", "Tailwind CSS v4", "TypeScript", "Framer Motion"],
    status: "In Progress",
  },
]

export default function Projects() {
  return (
    <section className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="glass rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 group"
          >
            {/* Title row — no icon */}
            <h3 className="text-2xl font-bold font-serif text-white group-hover:text-beige transition-colors mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-beige mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-chocolate/20 text-beige border border-chocolate/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Status badge */}
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-chocolate/20 text-beige border border-chocolate/30">
              {project.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
