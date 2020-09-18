import React, { useRef } from 'react';
import {
  // utils
  getStickyPosition,
  // types
  SectionProps,
} from '@react-scrolly/core';

import { usePlot } from '../hooks/usePlot';
import { PlotProps } from './Plot';

export interface StickyPlotProps extends PlotProps {
  /**
   * Render the non-sticky part of the section,
   * which is placed on top of the children
   */
  renderOverlay: React.ReactNode;
}

interface StickyBackgroundProps {
  plotRef: React.RefObject<HTMLDivElement>;
  trackingId?: SectionProps['trackingId'];
  children: PlotProps['children'];
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

export const Overlay = React.memo(({ children }) => {
  return <div style={{ position: 'relative' }}>{children}</div>;
});

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

  return (
    <div ref={plotRef} className={className} style={outerStyle} {...restProps}>
      <StickyBackground plotRef={plotRef} trackingId={trackingId}>
        {children}
      </StickyBackground>
      <Overlay>{renderOverlay}</Overlay>
    </div>
  );
};
