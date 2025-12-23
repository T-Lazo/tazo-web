import { Github, Linkedin } from "lucide-react";

export default function Socials() {
    const socials = [
        { icon: Github, label: "GitHub", href: "https://github.com/T-Lazo", color: "hover:text-white" },
        { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/timothy-josh-lazo-11435434b/", color: "hover:text-blue-400" },
    ];

    return (
        <section className="py-6 flex flex-col items-center">
            <p className="text-earth-sage mb-8 text-lg">Connect with me</p>
            <div className="flex gap-6">
                {socials.map((social, index) => (
                    <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-4 glass rounded-full transition-all duration-300 hover:scale-110 group ${social.color}`}
                        aria-label={social.label}
                    >
                        <social.icon className="w-6 h-6 text-earth-light transition-colors" />
                    </a>
                ))}
            </div>
        </section>
    );
}
