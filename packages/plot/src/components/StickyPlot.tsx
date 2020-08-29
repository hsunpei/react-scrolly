import React, { useRef, useMemo } from 'react';
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

interface StickyBackgroundProps {
  plotRef: React.RefObject<HTMLDivElement>;
  trackingId?: SectionProps['trackingId'];
  children: SectionProps['children'];
}

export const StickyBackground = React.memo(
  ({ plotRef, trackingId, children }: StickyBackgroundProps) => {
    const { sectionInfo, activeSection } = usePlot(plotRef, trackingId);
    const stickyStyle: React.CSSProperties = getStickyPosition(sectionInfo);

    return (
      <div style={stickyStyle}>
        {children({
          ...sectionInfo,
          ...activeSection,
        })}
      </div>
    );
  }
);

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
  const overlay = useMemo(() => {
    return <div style={{ position: 'relative' }}>{renderOverlay}</div>;
  }, [renderOverlay]);

  return (
    <div ref={plotRef} className={className} style={outerStyle} {...restProps}>
      <StickyBackground plotRef={plotRef} trackingId={trackingId}>
        {children}
      </StickyBackground>
      {overlay}
    </div>
  );
};
