import React, { useRef } from 'react';
import {
  // hooks
  useIntersectionObservable,
  useSectionRatio,
  // utils
  getStickyPosition,
  // types
  SectionProps,
 } from '@react-scrolly/core';

import { useActiveSectionInfo } from '../hooks/useActiveSectionInfo';

export interface StickyPlotProps extends SectionProps {
  /**
   * Render the non-sticky part of the section,
   * which is placed on top of the children
   */
  renderOverlay: React.ReactNode;
}

export const StickyPlot = ({
  className,
  style,
  children,
  trackingId,
  renderOverlay,
  ...restProps
}: StickyPlotProps) => {
  const outerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);
  const sectionInfo = useSectionRatio(sectionRef, intersectObsr$, trackingId);
  const activeSection = useActiveSectionInfo(intersectObsr$);

  const stickyStyle: React.CSSProperties = getStickyPosition(sectionInfo);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={outerStyle}
      {...restProps}
    >
      <div style={stickyStyle}>
        {children({
          ...sectionInfo,
          ...activeSection,
        })}
      </div>
      <div style={{ position: 'relative' }}>
        {renderOverlay}
      </div>
    </div>
  );
};
