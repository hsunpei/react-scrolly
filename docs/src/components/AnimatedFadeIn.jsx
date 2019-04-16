import React, { useRef } from 'react';
import styled from 'styled-components';
import { useIntersectingTrigger } from '@react-scrolly/trigger';

import { defaultColors } from '../config/theme';
import mq from '../config/media-queries';

const Wrapper = styled.div`
  transition: all 1s ease-in-out;
  opacity: ${ props => props.isIntersecting ? 1 : 0};
  transform: ${ props => props.isIntersecting ? 0 : 'translateY(3.5rem)' };
  color: ${({color = defaultColors.gray}) => color};
  padding: 5%;
  font-size: 1.1rem;

  ${mq.greaterThan('mobile')`
    font-size: 1.3rem;
  `}
`;

export const AnimatedFadeIn = ({
  children,
  trackOnce,
  ...restProps
}) => {
  const containerRef = useRef(null);
  const isIntersecting = useIntersectingTrigger(containerRef, trackOnce);

  return (
    <Wrapper ref={containerRef} isIntersecting={isIntersecting} {...restProps}>
      {children}
    </Wrapper>
  );
};
