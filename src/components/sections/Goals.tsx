import { profile } from '@/data/profile';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Icon } from '@/components/ui/Icon';

/** LEVEL 05 — the call to action ("Next Level"). */
export function Goals() {
  return (
    <section
      id="goals"
      className="mb-32 flex min-h-[60vh] flex-col items-center justify-center pt-20 text-center"
    >
      <ScrollReveal className="w-full">
        <GlassCard className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border-outline-variant/50 p-12">
          {/* Ambient accent inside the card */}
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <h2 className="relative z-10 mb-6 font-display text-headline-xl-mobile text-on-surface md:text-headline-xl">
            Next Level: <br />
            <span className="italic text-primary text-glow">Initialization</span>
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-2xl font-mono text-body-lg text-on-surface-variant">
            Currently seeking full-time roles in Software Engineering and Artificial Intelligence.
            Ready to deploy skills in production environments and architect high-impact solutions.
          </p>
          <div className="relative z-10 flex flex-col justify-center gap-6 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-2 rounded bg-primary px-8 py-4 font-mono text-label-caps text-terminal-bg shadow-glow-active transition-colors hover:bg-primary-fixed-dim"
            >
              <Icon name="send" className="text-[20px]" />
              INITIATE_CONTACT
            </a>
          </div>
        </GlassCard>
      </ScrollReveal>
    </section>
  );
}
