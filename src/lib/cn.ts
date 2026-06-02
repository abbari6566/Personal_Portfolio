/**
 * Tiny classNames joiner. Filters out falsy values so conditional classes
 * read cleanly: cn('base', isActive && 'active'). Avoids pulling in a dep.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
