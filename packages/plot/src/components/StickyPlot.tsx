import React, { useRef } from 'react';
import {
  // utils
  getStickyPosition,
  // types
  SectionProps,
} from '@react-scrolly/core';

import { usePlot } from '../hooks/usePlot';

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

  const plotRef = useRef<HTMLDivElement>(null);
  const { sectionInfo, activeSection } = usePlot(plotRef, trackingId);

  const stickyStyle: React.CSSProperties = getStickyPosition(sectionInfo);

  return (
    <div ref={plotRef} className={className} style={outerStyle} {...restProps}>
      <div style={stickyStyle}>
        {children({
          ...sectionInfo,
          ...activeSection,
        })}
      </div>
      <div style={{ position: 'relative' }}>{renderOverlay}</div>
    </div>
  );
};
