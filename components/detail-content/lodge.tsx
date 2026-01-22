"use client"

export function LodgeContent() {
  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">Adventurer's Lodge</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">About Me</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Based in the Pacific Northwest, I'm a tech-native social strategist and community builder. I'm passionate about tech, Web3,
        telling great stories. I blend strategic thinking with hands-on execution, crafting engaging experiences
        for top communities.
      </p>

      <div className="p-6 rounded-lg bg-[#d9cdb8]/20 border-2 border-[#8b6f47]/30">
        <h3 className="font-scroll-title text-lg font-semibold text-foreground mb-4">Character Sheet</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[#8b6f47]/20">
            <span className="font-scroll-body text-muted-foreground">Class</span>
            <span className="font-scroll-body font-medium text-foreground">Bard: Community & Social Strategist</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#8b6f47]/20">
            <span className="font-scroll-body text-muted-foreground">Alignment</span>
            <span className="font-scroll-body font-medium text-primary">Chaotic Good</span>
          </div>
          <div className="space-y-3 mt-4 pt-4 border-t border-[#8b6f47]/30">
            <p className="font-scroll-body text-muted-foreground text-xs uppercase font-semibold">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {["Community-building", "Social Strategy", "In-Depth Research", "Interpersonal Communication"].map((spec) => (
                <span
                  key={spec}
                  className="font-scroll-body px-3 py-1.5 rounded-lg text-xs bg-[#4a5d2a]/15 text-primary font-medium border border-[#4a5d2a]/30 hover:bg-[#4a5d2a]/25 transition-colors"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <p className="font-scroll-body text-xs uppercase font-semibold text-muted-foreground text-center">
          Connect & Collaborate
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://x.com/ItsTymo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2 rounded-lg bg-[#4a5d2a] text-white font-medium text-sm hover:bg-[#5a6d3a] transition-colors border border-[#3a4d1a] shadow-sm"
          >
            X / Twitter
          </a>
          <a
            href="https://www.linkedin.com/in/tymo/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2 rounded-lg bg-[#0077B5] text-white font-medium text-sm hover:bg-[#005885] transition-colors border border-[#005070] shadow-sm"
          >
            LinkedIn
          </a>
          <a
            href="mailto:itstymo.eth@gmail.com"
            className="font-scroll-body px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors border border-[#3a2f1a] shadow-sm"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  )
}
