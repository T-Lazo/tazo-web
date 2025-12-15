export default function Projects() {
    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            {/* Grid layout for projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Project Card 1 */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">My First Portfolio</h3>
                    <p className="text-zinc-500 mb-4">
                        The website you are looking at right now! Built with Next.js and Tailwind.
                    </p>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        In Progress
                    </div>
                </div>

                {/* Project Card 2 (Placeholder) */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-zinc-500 mb-4">
                        More cool projects will be added here as I learn more.
                    </p>
                </div>

            </div>
        </section>
    );
}
