import etStrings from './locales/et.json';
import enStrings from './locales/en.json';
import { routeMap, reverseRouteMap } from './routes';

export type Locale = 'et' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  et: etStrings,
  en: enStrings,
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations['et']?.[key] ?? key;
}

export function getLocale(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'et';
}

export function getLocalizedPath(etPath: string, targetLocale: Locale): string {
  return routeMap[targetLocale]?.[etPath] ?? etPath;
}

export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  const normalized = currentPath === '/' || currentPath === '/en/'
    ? currentPath
    : currentPath.replace(/\/$/, '');
  const etPath = reverseRouteMap[normalized] ?? '/';
  return getLocalizedPath(etPath, targetLocale);
}
