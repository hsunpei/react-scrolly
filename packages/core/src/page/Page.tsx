import * as React from 'react';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { throttleTime, map, pairwise } from 'rxjs/operators';

import { PageContext, PageContextInterface, sectionID } from '../context/PageContext';
import { getScrollPosition } from '../utils/getScrollPosition';

export interface ScrollPosition {
  /** The pageYOffset of the window obtained in <Page>  */
  scrollTop: number;

  /** The pageYOffset + height of the window obtained in <Page> */
  scrollBottom: number;

  /** The height of the window obtained in <Page> */
  windowHeight: number;

  /**
   * The difference between the current scrolltop and previous scrolltop obtained in <Page>.
   * Positive: if the user scroll down the page.
   */
  scrollOffset: number;
}

export interface PageProps {
  children: React.ReactNode | React.ReactNode[];
}

export class Page<T extends PageProps> extends React.PureComponent<
  T,
  PageContextInterface
> {
  public static defaultProps: PageProps = {
    children: () => null,
  };

  public scrollObserver$ = fromEvent(window, 'scroll')
    .pipe(
      throttleTime(0, animationFrameScheduler),
      map(() => getScrollPosition()),
      // use pairwise to group pairs of consecutive emissions
      // so that we can calculate `scrollOffset`
      pairwise(),
      map(([previousScroll, currentScroll]): ScrollPosition => {
        // amount of pixels scrolled by
        // - postive: scroll down
        // - negative: scroll up
        const scrollOffset = currentScroll.scrollTop - previousScroll.scrollTop;

        return {
          ...currentScroll,
          scrollOffset,
        };
      }),
    );

  // tslint:disable-next-line:function-name
  public _setCurrentActiveId(activeSectionId: sectionID) {
    this.setState({ activeSectionId });
  }

  public setCurrentActiveId = this._setCurrentActiveId.bind(this);

  public state: PageContextInterface = {
    activeSectionId: null,
    scrollObserver$: this.scrollObserver$,
    setCurrentActiveId: this.setCurrentActiveId,
  };

  public render() {
    const { Provider } = PageContext;

    const {
      children,
    } = this.props;

    return (
      <Provider
        value={this.state}
      >
        {children}
      </Provider>
    );
  }
}
