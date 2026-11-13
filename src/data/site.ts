// Who the site is about and where it lives. Read by the page metadata, the share image,
// robots.txt / sitemap.xml and the structured data, so search engines and link previews all
// get the same facts.

export const site = {
  url: "https://tjlazo.com",
  name: "TJ Lazo",
  title: "TJ Lazo · Software Engineering Student",
  description:
    "TJ Lazo, Immersive Software Engineering student at the University of Limerick. Interned at Analog Devices and Avtrain.",
  jobTitle: "Software Engineering Student",
  school: { name: "University of Limerick", url: "https://www.ul.ie" },
  profiles: {
    linkedin: "https://www.linkedin.com/in/timothy-josh-lazo-11435434b/",
    github: "https://github.com/T-Lazo",
  },
} as const;
