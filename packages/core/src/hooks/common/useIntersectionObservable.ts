import React, { useEffect, useRef, useCallback } from 'react';
import { Observable, Subject } from 'rxjs';

import {
  getIntersectionObserver,
  IntersectionObserverConfig,
} from '../../utils/getIntersectionObserver';

export interface IntersectionInfo {
  /** From IntersectionObserver: whether the `<Section>` is intersecting the root */
  isIntersecting: boolean;

  /** Tracking ID of the section  */
  trackingId?: string;

  /** The bounding rectangle of `<Section>` */
  sectionBoundingRect: ClientRect;
}

export function useIntersectionObservable(
  /** Ref which is binded to the section */
  sectionRef: React.RefObject<HTMLElement>,

  /** Provide the ID if the section is going to be tracked on the page */
  trackingId: IntersectionInfo['trackingId'],

  /** Margin and threshold configurations for IntersectionObserver */
  intersectionConfig?: IntersectionObserverConfig
): Observable<IntersectionInfo> {
  /**
   * Stores references to the observer listening to section intersection with the viewport
   */
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // transform the intersectionObserver as a RX Observable
  const intersectSubjectRef = useRef(new Subject<IntersectionInfo>());
  const intersectObservableRef = useRef(intersectSubjectRef.current.asObservable());

  /** Use browser's IntersectionObserver to record whether the section is inside the viewport */
  const recordIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const { isIntersecting, boundingClientRect } = entry;
      const intersecting: IntersectionInfo = {
        isIntersecting,
        trackingId,
        sectionBoundingRect: boundingClientRect,
      };

      intersectSubjectRef.current.next(intersecting);
    },
    [trackingId]
  );

  useEffect(() => {
    // check if it's not on SSR
    if (window && IntersectionObserver) {
      // start observing whether the section is scrolled into the viewport
      intersectionObserverRef.current = getIntersectionObserver(
        recordIntersection,
        intersectionConfig
      );

      intersectionObserverRef.current.observe(sectionRef.current!);
    }

    const intersectSubject = intersectSubjectRef.current;

    // unsubscribe to the intersection observer on unmounting
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectSubject.complete();
      }
    };
  }, [intersectionConfig, recordIntersection, sectionRef]);

  return intersectObservableRef.current;
}
