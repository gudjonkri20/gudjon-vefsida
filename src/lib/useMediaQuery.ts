import { useEffect, useState } from 'react';

/** Tailwind's `lg`: where the home page switches to its two-column layouts. */
export const WIDE = '(min-width: 1024px)';

/** Tracks a CSS media query, for the few places layout has to change in JS. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}
