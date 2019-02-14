import React from 'react';

import { Section, SectionState, SectionProps } from './Section';

export interface StickySectionProps {
  trackingId: SectionProps['trackingId'];
  className?: string;
  style?: React.CSSProperties;
  children: SectionProps['children'];

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
  section: SectionState,
): React.CSSProperties {
  const {
    scrollTop,
    scrollBottom,
    sectionTop,
    sectionHeight,
    sectionBoundingRect,
  } = section;
  const sectionBottom = sectionTop + sectionHeight;

  if (scrollTop < sectionTop) {
    // appears on the top of the page
    return positions.absTop;
  }

  if ((scrollTop >= sectionTop) && (sectionBottom > scrollBottom)) {
    // sticks to the viewport
    return {
      ...positions.fixed,
      left: sectionBoundingRect.left,
      width: sectionBoundingRect.width,
    };
  }

  // appears on the bottom of the page
  return positions.absBottom;
}

export const StickySection: React.SFC<StickySectionProps> = ({
  trackingId,
  className,
  style,
  children,
  renderNonSticky,
}) => {
  const outerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
  };

  return (
    <Section
      trackingId={trackingId}
      className={className}
      style={outerStyle}
    >
      {(section) => {
        const stickyStyle: React.CSSProperties = {
          ...getStickyPosition(section),
          height: `${section.windowHeight}px`,
        };

        return (
          <>
            <div style={stickyStyle}>
              {children(section)}
            </div>
            <div style={{ position: 'relative' }}>
              {renderNonSticky}
            </div>
          </>
        );
      }}
    </Section>
  );
};
