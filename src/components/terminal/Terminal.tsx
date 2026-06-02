import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { commandNames, runCommand } from '@/lib/commands';
import { profile } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';

interface TerminalProps {
  open: boolean;
  onClose: () => void;
  /** Smooth-scroll the page to a section id. */
  onNavigate: (id: string) => void;
}

interface HistoryEntry {
  prompt?: string;
  lines: ReactNode[];
}

const PROMPT = 'visitor@abrarbari:~$';

const WELCOME: ReactNode[] = [
  <span className="text-primary">{`Connected to ${profile.name}'s system.`}</span>,
  <span className="text-on-surface-variant">
    Type <span className="text-primary">help</span> to list commands, or{' '}
    <span className="text-primary">exit</span> to close.
  </span>,
];

/**
 * Interactive command terminal rendered as a focus-trapped modal overlay.
 * Supports command history (↑/↓), Tab autocomplete, and Escape/exit to close.
 */
export function Terminal({ open, onClose, onNavigate }: TerminalProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([{ lines: WELCOME }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus the input whenever the terminal opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the latest output in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  // Global Escape closes the terminal even if focus drifts.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = (raw: string) => {
    const result = runCommand(raw);

    if (result.effects?.clear) {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev, { prompt: raw, lines: result.output }]);
    }

    if (raw.trim()) {
      setHistory((prev) => [...prev, raw]);
    }
    setHistoryIndex(null);
    setInput('');

    if (result.effects?.close) onClose();
    if (result.effects?.navigateTo) {
      onNavigate(result.effects.navigateTo);
      onClose();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input);
      return;
    }

    // History navigation.
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }

    // Tab autocomplete against the command registry.
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const match = commandNames().find((name) => name.startsWith(partial));
      if (match) setInput(match);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive terminal"
        >
          <motion.div
            className="glass-card flex h-[70vh] max-h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-outline-variant/40 bg-terminal-bg/60 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-label-caps text-on-surface-variant">
                <Icon name="terminal" className="text-[16px] text-primary" />
                {PROMPT}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close terminal"
                className="text-on-surface-variant transition-colors hover:text-error-red"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>

            {/* Scrollback */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-1 overflow-y-auto px-4 py-3 font-mono text-body-md"
              onMouseDown={() => inputRef.current?.focus()}
            >
              {entries.map((entry, i) => (
                <div key={i} className="space-y-1">
                  {entry.prompt !== undefined && (
                    <div className="break-all">
                      <span className="text-secondary">{PROMPT}</span>{' '}
                      <span className="text-on-surface">{entry.prompt}</span>
                    </div>
                  )}
                  {entry.lines.map((node, j) => (
                    <div key={j} className="whitespace-pre-wrap break-words text-on-surface-variant">
                      {node}
                    </div>
                  ))}
                </div>
              ))}

              {/* Live input line */}
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-secondary">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Terminal command input"
                  className="flex-1 bg-transparent text-on-surface caret-primary outline-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
