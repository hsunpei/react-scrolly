export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IntersectionObserverConfig {
  /**
   * Threshold at which to trigger callback.
   * See: https://developers.google.com/web/updates/2016/04/intersectionobserver
   */
  threshold?: number[] | 0 | 1;

  /**
   * Margins for the root (document’s viewport),
   * which allows you to  grow or shrink the area used for intersections
   */
  rootMargin?: Margin;
}

const DEFAULT_THRESHOLD = 0;
const DEFAULT_MARGIN = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function getIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  { threshold = DEFAULT_THRESHOLD, rootMargin = DEFAULT_MARGIN }: IntersectionObserverConfig = {
    threshold: DEFAULT_THRESHOLD,
    rootMargin: DEFAULT_MARGIN,
  }
) {
  const { top, right, bottom, left } = rootMargin;

  return new IntersectionObserver(callback, {
    threshold,

    /**  Observe changes in visibility of the section relative to the document's viewport */
    root: null,

    /**
     * Watch only the changes in the intersection between the section and the viewport,
     * without any added or substracted space
     */
    rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
  });
}
