import { Github, Linkedin } from "lucide-react";

export default function Socials() {
    const socials = [
        { icon: Github, label: "GitHub", href: "https://github.com/T-Lazo", color: "hover:text-white" },
        { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/timothy-josh-lazo-11435434b/", color: "hover:text-blue-400" },
    ];

    return (
        <section className="py-12 flex flex-col items-center">
            <p className="text-beige/60 mb-8 text-lg font-medium tracking-wide">Connect with me</p>
            <div className="flex gap-8">
                {socials.map((social, index) => (
                    <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-5 glass rounded-full transition-all duration-500 hover:scale-110 group border border-white/5 hover:border-chocolate/50 ${social.color}`}
                        aria-label={social.label}
                    >
                        <social.icon className="w-7 h-7 text-beige transition-colors group-hover:text-chocolate" />
                    </a>
                ))}
            </div>
        </section>
    );
}
