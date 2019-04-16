import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTrail, animated } from 'react-spring';
import { useIntersectingTrigger } from '@react-scrolly/trigger';

import { defaultColors } from '../config/theme';
import mq from '../config/media-queries';

const Wrapper = styled.div`
  margin-top: 2.5rem;
  padding: 3rem 0 2rem 1rem;

  ${mq.greaterThan('mobile')`
    margin-top: 3.5rem;
    padding: 5rem 0 2rem 3rem;
  `}
`;

const Text = styled.span`
  display: block;
  color: ${({color = defaultColors.green}) => color};
  font-size: 2.8em;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1.2;

  ${mq.greaterThan('mobile')`
    font-size: 3.5em;
  `}
`;
const AnimatedText = animated(Text);

export const AnimatedTrail = ({
  color,
  title,
}) => {
  const items = title.split(' ');
  const containerRef = useRef(null);
  const isIntersecting = useIntersectingTrigger(containerRef);
  const trail = useTrail(items.length, {
    opacity: isIntersecting ? 1 : 0,
    x: isIntersecting ? 0 : 200,
  });

  return (
    <Wrapper ref={containerRef}>
      {trail.map(({ opacity, x }, idx) => {
        const text = items[idx];

        return (
          <AnimatedText
            key={`${idx}-${text}`}
            color={color}
            style={{
              opacity,
              transform: x.interpolate(pos => `translate3d(0,${pos}%,0)`),
            }}
          >
            {text}
          </AnimatedText>
        );
      })}
    </Wrapper>
  );
};
