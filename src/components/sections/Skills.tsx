import { skillGroups } from '@/data/skills';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/** LEVEL 04 — tech specs. Three terminal-style spec sheets. */
export function Skills() {
  return (
    <section id="skills" className="mb-32 pt-20">
      <SectionHeading>Tech Specs</SectionHeading>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {skillGroups.map((group, i) => (
          <ScrollReveal key={group.title} delay={i * 0.1}>
            <GlassCard className="h-full rounded-lg p-6">
              <h3 className="mb-6 border-b border-outline-variant/50 pb-2 font-mono text-label-caps text-primary">
                &gt;_ {group.title}
              </h3>
              <ul className="space-y-3 font-mono text-body-md text-on-surface-variant">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-primary">&gt;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
