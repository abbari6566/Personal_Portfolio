import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface TypeWriterProps {
  /** Lines typed out one after another. */
  lines: string[];
  /** Per-character delay in ms. */
  speed?: number;
  /** Delay before the first character, in ms. */
  startDelay?: number;
  className?: string;
  /** Called once every line has finished typing. */
  onDone?: () => void;
}

/**
 * Types `lines` character-by-character with a blinking block cursor, evoking a
 * terminal printing output. Honors reduced-motion by rendering instantly.
 */
export function TypeWriter({
  lines,
  speed = 28,
  startDelay = 200,
  className,
  onDone,
}: TypeWriterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const done = lineIndex >= lines.length;

  // Honour reduced-motion: show everything immediately.
  useEffect(() => {
    if (prefersReduced) {
      setLineIndex(lines.length);
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [prefersReduced, startDelay]);

  useEffect(() => {
    if (prefersReduced || !started || done) return;

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }

    // Line finished — pause, then advance to the next line.
    const timer = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, started, done, prefersReduced, lines, speed]);

  useEffect(() => {
    if (!prefersReduced && done) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className={cn('font-mono', className)}>
      {lines.map((line, i) => {
        if (i > lineIndex) return null;
        const text = i === lineIndex && !prefersReduced ? line.slice(0, charIndex) : line;
        const showCursor = !prefersReduced && i === lineIndex && !done;
        return (
          <p key={i} className="leading-relaxed">
            <span className="text-primary/70">&gt; </span>
            <span>{text}</span>
            {showCursor && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] animate-blink bg-primary" />
            )}
          </p>
        );
      })}
    </div>
  );
}
