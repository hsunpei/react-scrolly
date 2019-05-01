import * as path from 'path';
import { css } from 'styled-components';
import { defaultColors } from './docs/src/config/theme';

const modifyBundlerConfig = config => {
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    '@react-scrolly/core': path.resolve(__dirname, 'packages/core/src'),
    '@react-scrolly/scene': path.resolve(__dirname, 'packages/scene/src'),
    '@react-scrolly/plot': path.resolve(__dirname, 'packages/plot/src'),
    '@react-scrolly/trigger': path.resolve(__dirname, 'packages/trigger/src')
  });
  return config;
};

export default {
  title : 'React-Scrolly',
  typescript : true,
  repository: 'https://github.com/garfieldduck/react-scrolly',
  public: 'docs/public',
  // set hashRouter as `true` for Github
  hashRouter: true,
  htmlContext : {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://codemirror.net/theme/material.css'
        }
      ]
    }
  },
  htmlContext: {
    favicon: '/public/favicon.png'
  },
  // order of the menu
  menu: [
    'Introduction',
    'Scroll Tracking',
    'Pinning Sections',
    'Revealing Animations'
  ],
  modifyBundlerConfig,
  themeConfig : {
    // See: https://github.com/pedronauck/docz/tree/master/core/docz-theme-default
    mode: 'light',
    codemirrorTheme: 'material',
    showPlaygroundEditor: true, // always display the code in <Playground>
    colors: {
      primary: defaultColors.primary,
      background: defaultColors.background,
      text: defaultColors.text,
      blue: defaultColors.blue,
      sidebarBg: defaultColors.background,
      sidebarBorder: '#a3a4a5',
      border: '#a3a4a5',
      codeBg: defaultColors.white,
      codeColor: defaultColors.primary,
      theadColor: '#79878e'
    },
    logo: {
      src: '/public/logo-long.png',
      width: 200,
    },
    styles: {
      body: css`
        font-family: 'Source Sans Pro',helvetica,'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif;
        line-height: 1.6;
        img {
          max-width: 100%;
        }
      `,
      playground: css`
        background: #ffffff;
      `,
    },
  }
};
