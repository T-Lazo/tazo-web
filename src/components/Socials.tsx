import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function Socials() {
    const socials = [
        { icon: Instagram, label: "Instagram", href: "https://instagram.com/tjlazo_", color: "hover:text-pink-400" },
        { icon: Github, label: "GitHub", href: "https://github.com", color: "hover:text-white" },
        { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:text-blue-400" },
        { icon: Mail, label: "Email", href: "mailto:hello@example.com", color: "hover:text-yellow-400" },
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
