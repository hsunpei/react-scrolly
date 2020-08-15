import { useIntersectionObservable } from '../common/useIntersectionObservable';

import { useScrolledRatio } from './useScrolledRatio';

/**
 * Return the `sectionInfo` of obtained from `useScrolledRatio()`
 */
export function useSection(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,

  /**
   * By setting an unique Section ID, you can know which section the user is currently viewing.
   * If `trackingId` is not null,
   * it will trigger the update of the active section infomation managed in `<Page>`.
   * Please make sure that on the same `scrollTop`,
   * there is **NO** more than one tracked section (section with `trackingId`).
   */
  trackingId?: string
) {
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);
  return useScrolledRatio(sectionRef, intersectObsr$, trackingId);
}
