import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

import { sectionID } from '../context/PageContext';

type SectionDistance = {
  idx: string,
  distance: number,
} | null;

/**
 * Manage the current active section tracking ID
 * by selecting the section closest to the scroll bottom
 */
export function useActiveSection() {
  const [activeSectionId, setActiveSectionId] = useState<sectionID>(null);

  const activeSections = useRef({});

  /**
   * Update the current active section by selecting the section
   * closest to the bottom of the viewport
   */
  const updateActiveSection = useCallback(
    () => {
      const trackedSects = activeSections.current;

      // find the item closest to the bottom of the viewport
      const closest: SectionDistance = Object.keys(trackedSects).reduce(
        (accum: SectionDistance, idx) => {
          const distance = trackedSects[idx];
          if (!accum || distance < accum.distance) {
            return { idx, distance };
          }
          return accum;
        },
        null,
      );

      console.log('######## closest', closest)

      if (!closest) {
        setActiveSectionId(null);
      } else {
        setActiveSectionId(closest.idx);
      }
    },
    [],
  );

  /**
   * Add a section that is in the viewport
   */
  const addActiveSection = useCallback(
    (trackingId: string, bottomDistance: number) => {
      activeSections.current[trackingId] = bottomDistance;
      console.log('########!!! ', trackingId, 'scrolledRatio:', bottomDistance, activeSections.current)
      updateActiveSection();
    },
    [],
  );

  useEffect(
    () => {
      console.log('######## activeSectionId', activeSectionId)
    },
  );

  /**
   * Remove a section from the active sections
   */
  const removeActiveSection = useCallback(
    (trackingId: string) => {
      delete activeSections.current[trackingId];
      updateActiveSection();
    },
    [],
  );

  return {
    activeSectionId,
    addActiveSection,
    removeActiveSection,
  };
}
