import React, { useRef } from 'react';

import { SectionInfo, useSectionRatio } from '../effects/useSectionRatio';

import { SectionProps } from './Section';

export interface StickySectionProps {
  trackingId: SectionProps['trackingId'];
  className?: string;
  style?: React.CSSProperties;
  children: SectionProps['children'];

  /** Only track the section using the IntersectionObserver once */
  trackOnce: boolean;

  /**
   * Render the non-sticky part of the section,
   * which is placed on top of the children
   */
  renderNonSticky: React.ReactNode;
}

const positions: {
  absTop: React.CSSProperties,
  fixed: React.CSSProperties,
  absBottom: React.CSSProperties,
} = {
  absTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  fixed: {
    position: 'fixed',
    top: 0,
  },
  absBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
};

/**
 * Returns the position of the inner div of the StickySection
 */
function getStickyPosition(
  section: SectionInfo,
): React.CSSProperties {
  const {
    scrollInfo,
    sectionTop,
    boundingRect,
  } = section;
  const { scrollTop, scrollBottom } = scrollInfo;
  const sectionBottom = sectionTop + boundingRect.height;

  if (scrollTop < sectionTop) {
    // appears on the top of the page
    return positions.absTop;
  }

  if ((scrollTop >= sectionTop) && (sectionBottom > scrollBottom)) {
    // sticks to the viewport
    return {
      ...positions.fixed,
      left: boundingRect.left,
      width: boundingRect.width,
    };
  }

  // appears on the bottom of the page
  return positions.absBottom;
}

export const StickySection = ({
  className,
  style,
  children,
  trackingId,
  trackOnce = false,
  renderNonSticky,
  ...restProps
}: StickySectionProps) => {
  const outerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const pageScroll = useSectionRatio(sectionRef, trackingId, trackOnce);

  const stickyStyle: React.CSSProperties = {
    ...getStickyPosition(pageScroll),
    height: `${pageScroll.scrollInfo.windowHeight}px`,
  };

  return (
    <div
      ref={sectionRef}
      className={className}
      style={outerStyle}
      {...restProps}
    >
      <div style={stickyStyle}>
        {children(pageScroll)}
      </div>
      <div style={{ position: 'relative' }}>
        {renderNonSticky}
      </div>
    </div>
  );
};
