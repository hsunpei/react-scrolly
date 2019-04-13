import styled from 'styled-components';
import { lighten } from 'polished'
import { Section } from '@react-scrolly/core';

import mq from '../config/media-queries';
import { defaultColors } from '../config/theme';

export const DemoSection = styled(Section)`
  position: relative;
  height: ${({ height = '100vh' }) => height};
  background-image: ${({ gradient = 'linear-gradient(to top, #e6e9f2 0%, #eef1f6 100%)' }) => gradient};
  box-shadow: 0 15px 30px 0 rgba(0,0,0,.11), 0 6px 16px 0 rgba(0,0,0,.08);
  border-radius: 2px;
  margin: 1rem 0;
`;

export const BorderedDemoSection = styled(Section)`
  position: relative;
  margin-top: -3px;
  height: ${({ height = '100vh' }) => height};
  border: ${({ color = defaultColors.background }) => `3px solid ${lighten(0.35)(color)}`};
  border-radius: 2px;

  h5 {
    font-size: 1.05rem;
    margin-top: -2px;
    margin-left: -2px;
    color: ${defaultColors.white};
    background-color: ${({ color = defaultColors.text }) => color};
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 2px;
    ${mq.greaterThan('mobile')`
      font-size: 1.15rem;
    `}
  }
`;
