import * as React from 'react';

import { Section, SectionProps } from './Section';

export interface StickySectionProps {
  name: string;
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
  },
  fixed: {
    position: 'fixed',
    top: 0,
  },
  absBottom: {
    position: 'absolute',
    bottom: 0,
  },
};

/**
 * Returns the position of the inner div of the StickySection
 * @param scrollTop - scrollTop of the window
 * @param scrollBottom - window height + scrollTop
 * @param sectionTop - the top of the Section + scrollTop
 * @param sectionBottom - sectionTop + sectionHeight
 */
function getStickyPosition(
  scrollTop: number,
  scrollBottom: number,
  sectionTop: number,
  sectionBottom: number,
): React.CSSProperties {
  if (scrollTop < sectionTop) {
    // appears on the top of the page
    return positions.absTop;
  }

  if ((scrollTop >= sectionTop) && (sectionBottom > scrollBottom)) {
    // sticks to the viewport
    return positions.fixed;
  }

  // appears on the bottom of the page
  return positions.absBottom;
}

export const StickySection: React.SFC<StickySectionProps> = ({
  name,
  className,
  style,
  children,
  renderNonSticky,
}) => {
  const outerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
    boxSizing: 'border-box',
  };

  return (
    <Section name={name} className={className} style={outerStyle}>
      {(section) => {
        const {
          scrollTop,
          scrollBottom,
          sectionTop,
          sectionHeight,
          windowHeight,
        } = section;
        const stickyStyle: React.CSSProperties = {
          ...getStickyPosition(scrollTop, scrollBottom, sectionTop, (sectionTop + sectionHeight)),
          left: 0,
          width: '100%',
          height: `${windowHeight}px`,
          boxSizing: 'border-box',
          transition: 'all 0.25s ease',
        };

        return (
          <>
            <div style={stickyStyle}>
              {children(section)}
            </div>
            {renderNonSticky}
          </>
        );
      }}
    </Section>
  );
};
