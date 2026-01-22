"use client"

export function RiverContent() {
  const skills = [
    { category: "Strategy", items: ["Community Development", "Social Strategy", "GTM Rollouts", "Analytics and Data-Driven", "Leadership"] },
    {
      category: "Social & Content",
      items: ["Social Media Management Systems", "Short-Term and Long-Term Content Planning", "Narrative and Creative Design", "Crafting Brand Voice"],
    },
    {
      category: "Web3 & Tech",
      items: ["Omnichain Daily Active User", "Dev/Founder Experience", "Community Builder", "Passion for Bleeding Edge Tech"],
    },
    {
      category: "Creative Direction",
      items: ["Collaborative Contributor", "0 to 1 Campaign Design", "Graphic Design", "Video Editing"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">River Crossing</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">Skills & Capabilities</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Below is a list of my most prominent skills, broken down into four main categories. I've done a little bit of everything, and my skills reflect my ability to perform no matter what team I'm on.
      </p>

      <div className="space-y-5">
        {skills.map((skillGroup, i) => (
          <div key={i} className="p-4 rounded-lg bg-[#d9cdb8]/10 border-2 border-[#8b6f47]/20">
            <h3 className="font-scroll-title text-base font-semibold text-foreground mb-3">{skillGroup.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill) => (
                <span
                  key={skill}
                  className="font-scroll-body px-3 py-1.5 rounded-lg bg-[#4a5d2a]/15 text-primary font-medium text-xs border border-[#4a5d2a]/40 hover:border-[#4a5d2a]/70 hover:bg-[#4a5d2a]/25 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
