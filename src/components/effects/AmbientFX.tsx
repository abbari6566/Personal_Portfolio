/**
 * Full-viewport atmospheric layers that sit behind all content:
 *  - a faint CRT scanline texture
 *  - a single bright scanline sweeping down the screen
 *  - a soft teal vignette in the corners
 * All are pointer-events-none and aria-hidden — purely decorative.
 */
export function AmbientFX() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Static CRT line texture */}
      <div className="crt-overlay absolute inset-0 opacity-40" />

      {/* Sweeping scanline */}
      <div className="absolute inset-x-0 top-0 h-24 animate-scanline bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      {/* Corner glow accents */}
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-secondary-container/5 blur-3xl" />
    </div>
  );
}
