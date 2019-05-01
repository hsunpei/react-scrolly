![react-scrolly](https://user-images.githubusercontent.com/1139698/56862995-5cfba880-69e3-11e9-85ec-3a051659a324.jpg)

# Scrolly-telling made easy

Magical scroll-based interactions made easy with `react-scrolly`.

Scroll-based interactions create an incredible experience by letting users explore the story with simple scrolls,
such highlighting a portion of the content,
or animating the route on a map based on the position of the section user is reading.

However, tracking the scrolling progress by yourself is burdensome,
and binding the window scroll tracking for each component is prone to cause performance issues as the number of tracked components increase,
and thus making users see the screen juddering when scrolling.

With this in mind, `react-scrolly` is created to allow you to track the progress of scrolling with minimum efforts and the performance impact.

`react-scrolly` is perfect for the following use cases:

- Track the scrolled ratio (ratio of a section being read) by the user.
- Track the section the user is currently reading (closest to the bottom of the viewport) and its scrolled ratio in another component.
- Pin components on the scroll based on the scroll position.
- Making scrolled-based animations or parallax effects (by combining the scrolled ratio provided `react-scrolly` with animation libraries such as [react-spring](https://github.com/react-spring/react-spring),
you are able to make stunning scroll-based visual effects with concise and declarative code).

### Definition of the scrolled ratio
The `scrolled ratio` is defined by the ratio of a component being scrolled over **the bottom of the screen** (viewport).

![Scrolled ratio](https://user-images.githubusercontent.com/1139698/57021937-3a29f800-6c60-11e9-89d8-51959a7ca60e.png)


## Why is it performant?

In contrast to the traditional scroll tracking by binding window scroll event listeners to components and calling `getBoundingClientRect()` on scroll
which potentially causes many unnecessary re-renderings and [reflows](https://gist.github.com/paulirish/5d52fb081b3570c81e3a),
`react-scrolly` only notifies the scrolling position changes to the components currently intersected with the viewport,
which is made possible by utilizing the `IntersectionObserver`, `RxJS`, the context API, and React hooks.

## How to design scrolly-telling

Here are some references to help you design better scrolly-telling:

- How To Scroll by Mike Bostock: https://bost.ocks.org/mike/scroll/
- Responsive scrollytelling best practices (The Pudding): https://pudding.cool/process/responsive-scrollytelling/

