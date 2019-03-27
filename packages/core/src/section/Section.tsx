import React, { useRef } from 'react';

import { ScrollPosition } from '../page/Page';
import { SectionInfo, useSectionRatio } from '../hooks/section/useSectionRatio';

export interface SectionState extends ScrollPosition {
  /** From IntersectionObserver: whether the `<Section>` is intersecting the root */
  isIntersecting: boolean;

   /** From IntersectionObserver: the top of the `<Section>` + scrollTop */
  sectionTop: number;

  /** From IntersectionObserver: the height of the `<Section>` */
  sectionHeight: number;

  /** The bounding rectangle of `<Section>` */
  sectionBoundingRect: ClientRect;

  /** Ratio of the Page being scrolled */
  scrolledRatio: number;
}

export interface SectionProps {
  /**
   * By setting an unique Section ID, you can know which section the user is currently viewing.
   * If `trackingId` is not null,
   * `<Section>` will set it to `activeSectionId` of the `<Page>`
   * Please make sure that on the same `scrollTop`,
   * there is **NO** more than one tracked section (section with `trackingId`).
   */
  trackingId?: string;

  /**
   * The array of intersectionRatio thresholds which is used in the options of IntersectionObserver
   * @example [0, 0.25, 0.5, 0.75, 1]
   */
  threshold: number[] | 1;
  className?: string;
  style?: React.CSSProperties;
  children: (section: SectionInfo) => React.ReactNode;
}

export const Section = ({
  className,
  style,
  children,
  trackingId,
  ...restProps
}: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pageScroll = useSectionRatio(sectionRef, trackingId);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={style}
      {...restProps}
    >
      {children(pageScroll)}
    </div>
  );
};
