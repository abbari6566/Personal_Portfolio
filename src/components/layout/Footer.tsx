import { profile } from '@/data/profile';

const year = new Date().getFullYear();

/** Site footer: system-status line + social links. */
export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-outline-variant bg-terminal-bg py-10 md:ml-64 md:w-[calc(100%-256px)]">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-gutter px-margin-mobile md:flex-row md:px-margin-desktop">
        <p className="font-mono text-label-caps text-secondary opacity-80 transition-opacity hover:opacity-100">
          © {year} SYSTEM_STATUS: ONLINE
        </p>
        <div className="flex gap-6">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-label-caps text-on-surface-variant opacity-80 transition-all hover:text-secondary-fixed hover:opacity-100"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
