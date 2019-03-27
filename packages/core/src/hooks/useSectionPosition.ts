import { Observable, of } from 'rxjs';
import {
  map,
  filter,
  switchMap,
  merge,
 } from 'rxjs/operators';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';

import { PageContext, PageContextInterface } from '../context/PageContext';

import { IntersectionInfo } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';

export interface SectionPosition {
  /** From IntersectionObserver: the top of the `<Section>` + scrollTop */
  sectionTop: number;

  /** The bounding rectangle of `<Section>` */
  boundingRect: ClientRect;
}

export function useSectionPosition(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,
  intersectObsr$: Observable<IntersectionInfo>,
): SectionPosition {

  const context = useContext<PageContextInterface | null>(PageContext);
  const { resizeObs$ } = context!;

  const [sectionPosition, setSectionPosition] = useState<SectionPosition>({
    sectionTop: 0,
    boundingRect: {
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      height: 1,
      width: 1,
    },
  });

  /** Function to set the subscription to the page resizing  */
  const { setSubscription } = useSubscription(null);

  /** Observer to the window resizing events */
  const combinedResizeObsRef = useRef(intersectObsr$.pipe(
    switchMap((intersectInfo) => {
      const { isIntersecting, sectionBoundingRect } = intersectInfo;
      return isIntersecting
        ? (
          // return the bounding rect from `intersectObsr$` when it appears in the viewport
          of(sectionBoundingRect)
          // merge it with the intersection observer
          .pipe(
            merge(resizeObs$.pipe(
              map(() => {
                const currentSect = sectionRef.current;
                if (currentSect) {
                  const rect = currentSect.getBoundingClientRect();
                  return rect;
                }
                return undefined;
              }),
            ))
          )
        )
        // when the section is scrolled out of the viewport
        : of(undefined);
    }),
    filter(rect => typeof rect !== 'undefined'),
  ));

  /**
   * Update the absolute position of the section
   */
  const updateSectionPosition = useCallback(
    (boundingClientRect) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const { top } = boundingClientRect;

      setSectionPosition({
        sectionTop: top + scrollTop,
        boundingRect: boundingClientRect,
      });
    },
    [],
  );

  useEffect(
    () => {
      // update the dimension of the section when it's mounted
      if (sectionRef.current) {
        updateSectionPosition(sectionRef.current.getBoundingClientRect());
      }

      // set the subscription to the page resizing events and intersection events
      setSubscription(combinedResizeObsRef.current.subscribe({
        next: (sectionBoundingRect) => {
          updateSectionPosition(sectionBoundingRect!);
        },
      }));
    },
    [],
  );

  return sectionPosition;
}
