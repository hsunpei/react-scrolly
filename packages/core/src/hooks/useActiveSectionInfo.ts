import { Observable, of } from 'rxjs';
import { map, switchMap, merge, filter } from 'rxjs/operators';
import {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { ActiveSectionInfo, PageContext, PageContextInterface } from '../context/PageContext';

import { IntersectionInfo } from './useIntersectionObservable';
import { useSubscription } from './useSubscription';

export function useActiveSectionInfo(
  intersectObsr$: Observable<IntersectionInfo>,
) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { activeSectionObs$ } = context!;

  /** Function to set the subscription to the info of the active section  */
  const { setSubscription } = useSubscription(null);

  const [activeSection, setActiveSection] = useState<ActiveSectionInfo | null>(null);

  const isIntersectingObs = useRef(intersectObsr$.pipe(
    map(({ isIntersecting }) => isIntersecting)
  ));

  /**
   * Observer to the changes in the scrolledRatio of the active section
   * when the section is in the viewport
   */
  const activeSectionObsrRef = useRef(
    // first emit true in order to take the active section info when Page is mounted
    of(true)
    // merge it with the intersection observer
    .pipe(
      merge(isIntersectingObs.current)
    )
    // use `isIntersecting` to determine whether to take the active section info
    .pipe(
      switchMap((isIntersecting: boolean) => {
        return isIntersecting
          ? activeSectionObs$
          // when the section is scrolled out of the viewport, update its dimension
          : of(undefined);
      }),
      filter(info => typeof info !== 'undefined'),
    )
  );

  useEffect(
    () => {
      // set the subscription to the info of the active section
      setSubscription(activeSectionObsrRef.current.subscribe({
        next: (activeSectionInfo) => {
          setActiveSection(activeSectionInfo!);
        },
      }));
    },
    [],
  );

  return {
    activeSection,
  };
}
