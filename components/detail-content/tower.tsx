"use client"

export function TowerContent() {
  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">Signal Tower</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">Contact & Availability</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Connect with me at the links below, and let's build something cool!
      </p>

      <div className="p-6 rounded-lg bg-[#4a5d2a]/15 border-2 border-[#4a5d2a]/30">
        <p className="font-scroll-body text-sm font-semibold text-primary mb-3">Current Status</p>
        <div className="space-y-2 text-sm text-foreground font-scroll-body">
          <p>✓ Open to Community and Social Lead roles</p>
          <p>✓ Open to collaborations</p>
          <p>✓ On my vibecoding and photography arc</p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <p className="font-scroll-body text-xs uppercase font-semibold text-muted-foreground text-center">
          Send a Signal
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://x.com/itstymo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2.5 rounded-lg bg-[#4a5d2a] text-white font-medium text-sm hover:bg-[#5a6d3a] transition-colors border border-[#3a4d1a] shadow-sm"
          >
            X
          </a>
          <a
            href="https://linkedin.com/in/Tymo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2.5 rounded-lg bg-[#0077B5] text-white font-medium text-sm hover:bg-[#005885] transition-colors border border-[#005070] shadow-sm"
          >
            LinkedIn
          </a>
          <a
            href="mailto:itstymo.eth@gmail.com"
            className="font-scroll-body px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors border border-[#3a2f1a] shadow-sm"
          >
            Email
          </a>
        </div>
      </div>

      <div className="font-scroll-body text-xs text-muted-foreground space-y-2 pt-4 border-t-2 border-accent/20">
        <p>
          <strong>Response time:</strong> Within 24 hours
        </p>
        <p>
          <strong>Please Include:</strong> Name, company/organization, and a summary of what you'd like to discuss!
        </p>
      </div>
    </div>
  )
}
