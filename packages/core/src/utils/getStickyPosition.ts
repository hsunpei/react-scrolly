import { SectionInfo } from '../hooks/section/useScrolledRatio';

const STICKY_POS: {
  absTop: React.CSSProperties;
  fixed: React.CSSProperties;
  absBottom: React.CSSProperties;
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
export function getStickyPosition(section: SectionInfo): React.CSSProperties {
  const { scrollInfo, sectionTop, boundingRect } = section;
  const { scrollTop, scrollBottom } = scrollInfo;
  const sectionBottom = sectionTop + boundingRect.height;
  const stickyHeight = {
    height: `${section.scrollInfo.windowHeight}px`,
  };

  if (scrollTop < sectionTop) {
    // appears on the top of the page
    return { ...stickyHeight, ...STICKY_POS.absTop };
  }

  if (scrollTop >= sectionTop && sectionBottom > scrollBottom) {
    // sticks to the viewport
    return {
      ...stickyHeight,
      ...STICKY_POS.fixed,
      left: boundingRect.left,
      width: boundingRect.width,
    };
  }

  // appears on the bottom of the page
  return { ...stickyHeight, ...STICKY_POS.absBottom };
}
