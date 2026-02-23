export default function About() {
    return (
        <section className="py-8 flex flex-col items-center text-center">
            <div className="glass p-10 md:p-16 rounded-3xl max-w-4xl mx-auto">
                <p className="text-beige leading-relaxed text-lg md:text-xl text-center">
                    I'm a 19 year old <a href="https://software-engineering.ie/" target="_blank" rel="noopener noreferrer" className="font-semibold text-chocolate hover:text-white transition-colors underline underline-offset-4 decoration-chocolate/30">Immersive Software Engineering</a> student in my second year at the University of Limerick.
                    I'm an aspiring software engineer who loves to keep up with the tech world. I play guitar and football on the side as my two main hobbies with
                    other things like reading, running and playing games to keep things exciting.</p>
            </div>
        </section>
    );
}
