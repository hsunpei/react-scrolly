import { Observable } from 'rxjs';
import { map, filter, pairwise, takeWhile, combineLatest } from 'rxjs/operators';
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

  /** Function to set the subscription to the IntersectionObservable  */
  const { setSubscription: setIntersectSubscpt } = useSubscription(null);

  /** Function to set the subscription to the IntersectionObservable  */
  const { setSubscription: setSectionSubscrpt } = useSubscription(null);

  /** Function to set the subscription to the page scrolling  */
  const { setSubscription: setPageSubscpt } = useSubscription(null);

  // convert the intersecting state as [preIntersecting, currentIntersecting]
  const intersectingRef = useRef(intersectObsr$.pipe(
    map(({ isIntersecting }) => isIntersecting),
  ));
  const intersectingPairRef = useRef(intersectingRef.current.pipe(pairwise()));

  /** Observer to the window resizing events */
  // TODO: simplify it: using map (IntersectionObserver) + merge
  const resizeObsrRef = useRef(intersectingRef.current.pipe(
    // take the page scrolling only when the section is in viewport
    takeWhile(isIntersecting => isIntersecting),
    combineLatest(resizeObserver$.pipe(
      map(() => {
        const currentSect = sectionRef.current;
        if (currentSect) {
          const sectionBoundingRect = currentSect.getBoundingClientRect();
          return sectionBoundingRect;
        }
        return undefined;
      }),
      filter(rect => typeof rect !== 'undefined'),
    )),
    map(latest => latest[1]),
  ));

  /** updates the section bound when the window resizes */
  const updateSectionBounds = useCallback(
    () => {
      setPageSubscpt(resizeObsrRef.current.subscribe({
        next: (sectionBoundingRect) => {
          setSectionPosition(sectionBoundingRect!);
        },
      }));
    },
    [],
  );

  useEffect(
    () => {
      setIntersectSubscpt(intersectingPairRef.current.subscribe(
        ([preIntersecting, curIntersecting]) => {
          // If Section enters the viewport, start subscribing to the window resizing observer
          if (!preIntersecting && curIntersecting) {
            updateSectionBounds();
          }
        },
      ));

      // update the section bounds provided by IntersectionObserver
      setSectionSubscrpt(intersectObsr$.pipe(
        map(({ sectionBoundingRect }) => (
          setSectionPosition(sectionBoundingRect)
        )),
      ));
    },
    [],
  );

  useEffect(
    () => {
      console.log('^^^^^^^^^', sectionPosition);
    },
    [sectionPosition],
  );

  return sectionPosition;
}
