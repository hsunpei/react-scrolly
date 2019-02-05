import * as React from 'react';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { throttleTime, map, pairwise } from 'rxjs/operators';

import pageContext, { descriptionID } from '../context/pageContext';

export interface ScrollPosition {
  scrollTop: number;
  scrollBottom: number;
  windowHeight: number;
  scrollOffset: number;
}
export interface PageState {
  /** The ID of the current active description box */
  activeDescriptionId: descriptionID;
}

export interface PageProps {
  debounceTime?: number;
  children: React.ReactNode | React.ReactNode[];
}

export class Page extends React.PureComponent<
  PageProps,
  PageState
> {
  public static defaultProps: PageProps = {
    debounceTime: 300,
    children: () => null,
  };

  public state: PageState = {
    activeDescriptionId: null,
  };

  public scrollObserver$ = fromEvent(window, 'scroll')
    .pipe(
      throttleTime(0, animationFrameScheduler),
      map(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollBottom = scrollTop + windowHeight;

        return {
          scrollTop,
          scrollBottom,
          windowHeight,
        };
      }),
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

  public setCurrentActiveId = (activeDescriptionId: descriptionID) => {
    this.setState({ activeDescriptionId });
  };

  public render() {
    const { Provider } = pageContext;

    const {
      children,
    } = this.props;
    const { activeDescriptionId } = this.state;

    return (
      <Provider
        value={{
          activeDescriptionId,
          scrollObserver$: this.scrollObserver$,
          setCurrentActiveId: this.setCurrentActiveId,
        }}
      >
        {children}
      </Provider>
    );
  }
}
