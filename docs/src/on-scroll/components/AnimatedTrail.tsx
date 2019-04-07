import React, { useRef } from 'react';
import styledComponents from 'styled-components';
import { useTrail, animated } from 'react-spring';
import { useIntersectingTrigger } from '@react-scrolly/trigger';

const Wrapper = styledComponents.div`
  padding: 5rem;
`;

const Text = styledComponents.span`
  display: block;
  color: #0CCE8B;
  font-size: 3em;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1.2;
`;
const AnimatedText = animated(Text);

const items = ['Lorem', 'ipsum', 'dolor', 'sit'];

export const AnimatedTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectingTrigger(containerRef);
  const trail = useTrail(items.length, {
    opacity: isIntersecting ? 1 : 0,
    x: isIntersecting ? 0 : 120,
  });

  return (
    <Wrapper ref={containerRef}>
      {trail.map(({ opacity, x }, idx) => {
        const text = items[idx];

        return (
          <AnimatedText
            key={`${idx}-${text}`}
            style={{
              opacity,
              // TODO: upgrade react-spring to fix the false alarms about typings
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
