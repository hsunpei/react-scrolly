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

export interface StickySceneProps extends SectionProps {
  /**
   * Render the non-sticky part of the section,
   * which is placed on top of the children
   */
  renderOverlay: React.ReactNode;
}

export const StickyScene = ({
  className,
  style,
  children,
  trackingId,
  renderOverlay,
  ...restProps
}: StickySceneProps) => {
  const outerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);
  const sectionInfo = useSectionRatio(sectionRef, intersectObsr$, trackingId);

  const stickyStyle: React.CSSProperties = getStickyPosition(sectionInfo);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={outerStyle}
      {...restProps}
    >
      <div style={stickyStyle}>
        {children(sectionInfo)}
      </div>
      <div style={{ position: 'relative' }}>
        {renderOverlay}
      </div>
    </div>
  );
};
