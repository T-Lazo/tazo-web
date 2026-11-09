import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import TabbedInterface from "@/components/TabbedInterface";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Journey />
      {/* Slides up over the pinned journey; the soft top edge lets the journey dissolve into it */}
      <div className="relative z-30 bg-canvas before:pointer-events-none before:absolute before:inset-x-0 before:-top-40 before:h-40 before:bg-gradient-to-b before:from-transparent before:to-canvas">
        <TabbedInterface />
      </div>
    </main>
  );
}
