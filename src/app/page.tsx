import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    // <main> is the semantic HTML tag for the primary content of a page.
    <main className="flex min-h-screen flex-col px-6 md:px-24">
      <Hero />
      <About />
      <Projects />
    </main>
  );
}
