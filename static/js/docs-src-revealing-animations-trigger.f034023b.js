(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"./docs/src/RevealingAnimations/Trigger.mdx":function(e,t,n){"use strict";n.r(t);var r=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),i=n("./node_modules/react/index.js"),a=n.n(i),o=n("./node_modules/@mdx-js/react/dist/index.es.js"),c=(n("./node_modules/docz/dist/index.esm.js"),n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js")),s=n("./packages/core/src/index.ts");function l(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2?arguments[2]:void 0,r=Object(i.useState)(!1),a=Object(c.a)(r,2),o=a[0],l=a[1],b=Object(i.useRef)(!1),u=Object(i.useRef)(null),m=Object(i.useCallback)(function(){u.current&&u.current.disconnect()},[]),d=Object(i.useCallback)(function(e){var n=Object(c.a)(e,1)[0].isIntersecting;l(n),t&&!b.current&&n&&m(),b.current=n},[]);return Object(i.useEffect)(function(){return u.current=Object(s.d)(d,n),u.current.observe(e.current),function(){m()}},[]),o}l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useIntersectingTrigger",filename:"packages/trigger/src/hooks/useIntersectingTrigger.ts"}});var b=n("./docs/src/components/DemoWrapper.jsx"),u=(n("./docs/src/components/CenterBox.jsx"),n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js")),m=n("./node_modules/styled-components/dist/styled-components.browser.esm.js"),d=n("./docs/src/config/theme.js"),p=n("./docs/src/config/media-queries.js");function g(){var e=Object(u.a)(["\n    font-size: 1.3rem;\n  "]);return g=function(){return e},e}function j(){var e=Object(u.a)(["\n  transition: all 1s ease-in-out;\n  opacity: ",";\n  transform: ",";\n  color: ",";\n  padding: 5%;\n  font-size: 1.1rem;\n\n  ","\n"]);return j=function(){return e},e}var f=m.d.div(j(),function(e){return e.isIntersecting?1:0},function(e){return e.isIntersecting?0:"translateY(3.5rem)"},function(e){var t=e.color;return void 0===t?d.a.gray:t},p.a.greaterThan("mobile")(g())),O=function(e){var t=e.children,n=e.trackOnce,o=Object(r.a)(e,["children","trackOnce"]),c=Object(i.useRef)(null),s=l(c,n);return a.a.createElement(f,Object.assign({ref:c,isIntersecting:s},o),t)};"undefined"!==typeof O&&O&&O===Object(O)&&Object.isExtensible(O)&&Object.defineProperty(O,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"AnimatedFadeIn",filename:"docs/src/components/AnimatedFadeIn.jsx"}});var h=n("./node_modules/react-spring/web.js");function v(){var e=Object(u.a)(["\n    font-size: 3.5em;\n  "]);return v=function(){return e},e}function y(){var e=Object(u.a)(["\n  display: block;\n  color: ",";\n  font-size: 2.8em;\n  font-weight: 800;\n  text-transform: uppercase;\n  line-height: 1.2;\n\n  ","\n"]);return y=function(){return e},e}function x(){var e=Object(u.a)(["\n    margin-top: 3.5rem;\n    padding: 5rem 0 2rem 3rem;\n  "]);return x=function(){return e},e}function T(){var e=Object(u.a)(["\n  margin-top: 2.5rem;\n  padding: 3rem 0 2rem 1rem;\n\n  ","\n"]);return T=function(){return e},e}var N=m.d.div(T(),p.a.greaterThan("mobile")(x())),k=m.d.span(y(),function(e){var t=e.color;return void 0===t?d.a.green:t},p.a.greaterThan("mobile")(v())),w=Object(h.a)(k),I=function(e){var t=e.color,n=e.title,r=e.trackOnce,o=n.split(" "),c=Object(i.useRef)(null),s=l(c,r),b=Object(h.b)(o.length,{opacity:s?1:0,x:s?0:200});return a.a.createElement(N,{ref:c},b.map(function(e,n){var r=e.opacity,i=e.x,c=o[n];return a.a.createElement(w,{key:"".concat(n,"-").concat(c),color:t,style:{opacity:r,transform:i.interpolate(function(e){return"translate3d(0,".concat(e,"%,0)")})}},c)}))};"undefined"!==typeof I&&I&&I===Object(I)&&Object.isExtensible(I)&&Object.defineProperty(I,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"AnimatedTrail",filename:"docs/src/components/AnimatedTrail.jsx"}}),n.d(t,"default",function(){return A});var C={},_="wrapper";function A(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)(_,Object.assign({},C,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"trigger"},"Trigger"),Object(o.b)("p",null,"On occasion, all you want is just to track ",Object(o.b)("strong",{parentName:"p"},"whether a component is scrolled into the viewport"),",\ninstead of getting additional information such as the scroll position to engender the potential performance impact."),Object(o.b)("p",null,"That is the moment when the ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," hook comes into play."),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," is particularly well-suited for the animations triggered when the elements are scrolled into the viewport."),Object(o.b)("h2",{id:"example"},"Example"),Object(o.b)(b.a,{mdxType:"DemoWrapper"},Object(o.b)(I,{title:"Lorem ipsum dolor sit",color:d.a.primary,mdxType:"AnimatedTrail"}),Object(o.b)(O,{height:"20vh",mdxType:"AnimatedFadeIn"},"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."),Object(o.b)(I,{title:"Ut enim ad minim veniam",color:d.a.primary,mdxType:"AnimatedTrail"}),Object(o.b)(O,{height:"20vh",mdxType:"AnimatedFadeIn"},"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."),Object(o.b)(I,{title:"Duis aute irure dolor",color:d.a.primary,mdxType:"AnimatedTrail"}),Object(o.b)(O,{height:"20vh",mdxType:"AnimatedFadeIn"},"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")),Object(o.b)("h2",{id:"usage"},"Usage"),Object(o.b)("p",null,"Import the ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," hook."),Object(o.b)("pre",null,Object(o.b)("code",Object.assign({parentName:"pre"},{className:"language-jsx"}),"import { useIntersectingTrigger } from '@react-scrolly/trigger';\n")),Object(o.b)("p",null,"Then, you can know whether a component is inside the viewport by giving ",Object(o.b)("a",Object.assign({parentName:"p"},{href:"https://reactjs.org/docs/refs-and-the-dom.html"}),"the ",Object(o.b)("inlineCode",{parentName:"a"},"ref")," of a component")," to ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," hook."),Object(o.b)("p",null,"By combining with CSS styles or animation libraries such as ",Object(o.b)("a",Object.assign({parentName:"p"},{href:"https://github.com/react-spring/react-spring"}),"react-spring"),",\nyou are able to make various visual effects triggered when components are scrolled into the viewport."),Object(o.b)("pre",null,Object(o.b)("code",Object.assign({parentName:"pre"},{className:"language-jsx"}),"...\nconst ref = useRef(null);\nconst isIntersecting = useIntersectingTrigger(ref);\n\nreturn (\n  <div ref={ref}>\n    {children}\n  </div>\n};\n")),Object(o.b)("p",null,"Note that unlike ",Object(o.b)("inlineCode",{parentName:"p"},"<Section>"),", ",Object(o.b)("inlineCode",{parentName:"p"},"<Plot>"),", or ",Object(o.b)("inlineCode",{parentName:"p"},"<Scene>"),", it is not required to wrap\n",Object(o.b)("inlineCode",{parentName:"p"},"<PageProvider>")," outside the ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger"),"\nbecause ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," does not take information related to the window resizing or the scroll effects."),Object(o.b)("p",null,"The detection of ",Object(o.b)("inlineCode",{parentName:"p"},"isIntersecting")," of ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," is implemented using the ",Object(o.b)("inlineCode",{parentName:"p"},"IntersectionObserver")," directly."),Object(o.b)("h2",{id:"advanced-usage"},"Advanced Usage"),Object(o.b)("pre",null,Object(o.b)("code",Object.assign({parentName:"pre"},{}),"useIntersectingTrigger(containerRef, trackOnce, intersectionConfig)\n")),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"useIntersectingTrigger")," hook takes three parameters:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("strong",{parentName:"li"},"containerRef"),": ",Object(o.b)("inlineCode",{parentName:"li"},"ref")," of a component."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("strong",{parentName:"li"},"trackOnce"),": finish the tracking once the component scrolled into the viewport. Default value: ",Object(o.b)("inlineCode",{parentName:"li"},"false"),"."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("strong",{parentName:"li"},"intersectionConfig"),":\ncustom config of the ",Object(o.b)("a",Object.assign({parentName:"li"},{href:"https://developers.google.com/web/updates/2016/04/intersectionobserver"}),"IntersectionObserver"),";\nDefault value: ",Object(o.b)("inlineCode",{parentName:"li"},"{ threshold: 0, rootMargin: {top: 0, right: 0, bottom: 0, left: 0} }"),".")),Object(o.b)("h3",{id:"example-of-trackonce"},"Example of trackOnce"),Object(o.b)(b.a,{mdxType:"DemoWrapper"},Object(o.b)(O,{trackOnce:!0,height:"20vh",mdxType:"AnimatedFadeIn"},"Play the fade-in effect just once with trackOnce")))}A&&A===Object(A)&&Object.isExtensible(A)&&Object.defineProperty(A,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"docs/src/RevealingAnimations/Trigger.mdx"}}),A.isMDXComponent=!0}}]);
//# sourceMappingURL=docs-src-revealing-animations-trigger.367b7a04943706d223f1.js.map