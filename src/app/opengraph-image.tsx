import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// The preview card image shown when the site's link is shared (LinkedIn, iMessage, Discord...).
// Next.js renders it at build time and adds the og:image / twitter:image tags for it.
// Fonts are local .woff files because the image renderer can't use next/font (or woff2).

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src/assets/og-fonts");

export default async function OpengraphImage() {
  const [playfair, inter] = await Promise.all([
    readFile(join(fontDir, "playfair-display-700.woff")),
    readFile(join(fontDir, "inter-400.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "Inter",
          color: "#E8E8E8",
          // Glow centred behind the name, fading to the site's canvas colour at the edges
          background: "radial-gradient(ellipse 70% 80% at 50% 50%, #1D6142 0%, #0D1A14 60%, #060E09 100%)",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 7, textTransform: "uppercase", color: "#8A9E93" }}>
          ISE Student · University of Limerick
        </div>
        <div
          style={{
            fontFamily: "Playfair Display",
            fontSize: 150,
            color: "#FFFFFF",
            lineHeight: 1,
            letterSpacing: -2,
            marginTop: 28,
          }}
        >
          {site.name}
        </div>
        <div style={{ width: 96, height: 4, background: "#D4AF37", borderRadius: 2, marginTop: 40 }} />
        <div style={{ fontSize: 30, color: "#B4C2BA", marginTop: 36 }}>
          Previously interned at Analog Devices &amp; Avtrain
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 52,
            fontSize: 24,
            letterSpacing: 3,
            color: "#D4AF37",
          }}
        >
          tjlazo.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
    },
  );
}
