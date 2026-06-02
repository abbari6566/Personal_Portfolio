interface SectionHeadingProps {
  children: string;
}

/** Section title (Playfair) followed by a fading teal rule — used per level. */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-center gap-4">
      <h2 className="font-display text-headline-lg text-on-surface">{children}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
    </div>
  );
}
