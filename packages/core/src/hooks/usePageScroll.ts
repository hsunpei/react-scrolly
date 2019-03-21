import { Observable, of } from 'rxjs';
import { map, switchMap, merge } from 'rxjs/operators';
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
) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { scrollObserver$ } = context!;

  const [intersecting, setIntersecting] = useState<boolean>(false);

  const [scrollInfo, setScrollInfo] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
  });

  /** Function to set the subscription to the page scrolling  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);
  const isIntersectingObs = useRef(intersectObsr$.pipe(
    map(({ isIntersecting }) => isIntersecting)
  ));

  /** Observer to the page scrolling when the section is in the viewport */
  const pageScrollObsrRef = useRef(
    // first emit true in order to take the scroll position emitted when Page is mounted
    of(true)
    // merge it with the intersection observer
    .pipe(
      merge(isIntersectingObs.current)
    )
    // use `isIntersecting` to determine whether to take the scrolling info
    .pipe(
      switchMap((isIntersecting: boolean) => {
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
    )
  );

  useEffect(
    () => {
      // subscribe to the page scrolling
      setPageSubscpt(pageScrollObsrRef.current.subscribe({
        // record the page scrolling
        next: ({ isIntersecting, scrollPos }) => {
          if (isIntersecting && scrollPos) {
            const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;

            // updates the ratio of the section being scrolled and the scroll positions
            setScrollInfo({
              scrollTop,
              scrollBottom,
              windowHeight,
              scrollOffset,
            });
          }

          // update the intersecting state
          setIntersecting(isIntersecting);
        },
      }));
    },
    [],
  );

  return {
    scrollInfo,
    isIntersecting: intersecting,
  };
}
