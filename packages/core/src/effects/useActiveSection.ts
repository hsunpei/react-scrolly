import {
  useState,
  useRef,
  useCallback,
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
          const distance = sectionTop - scrollBottom;
          if (!accum
            || (distance > 0 && distance < accum.distance)
          ) {
            return { idx, distance };
          }
          return accum;
        },
        null,
      );

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
    (trackingId: string, scrollBottom: number, sectionTop: number) => {
      activeSections.current[trackingId] = sectionTop;
      updateActiveSection(scrollBottom);
    },
    [],
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
