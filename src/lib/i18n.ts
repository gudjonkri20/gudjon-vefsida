import { useLocation } from 'react-router-dom';
import type { Locale } from '../types';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'is'];
export const DEFAULT_LOCALE: Locale = 'en';

export function localeFromPath(pathname: string): Locale {
  if (pathname === '/is' || pathname.startsWith('/is/')) {
    return 'is';
  }
  return 'en';
}

export function pathWithoutLocale(pathname: string): string {
  if (pathname === '/is') return '/';
  if (pathname.startsWith('/is/')) return pathname.slice(3);
  return pathname;
}

export function pathWithLocale(pathname: string, locale: Locale): string {
  const stripped = pathWithoutLocale(pathname);
  if (locale === 'en') return stripped;
  if (stripped === '/') return '/is';
  return `/is${stripped}`;
}

export function useCurrentLocale(): Locale {
  const location = useLocation();
  return localeFromPath(location.pathname);
}

export function localizedHref(href: string, locale: Locale): string {
  if (locale === 'en') return href;
  if (href === '/') return '/is';
  if (href.startsWith('/')) return `/is${href}`;
  return href;
}
