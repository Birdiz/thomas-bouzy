/**
 * The résumé content contract.
 *
 * Both locales are plain TypeScript modules declared `satisfies ResumeContent`,
 * so a missing or misspelled key is a compile error caught by `astro check` —
 * no runtime validation layer needed for content authored in-repo.
 *
 * What types cannot express (array lengths matching across locales, empty
 * strings, malformed URLs) is enforced by tests/content.spec.ts.
 */

export interface Stat {
  /** The figure itself, pre-formatted for the locale (e.g. "1.5M+" / "1,5 M+"). */
  n: string;
  label: string;
}

export interface Project {
  title: string;
  org: string;
  period: string;
  context: string;
  approach: string;
  result: string;
  stack: string[];
}

export interface Job {
  period: string;
  duration: string;
  place: string;
  title: string;
  company: string;
  summary: string;
  bullets: string[];
  stack: string[];
}

export interface EarlierRole {
  period: string;
  title: string;
  org: string;
  text: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface MentoringEntry {
  year: string;
  text: string;
}

export interface LanguageSkill {
  name: string;
  level: string;
}

export interface ResumeContent {
  /** <head> copy. Not shown on the page. */
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
  };

  /** Strings that exist for assistive technology only. */
  a11y: {
    skipToContent: string;
    languageSwitcher: string;
    switchToOther: string;
    mainNavigation: string;
    portraitAlt: string;
  };

  nav: {
    work: string;
    experience: string;
    skills: string;
    about: string;
    contact: string;
  };

  hero: {
    availability: string;
    role: string;
    blurb: string;
    yearsCount: string;
    yearsLabel: string;
    badges: string[];
    ctaWork: string;
    ctaPdf: string;
  };

  stats: Stat[];

  work: {
    kicker: string;
    title: string;
    intro: string;
    labelContext: string;
    labelApproach: string;
    labelResult: string;
  };
  projects: Project[];

  experience: {
    kicker: string;
    title: string;
    earlierShow: string;
    earlierHide: string;
  };
  jobs: Job[];
  earlier: EarlierRole[];

  skillsSection: {
    kicker: string;
    title: string;
  };
  skills: SkillGroup[];

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    mentoringKicker: string;
    languagesKicker: string;
    educationKicker: string;
    educationText: string;
  };
  mentoring: MentoringEntry[];
  languages: LanguageSkill[];

  contact: {
    kicker: string;
    title: string;
    blurb: string;
    revealPhone: string;
    pdfLabel: string;
    locationLine: string;
  };
}
