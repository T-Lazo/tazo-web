const bio = `Software engineering student at the University of Limerick, recently back from a 6-month internship at Analog Devices. I build things end to end — from Raspberry Pi network setups to this site. I like figuring out how things actually work.`

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
      "Worked on the Samana project, contributing to the software bring-up of the ADRV906x, a System on Chip (SoC) designed for 5G radio unit development, using a dedicated evaluation board called Denali.",
      "Gained hands-on experience with embedded Linux, modifying configuration files that describe how the operating system interacts with hardware, then building and flashing updated software images onto the board.",
      "Wrote clear technical documentation for low-level hardware tasks, such as controlling onboard components and configuring network interfaces directly through software.",
      "Worked across SSH, UART serial terminals (Tera Term), and remote Linux build environments daily, navigating a professional embedded systems development workflow.",
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
    <div className="flex flex-col gap-6">

      {/* Card 1 — Bio */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-4">About</h2>
        <p className="text-beige leading-relaxed">{bio}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-sm bg-chocolate/20 text-beige border border-chocolate/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Card 2 — Experience */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-6">Experience</h2>
        <div className="border-l-2 border-chocolate/40 flex flex-col gap-8 pl-6">
          {experience.map((item) => (
            <div key={item.org} className="relative">
              <span className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-chocolate border-2 border-[#152E24]" />
              <div className="flex flex-col gap-0.5 mb-3">
                <p className="text-white font-semibold">{item.org}</p>
                <p className="text-earth-medium text-sm">{item.role}</p>
                <p className="text-earth-medium text-sm">{item.period}</p>
              </div>
              {item.bullets && (
                <ul className="list-disc list-inside space-y-1 text-beige text-sm leading-relaxed">
                  {item.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Card 3 — Education */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-6">Education</h2>
        <div className="border-l-2 border-chocolate/40 flex flex-col gap-8 pl-6">
          {education.map((item) => (
            <div key={item.org} className="relative">
              <span className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-chocolate border-2 border-[#152E24]" />
              <div className="flex flex-col gap-0.5">
                <p className="text-white font-semibold">{item.org}</p>
                <p className="text-earth-medium text-sm">{item.role}</p>
                <p className="text-earth-medium text-sm">{item.period}</p>
                {item.score && (
                  <p className="text-earth-medium text-sm">{item.score}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
