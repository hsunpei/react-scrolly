import { Observable, of } from 'rxjs';
import {
  map,
  filter,
  switchMap,
 } from 'rxjs/operators';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { PageContext, PageContextInterface } from '../context/PageContext';

import { IntersectionInfo } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';

export function useSectionPosition(
  /** Ref of the section being tracked */
  sectionRef: React.RefObject<HTMLElement>,
  intersectObsr$: Observable<IntersectionInfo>,
) {

  const context = useContext<PageContextInterface | null>(PageContext);
  const { resizeObserver$ } = context!;

  const [sectionPosition, setSectionPosition] = useState<ClientRect>({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: 1,
    width: 1,
  });

  /** Function to set the subscription to the page resizing  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);

  /** Observer to the window resizing events */
  const combinedResizeObsRef = useRef(intersectObsr$.pipe(
    switchMap((intersectInfo) => {
      const { isIntersecting, sectionBoundingRect } = intersectInfo;
      return isIntersecting
        ? resizeObserver$.pipe(
          map(() => {
            const currentSect = sectionRef.current;
            if (currentSect) {
              const rect = currentSect.getBoundingClientRect();
              return rect;
            }
            return undefined;
          }),
          filter(rect => typeof rect !== 'undefined'),
        )
        // when the section is scrolled out of the viewport, update its dimension
        : of(sectionBoundingRect);
    }),
  ));

  useEffect(
    () => {
      // update the dimension of the section when it's mounted
      if (sectionRef.current) {
        setSectionPosition(sectionRef.current.getBoundingClientRect());
      }

      // set the subscription to the page resizing events and intersection events
      setPageSubscpt(combinedResizeObsRef.current.subscribe({
        next: (sectionBoundingRect) => {
          setSectionPosition(sectionBoundingRect!);
        },
      }));
    },
    [],
  );

  return sectionPosition;
}
