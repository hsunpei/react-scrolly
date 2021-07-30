import React, { FunctionComponent, useRef, useEffect } from 'react';
import { Subject, fromEvent, animationFrameScheduler, of } from 'rxjs';
import { debounceTime, map, pairwise, merge } from 'rxjs/operators';

import { PageContext, PageContextInterface } from '../context/PageContext';
import { getScrollPosition } from '../utils/getScrollPosition';
import { useActiveSectionTracker } from '../hooks/page/useActiveSectionTracker';
import { ScrollPosition } from '../types/ScrollPosition';

export interface PageProps {
  children: React.ReactNode;

  /**
   * Allows the window resizing event to go through again after the `resizeThrottleTime`
   */
  resizeThrottleTime?: number;
}

export const PageProvider: FunctionComponent<PageProps> = ({
  children,
  resizeThrottleTime = 300,
}) => {
  const { Provider } = PageContext;

  const {
    updateScrollRatio,
    addActiveSection,
    removeActiveSection,
    activeSectionObs$,
  } = useActiveSectionTracker();

  /**
   * Subject to be combined with `scrollSubjectRef`
   * in order to listen to the initial window scroll position on mounted
   */
  const scrollSubjectRef = useRef(new Subject<ScrollPosition>());
  /**
   * Observer to listen to page scroll
   */
  const scrollObserverRef = useRef(
    // detect window object to prevent issues on SSR
    typeof window !== 'undefined'
      ? scrollSubjectRef.current.asObservable().pipe(
          merge(
            fromEvent(window, 'scroll').pipe(
              // throttled by the animation frame
              debounceTime(0, animationFrameScheduler),
              map(() => getScrollPosition()),
              // use pairwise to group pairs of consecutive emissions
              // so that we can calculate `scrollOffset`
              pairwise(),
              map(
                ([previousScroll, currentScroll]): ScrollPosition => {
                  // amount of pixels scrolled by
                  // - postive: scroll down
                  // - negative: scroll up
                  const scrollOffset = currentScroll.scrollTop - previousScroll.scrollTop;

                  return {
                    ...currentScroll,
                    scrollOffset,
                  };
                }
              )
            )
          )
        )
      : of({
          scrollTop: 0,
          scrollBottom: 0,
          windowHeight: 10,
          scrollOffset: 0,
        })
  );

  /**
   * Observer to listen to window resize
   */
  const resizeObserverRef = useRef(
    // detect window object to prevent issues on SSR
    typeof window !== 'undefined'
      ? fromEvent(window, 'resize').pipe(debounceTime(resizeThrottleTime))
      : undefined
  );

  const context: PageContextInterface = {
    addActiveSection,
    removeActiveSection,
    updateScrollRatio,
    activeSectionObs$,
    scrollObs$: scrollObserverRef.current,
    resizeObs$: resizeObserverRef.current,
  };

  useEffect(() => {
    const initialScroll = {
      ...getScrollPosition(),
      scrollOffset: 0,
    };

    const scrollSubject = scrollSubjectRef.current;
    // send the initial window scrolling position on mounted
    scrollSubject.next(initialScroll);

    return () => {
      // complete the scrolling subject
      scrollSubject.complete();
    };
  }, []);

  return <Provider value={context}>{children}</Provider>;
};
