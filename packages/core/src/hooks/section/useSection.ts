import { useRef } from 'react';
import { useIntersectionObservable } from '../common/useIntersectionObservable';

import { useScrolledRatio } from './useScrolledRatio';
import { IntersectionObserverConfig } from '../../utils/getIntersectionObserver';

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
  trackingId?: string,

  /**
   * The array of intersectionRatio thresholds which is used in the options of IntersectionObserver
   * @example [0, 0.25, 0.5, 0.75, 1]
   */
  threshold?: IntersectionObserverConfig['threshold']
) {
  const intersectionConfig = useRef({
    threshold,
  });
  const intersectObsr$ = useIntersectionObservable(
    sectionRef,
    trackingId,
    intersectionConfig.current
  );
  return useScrolledRatio(sectionRef, intersectObsr$, trackingId);
}
