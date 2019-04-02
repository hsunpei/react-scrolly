import React, { useRef } from 'react';
import styledComponents from 'styled-components';
import { useIntersectingTrigger } from '@react-scrolly/trigger';

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
  const isIntersecting = useIntersectingTrigger(containerRef);

  return (
    <Wrapper ref={containerRef} isIntersecting={isIntersecting}>
      AnimatedFadeIn
    </Wrapper>
  );
};
