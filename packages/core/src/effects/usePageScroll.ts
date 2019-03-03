import { map, pairwise, takeWhile, combineLatest } from 'rxjs/operators';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';

import { PageContext, PageContextInterface } from '../context/PageContext';
import { ScrollPosition } from '../page/Page';

import { useIntersectionObservable } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';

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

export function usePageScroll(
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
  const [intersectingState, setIntersectingState] = useState<boolean>(false);

  const context = useContext<PageContextInterface | null>(PageContext);
  const { scrollObserver$, setActiveSectionId } = context!;

  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
    scrolledRatio: 0,
  });

  const [sectionPosition, setSectionPosition] = useState<ClientRect>({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: 1,
    width: 1,
  });

  /** Function to set the subscription to the IntersectionObservable  */
  const { setSubscription: setIntersectSubscpt } = useSubscription(null);

  /** Function to set the subscription to the page scrolling  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);

  // convert the intersecting state as [preIntersecting, currentIntersecting]
  const intersectObsr$ = useIntersectionObservable(sectionRef);
  const intersectingRef = useRef(intersectObsr$.pipe(
    map(({ isIntersecting }) => isIntersecting),
  ));
  const intersectingPairRef = useRef(intersectingRef.current.pipe(pairwise()));

  /** Observer to the page scrolling when the section is in the viewport */
  const pageScrollObsrRef = useRef(intersectingRef.current.pipe(
    combineLatest(scrollObserver$),
    // take the page scrolling only when the section is in viewport
    takeWhile(latest => latest[0]),
    // emit the information related to the scrolling position
    map(latest => latest[1]),
  ));

  /** Function to subscribe to the page scrolling */
  const subscribeScrolling = useCallback(
    () => {
      setPageSubscpt(pageScrollObsrRef.current.subscribe({
        // record the page scrolling
        next: (scrollPos: ScrollPosition) => {
          const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;
          const { top, height } = sectionPosition;
          const sectionTop = top + scrollTop;

          let scrolledRatio = (scrollBottom - sectionTop) / height;

          if (scrolledRatio > 1) {
            scrolledRatio = 1;
          } else if (scrolledRatio < 0) {
            scrolledRatio = 0;
          }

          console.log('recordPageScroll', scrollPos, scrollInfo);

          // updates the ratio of the section being scrolled and the scroll positions
          setScrollInfo({
            scrollTop,
            scrollBottom,
            windowHeight,
            scrollOffset,
            scrolledRatio,
          });

          // TODO: updates the section currently being scrolled
        },
        complete: () => {
          if (trackingId) {
            // TODO: clear the section ID tracked in the page
            setActiveSectionId(null);
          }
        },
      }));
    },
    [],
  );

  useEffect(
    () => {
    // TODO: subscribe page scrolling here instead
    // 1. change useIntersectionObserver as state passing
    // 2. move onIntersectionUpdated here
    // TODO: try to use repeat of RX instead
      setIntersectSubscpt(intersectingPairRef.current.subscribe(
        ([preIntersecting, curIntersecting]) => {
          setIntersectingState(curIntersecting);
          // If Section enters the viewport, start subscribing to the page scrolling observer
          if (!preIntersecting && curIntersecting) {
            subscribeScrolling();
          }
        },
      ));
    },
    [],
  );

  useEffect(
    () => {
      console.log('**********', intersectingState, scrollInfo);
    },
    [intersectingState],
  );

  return {
    scrollInfo,
    sectionPosition,
    isIntersecting: intersectingState,
  };
}
