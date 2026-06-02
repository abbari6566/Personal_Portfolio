import { profile } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';

interface MobileHeaderProps {
  onOpenTerminal: () => void;
}

/** Top app bar shown only on mobile (the SideNav is hidden below md). */
export function MobileHeader({ onOpenTerminal }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-glass-fill shadow-glow-soft backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile">
        <a href="#about" className="flex items-center gap-3">
          <Icon name="terminal" className="text-primary" />
          <span className="font-display text-headline-sm font-bold tracking-tighter text-primary">
            {profile.name.toUpperCase()}
          </span>
        </a>
        <button
          type="button"
          onClick={onOpenTerminal}
          className="font-mono text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-primary"
        >
          SYNC_DATA
        </button>
      </div>
    </header>
  );
}
