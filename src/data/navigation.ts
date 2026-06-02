import type { NavItem } from './types';

/** The five "levels" of the portfolio, in scroll order. */
export const navItems: NavItem[] = [
  { id: 'about', level: 'LVL_01', label: 'ABOUT', icon: 'person' },
  { id: 'experience', level: 'LVL_02', label: 'EXP', icon: 'database' },
  { id: 'work', level: 'LVL_03', label: 'WORK', icon: 'code' },
  { id: 'skills', level: 'LVL_04', label: 'SKILLS', icon: 'terminal' },
  { id: 'goals', level: 'LVL_05', label: 'GOALS', icon: 'flag' },
];
