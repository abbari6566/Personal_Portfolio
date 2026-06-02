/**
 * Shared content types. Keeping these in one place lets the data files and
 * the components agree on shape without circular imports.
 */

export interface NavItem {
  /** Section id used for the in-page anchor and scroll-spy. */
  id: string;
  /** "LVL_01" style prefix shown in the HUD. */
  level: string;
  /** Short label, e.g. "ABOUT". */
  label: string;
  /** Material Symbols icon name. */
  icon: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Profile {
  name: string;
  role: string;
  levelTag: string;
  avatar: string;
  avatarAlt: string;
  /** Hero lines, each rendered as a `> ...` terminal line. */
  bio: string[];
  email: string;
  socials: SocialLink[];
}

export type ExperienceStatus = 'active' | 'completed' | 'archived';

export interface Experience {
  title: string;
  org?: string;
  description: string;
  status?: ExperienceStatus;
  tags?: string[];
}

export interface Project {
  name: string;
  category: string;
  categoryIcon: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Links shown as icon buttons on the card. */
  links: SocialLink[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}
