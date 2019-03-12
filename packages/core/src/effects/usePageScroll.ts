import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { PageContext, PageContextInterface } from '../context/PageContext';
import { ScrollPosition } from '../page/Page';

import { IntersectionInfo } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';

export interface SectionPosition {
   /** From IntersectionObserver: the top of the `<Section>` + scrollTop */
  sectionTop: number;

   /** From IntersectionObserver: the height of the `<Section>` */
  sectionHeight: number;

   /** The bounding rectangle of `<Section>` */
  sectionBoundingRect: ClientRect;
}

export function usePageScroll(
  intersectObsr$: Observable<IntersectionInfo>,

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
) {
  const [intersectingState, setIntersectingState] = useState<boolean>(false);

  const context = useContext<PageContextInterface | null>(PageContext);
  const { scrollObserver$, setActiveSectionId } = context!;

  const [scrollInfo, setScrollInfo] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
  });

  /** Function to set the subscription to the page scrolling  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);

  /** Observer to the page scrolling when the section is in the viewport */
  const pageScrollObsrRef = useRef(intersectObsr$.pipe(
    switchMap((intersectInfo) => {
      const { isIntersecting } = intersectInfo;
      return isIntersecting
        ? scrollObserver$.pipe(
          map((scrollPos: ScrollPosition) => ({
            isIntersecting,
            scrollPos,
          })),
        )
        // when the section is scrolled out of the viewport, update its dimension
        : of({
          isIntersecting,
          scrollPos: null,
        });
    }),
  ));

  useEffect(
    () => {
      setPageSubscpt(pageScrollObsrRef.current.subscribe({
        // record the page scrolling
        next: ({ isIntersecting, scrollPos }) => {
          console.log('***value',isIntersecting, scrollPos)
          if (isIntersecting && scrollPos) {
            const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;

            // console.log('recordPageScroll', scrollPos, scrollInfo);

            // updates the ratio of the section being scrolled and the scroll positions
            setScrollInfo({
              scrollTop,
              scrollBottom,
              windowHeight,
              scrollOffset,
            });

            setIntersectingState(isIntersecting);
          }

          // TODO: updates the section currently being scrolled
        },
        complete: () => {
          // TODO: change it using finally
          if (trackingId) {
            // TODO: clear the section ID tracked in the page
            setActiveSectionId(null);
          }
        },
      }));
    },
    [],
  );

  // useEffect(
  //   () => {
  //     console.log('**********', intersectingState, scrollInfo);
  //   },
  //   [intersectingState],
  // );

  return {
    scrollInfo,
    isIntersecting: intersectingState,
  };
}
