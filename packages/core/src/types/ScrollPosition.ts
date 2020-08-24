export interface ScrollPosition {
  /** The pageYOffset of the window obtained in <PageProvider>  */
  scrollTop: number;

  /** The pageYOffset + height of the window obtained in <PageProvider> */
  scrollBottom: number;

  /** The height of the window obtained in <PageProvider> */
  windowHeight: number;

  /**
   * The difference between the current scrolltop and previous scrolltop obtained in <PageProvider>.
   * Positive: if the user scroll down the page.
   */
  scrollOffset: number;
}
