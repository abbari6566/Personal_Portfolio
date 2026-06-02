import { cn } from '@/lib/cn';

interface IconProps {
  /** Material Symbols Outlined glyph name, e.g. "terminal". */
  name: string;
  /** Render the filled variant. */
  filled?: boolean;
  className?: string;
}

/**
 * Thin wrapper over the Material Symbols web font. Marked aria-hidden because
 * icons here are decorative — labels carry the meaning.
 */
export function Icon({ name, filled, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('material-symbols-outlined', filled && 'icon-fill', className)}
    >
      {name}
    </span>
  );
}
