import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * The primary content container: frosted glass + dual-tone gradient border.
 * Visual treatment lives in the `.glass-card` class (index.css); this just
 * applies the default radius/border so call sites stay tidy.
 */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn('glass-card rounded-xl border border-outline-variant/30', className)}>
      {children}
    </div>
  );
}
