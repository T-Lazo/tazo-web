import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
    const projects = [
        {
            title: "My Portfolio",
            description: "The website you are looking at right now! Built with Next.js, Tailwind, and Framer Motion.",
            status: "In Progress",
            link: "#",
            type: "active"
        },
        {
            title: "Future Project",
            description: "More cool projects will be added here as I continue my journey in web development.",
            status: "Coming Soon",
            link: "#",
            type: "inactive"
        }
    ];

    return (
        <section className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="glass rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold font-serif text-white group-hover:text-beige transition-colors">
                                {project.title}
                            </h3>
                            {project.type === "active" && (
                                <ExternalLink className="w-6 h-6 text-chocolate group-hover:text-white transition-colors" />
                            )}
                        </div>
                        <p className="text-beige mb-6 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-chocolate/20 text-beige border border-chocolate/30">
                            {project.status}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
