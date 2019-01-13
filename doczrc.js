import * as path from 'path';

const modifyBundlerConfig = config => {
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    '@intrasections/core': path.resolve(__dirname, 'packages/core/src'),
  });
  return config;
};

export default {
  title: 'Intrasections',
  typescript: true,
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        href: 'https://codemirror.net/theme/monokai.css'
      }]
    }
  },
  modifyBundlerConfig,
  themeConfig: {
    // See: https://github.com/pedronauck/docz/blob/5fbea6a1469d2e258402621ba81f74f898af906a/packages/docz-theme-default/README.md#default-themeconfig
    mode: 'light',
    codemirrorTheme: 'monokai',
    showPlaygroundEditor: true, // always display the code in <Playground>
    colors: {
      primary: '#ff9f00',
      background: '#edeeef',
      text: '#0a2c43',
      blue: '#5211de',
      sidebarBg: '#edeeef',
      sidebarBorder: '#0078e0',
      border: '0078e0',
      codeBg: '#ffffff',
      codeColor: '#ff9f00',
      theadColor: '#79878e',
    },
    styles: {
      playground: {
        background: '#ffffff',
      },
    },
  },
};
