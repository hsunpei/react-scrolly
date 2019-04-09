import { generateMedia } from 'styled-media-query';

const mq = generateMedia({
  desktop: '78em',
  large: '70em',
  tablet: '60.5em',
  mobile: '46em',
});

export default mq;
