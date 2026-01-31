"use client"

export function TavernContent() {
  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-accent/20 pb-4">
        <h2 className="font-scroll-title text-2xl md:text-3xl font-semibold text-foreground">The Tavern</h2>
        <p className="font-scroll-body text-sm italic text-neutral-700 mt-1">Where the Bard holds court</p>
      </div>

      <p className="font-scroll-body text-foreground leading-relaxed text-center">
        Pull up a chair, traveler. The bard takes the stage each eve, weaving tales through song and verse.
        Lend an ear to the melodies that echo through these ancient halls.
      </p>

      {/* Spotify Embed - The Bard's Songbook */}
      <div className="p-6 rounded-lg bg-[#d9cdb8]/20 border-2 border-[#8b6f47]/30">
        <h3 className="font-scroll-title text-lg font-semibold text-foreground mb-4">The Bard&apos;s Songbook</h3>
        <p className="font-scroll-body text-sm text-muted-foreground mb-4">
          A collection of the bard&apos;s finest performances, preserved in arcane wax and melody.
        </p>
        <div className="rounded-lg overflow-hidden">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/artist/3ETSesqxUJBL3wcCrTQrCN?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify artist embed"
          />
        </div>
      </div>

      {/* YouTube - The Scrying Pool */}
      <div className="p-6 rounded-lg bg-[#d9cdb8]/20 border-2 border-[#8b6f47]/30">
        <h3 className="font-scroll-title text-lg font-semibold text-foreground mb-4">The Scrying Pool</h3>
        <p className="font-scroll-body text-sm text-muted-foreground mb-4">
          Gaze into the pool and witness the bard&apos;s visual chronicles - moving pictures from distant realms.
        </p>
        <a
          href="https://www.youtube.com/@its_tymo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-scroll-body inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FF0000] text-white font-medium text-sm hover:bg-[#CC0000] transition-colors border border-[#CC0000] shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814Z" />
            <path d="m9.545 15.568 6.273-3.568-6.273-3.568v7.136Z" fill="#fff" />
          </svg>
          Visit the Scrying Pool
        </a>
      </div>

      {/* CTA - Follow the Bard */}
      <div className="space-y-4 pt-4">
        <p className="font-scroll-body text-xs uppercase font-semibold text-muted-foreground text-center">
          Follow the Bard
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://open.spotify.com/artist/3ETSesqxUJBL3wcCrTQrCN"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2 rounded-lg bg-[#1DB954] text-white font-medium text-sm hover:bg-[#1AA34A] transition-colors border border-[#17a247] shadow-sm"
          >
            Spotify
          </a>
          <a
            href="https://www.youtube.com/@its_tymo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-scroll-body px-4 py-2 rounded-lg bg-[#FF0000] text-white font-medium text-sm hover:bg-[#CC0000] transition-colors border border-[#CC0000] shadow-sm"
          >
            YouTube
          </a>
        </div>
      </div>
    </div>
  )
}
