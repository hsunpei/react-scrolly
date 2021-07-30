import { Observable, of } from 'rxjs';
import { map, filter, switchMap, merge } from 'rxjs/operators';
import React, { useEffect, useContext, useMemo, useCallback } from 'react';
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
        height: 1,
        width: 1,
      },
    }
  );

  useEffect(() => {
    // update the dimension of the section when it's mounted
    if (sectionRef.current) {
      updateSectionPosition({
        ...sectionPosition,
        boundingRect: sectionRef.current.getBoundingClientRect(),
      });
    }
  }, [sectionPosition, sectionRef, updateSectionPosition]);

  return sectionPosition;
}
