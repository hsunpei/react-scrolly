import { Observable } from 'rxjs';
import { useRef, useMemo, useEffect, useContext } from 'react';

import { PageContext, PageContextInterface } from '../../context/PageContext';
import { useSectionPosition, SectionPosition } from '../common/useSectionPosition';
import { usePageScroll } from '../common/usePageScroll';
import { IntersectionInfo } from '../common/useIntersectionObservable';
import { ScrollPosition } from '../../types/ScrollPosition';

export interface SectionInfo extends SectionPosition {
  /** Whether the section is intersecting with the viewport */
  isIntersecting: boolean;

  /** Information related to the window scrolling and the ratio of the section being scrolled */
  scrollInfo: ScrollPosition;

  /** Ratio of the section being scrolled */
  scrolledRatio: number;
}

export function useScrolledRatio(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,

  intersectObsr$: Observable<IntersectionInfo>,

  /**
   * By setting an unique Section ID, you can know which section the user is currently viewing.
   * If `trackingId` is not null,
   * it will trigger the update of the active section infomation managed in `<Page>`.
   * Please make sure that on the same `scrollTop`,
   * there is **NO** more than one tracked section (section with `trackingId`).
   */
  trackingId?: string
): SectionInfo {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { addActiveSection, removeActiveSection, updateScrollRatio } = context!;

  const { sectionTop, boundingRect } = useSectionPosition(sectionRef, intersectObsr$);

  const { isIntersecting, scrollInfo } = usePageScroll(intersectObsr$);

  const preIntersecting = useRef(false);

  // update the active section info if `isIntersecting` changes
  useEffect(() => {
    const curInter = isIntersecting;
    const preInter = preIntersecting.current;

    if (trackingId) {
      if (!preInter && curInter) {
        // update the section currently being scrolled
        addActiveSection(trackingId, sectionTop, scrollInfo.scrollBottom);
      } else if (preInter && !curInter) {
        // clear the section ID tracked in the page
        removeActiveSection(trackingId, scrollInfo.scrollBottom);
      }
    }

    preIntersecting.current = curInter;
  }, [trackingId, isIntersecting, sectionTop, scrollInfo, addActiveSection, removeActiveSection]);

  const scrolledRatio = useMemo(() => {
    const { scrollBottom } = scrollInfo;
    const { height } = boundingRect;

    const distance = scrollBottom - sectionTop;
    let ratio = distance / height;

    if (ratio >= 1) {
      ratio = 1;
    } else if (ratio <= 0) {
      ratio = 0;
    }

    return ratio;
  }, [scrollInfo, boundingRect, sectionTop]);

  useEffect(() => {
    // if the section is tracked,
    // let `useActiveSectionTracker()`to determine whether it is active,
    // and if it is active, the scrolled ratio which it keeps track of will be updated
    if (trackingId) {
      updateScrollRatio(trackingId, scrolledRatio);
    }
  }, [scrolledRatio, trackingId, updateScrollRatio]);

  return {
    isIntersecting,
    scrolledRatio,
    sectionTop,
    scrollInfo,
    boundingRect,
  };
}
