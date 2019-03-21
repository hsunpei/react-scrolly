import React, {
  useEffect,
  useRef,
} from 'react';
import { Observable, Subject } from 'rxjs';
// TODO: add the polyfill of IntersectionObserver

export interface IntersectionInfo {
  /** From IntersectionObserver: whether the `<Section>` is intersecting the root */
  isIntersecting: boolean;

  trackingId?: string;

  /** The bounding rectangle of `<Section>` */
  sectionBoundingRect: ClientRect;
}

export function useIntersectionObservable(
  sectionRef: React.RefObject<HTMLElement>,
  trackingId: IntersectionInfo['trackingId'],
  threshold: number[] | 1 = [0, 1],
): Observable<IntersectionInfo> {
  /**
   * Stores references to the observer listening to section intersection with the viewport
   */
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // transform the intersectionObserver as a RX Observable
  const intersectSubjectRef = useRef(new Subject<IntersectionInfo>());
  const intersectObservableRef = useRef(intersectSubjectRef.current.asObservable());

  /** Use browser's IntersectionObserver to record whether the section is inside the viewport */
  const recordIntersection = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const { isIntersecting, boundingClientRect } = entry;
    const intersecting: IntersectionInfo = {
      isIntersecting,
      trackingId,
      sectionBoundingRect: boundingClientRect,
    };

    intersectSubjectRef.current.next(intersecting);
  };

  useEffect(
    () => {
      // start observing whether the section is scrolled into the viewport
      intersectionObserverRef.current = new IntersectionObserver(recordIntersection, {
        threshold,

        /**  Observe changes in visibility of the section relative to the document's viewport */
        root: null,

        /**
         * Watch only the changes in the intersection between the section and the viewport,
         * without any added or substracted space
         */
        // TODO: make this string changeable
        rootMargin: '0px',
      });

      intersectionObserverRef.current.observe(sectionRef.current!);

      // unsubscribe to the intersection observer on unmounting
      return () => {
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect();
          intersectSubjectRef.current.complete();
        }
      };
    },
    [],
  );

  return intersectObservableRef.current;
}
