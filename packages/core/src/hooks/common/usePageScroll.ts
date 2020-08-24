import { Observable, of, zip } from 'rxjs';
import { map, switchMap, merge, take } from 'rxjs/operators';
import { useState, useEffect, useRef, useContext } from 'react';

import { PageContext, PageContextInterface } from '../../context/PageContext';

import { IntersectionInfo } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';
import { ScrollPosition } from '../../types/ScrollPosition';

export function usePageScroll(intersectObsr$: Observable<IntersectionInfo>) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { scrollObs$ } = context!;

  const [intersecting, setIntersecting] = useState<boolean>(false);

  const [scrollInfo, setScrollInfo] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
  });

  /** Function to set the subscription to the page scrolling  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);
  const isIntersectingObs = useRef(
    intersectObsr$.pipe(map(({ isIntersecting }) => isIntersecting))
  );

  /**
   * Observer to track the scroll position
   * emitted when Page is mounted
   */
  const mountScrollObsRef = useRef(
    zip(scrollObs$, isIntersectingObs.current).pipe(
      map(([scrollPos, isIntersecting]): {
        isIntersecting: boolean;
        scrollPos: ScrollPosition;
      } => ({
        isIntersecting,
        scrollPos: {
          ...scrollPos,
          scrollOffset: 0,
        },
      })),
      take(1)
    )
  );
  /**
   * Observer to track the scroll position
   * when real scrolling events are triggered
   */
  const windowScrollObsRef = useRef(
    isIntersectingObs.current.pipe(
      switchMap((isIntersecting: boolean) => {
        // use `isIntersecting` to determine whether to take the scrolling info
        return isIntersecting
          ? scrollObs$.pipe(
              map((scrollPos: ScrollPosition) => ({
                isIntersecting,
                scrollPos,
              }))
            )
          : // when the section is scrolled out of the viewport, update its dimension
            of({
              isIntersecting,
              scrollPos: null,
            });
      })
    )
  );
  /** Observer to track the page scrolling by combining mountScrollObs and windowScrollObs */
  const pageScrollObsrRef = useRef(
    mountScrollObsRef.current.pipe(merge(windowScrollObsRef.current))
  );

  useEffect(() => {
    // subscribe to the page scrolling
    setPageSubscpt(
      pageScrollObsrRef.current.subscribe({
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
      })
    );
  }, [setPageSubscpt]);

  return {
    scrollInfo,
    isIntersecting: intersecting,
  };
}
