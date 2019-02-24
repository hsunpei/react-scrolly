import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { PageContext, PageContextInterface } from '../context/PageContext';
import { ScrollPosition } from '../page/Page';

import { useIntersectionObserver, IntersectionInfo } from './useIntersectionObserver';

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

export function usePageScroll(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,

  /** Only track the section using the IntersectionObserver once */
  trackOnce: boolean,
) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const {
    scrollObserver$,
    resizeObserver$,
    activeSectionId,
    setActiveSectionId,
  } = context!;
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const intersectObsr = useIntersectionObserver(sectionRef, onIntersectionUpdated);

  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
    scrolledRatio: 0,
  });
  const pageScrollObsrRef = useRef(scrollObserver$.pipe(
    takeWhile(() => {
      // subscribe only when the section is in the viewport
      return isIntersecting;
    }),
  ));
  const scrollSubscriptionRef = useRef<Subscription | null>(null);

  const [sectionPosition, setSectionPosition] = useState<SectionPosition>({
    sectionTop: 0,
    sectionHeight: 1,
    sectionBoundingRect: {
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      height: 1,
      width: 1,
    },
  });
  const resizeObsrRef = useRef(resizeObserver$.pipe(
    takeWhile(() => {
      return isIntersecting;
    }),
  ));
  const resizeSubscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    return () => {
      // stop subscribing to the window scrolling events from <Page>
      if (scrollSubscriptionRef.current) {
        scrollSubscriptionRef.current.unsubscribe();
      }
      // stop subscribing to the window resizing events from <Page>
      if (resizeSubscriptionRef.current) {
        resizeSubscriptionRef.current.unsubscribe();
      }
    };
  },        []);

  /** Sets the scroll position information calculated in <Page> to the state */
  function recordPageScroll(scrollPos: ScrollPosition) {
    const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;
    const { sectionTop, sectionHeight } = sectionPosition;

    let scrolledRatio = (scrollBottom - sectionTop) / sectionHeight;

    if (scrolledRatio > 1) {
      scrolledRatio = 1;
    } else if (scrolledRatio < 0) {
      scrolledRatio = 0;
    }

    // updates the ratio of the section being scrolled and the scroll positions
    setScrollInfo({
      scrollTop,
      scrollBottom,
      windowHeight,
      scrollOffset,
      scrolledRatio,
    });

    // updates the section currently being scrolled
    if (activeSectionId) {
      setActiveSectionId(activeSectionId);
    }
  }

  /** Subscribe to the `scrollObserver` from <Page> */
  function subscribeScrolling() {
    scrollSubscriptionRef.current = pageScrollObsrRef.current.subscribe({
      next: recordPageScroll,
      complete: () => {
        if (activeSectionId) {
          // clear the section ID tracked in the page
          setActiveSectionId(null);
        }
        // unobserve IntersectionObserver if the section is only tracked once
        if (trackOnce && intersectObsr) {
          intersectObsr.disconnect();
        }
      },
    });
  }

  function onIntersectionUpdated(intersection: IntersectionInfo) {
    const {
      isIntersecting: curIntersecting,
      sectionTop,
      sectionHeight,
      sectionBoundingRect,
    } = intersection;

    // If Section enters the viewport, start subscribing to the page scrolling observer
    if (!isIntersecting && curIntersecting) {
      subscribeScrolling();
      subscribeResizing();
    }

    // update the intersecting status
    setIsIntersecting(curIntersecting);

    //  update the section position
    setSectionPosition({ sectionTop, sectionHeight, sectionBoundingRect });
  }

  /** updates the section bound when the window resizes */
  function updateSectionBounds() {
    const currentSect = sectionRef.current;
    // only update the resized `<Section>` if it is in the viewport
    if (currentSect) {
      const sectionBoundingRect = currentSect.getBoundingClientRect();
      setSectionPosition({
        sectionBoundingRect,
        sectionTop: sectionBoundingRect.top,
        sectionHeight: sectionBoundingRect.height,
      });
    }
  }

  /** Subscribe to the `resizeObserver` from <Page> */
  function subscribeResizing() {
    resizeSubscriptionRef.current = resizeObsrRef.current.subscribe({
      next: updateSectionBounds,
    });
  }

  return {
    /** Whether the section is intersecting with the viewport */
    isIntersecting,

    /** Information related to the window scrolling and the ratio of the section being scrolled */
    scrollInfo,

    /** The position of the section */
    sectionPosition,
  };
}
