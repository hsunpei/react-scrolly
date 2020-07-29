import React, { useRef } from 'react';
import {
  // types
  SectionProps,
} from '@react-scrolly/core';

import { usePlot } from '../hooks/usePlot';

export const Plot = ({ className, style, children, trackingId, ...restProps }: SectionProps) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const { sectionInfo, activeSection } = usePlot(plotRef, trackingId);

  return (
    <div ref={plotRef} className={className} style={style} {...restProps}>
      {children({
        ...sectionInfo,
        ...activeSection,
      })}
    </div>
  );
};
