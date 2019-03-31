import React, { useRef } from 'react';

import { useIntersectionObservable } from '../hooks/useIntersectionObservable';
import { useSectionRatio } from '../hooks/section/useSectionRatio';
import { getStickyPosition } from '../utils/getStickyPosition';

import { SectionProps } from '../components/Section';

export interface StickySectionProps extends SectionProps {
  /**
   * Render the non-sticky part of the section,
   * which is placed on top of the children
   */
  renderNonSticky: React.ReactNode;
}

export const StickySection = ({
  className,
  style,
  children,
  trackingId,
  renderNonSticky,
  ...restProps
}: StickySectionProps) => {
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
        {renderNonSticky}
      </div>
    </div>
  );
};
