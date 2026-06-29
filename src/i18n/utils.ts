import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';

export type { Lang, UIKey };
export const locales: Lang[] = ['en', 'ar'];

/** Extract the locale from a URL pathname (e.g. /ar/work/... -> 'ar'). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg && seg in languages) return seg as Lang;
  return defaultLang;
}

/** A translator bound to a language, falling back to English. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Pick the right side of a bilingual value. */
export function pick<T>(lang: Lang, value: { en: T; ar: T }): T {
  return value[lang];
}

/** Text direction for a language. */
export function dir(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

/** The "other" language (for the toggle). */
export function otherLang(lang: Lang): Lang {
  return lang === 'ar' ? 'en' : 'ar';
}

/** Home path for a language. */
export function homePath(lang: Lang): string {
  return `/${lang}`;
}

/** Story path for a language + slug. */
export function workPath(lang: Lang, slug: string): string {
  return `/${lang}/work/${slug}`;
}

/**
 * Given the CURRENT pathname and a TARGET language, return the mirror URL so the
 * language toggle keeps you on the same page (home or a specific story).
 */
export function mirrorPath(currentPath: string, target: Lang): string {
  const parts = currentPath.replace(/\/+$/, '').split('/').filter(Boolean);
  // parts[0] is the current lang; swap it, keep the rest.
  if (parts.length === 0) return `/${target}`;
  parts[0] = target;
  return '/' + parts.join('/');
}
