import styledComponents from 'styled-components';
import mq from '../config/media-queries';
import { defaultColors } from '../config/theme';

export const CenterBox = styledComponents.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  list-style: none;

  ${mq.greaterThan('mobile')`
    font-size: 1.5rem;
  `}

  h4 {
    background: ${defaultColors.background};
    display: inline-block;
    padding: 0.1rem 0.5rem;
    border-radius: 6px;
    color: ${defaultColors.primary};
    margin-left: -0.5rem;
  }

  b {
    padding: 0.05rem 0.25rem;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.85);
    color: ${({ boldColor = defaultColors.blue }) => boldColor};
  }

  li:before {
    content: "•";
    padding-right: 1rem;
    color: ${defaultColors.gray};
  }
`;
