import React, { useRef } from 'react';
import styledComponents from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useIntersectingDetection } from '@intrasections/core';

const Wrapper = styledComponents.div`
  padding: 4em;
  background: blanchedalmond;
  height: 20rem;
`;

const AnimatedWrapper = animated(Wrapper);

export const AnimatedFade = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectingDetection(containerRef);
  const aniStyles = useSpring({ opacity: isIntersecting ? 1 : 0 });

  return (
    <AnimatedWrapper ref={containerRef} style={aniStyles}>
      AnimatedFade
    </AnimatedWrapper>
  );
};
