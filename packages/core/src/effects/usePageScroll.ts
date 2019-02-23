import { Subscription } from 'rxjs';
import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import { PageContextInterface } from '../context/PageContext';
import { ScrollPosition } from '../page/Page';

import { IntersectionInfo } from './useIntersectionObserver';

export function usePageScroll(
  pageScrollObsr$: PageContextInterface['scrollObserver$'],
  activeSectionId: PageContextInterface['activeSectionId'],
  setActiveSectionId: PageContextInterface['setActiveSectionId'],
) {
  const intersectingRef = useRef<boolean>(false);
  const scrollSubscriptionRef = useRef<Subscription | null>(null);
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
    scrolledRatio: 0,
  });

  useEffect(() => {
    return () => {
      // stop subscribing to the window scrolling events from <Page>
      if (scrollSubscriptionRef.current) {
        scrollSubscriptionRef.current.unsubscribe();
      }
    };
  },        []);

  /** Sets the scroll position information calculated in <Page> to the state */
  const recordPageScroll = (scrollPos: ScrollPosition) => {
    const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;
    const { sectionTop, sectionHeight } = scrollInfo;

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
  };

  /** Subscribe to the `scrollObserver` from <Page> */
  const subscribeScrollPos = () => {
    scrollSubscriptionRef.current = pageScrollObsr$.subscribe({
      next: recordPageScroll,
      complete: () => {
        if (activeSectionId) {
          setActiveSectionId(null);
        }
      },
    });
  };

  const setIntersecting = (intersection: IntersectionInfo) => {
    const preIntersecting = intersectingRef.current;
    const currentIntersecting = intersection.isIntersecting;
    intersectingRef.current = currentIntersecting;

    // If Section enters the viewport, start subscribing to the page scrolling observer
    if (!preIntersecting && currentIntersecting) {
      subscribeScrollPos();
    }
  };

  return {
    setIntersecting,
  };
}
