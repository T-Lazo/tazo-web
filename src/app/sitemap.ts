import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Served as /sitemap.xml. One page for now; add an entry here for any new route.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
