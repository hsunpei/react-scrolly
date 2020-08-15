import * as React from 'react';
import { Helmet } from 'react-helmet-async';

// The doc prop contains some metadata about the page being rendered that you can use.
const Wrapper = ({ children, _ }) => (
  <>
    <Helmet>
      <link
        rel="icon"
        type="image/png"
        href="https://user-images.githubusercontent.com/1139698/57021930-34341700-6c60-11e9-876f-62d613f02178.png"
      />
    </Helmet>
    {children}
  </>
);
export default Wrapper;
