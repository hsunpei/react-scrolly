import { css } from 'styled-components';
import { lighten } from 'polished'

import mq from '../config/media-queries';
import { defaultColors } from '../config/theme';

export const borderedStyle = css`
  position: relative;
  margin-top: -3px;
  ${({ height }) => height ? `height: ${height}` : null};
  border: ${({ color = defaultColors.gray }) => `2.5px solid ${lighten(0.2)(color)}`};
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
