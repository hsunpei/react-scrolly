import React, { FunctionComponent, useRef, useEffect } from 'react';
import { Subject, fromEvent, animationFrameScheduler } from 'rxjs';
import { debounceTime, map, pairwise, merge } from 'rxjs/operators';

import { PageContext, PageContextInterface } from '../context/PageContext';
import { getScrollPosition } from '../utils/getScrollPosition';
import { useActiveSection } from '../effects/useActiveSection';

export interface ScrollPosition {
  /** The pageYOffset of the window obtained in <Page>  */
  scrollTop: number;

  /** The pageYOffset + height of the window obtained in <Page> */
  scrollBottom: number;

  /** The height of the window obtained in <Page> */
  windowHeight: number;

  /**
   * The difference between the current scrolltop and previous scrolltop obtained in <Page>.
   * Positive: if the user scroll down the page.
   */
  scrollOffset: number;
}

export interface PageProps {
  children: React.ReactNode;

  /**
   * Allows the window resizing event to go through again after the `resizeThrottleTime`
   */
  resizeThrottleTime: number;
}

export const Page: FunctionComponent<PageProps> = ({
  children,
  resizeThrottleTime = 300,
}) => {
  // TODO: change it with dispatch
  const { activeSectionId, addActiveSection, removeActiveSection } = useActiveSection();

  /**
   * Subject to be combined with `scrollSubjectRef`
   * in order to listen to the initial window scroll position on mounted
   */
  const scrollSubjectRef = useRef(new Subject<ScrollPosition>());
  /**
   * Observer to listen to page scroll
   */
  const scrollObserverRef = useRef(
    scrollSubjectRef.current.asObservable().pipe(
      merge(
        fromEvent(window, 'scroll')
          .pipe(
            // throttled by the animation frame
            debounceTime(0, animationFrameScheduler),
            map(() => getScrollPosition()),
            // use pairwise to group pairs of consecutive emissions
            // so that we can calculate `scrollOffset`
            pairwise(),
            map(([previousScroll, currentScroll]): ScrollPosition => {
              // amount of pixels scrolled by
              // - postive: scroll down
              // - negative: scroll up
              const scrollOffset = currentScroll.scrollTop - previousScroll.scrollTop;

              return {
                ...currentScroll,
                scrollOffset,
              };
            }),
        ),
      )
    )
  );

  /**
   * Observer to listen to window resize
   */
  const resizeObserverRef = useRef(
    fromEvent(window, 'resize')
    .pipe(
      debounceTime(resizeThrottleTime),
    ),
  );

  const { Provider } = PageContext;
  const context: PageContextInterface = {
    activeSectionId,
    addActiveSection,
    removeActiveSection,
    scrollObserver$: scrollObserverRef.current,
    resizeObserver$: resizeObserverRef.current,
  };

  useEffect(
    () => {
      const initialScroll = {
        ...getScrollPosition(),
        scrollOffset: 0,
      };

      // send the initial window scrolling position on mounted
      scrollSubjectRef.current.next(initialScroll);

      return () => {
        // complete the scrolling subject
        scrollSubjectRef.current.complete();
      };
    },
    [],
  );

  return (
    <Provider
      value={context}
    >
      {children}
    </Provider>
  );
};
