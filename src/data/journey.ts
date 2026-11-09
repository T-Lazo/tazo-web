// The scroll journey under the hero. Everything the Journey component shows comes from here.
//
// Adding a residency: push a stop into its year's `stops` and move `current: true` onto it.
// Adding a new stage (e.g. a full-time job): append a new group with its own `label`.

export type YearLabelMode = "dot" | "sticky" | "off";
export type PhotoLayout = "stack" | "carousel" | "off";

// The ball: ShaderGradient's "Pensive" sphere, recoloured black and gold.
const goldBall = {
  type: "sphere",
  animate: "on",
  uTime: 0,
  uSpeed: 0.3,
  uStrength: 1.5,
  uDensity: 1.1,
  uFrequency: 5.5,
  uAmplitude: 7,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 140,
  color1: "#D4AF37", // base: polished gold (this slot covers most of the ball)
  color2: "#0A0804", // near-black, swirls through the gold
  color3: "#F6DE8D", // highlight
  reflection: 0.5,
  cAzimuthAngle: 250,
  cPolarAngle: 140,
  cDistance: 1.5,
  cameraZoom: 12.5,
  lightType: "3d",
  brightness: 1,
  envPreset: "city",
  grain: "off", // the library's grain is coloured noise (red/green speckle at this size); see ball.grain
} as const;

export const journeyConfig = {
  // How the current year is shown while scrolling:
  //   "dot"    → label rides just above the ball
  //   "sticky" → label pinned to the top of the screen
  //   "off"    → only the year markers on the road
  yearLabel: "dot" as YearLabelMode,

  // Road spacing between markers, as a fraction of the screen height. Bigger = longer road.
  firstGap: 0.4,
  stopSpacing: 0.38,
  yearSpacing: 0.48,
  // Scrolling it takes to travel from one milestone to the next, as a fraction of the screen
  // height. Smaller = shorter journey.
  segmentScroll: 0.32,
  // How much the ball lingers at each milestone and zips between them. 0 = constant speed.
  dwell: 0.7,
  // Pause on the last milestone before the rest of the page slides up over the journey,
  // as a fraction of the screen height.
  endRest: 0.2,
  // How far the road swings left/right on desktop, in px (capped at 16% of the width).
  swing: 180,

  // Camera. followX: 1 keeps the ball dead centre sideways, 0 never pans sideways.
  // trail: lower stiffness = the camera lags further behind the ball on the bends.
  camera: {
    followX: 0.4,
    trail: { stiffness: 120, damping: 24, mass: 0.8 },
  },

  // Accent for the road, labels and markers
  accent: "#D4AF37", // polished gold

  ball: {
    size: 56,
    mobileSize: 40,
    shader: goldBall,
    glow: "rgba(212, 175, 55, 0.4)",
    // Monochrome film grain laid over the ball. 0 = none, 1 = heavy.
    grain: 0.55,
    // Black in the ball: shading falls off to near-black away from the highlight,
    // and a soft dark band slowly circles it. 0 = none, 1 = strongest.
    shadow: 1,
    bandSeconds: 9, // time for the dark band to go round once
  },

  // Polaroids beside each milestone (photos live in public/journey/)
  photos: {
    //   "stack"    → overlapping polaroids that fan out as the ball arrives
    //   "carousel" → one polaroid that crossfades through the photos once the ball arrives
    //   "off"      → no photos
    layout: "stack" as PhotoLayout,
    size: 150, // polaroid width on desktop, px
    mobileSize: 104,
    maxStack: 3, // most polaroids shown at once in "stack"
    interval: 3.2, // seconds per photo in "carousel"
  },

  // Big title behind the start of the road. The ball rolls across it; it drifts up slower than
  // the road and fades out as the ball nears the first milestone.
  title: {
    enabled: true,
    text: "The journey so far",
    eyebrow: "2024 — Now",
    style: "fill" as "fill" | "outline", // "outline" = thin gold outline instead of solid letters
    opacity: 0.14,
    speed: 0.6, // relative to the road; < 1 drifts slower, so it feels further back
    // Extra road before the first milestone so the title has room, as a fraction of the screen height
    space: 0.6,
    // Fades out between these points on the way to the first milestone (0 = start, 1 = arrived)
    fadeOut: [0.35, 0.8] as [number, number],
  },

  // Background behind the road (inspired by GSAP's "mesmerising effects" section)
  background: {
    // Pills (after GSAP's "mesmerising effects"): the journey starts with a scatter of dots,
    // they all stretch into pills together as the ball travels, then dim out near the end.
    // Each pill has a depth: near ones are bigger, brighter and faster; far ones tiny, dim, slow.
    pills: {
      enabled: true,
      count: 24,
      mobileCount: 16,
      colors: ["#D4AF37", "#006850"], // gradient across each pill: gold → emerald
      opacity: 0.7, // overall cap; keeps the ball the brightest thing on screen
      speed: [0.35, 1.8] as [number, number], // far → near, relative to the road
      width: [3, 24] as [number, number], // far → near dot diameter, px
      stretch: [3, 8] as [number, number], // fully stretched length, in multiples of the width
      // Journey progress (0 → 1) where the stretch starts/ends and the fade-out starts
      stretchFrom: 0.1,
      stretchTo: 0.6,
      fadeFrom: 0.78,
    },
  },
};

export type Photo = { src: string; alt: string };

type Entry = {
  title: string;
  detail: string; // the one line that fades in when the dot arrives
  period: string;
  current?: boolean; // where the dot comes to rest; exactly one entry should have it
  photos?: Photo[]; // first one is on top of the stack / shown first
};

export type Stop = Entry & { id: string };

export type JourneyGroup =
  | { id: string; stops: Stop[] } // no year marker (e.g. the prologue)
  | (Entry & { id: string; label: string; stops: Stop[] });

export const journey: JourneyGroup[] = [
  {
    id: "prologue",
    stops: [
      {
        id: "castletroy",
        title: "Castletroy College",
        detail: "567 / 625 points",
        period: "2024",
        photos: [
          { src: "/journey/castletroycollege/castletroy-graduation.jpg", alt: "Holding an award at Castletroy College" },
          { src: "/journey/castletroycollege/castletroy-principal.jpg", alt: "Receiving an award on stage at Castletroy College" },
        ],
      },
    ],
  },
  {
    id: "y1",
    label: "Year 1",
    title: "University of Limerick",
    detail: "Immersive Software Engineering",
    period: "Sep 2024 – May 2025",
    photos: [
      { src: "/journey/first-year-ise/1st-year-p-musical.jpg", alt: "Group photo with ISE classmates" },
      { src: "/journey/first-year-ise/1st-year-polaroids.jpg", alt: "Polaroid photos of ISE classmates" },
      { src: "/journey/first-year-ise/1st-year-halloween.jpg", alt: "Halloween in the ISE building" },
      { src: "/journey/first-year-ise/1st-year-sunset.jpg", alt: "Sunset over the water in Limerick" },
    ],
    stops: [
      {
        id: "adi",
        title: "Analog Devices",
        detail: "6 months",
        period: "Jun 2025 – Jan 2026",
        photos: [
          { src: "/journey/analog/analog-catalyst.jpg", alt: "With fellow interns outside the Analog Devices Catalyst building" },
          { src: "/journey/analog/analog-building.jpg", alt: "Outside the Analog Devices office" },
          { src: "/journey/analog/analog-christmas-party.jpg", alt: "Photo strip from the Analog Devices Christmas party, 2025" },
        ],
      },
    ],
  },
  {
    id: "y2",
    label: "Year 2",
    title: "University of Limerick",
    detail: "Back at UL",
    period: "Jan 2026 – May 2026",
    photos: [
      { src: "/journey/second-year-ise/2nd-year-hackupc.jpg", alt: "Team photo at HackUPC" },
      { src: "/journey/second-year-ise/2nd-year-soccer-tdm.jpg", alt: "Celebrating after a football match" },
      { src: "/journey/second-year-ise/2ndyear-group-hp.jpg", alt: "Group photo with ISE classmates" },
      { src: "/journey/second-year-ise/2nd-year-races.jpg", alt: "Messing around with classmates" },
      { src: "/journey/second-year-ise/2nd-year-soccer-match-d.jpg", alt: "ISE football match" },
    ],
    stops: [
      {
        id: "avtrain",
        title: "Avtrain",
        detail: "3 months",
        period: "Jun 2026 – Aug 2026",
        photos: [
          { src: "/journey/avtrain/avtrain-jet.jpg", alt: "Climbing into a jet cockpit at Farnborough" },
          { src: "/journey/avtrain/avtrain-farnborough-airshow.jpg", alt: "Red Arrows display at the Farnborough Airshow" },
          { src: "/journey/avtrain/avtrain-booth.jpg", alt: "Trying a VR headset at a stand" },
          { src: "/journey/avtrain/avtrain-farnborough-headshot.jpg", alt: "Pilot cut-outs beside an aircraft at Farnborough" },
        ],
      },
    ],
  },
  {
    id: "y3",
    label: "Year 3",
    title: "University of Limerick",
    detail: "Back at UL",
    period: "Sep 2026 –",
    current: true,
    stops: [],
  },
];

export type Marker = Entry & {
  id: string;
  kind: "year" | "stop";
  year?: string; // the year this marker belongs to, for the moving year label
};

// One flat list of markers in scroll order.
export function flattenJourney(groups: JourneyGroup[]): Marker[] {
  return groups.flatMap((g) => {
    const year = "label" in g ? g.label : undefined;
    const head: Marker[] =
      "label" in g
        ? [{ id: g.id, kind: "year", year, title: g.title, detail: g.detail, period: g.period, current: g.current, photos: g.photos }]
        : [];
    return [...head, ...g.stops.map((s): Marker => ({ ...s, kind: "stop", year }))];
  });
}
