import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatusChipProps {
  children: ReactNode;
  /** Dim the chip for completed/inactive states. */
  dim?: boolean;
  className?: string;
}

/** Small data tag — dark teal fill, teal border, label-caps text. */
export function StatusChip({ children, dim, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'status-chip inline-block rounded px-2 py-1 font-mono text-label-caps text-primary',
        dim && 'opacity-50',
        className,
      )}
    >
      {children}
    </span>
  );
}
