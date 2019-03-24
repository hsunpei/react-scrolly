import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';

import {
  getIntersectionObserver,
  IntersectionObserverConfig,
} from '../utils/getIntersectionObserver';

export function useIntersectingDetection(
  /** Ref which is binded to the container */
  containerRef: React.RefObject<HTMLElement>,

  /** If true, the container will not be tracked again once it is visible in the viewport */
  trackOnce: boolean = false,

  /** Margin and threshold configurations for IntersectionObserver */
  intersectionConfig?: IntersectionObserverConfig,
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const preIntersecting = useRef(false);

  /**
   * Stores references to the observer listening to section intersection with the viewport
   */
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  const disconnectIntersection = useCallback(
    () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    },
    []
  );

  /** Use browser's IntersectionObserver to record whether the container is inside the viewport */
  const recordIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const { isIntersecting: curIntersecting } = entry;
      setIsIntersecting(curIntersecting);

      if (trackOnce &&
        (!preIntersecting.current && curIntersecting)
      ) {
        disconnectIntersection();
      }

      preIntersecting.current = curIntersecting;
    },
    []
  );

  useEffect(
    () => {
      // start observing whether the container is scrolled into the viewport
      intersectionObserverRef.current = getIntersectionObserver(
        recordIntersection,
        intersectionConfig
      );

      intersectionObserverRef.current.observe(containerRef.current!);

      // unsubscribe to the intersection observer on unmounting
      return () => {
        disconnectIntersection();
      };
    },
    []
  );

  return isIntersecting;
}
