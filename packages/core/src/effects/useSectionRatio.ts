import { ScrollPosition } from '../page/Page';

import { useIntersectionObservable } from './useIntersectionObservable';
import { useSectionPosition } from './useSectionPosition';
import { usePageScroll } from './usePageScroll';

export interface ScrollInfo extends ScrollPosition {
  /** Ratio of the Page being scrolled */
  scrolledRatio: number;
}

export interface SectionPosition {
   /** From IntersectionObserver: the top of the `<Section>` + scrollTop */
  sectionTop: number;

   /** From IntersectionObserver: the height of the `<Section>` */
  sectionHeight: number;

   /** The bounding rectangle of `<Section>` */
  sectionBoundingRect: ClientRect;
}

export interface SectionInfo {
  /** Whether the section is intersecting with the viewport */
  isIntersecting: boolean;

  /** Information related to the window scrolling and the ratio of the section being scrolled */
  scrollInfo: ScrollInfo;

  /** The position of the section */
  sectionPosition: ClientRect;
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

  // convert the intersecting state as [preIntersecting, currentIntersecting]
  const intersectObsr$ = useIntersectionObservable(sectionRef);

  const sectionPosition = useSectionPosition(sectionRef, intersectObsr$);

  const { scrollInfo, isIntersecting } = usePageScroll(intersectObsr$, trackingId, trackOnce);

  // TODO: move the calculation of scrolledRatio here
  return {
    scrollInfo,
    sectionPosition,
    isIntersecting,
  };
}
