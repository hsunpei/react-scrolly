import styled from 'styled-components';
import { Section } from '@react-scrolly/core';

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
  border: 3px solid ${defaultColors.background};
  border-radius: 2px;

  h5 {
    margin-top: 0.5rem;
    margin-left: 0.7rem;
  }
`;
