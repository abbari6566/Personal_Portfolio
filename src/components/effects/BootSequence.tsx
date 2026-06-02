import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/data/profile';

interface BootSequenceProps {
  /** Fired when the boot overlay has fully dismissed. */
  onComplete: () => void;
}

const BOOT_LINES = [
  'INITIALIZING SYSTEM CORE...',
  'MOUNTING /dev/portfolio ............ OK',
  'LOADING NEURAL MODULES ............. OK',
  'ESTABLISHING SECURE LINK ........... OK',
  `AUTHENTICATING USER: ${profile.name.toUpperCase()}`,
  'ACCESS GRANTED. WELCOME, OPERATOR.',
];

/**
 * A one-time fake terminal boot screen. Prints status lines, fills a progress
 * bar, then fades the whole overlay out to reveal the portfolio. Persists a
 * sessionStorage flag so it only plays once per browser session.
 */
export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Reveal one status line at a time.
  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return;
    const timer = setTimeout(() => setVisibleLines((n) => n + 1), 260);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  // Drive the progress bar to 100%, then dismiss.
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setDismissed(true), 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setProgress((p) => Math.min(100, p + 4)), 45);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-terminal-bg px-margin-mobile"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="w-full max-w-xl font-mono text-body-md">
            <p className="mb-6 text-label-caps tracking-[0.3em] text-primary/60">
              CYBER_OS v9.9 // SECURE BOOT
            </p>

            <div className="min-h-[180px] space-y-1.5">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-on-surface-variant"
                >
                  <span className="text-primary">&gt; </span>
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-label-caps text-on-surface-variant">
                <span>LOADING</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary shadow-glow-active transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
