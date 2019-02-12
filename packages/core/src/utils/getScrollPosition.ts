/**
 * Returns the current window `scrollTop`, `windowHeight` (height of the window),
 * and the `scrollBottom` (`scrollTop` + `windowHeight`)
 */
export function getScrollPosition() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const scrollBottom = scrollTop + windowHeight;

  return {
    scrollTop,
    scrollBottom,
    windowHeight,
  };
}
