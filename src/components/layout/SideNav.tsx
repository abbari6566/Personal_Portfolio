import { profile } from '@/data/profile';
import { navItems } from '@/data/navigation';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface SideNavProps {
  /** Currently active section id (from scroll-spy). */
  activeId: string;
  /** Opens the interactive command terminal. */
  onOpenTerminal: () => void;
}

/** Fixed desktop navigation drawer: profile header + the five level links. */
export function SideNav({ activeId, onOpenTerminal }: SideNavProps) {
  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-terminal-bg py-8 md:flex">
      {/* Profile header */}
      <div className="mb-12 px-6">
        <div className="mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-primary shadow-glow-active">
          <img
            src={profile.avatar}
            alt={profile.avatarAlt}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <h2 className="mb-1 font-display text-headline-sm text-primary">{profile.name}</h2>
        <p className="font-mono text-body-md text-on-surface-variant">{profile.role}</p>
        <div className="status-chip mt-2 inline-block rounded px-2 py-1 font-mono text-label-caps text-primary">
          {profile.levelTag}
        </div>
      </div>

      {/* Level links */}
      <div className="relative flex-1">
        <div className="absolute bottom-4 left-[27px] top-4 -z-10 w-0.5 animate-pulse-line bg-gradient-to-b from-primary to-transparent opacity-30" />
        <ul className="space-y-4">
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group flex items-center gap-4 px-4 py-3 font-mono text-label-caps transition-all duration-200 ease-in-out',
                    isActive
                      ? 'border-l-2 border-primary bg-secondary-container/10 text-primary'
                      : 'text-on-surface-variant opacity-60 hover:bg-surface-variant/20 hover:opacity-100',
                  )}
                >
                  <Icon name={item.icon} filled={isActive} />
                  {item.level}:{item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Terminal launcher */}
      <div className="mt-6 px-6">
        <button
          type="button"
          onClick={onOpenTerminal}
          className="flex w-full items-center justify-center gap-2 rounded border border-primary/60 px-4 py-3 font-mono text-label-caps text-primary transition-colors hover:bg-primary/10"
        >
          <Icon name="terminal" className="text-[18px]" />
          OPEN_TERMINAL
        </button>
      </div>
    </nav>
  );
}
