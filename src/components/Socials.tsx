import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const socials = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "timothy-josh-lazo",
    href: "https://www.linkedin.com/in/timothy-josh-lazo-11435434b/",
  },
  {
    icon: Github,
    label: "GitHub",
    handle: "@T-Lazo",
    href: "https://github.com/T-Lazo",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "tj.clazo@gmail.com",
    href: "mailto:tj.clazo@gmail.com",
  },
]

export default function Socials() {
  return (
    <section className="flex flex-col gap-3 py-2">
      <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-5">Connect</p>
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl border border-edge bg-surface hover:border-accent/50 hover:bg-edge transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <social.icon className="w-4 h-4 text-dim group-hover:text-white transition-colors" />
            <div>
              <p className="text-white text-sm font-medium font-sans">{social.label}</p>
              <p className="text-dim text-xs font-sans">{social.handle}</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-dim opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-200" />
        </a>
      ))}
    </section>
  )
}
