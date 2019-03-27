import React, { useRef } from 'react';

import { useIntersectionObservable } from '../hooks/useIntersectionObservable';
import { useSectionRatio } from '../hooks/section/useSectionRatio';
import { useActiveSectionInfo } from '../hooks/section/useActiveSectionInfo';
import { getStickyPosition } from '../utils/getStickyPosition';

import { StickySectionProps } from './StickySection';

export const StickySectionWithActiveInfo = ({
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
        {renderNonSticky}
      </div>
    </div>
  );
};
