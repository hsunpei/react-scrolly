import { useIntersectionObservable, useScrolledRatio } from '@react-scrolly/core';

import { useActiveSectionInfo } from './useActiveSectionInfo';

export function usePlot(
  /** Ref of the plot being tracked */
  plotRef: React.RefObject<HTMLElement>,

  /**
   * By setting an unique Section ID, you can know which section the user is currently viewing.
   * If `trackingId` is not null,
   * it will trigger the update of the active section infomation managed in `<Page>`.
   * Please make sure that on the same `scrollTop`,
   * there is **NO** more than one tracked section (section with `trackingId`).
   */
  trackingId?: string
) {
  const intersectObsr$ = useIntersectionObservable(plotRef, trackingId);
  const sectionInfo = useScrolledRatio(plotRef, intersectObsr$, trackingId);
  const activeSection = useActiveSectionInfo(intersectObsr$);

  return {
    sectionInfo,
    ...activeSection,
  };
}
