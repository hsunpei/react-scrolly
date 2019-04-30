import React, { useRef } from 'react';
import {
  // hooks
  useIntersectionObservable,
  useSectionRatio,
  // types
  SectionProps,
 } from '@react-scrolly/core';

import { useActiveSectionInfo } from '../hooks/useActiveSectionInfo';

export const Plot = ({
  className,
  style,
  children,
  trackingId,
  ...restProps
}: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const intersectObsr$ = useIntersectionObservable(sectionRef, trackingId);
  const sectionInfo = useSectionRatio(sectionRef, intersectObsr$, trackingId);
  const activeSection = useActiveSectionInfo(intersectObsr$);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={style}
      {...restProps}
    >
      {children({
        ...sectionInfo,
        ...activeSection,
      })}
    </div>
  );
};
