import * as React from 'react';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { ScrollPosition } from '../page/Page';
import { getScrollPosition } from '../utils/getScrollPosition';
import { PageContext } from '../context/PageContext';

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
  children: (section: SectionState) => React.ReactNode;

  /** Only track the section using the IntersectionObserver once */
  trackOnce: boolean;
}

export class Section extends React.PureComponent<SectionProps, SectionState> {
  /** Access the page context */
  public static contextType = PageContext;

  public static defaultProps = {
    trackOnce: false,
    threshold: [0, 0.5, 1],
  };

  public state: SectionState = {
    isIntersecting: false,
    sectionTop: 0,
    sectionHeight: 1,
    scrollTop: 0,
    scrollBottom: 0,
    windowHeight: 0,
    scrollOffset: 0,
    scrolledRatio: 0,
    sectionBoundingRect: {
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      height: 1,
      width: 1,
    },
  };

  /** Ref for this section */
  private sectionRef = React.createRef<HTMLDivElement>();

  /**
   * Use IntersectionObserver API to observe the changes
   * in the intersection of the section with the viewport
   */
  public intersectObsr: IntersectionObserver;

  /**
   * Observer to observe the scrolling position calculated in `<Page>`
   * while the `<Section>` is inside the viewport
   */
  public pageScrollObsr$ = this.context.scrollObserver$.pipe(
    takeWhile(() => {
      return this.state.isIntersecting;
    }),
  );

  /** Subscription to `pageScrollObsr$` */
  public pageSubscription: Subscription;

  /** Subscription to `resizeObserver$` */
  public resizeSubscription: Subscription;

  /** Subscribe to the `scrollObserver` from <Page> */
  private subscribeScrollPos = () => {
    this.pageSubscription = this.pageScrollObsr$.subscribe({
      next: this.recordPageScroll,
      complete: this.onPageSubscriptionComplete,
    });
  };

  /** Use browser's IntersectionObserver to record whether the section is inside the viewport */
  private recordIntersection = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const { isIntersecting, boundingClientRect } = entry;

    // If Section enters the viewport, start subscribing to the page scrolling observer
    if (!this.state.isIntersecting && isIntersecting) {
      this.subscribeScrollPos();
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { top, height } = boundingClientRect;

    this.setState({
      isIntersecting,
      sectionTop: top + scrollTop,
      sectionHeight: height,
      sectionBoundingRect: boundingClientRect,
    });
  };

  /** Sets the scroll position information calculated in <Page> to the state */
  private recordPageScroll = (scrollPos: ScrollPosition) => {
    const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;
    const { sectionTop, sectionHeight } = this.state;

    let scrolledRatio = (scrollBottom - sectionTop) / sectionHeight;

    if (scrolledRatio > 1) {
      scrolledRatio = 1;
    } else if (scrolledRatio < 0) {
      scrolledRatio = 0;
    }

    // updates the ratio of the section being scrolled and the scroll positions
    this.setState({
      scrollTop,
      scrollBottom,
      windowHeight,
      scrollOffset,
      scrolledRatio,
    });

    // updates the section currently being scrolled
    const { setCurrentActiveId } = this.context;
    const { trackingId } = this.props;
    if (trackingId) {
      setCurrentActiveId(trackingId);
    }
  };

  /** updates the section bound when the window resizes */
  private updateSectionBounds = () => {
    const currentSect = this.sectionRef.current;
    // only update the resized `<Section>` if it is in the viewport
    if (currentSect && this.state.isIntersecting) {
      const sectionBoundingRect = currentSect.getBoundingClientRect();
      this.setState({
        sectionBoundingRect,
        sectionHeight: sectionBoundingRect.height,
      });
    }
  };

  /**
   * Executes after the subscription to the page scrolling completes,
   * i.e., the section is scrolled out of the viewport
   */
  private onPageSubscriptionComplete = () => {
    const { trackingId, trackOnce } = this.props;

    // clear the section ID tracked in the page
    const { setCurrentActiveId } = this.context;
    if (trackingId) {
      setCurrentActiveId(undefined);
    }

    // disconnect from IntersectionObserver if the section is only tracked once
    if (trackOnce) {
      this.intersectObsr.disconnect();
    }
  };

  public componentDidMount() {
    const { threshold } = this.props;
    // start observing whether the section is scrolled into the viewport
    this.intersectObsr = new IntersectionObserver(this.recordIntersection, {
      threshold,

      /**  Observe changes in visibility of the section relative to the document's viewport */
      root: null,

      /**
       * Watch only the changes in the intersection between the section and the viewport,
       * without any added or substracted space
       */
      rootMargin: '0px',
    });

    this.intersectObsr.observe(this.sectionRef.current!);

    // subscribe to the window resize event
    this.resizeSubscription = this.context.resizeObserver$.subscribe({
      next: this.updateSectionBounds,
    });

    // update the initial scroll information of the window into the section
    this.setState(getScrollPosition());
  }

  public componentWillUnmount() {
    // disable the entire IntersectionObserver
    this.intersectObsr.disconnect();
    // stop subscribing to the window scrolling events from <Page>
    this.pageSubscription.unsubscribe();
    // stop subscribing to the window resizing events from <Page>
    this.resizeSubscription.unsubscribe();
  }

  public render() {
    const {
      className,
      style,
      children,
      trackOnce,
      ...restProps
    } = this.props;

    return (
      <div
        ref={this.sectionRef}
        className={className}
        style={style}
        {...restProps}
      >
        {children(this.state)}
      </div>
    );
  }

}
