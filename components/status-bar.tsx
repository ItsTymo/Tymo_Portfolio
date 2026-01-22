export function StatusBar() {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Region</span>
              <span className="text-foreground font-medium">Pacific Northwest</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-border pl-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Class</span>
              <span className="text-foreground font-medium">Community Builder & Strategist</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Level</span>
              <span className="text-foreground font-medium">32</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-border pl-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quests</span>
              <span className="text-accent font-semibold">4 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
