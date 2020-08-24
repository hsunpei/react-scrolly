import { useRef, useCallback } from 'react';
import { Subject } from 'rxjs';

import { ActiveSectionInfo, ActiveSectionTracker, sectionID } from '../../context/PageContext';

type SectionDistance = {
  idx: string;
  distance: number;
} | null;

/**
 * Manage the current active section tracking ID
 * by selecting the section closest to the scroll bottom
 */
export function useActiveSectionTracker(): ActiveSectionTracker {
  /**
   * keep track of the all the sections appeared in the viewport,
   * - Key: `trackingId`
   * - Value: `sectionTop`.
   * @example {
   *  'section-2': 1000,
   * }
   */
  const visibleSections = useRef<{ [key: string]: number }>({});

  /** keep track of the scrollRatios updated by `updateScrollRatio` */
  const sectionScrollRatios = useRef<{ [key: string]: number }>({});

  /** keep track of the `trackingId` of the section closet to the bottom of the viewport */
  const activeSectionId = useRef<sectionID>(null);

  // make a Subject to take all the changes and transform it as a RX Observable
  const activeSectionSubjectRef = useRef(new Subject<ActiveSectionInfo | null>());
  const activeSectionObservableRef = useRef(activeSectionSubjectRef.current.asObservable());

  /**
   * Let Section set the scrolled ratio if it is active
   */
  const updateScrollRatio = useCallback((trackingId: string, scrolledRatio: number) => {
    const activeId = activeSectionId.current;
    if (activeId && activeId === trackingId) {
      // notify all sections subscribing to ActiveSectionInfo
      activeSectionSubjectRef.current.next({
        id: trackingId,
        ratio: scrolledRatio,
      });
    }

    // update the scroll ratios of the sections
    sectionScrollRatios.current[trackingId] = scrolledRatio;
  }, []);

  /**
   * Update the current active section by selecting the section
   * closest to the bottom of the viewport
   */
  const updateActiveSection = useCallback((scrollBottom: number) => {
    const trackedSects = visibleSections.current;

    // find the item closest to the bottom of the viewport
    const closest: SectionDistance = Object.keys(trackedSects).reduce(
      (accum: SectionDistance, idx) => {
        const sectionTop = trackedSects[idx];
        const distance = scrollBottom - sectionTop;

        if (!accum || distance < accum.distance) {
          return { idx, distance };
        }
        return accum;
      },
      null
    );

    if (!closest) {
      // there is no section in the viewport
      activeSectionId.current = null;

      // notify all sections subscribing to ActiveSectionInfo
      activeSectionSubjectRef.current.next(null);
    } else if (activeSectionId.current !== closest.idx) {
      activeSectionId.current = closest.idx;

      // notify there is a new section being added
      activeSectionSubjectRef.current.next({
        id: closest.idx,
        ratio: sectionScrollRatios.current[closest.idx],
      });
    }
  }, []);

  /**
   * Add a section that is in the viewport
   */
  const addActiveSection = useCallback(
    (trackingId: string, sectionTop: number, scrollBottom: number) => {
      visibleSections.current[trackingId] = sectionTop;

      updateActiveSection(scrollBottom);
    },
    [updateActiveSection]
  );

  /**
   * Remove a section from the active sections
   */
  const removeActiveSection = useCallback(
    (trackingId: string, scrollBottom: number) => {
      delete visibleSections.current[trackingId];
      updateActiveSection(scrollBottom);
    },
    [updateActiveSection]
  );

  return {
    addActiveSection,
    removeActiveSection,
    updateScrollRatio,
    activeSectionObs$: activeSectionObservableRef.current,
  };
}
