const bio = `2nd Year Immersive Software Engineering student at the University of Limerick, recently back from a 6-month internship at Analog Devices. I like to build and design things end to end — software, hardware, and the occasional film. I'm a tinkerer by nature, always looking for something new to learn.`

const skills = [
  "Python", "Java", "C", "Bash",
  "Embedded Linux", "Git", "Docker",
  "SSH", "Networking", "DNS",
  "Raspberry Pi", "Technical Docs",
  "Curious by nature",
]

type TimelineItem = {
  org: string
  role: string
  period: string
  score?: string
  bullets?: string[]
}

const experience: TimelineItem[] = [
  {
    org: "Analog Devices",
    role: "Software Engineering Intern",
    period: "Summer 2025 – Winter 2025",
    bullets: [
      "Worked on the Samana project, contributing to the software bring-up of the ADRV906x, a System on Chip designed for 5G radio unit development.",
      "Gained hands-on experience with embedded Linux — modifying config files, building and flashing updated images onto the evaluation board.",
      "Wrote clear technical documentation for low-level hardware tasks such as controlling onboard components and configuring network interfaces.",
      "Worked daily across SSH, UART serial terminals (Tera Term), and remote Linux build environments.",
    ],
  },
]

const education: TimelineItem[] = [
  {
    org: "University of Limerick",
    role: "BSc/MSc in Immersive Software Engineering",
    period: "2024 – 2028",
    score: "QCA 3.20 / 4.00",
  },
  {
    org: "Castletroy College, Limerick",
    role: "Leaving Certificate",
    period: "2024",
    score: "567 / 625 points",
  },
]

export default function About() {
  return (
    <div className="flex flex-col gap-14">

      {/* Bio + cinematography clip */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-4">About</p>
          <p className="text-body leading-relaxed">{bio}</p>
        </div>

        {/* Cinematography video snippet — add your clip to /public/clip.mp4 */}
        <div className="w-full md:w-36 shrink-0 aspect-[9/16] rounded-xl overflow-hidden border border-edge bg-surface">
          <video
            className="w-full h-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/clip.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-5">Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-md text-sm bg-surface text-body border border-edge font-sans"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-7">Experience</p>
        <div className="border-l border-edge flex flex-col gap-10 pl-6">
          {experience.map((item) => (
            <div key={item.org} className="relative">
              <span className="absolute -left-[25px] top-[6px] w-2 h-2 rounded-full bg-accent" />
              <p className="text-white font-semibold mb-0.5 font-serif">{item.org}</p>
              <p className="text-dim text-sm mb-0.5 font-sans">{item.role}</p>
              <p className="text-dim text-sm mb-4 font-sans">{item.period}</p>
              {item.bullets && (
                <ul className="flex flex-col gap-2">
                  {item.bullets.map((b) => (
                    <li key={b} className="text-body/80 text-sm leading-relaxed font-sans flex gap-2">
                      <span className="text-accent mt-1 shrink-0">–</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-7">Education</p>
        <div className="border-l border-edge flex flex-col gap-8 pl-6">
          {education.map((item) => (
            <div key={item.org} className="relative">
              <span className="absolute -left-[25px] top-[6px] w-2 h-2 rounded-full bg-accent" />
              <p className="text-white font-semibold mb-0.5 font-serif">{item.org}</p>
              <p className="text-dim text-sm mb-0.5 font-sans">{item.role}</p>
              <p className="text-dim text-sm font-sans">{item.period}</p>
              {item.score && (
                <p className="text-dim text-sm font-sans">{item.score}</p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
