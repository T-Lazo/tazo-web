const bio = `3rd Year Immersive Software Engineering student at the University of Limerick. 
I've interned at Analog Devices and Avtrain. I love learning new skills and meeting new people to learn from and connect with.
Hope you enjoy my website ◡̈ `

const skills = [
  "Python", "Java", "Kotlin", "C", "C++", "Scala", "Bash", "Supabase",
  "Flask", "Gunicorn", "React", "TypeScript", "Next.js", "HTML", "CSS",
  "Embedded Linux", "Git", "Docker",
  "SSH", "Raspberry Pi", "Tailscale",
  "Technical Docs", "micro:bit", "SolidWorks", "Davinci Resolve",
  "Solidity", "Web3.js", "MetaMask", "Ethereum / Sepolia Testnet"
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
    org: "Avtrain",
    role: "Software Engineering Intern",
    period: "Summer 2026",
    bullets: [
      "Developing the Operations Manual Generator (OMG), a tool that streamlines how drone operators create and maintain the operations manuals required for regulatory approval.",
    ],
  },
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

      {/* Bio */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-4">About</p>
        <p className="text-body leading-relaxed">{bio}</p>
      </div>

      {/* Cinematography video snippet — add your clip to /public/clip.mp4 */}
      <div className="w-full md:w-9/10 mx-auto aspect-video rounded-lg overflow-hidden border border-edge bg-surface opacity-67 hover:opacity-90 transition-opacity duration-300">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/clip.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-accent font-sans mb-5">Tools I've Worked With</p>
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
