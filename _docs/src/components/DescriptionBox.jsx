import styledComponents from 'styled-components';
import { transparentize } from 'polished'

import mq from '../config/media-queries';
import { defaultColors } from '../config/theme';

const DEFAULT_COLOR = defaultColors.primary;

export const DescriptionBox = styledComponents.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 40%;
  box-sizing: border-box;
  border: 3px solid ${({ color = DEFAULT_COLOR }) => color};
  border-radius: 2px;
  background: ${({ color = DEFAULT_COLOR }) => transparentize(0.8, color)};
  padding: 1.5rem;

  ${mq.greaterThan('mobile')`
    width: 55%;
  `}

  h4 {
    background: ${defaultColors.background};
    display: inline-block;
    padding: 0.1rem 0.5rem;
    border-radius: 6px;
    margin-left: -0.3rem;
    color: ${defaultColors.primary};
  }
`;
