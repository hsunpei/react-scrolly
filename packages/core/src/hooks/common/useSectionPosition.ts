import { Observable, of } from 'rxjs';
import { map, filter, switchMap, merge } from 'rxjs/operators';
import React, { useContext, useMemo, useCallback, useLayoutEffect } from 'react';
import { useObservableState } from 'observable-hooks';

import { PageContext, PageContextInterface } from '../../context/PageContext';

import { IntersectionInfo } from './useIntersectionObservable';

export interface SectionPosition {
  /** From IntersectionObserver: the top of the `<Section>` + scrollTop */
  sectionTop: number;

  /** The bounding rectangle of `<Section>` */
  boundingRect: ClientRect;
}

export function useSectionPosition(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,
  intersectObsr$: Observable<IntersectionInfo>
): SectionPosition {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { resizeObs$ } = context!;

  /** Observer to the window resizing events */
  const combinedResizeObs = useMemo(
    () =>
      resizeObs$
        ? intersectObsr$.pipe(
            switchMap((intersectInfo) => {
              const { isIntersecting, sectionBoundingRect } = intersectInfo;
              return isIntersecting
                ? // return the bounding rect from `intersectObsr$` when it appears in the viewport
                  of(sectionBoundingRect)
                    // merge it with the intersection observer
                    .pipe(
                      merge(
                        resizeObs$.pipe(
                          map(() => {
                            const currentSect = sectionRef.current;
                            if (currentSect) {
                              const rect = currentSect.getBoundingClientRect();
                              return rect;
                            }
                            return undefined;
                          })
                        )
                      )
                    )
                : // when the section is scrolled out of the viewport
                  of(undefined);
            })
          )
        : // resizeObs$ does not exist on SSR
          of(undefined),
    [intersectObsr$, resizeObs$, sectionRef]
  );

  /**
   * Observable for the absolute position of the section
   */
  const sectionSizeObsFunc = useCallback(
    () =>
      combinedResizeObs.pipe(
        filter((boundingClientRect) => typeof boundingClientRect !== 'undefined'),
        map((boundingClientRect) => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const { top } = boundingClientRect!;
          return {
            sectionTop: top + scrollTop,
            boundingRect: boundingClientRect as ClientRect,
          };
        })
      ),
    [combinedResizeObs]
  );

  const [sectionPosition, updateSectionPosition] = useObservableState<SectionPosition>(
    sectionSizeObsFunc,
    {
      sectionTop: 0,
      boundingRect: {
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        // TODO: think of a way to deal with the case that sectionPosition
        // cannot be correctly updated occasionally in <StickyScene>
        // see also `getStickyPosition()`: width < 0
        height: -1,
        width: -1,
      },
    }
  );

  useLayoutEffect(() => {
    // update the dimension of the section when it's mounted
    // TODO: remove this
    if (!sectionRef.current) {
      console.log('-> react-scrolly cannot get sectionRef:', sectionRef);
    }

    console.log('getBoundingClientRect', sectionRef.current!.getBoundingClientRect());

    if (sectionRef.current) {
      updateSectionPosition({
        ...sectionPosition,
        boundingRect: sectionRef.current.getBoundingClientRect(),
      });
    }
  }, [sectionPosition, sectionRef, updateSectionPosition]);

  return sectionPosition;
}
