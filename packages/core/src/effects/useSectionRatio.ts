import { useMemo, useEffect, useState } from 'react';

import { ScrollPosition } from '../page/Page';

import { useIntersectionObservable } from './useIntersectionObservable';
import { useSectionPosition, SectionPosition } from './useSectionPosition';
import { usePageScroll } from './usePageScroll';
import { useSubscription } from './useSubscription';

export interface SectionInfo extends SectionPosition {
  /** Whether the section is intersecting with the viewport */
  isIntersecting: boolean;

  /** Information related to the window scrolling and the ratio of the section being scrolled */
  scrollInfo: ScrollPosition;

  /** Ratio of the Page being scrolled */
  scrolledRatio: number;
}

export function useSectionRatio(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,

  /**
   * By setting an unique Section ID, you can know which section the user is currently viewing.
   * If `trackingId` is not null,
   * `usePageScroll` will set it to `activeSectionId` of the `<Page>`
   * Please make sure that on the same `scrollTop`,
   * there is **NO** more than one tracked section (section with `trackingId`).
   */
  trackingId?: string,

  /** Only track the section using the IntersectionObserver once */
  trackOnce = false,
): SectionInfo {

  const [isIntersecting, setIntersectingState] = useState<boolean>(false);

  /** Function to set the subscription to the intersection  */
  const { setSubscription } = useSubscription(null);

  // convert the intersecting state as [preIntersecting, currentIntersecting]
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);

  const { sectionTop, boundingRect } = useSectionPosition(sectionRef, intersectObsr$);

  const scrollInfo = usePageScroll(intersectObsr$, trackingId, trackOnce);

  const scrolledRatio = useMemo(
    () => {
      const { scrollBottom } = scrollInfo;
      const { height } = boundingRect;

      let ratio = (scrollBottom - sectionTop) / height;

      if (ratio > 1) {
        ratio = 1;
      } else if (ratio < 0) {
        ratio = 0;
      }
      return ratio;
    },
    [sectionTop, boundingRect, scrollInfo],
  );

  useEffect(
    () => {
      // set the subscription to the intersection events on mounted
      setSubscription(intersectObsr$.subscribe({
        next: ({ isIntersecting: interseting }) => {
          // update the isIntersecting state
          setIntersectingState(interseting);
        },
      }));
    },
    [],
  );

  useEffect(
    () => {
      console.log('>///<', {
        isIntersecting,
        scrolledRatio,
        sectionTop,
        scrollInfo,
        boundingRect,
      });
    },
  );

  return {
    isIntersecting,
    scrolledRatio,
    sectionTop,
    scrollInfo,
    boundingRect,
  };
}
