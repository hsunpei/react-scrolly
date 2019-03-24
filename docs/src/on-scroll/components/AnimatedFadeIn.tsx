import React, { useRef } from 'react';
import styledComponents from 'styled-components';
import { useIntersectingDetection } from '@intrasections/core';

const Wrapper = styledComponents.div<{isIntersecting: boolean}>`
  padding: 4em;
  background: blanchedalmond;
  height: 20rem;
  transition: all 1s ease-in-out;
  opacity: ${ props => props.isIntersecting ? 1 : 0};
  transform: ${ props => props.isIntersecting ? 0 : 'translateY(3.5rem)' };
`;

export const AnimatedFadeIn = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectingDetection(containerRef);

  return (
    <Wrapper ref={containerRef} isIntersecting={isIntersecting}>
      AnimatedFadeIn
    </Wrapper>
  );
};
