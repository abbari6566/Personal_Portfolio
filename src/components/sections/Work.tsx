import { projects } from '@/data/projects';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

/** LEVEL 03 — featured projects ("quests") as wide split image/text cards. */
export function Work() {
  return (
    <section id="work" className="mb-32 pt-20">
      <SectionHeading>Completed Quests</SectionHeading>

      <div className="space-y-8">
        {projects.map((project, i) => {
          const reversed = i % 2 === 1;
          return (
            <ScrollReveal key={project.name}>
              <GlassCard
                className={cn(
                  'group flex flex-col overflow-hidden rounded-xl p-0',
                  reversed ? 'md:flex-row-reverse' : 'md:flex-row',
                )}
              >
                {/* Media */}
                <div className="relative min-h-[200px] w-full bg-surface-container-high md:w-2/5">
                  <div
                    role="img"
                    aria-label={project.imageAlt}
                    className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-300 group-hover:opacity-70"
                    style={{ backgroundImage: `url('${project.image}')` }}
                  />
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t from-terminal-bg to-transparent',
                      reversed ? 'md:bg-gradient-to-r' : 'md:bg-gradient-to-l',
                    )}
                  />
                </div>

                {/* Body */}
                <div className="flex w-full flex-col justify-center p-8 md:w-3/5">
                  <div className="mb-2 flex items-center gap-2 font-mono text-label-caps text-primary">
                    <Icon name={project.categoryIcon} className="text-[16px]" />
                    {project.category}
                  </div>
                  <h3 className="mb-3 font-display text-headline-md text-on-surface">
                    {project.name}
                  </h3>
                  <p className="mb-6 font-mono text-body-md text-on-surface-variant">
                    {project.description}
                  </p>
                  <div className="flex gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        aria-label={`${project.name} — ${link.label}`}
                        className="text-primary transition-colors hover:text-secondary-fixed"
                      >
                        <Icon name={link.icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
