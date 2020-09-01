import { Observable, of, zip } from 'rxjs';
import { map, switchMap, merge, take, filter } from 'rxjs/operators';
import { useCallback, useContext, useMemo } from 'react';
import { useObservableState } from 'observable-hooks';

import { PageContext, PageContextInterface } from '../../context/PageContext';
import { IntersectionInfo } from './useIntersectionObservable';
import { ScrollPosition } from '../../types/ScrollPosition';

export function usePageScroll(intersectObsr$: Observable<IntersectionInfo>) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { scrollObs$ } = context!;

  const isIntersectingObs = useMemo(
    () => intersectObsr$.pipe(map(({ isIntersecting }) => isIntersecting)),
    [intersectObsr$]
  );
  const isInterSectingFunc = useCallback(() => isIntersectingObs, [isIntersectingObs]);
  const [intersecting] = useObservableState(isInterSectingFunc, false);

  /**
   * Observer to track the scroll position
   * emitted when Page is mounted
   */
  const mountScrollObs = useMemo(
    () =>
      zip(scrollObs$, isIntersectingObs).pipe(
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
      ),
    [isIntersectingObs, scrollObs$]
  );
  /**
   * Observer to track the scroll position
   * when real scrolling events are triggered
   */
  const windowScrollObs = useMemo(
    () =>
      isIntersectingObs.pipe(
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
      ),
    [isIntersectingObs, scrollObs$]
  );

  /** Observer to track the page scrolling by combining mountScrollObs and windowScrollObs */
  const pageScrollObsrFunc = useCallback(
    () =>
      mountScrollObs.pipe(
        merge(windowScrollObs),
        filter(({ isIntersecting, scrollPos }) => isIntersecting && scrollPos !== null),
        map(({ scrollPos }) => {
          return scrollPos!;
        })
      ),
    [mountScrollObs, windowScrollObs]
  );

  const [scrollInfo] = useObservableState<ScrollPosition>(pageScrollObsrFunc, {
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
  });

  return {
    scrollInfo,
    isIntersecting: intersecting,
  };
}
