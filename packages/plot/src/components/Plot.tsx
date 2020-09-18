import React, { useRef } from 'react';
import {
  // types
  SectionProps,
  SectionInfo,
  ActiveSectionInfo,
} from '@react-scrolly/core';

import { usePlot } from '../hooks/usePlot';

export type PlotRenderProps = (
  plotInfo: SectionInfo & {
    activeSection: ActiveSectionInfo | null | undefined;
  }
) => React.ReactNode;
export interface PlotProps extends Omit<SectionProps, 'children'> {
  children: PlotRenderProps;
}

export const Plot = ({ className, style, children, trackingId, ...restProps }: PlotProps) => {
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
