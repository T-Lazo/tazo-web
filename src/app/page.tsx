import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import TabbedInterface from "@/components/TabbedInterface";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Journey />
      <TabbedInterface />
    </main>
  );
}
