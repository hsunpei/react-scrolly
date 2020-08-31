import { Observable, of } from 'rxjs';
import { map, switchMap, merge, filter } from 'rxjs/operators';
import { useRef, useContext, useMemo } from 'react';
import { useObservableState } from 'observable-hooks';
import {
  // context
  PageContext,
  // types
  IntersectionInfo,
  ActiveSectionInfo,
  PageContextInterface,
} from '@react-scrolly/core';

const getActiveSectionObsrFunc = (
  isIntersectingObs$: Observable<boolean>,
  activeSectionObs$: Observable<ActiveSectionInfo | null>
) => () => {
  /**
   * Observer to the changes in the scrolledRatio of the active section
   * when the section is in the viewport
   */
  return (
    // first emit true in order to take the active section info when Page is mounted
    of(true)
      // merge it with the intersection observer
      .pipe(merge(isIntersectingObs$))
      // use `isIntersecting` to determine whether to take the active section info
      .pipe(
        switchMap((isIntersecting: boolean) => {
          return isIntersecting
            ? activeSectionObs$.pipe(
                map((activeSectionInfo) => {
                  return activeSectionInfo;
                })
              )
            : of(undefined);
        }),
        filter((info) => typeof info !== 'undefined')
      )
  );
};

export function useActiveSectionInfo(intersectObsr$: Observable<IntersectionInfo>) {
  const context = useContext<PageContextInterface | null>(PageContext);
  const { activeSectionObs$ } = context!;

  const isIntersectingObs = useRef(
    intersectObsr$.pipe(map(({ isIntersecting }) => isIntersecting))
  );

  const activeSectionFunc = useMemo(() => {
    return getActiveSectionObsrFunc(isIntersectingObs.current, activeSectionObs$);
  }, [activeSectionObs$]);

  const [activeSection] = useObservableState(activeSectionFunc, null);

  return {
    activeSection,
  };
}
