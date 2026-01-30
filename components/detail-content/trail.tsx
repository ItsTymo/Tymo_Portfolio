"use client"

export function TrailContent() {
  const quests = [
    { name: "Photography", status: "Active", description: "Figuring out my Fujifilm X100V one shot at a time" },
    { name: "Used Book Recommendation App", status: "In Development", description: "Making a tool to help me figure out what to read next" },
    {
      name: "Spokane Pickleball Board Member",
      status: "Active",
      description: "Leading the growth of Pickleball in Spokane and the surrounding area",
    },
    { name: "Neighborhood Council Representative", status: "Active", description: "Representing 10,000 residents' interests to the City, and bringing neighbors together" },
  ]

  const statusColors: Record<string, string> = {
    Active: "bg-[#4a5d2a]/25 text-primary border border-[#4a5d2a]/50",
    "In Progress": "bg-accent/20 text-accent border border-accent/40",
    'In Development': "bg-[#5a7fb8]/20 text-secondary border border-[#5a7fb8]/40",
    Completed: "bg-muted/20 text-muted-foreground border border-muted/30",
  }

  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">Trailhead</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">Active Quests & Projects</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Current expeditions and ongoing projects in my life. Each quest represents an opportunity to build, grow,
        and create something bigger than myself.
      </p>

      <div className="space-y-3">
        {quests.map((quest, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border-2 border-[#8b6f47]/30 bg-[#d9cdb8]/10 hover:bg-[#d9cdb8]/20 transition-all"
          >
            <div className="flex items-start justify-between mb-2 gap-3">
              <h3 className="font-scroll-title text-base font-semibold text-foreground flex-1">{quest.name}</h3>
              <span
                className={`font-scroll-body text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${statusColors[quest.status]}`}
              >
                {quest.status}
              </span>
            </div>
            <p className="font-scroll-body text-sm text-muted-foreground">{quest.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
