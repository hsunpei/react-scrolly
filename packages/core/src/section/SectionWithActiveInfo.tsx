import React, { useRef } from 'react';

import { useIntersectionObservable } from '../hooks/useIntersectionObservable';
import { useSectionRatio } from '../hooks/section/useSectionRatio';
import { useActiveSectionInfo } from '../hooks/section/useActiveSectionInfo';

import { SectionProps } from '../components/Section';

export const SectionWithActiveInfo = ({
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
