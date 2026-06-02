import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { GlassCard } from '@/components/ui/GlassCard';
import { TypeWriter } from '@/components/ui/TypeWriter';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

/** LEVEL 01 — hero. Animated label, display headline, terminal-typed bio. */
export function About() {
  return (
    <section id="about" className="mb-32 flex min-h-[80vh] flex-col justify-center pt-20">
      <motion.div
        className="mb-4 inline-flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="font-mono text-label-caps text-primary">SYSTEM_INIT //</span>
        <span className="h-px w-12 bg-primary opacity-50" />
      </motion.div>

      <motion.h1
        className="mb-6 font-display text-headline-xl-mobile text-on-surface md:text-headline-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Architecting <br />
        <span className="italic text-primary text-glow">Intelligence</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <GlassCard className="max-w-3xl p-8 md:p-12">
          <TypeWriter
            lines={profile.bio}
            startDelay={900}
            className="mb-6 text-body-lg text-on-surface-variant"
          />

          <div className="mt-8 flex flex-wrap gap-4">
            {profile.socials.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 rounded px-6 py-3 font-mono text-label-caps transition-colors',
                  i === 0
                    ? 'bg-primary text-terminal-bg shadow-glow-active hover:bg-primary-fixed-dim'
                    : 'border border-primary text-primary hover:bg-primary/10',
                )}
              >
                <Icon name={social.icon} className="text-[18px]" />
                {social.label}
              </a>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
