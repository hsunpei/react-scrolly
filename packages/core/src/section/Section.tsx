import * as React from 'react';

import pageContext from '../context/pageContext';
import { Subscription } from 'rxjs';

export interface SectionProps {
  // TODO: deal with this case
  trackOnce: boolean;

  name: string;

  /**
   * The array of intersectionRatio thresholds which is used in the options of IntersectionObserver
   * @example [0, 0.25, 0.5, 0.75, 1]
   */
  threshold: number[] | 1;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
}

export interface SectionState {
  /** From IntersectionObserver: whether the Section is intersecting the root */
  isIntersecting: boolean;

  /** From IntersectionObserver: the ratio of intersectionRect area to boundingClientRect area */
  intersectionRatio: number;

  /** From IntersectionObserver: obtained by running the getBoundingClientRect() on the Section */
  boundingClientRect: ClientRect | null;
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
    intersectionRatio: 0,
    boundingClientRect: null,
  };

  /** Ref for this section */
  private sectionRef = React.createRef<HTMLDivElement>();

  /**
   * Use IntersectionObserver API to observe the changes
   * in the intersection of the section with the viewport
   */
  public intersectObsr: IntersectionObserver;

  public pageSubscription: Subscription;

  /** Subscribe to the page scrolling observer */
  private subscribePageScroll = () => {
    const { scrollObserver$ } = this.context;
    this.pageSubscription = scrollObserver$.subscribe(this.recordPageScroll);
  };

  /** Unsubscribe the page scrolling observer */
  private unsubscribePageScroll = () => {
    console.log('this.pageSubscription', this.pageSubscription)
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  };

  // FIXME: this shoule be rewritten
  private updateScrollObsSubscription = (prevIntersecting: boolean, intersecting: boolean) => {
    const { scrollObserver$ } = this.context;
    if (!prevIntersecting && intersecting) {
      this.subscribePageScroll();
    } else if (prevIntersecting && !intersecting) {
      console.log('***********unsubscribePageScroll', this.props.name)
      this.unsubscribePageScroll();
    }
  };

  /** Use browser's IntersectionObserver to record whether the section is inside the viewport */
  private recordIntersection = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const { isIntersecting, intersectionRatio, boundingClientRect } = entry;
    console.log(isIntersecting, this.pageSubscription,
                intersectionRatio,
                boundingClientRect);

    // FIXME: this shoule be rewritten
    this.updateScrollObsSubscription(this.state.isIntersecting, isIntersecting);

    this.setState({
      isIntersecting,
      intersectionRatio,
      boundingClientRect,
    });
  };

  private recordPageScroll = (val) => {
    console.log('==========', this.state.isIntersecting, this.props.name, val);
  };

  public componentDidMount() {
    const { threshold } = this.props;
    const { scrollObserver$ } = this.context;
    this.intersectObsr = new IntersectionObserver(this.recordIntersection, {
      threshold,

      /**  Observe changes in visibility of the section relative to the document's viewport */
      root: null,

      // TODO: check this value
      /**
       * Watch only the changes in the intersection between the section and the viewport,
       * without any added or substracted space
       */
      rootMargin: '0px',
    });

    this.intersectObsr.observe(this.sectionRef.current!);

    // start subscribing to the window scrolling events from <Page>
    this.subscribePageScroll();
  }

  public componentWillUnmount() {
    // disable the entire IntersectionObserver
    this.intersectObsr.disconnect();
    // stop subscribing to the window scrolling events from <Page>
    this.unsubscribePageScroll();
  }

  public render() {
    const {
      className,
      style,
      children,
      ...restProps
    } = this.props;

    return (
      <div
        ref={this.sectionRef}
        className={className}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }

}
