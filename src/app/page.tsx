import Hero from "@/components/Hero";
import TabbedInterface from "@/components/TabbedInterface";

export default function Home() {
  return (
    // <main> is the semantic HTML tag for the primary content of a page.
    <main className="flex min-h-screen flex-col items-center px-6 md:px-24 gap-8">
      {/* Top Section: Intro */}
      <div className="flex flex-col max-w-3xl w-full">
        <Hero />
      </div>

      {/* Bottom Section: Tabs/Content */}
      <TabbedInterface />
    </main>
  );
}
