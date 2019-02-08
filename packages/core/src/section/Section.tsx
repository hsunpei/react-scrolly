import * as React from 'react';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { ScrollPosition } from '../page/Page';
import pageContext from '../context/pageContext';

export interface SectionState extends ScrollPosition {
  /** From IntersectionObserver: whether the Section is intersecting the root */
  isIntersecting: boolean;

   /** From IntersectionObserver: the top of the Section + scrollTop */
  sectionTop: number;

  /** From IntersectionObserver: the height of the Section */
  sectionHeight: number;

  /** Ratio of the Page being scrolled */
  scrolledRatio: number;
}

export interface SectionProps {
  name: string;

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
  public static contextType = pageContext;

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

  /** Use browser's IntersectionObserver to record whether the section is inside the viewport */
  private recordIntersection = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const { isIntersecting, boundingClientRect } = entry;
    console.log(isIntersecting, this.pageSubscription,
                boundingClientRect);

    // If Section enters the viewport, start subscribing to the page scrolling observer
    if (!this.state.isIntersecting && isIntersecting) {
      this.pageSubscription = this.pageScrollObsr$.subscribe({
        next: this.recordPageScroll,
        complete: this.onPageSubscriptionComplete,
      });
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { top, height } = boundingClientRect;

    this.setState({
      isIntersecting,
      sectionTop: top + scrollTop,
      sectionHeight: height,
    });
  };

  /** Sets the scroll position information calculated in <Page> to the state */
  private recordPageScroll = (scrollPos: ScrollPosition) => {
    console.log('==========', this.state.isIntersecting, this.props.name, scrollPos);
    const { scrollTop, scrollBottom, windowHeight, scrollOffset } = scrollPos;
    const { sectionTop, sectionHeight } = this.state;

    let scrolledRatio = (scrollBottom - sectionTop) / sectionHeight;

    if (scrolledRatio > 1) {
      scrolledRatio = 1;
    } else if (scrolledRatio < 0) {
      scrolledRatio = 0;
    }

    this.setState({
      scrollTop,
      scrollBottom,
      windowHeight,
      scrollOffset,
      scrolledRatio,
    });
  };

  private onPageSubscriptionComplete = () => {
    const { trackOnce } = this.props;

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
  }

  public componentWillUnmount() {
    // disable the entire IntersectionObserver
    this.intersectObsr.disconnect();
    // stop subscribing to the window scrolling events from <Page>
    this.pageSubscription.unsubscribe();
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
