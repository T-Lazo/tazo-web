// The loading screen shown while the shaders, fonts and journey photos get ready.
//
// Swapping the look: set `firstVisit` / `reload` to another look name, or "none" to skip it.
// Adding a look: make a component in src/components/loader/looks/, add its name to `LoaderLook`
// below and register it in src/components/loader/looks/index.ts.

export type LoaderLook = "headlineFill" | "nameFill" | "fade";

export const loaderConfig = {
  // First page load in a browser session
  //   "headlineFill" → the hero headline fills with gold-to-green liquid, then glides into place
  //   "nameFill"     → "TJ Lazo" fills with gold, then fades
  firstVisit: "headlineFill" as LoaderLook | "none",
  // Every reload after that, in the same session ("fade" → plain dark screen that fades out)
  reload: "fade" as LoaderLook | "none",

  // Longest the page is held back (from the moment the browser starts loading the page), so slow
  // connections aren't stuck. When it runs out, the page shows anyway.
  maxWaitMs: { firstVisit: 2500, reload: 1000 },

  // Off in `next dev` so you don't sit through it on every save. Add ?intro to the URL to see the
  // first-visit look anyway (works in production too, ignoring the "seen this session" flag).
  inDev: false,

  // Text for the "nameFill" look
  name: "TJ Lazo",
};
