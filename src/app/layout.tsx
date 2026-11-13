import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/loader/Loader";
import { site } from "@/data/site";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
  },
  // Link preview cards; the image itself comes from app/opengraph-image.tsx
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IE",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

// Structured data (schema.org): tells search engines this site, the LinkedIn and the GitHub
// are all the same person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.jobTitle,
  affiliation: { "@type": "CollegeOrUniversity", name: site.school.name, url: site.school.url },
  sameAs: Object.values(site.profiles),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground relative min-h-screen`}
      >
        <script
          type="application/ld+json"
          // Built from our own constants only, never user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <div className="noise" />
        <SmoothScroll>
          <Loader>{children}</Loader>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
