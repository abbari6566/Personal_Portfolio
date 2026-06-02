import type { ReactNode } from 'react';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { projects } from '@/data/projects';
import { skillGroups } from '@/data/skills';
import { navItems } from '@/data/navigation';

/** Side effects a command can request from the host terminal. */
export interface CommandEffects {
  /** Clear the scrollback. */
  clear?: boolean;
  /** Smooth-scroll to a section id and close the terminal. */
  navigateTo?: string;
  /** Close the terminal overlay. */
  close?: boolean;
}

export interface CommandResult {
  /** Lines to print. ReactNode so we can colorize/link output. */
  output: ReactNode[];
  effects?: CommandEffects;
}

type CommandHandler = (args: string[]) => CommandResult;

interface Command {
  name: string;
  summary: string;
  handler: CommandHandler;
}

const line = (content: ReactNode): ReactNode => content;

// Declared early so `help` can enumerate the registry it belongs to.
const registry = new Map<string, Command>();

const register = (name: string, summary: string, handler: CommandHandler) => {
  registry.set(name, { name, summary, handler });
};

register('help', 'List available commands', () => ({
  output: [
    line('Available commands:'),
    line(''),
    ...Array.from(registry.values()).map((cmd) => (
      <span>
        <span className="text-primary">{cmd.name.padEnd(12)}</span>
        <span className="text-on-surface-variant">{cmd.summary}</span>
      </span>
    )),
    line(''),
    line(
      <span className="text-on-surface-variant/70">
        Tip: try <span className="text-primary">goto work</span> or{' '}
        <span className="text-primary">whoami</span>. Use ↑/↓ for history, Tab to autocomplete.
      </span>,
    ),
  ],
}));

register('whoami', 'Print operator identity', () => ({
  output: [
    line(
      <span>
        <span className="text-primary">{profile.name}</span> — {profile.role}{' '}
        <span className="text-secondary">[{profile.levelTag}]</span>
      </span>,
    ),
    ...profile.bio.map((b) => line(<span className="text-on-surface-variant">{b}</span>)),
  ],
}));

register('about', 'Jump to the About level', () => ({
  output: [line('Navigating to LVL_01:ABOUT ...')],
  effects: { navigateTo: 'about' },
}));

register('experience', 'List the experience log', () => ({
  output: [
    line('EXPERIENCE_LOG:'),
    line(''),
    ...experience.map((e) =>
      line(
        <span>
          <span className="text-primary">[{(e.status ?? 'archived').toUpperCase()}]</span>{' '}
          <span className="text-on-surface">{e.title}</span>
          {e.org ? <span className="text-on-surface-variant"> @ {e.org}</span> : null}
        </span>,
      ),
    ),
  ],
}));

register('projects', 'List featured projects', () => ({
  output: [
    line('COMPLETED_QUESTS:'),
    line(''),
    ...projects.flatMap((p) => [
      line(
        <span>
          <span className="text-primary">▸ {p.name}</span>{' '}
          <span className="text-secondary">({p.category})</span>
        </span>,
      ),
      line(<span className="text-on-surface-variant"> {p.description}</span>),
      line(''),
    ]),
  ],
}));

register('skills', 'List the tech stack', () => ({
  output: [
    line('TECH_SPECS:'),
    line(''),
    ...skillGroups.map((g) =>
      line(
        <span>
          <span className="text-primary">{`>_ ${g.title}`.padEnd(20)}</span>
          <span className="text-on-surface-variant">{g.items.join(', ')}</span>
        </span>,
      ),
    ),
  ],
}));

register('contact', 'Show contact channels', () => ({
  output: [
    line(
      <span>
        EMAIL:{' '}
        <a className="text-primary underline" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </span>,
    ),
    ...profile.socials.map((s) =>
      line(
        <span>
          {s.label}:{' '}
          <a
            className="text-primary underline"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.href}
          </a>
        </span>,
      ),
    ),
  ],
}));

register('goto', 'goto <section> — jump to a level', (args) => {
  const target = args[0]?.toLowerCase();
  const match = navItems.find((n) => n.id === target);
  if (!match) {
    return {
      output: [
        line(
          <span className="text-error-red">
            Unknown section: {target ?? '(none)'}. Try: {navItems.map((n) => n.id).join(', ')}
          </span>,
        ),
      ],
    };
  }
  return {
    output: [line(`Warping to ${match.level}:${match.label} ...`)],
    effects: { navigateTo: match.id },
  };
});

register('ls', 'List levels', () => ({
  output: navItems.map((n) =>
    line(
      <span>
        <span className="text-primary">{n.level}</span>{' '}
        <span className="text-on-surface">{n.id}/</span>
      </span>,
    ),
  ),
}));

register('clear', 'Clear the screen', () => ({ output: [], effects: { clear: true } }));

register('exit', 'Close the terminal', () => ({
  output: [],
  effects: { close: true },
}));

register('sudo', 'Elevate privileges', () => ({
  output: [
    line(<span className="text-error-red">Nice try, operator. This incident will be logged.</span>),
  ],
}));

const BANNER = String.raw`
   _   ___ ___    _   ___   ___   _   ___ ___
  /_\ | _ ) _ \  /_\ | _ \ | _ ) /_\ | _ \_ _|
 / _ \| _ \   / / _ \|   / | _ \/ _ \|   /| |
/_/ \_\___/_|_\/_/ \_\_|_\ |___/_/ \_\_|_\___|
`;

register('banner', 'Print the ASCII banner', () => ({
  output: [line(<pre className="text-primary leading-tight">{BANNER}</pre>)],
}));

/**
 * Parse and execute a raw input line. Returns the echoed prompt plus output.
 * Unknown commands produce a friendly error rather than throwing.
 */
export function runCommand(raw: string): CommandResult {
  const trimmed = raw.trim();
  if (trimmed === '') return { output: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const command = registry.get(name.toLowerCase());

  if (!command) {
    return {
      output: [
        line(
          <span className="text-error-red">
            command not found: {name}. Type <span className="text-primary">help</span> for options.
          </span>,
        ),
      ],
    };
  }

  return command.handler(args);
}

/** Command names, used for Tab autocomplete. */
export const commandNames = (): string[] => Array.from(registry.keys());
