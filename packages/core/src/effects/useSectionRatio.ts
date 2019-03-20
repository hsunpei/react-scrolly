import {
  useRef,
  useMemo,
  useEffect,
  useContext,
} from 'react';

import { ScrollPosition } from '../page/Page';
import { PageContext, PageContextInterface } from '../context/PageContext';

import { useIntersectionObservable } from './useIntersectionObservable';
import { useSectionPosition, SectionPosition } from './useSectionPosition';
import { usePageScroll } from './usePageScroll';

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
  const context = useContext<PageContextInterface | null>(PageContext);
  const { addActiveSection, removeActiveSection } = context!;

  // convert the intersecting state as [preIntersecting, currentIntersecting]
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);

  const { sectionTop, boundingRect } = useSectionPosition(sectionRef, intersectObsr$);

  const { isIntersecting, scrollInfo } = usePageScroll(intersectObsr$, trackingId, trackOnce);

  const preIntersecting = useRef(false);

  const scrolledRatio = useMemo(
    () => {
      const { scrollBottom } = scrollInfo;
      const { height } = boundingRect;

      const distance = scrollBottom - sectionTop;
      let ratio = distance / height;

      if (ratio >= 1) {
        ratio = 1;
      } else if (ratio <= 0) {
        ratio = 0;
      }

      // console.log('######## trackingId = ', trackingId, distance)
      return ratio;
    },
    [sectionTop, boundingRect, scrollInfo],
  );

  // update the active section info if `isIntersecting` changes
  useEffect(
    () => {
      const curInter = isIntersecting;
      const preInter = preIntersecting.current;

      if (trackingId) {
        if (!preInter && curInter){
          // update the section currently being scrolled
          addActiveSection(trackingId, sectionTop, scrollInfo.scrollBottom);
        } else if (preInter && !curInter) {
          // clear the section ID tracked in the page
          removeActiveSection(trackingId, scrollInfo.scrollBottom);
        }
      }

      preIntersecting.current = curInter;
    },
    [isIntersecting, sectionTop, scrollInfo],
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
