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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="glass rounded-xl p-6 transition-all duration-300 hover:bg-white/5 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold font-serif text-earth-cream group-hover:text-white transition-colors">
                                {project.title}
                            </h3>
                            {project.type === "active" && (
                                <ExternalLink className="w-5 h-5 text-earth-sage group-hover:text-earth-cream transition-colors" />
                            )}
                        </div>
                        <p className="text-earth-sage mb-6 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-earth-hunter/50 text-earth-light border border-earth-medium/20">
                            {project.status}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
