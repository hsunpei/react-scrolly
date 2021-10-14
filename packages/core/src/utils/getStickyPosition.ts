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

  // TODO: think of a way to handle the case when sectionPosition cannot be successfully obtained when mounted
  if (boundingRect.width < 0) {
    return { position: 'relative' };
  }

  const { scrollTop, scrollBottom } = scrollInfo;
  const sectionBottom = sectionTop + boundingRect.height;
  const stickyHeight = {
    height: `${section.scrollInfo.windowHeight || window.innerHeight}px`,
  };

  console.log('scrollTop', scrollTop, 'sectionTop', sectionTop, 'sectionBottom', sectionBottom);

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
