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
