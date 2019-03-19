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
    (scrollBottom: number) => {
      const trackedSects = activeSections.current;

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
    (trackingId: string, sectionTop: number, scrollBottom: number) => {
      activeSections.current[trackingId] = sectionTop;
      console.log('########!!! ', trackingId, 'scrolledRatio:', sectionTop, activeSections.current)
      updateActiveSection(scrollBottom);
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
    (trackingId: string, scrollBottom: number) => {
      delete activeSections.current[trackingId];
      updateActiveSection(scrollBottom);
    },
    [],
  );

  return {
    activeSectionId,
    addActiveSection,
    removeActiveSection,
  };
}
