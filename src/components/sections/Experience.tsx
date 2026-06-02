import { experience } from '@/data/experience';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/** LEVEL 02 — experience log, a 2-up grid of glass cards. */
export function Experience() {
  return (
    <section id="experience" className="mb-32 pt-20">
      <SectionHeading>Experience Log</SectionHeading>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {experience.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.08}>
            <GlassCard className="h-full rounded-lg p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-display text-headline-sm text-primary">{item.title}</h3>
                {item.status === 'active' && <StatusChip>ACTIVE</StatusChip>}
                {item.status === 'completed' && <StatusChip dim>COMPLETED</StatusChip>}
              </div>

              {item.org && (
                <p className="mb-2 font-mono text-body-md text-on-surface-variant">{item.org}</p>
              )}
              <p className="mb-4 font-mono text-body-md text-on-surface-variant opacity-80">
                {item.description}
              </p>

              {item.tags && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="font-mono text-xs text-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
