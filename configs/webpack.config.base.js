const path = require('path');

const dashToCamelCase = (str) => str.split('-').reduce(
  (res, segment, idx) => {
    if (idx === 0) {
      return segment
    }
    return `${res}${segment[0].toUpperCase()}${segment.substr(1)}`;
  },
  ''
);

const packageDirname = process.cwd();
const fullPackageName = process.env.npm_package_name || process.env.PKG_NAME;
const packageName = fullPackageName.replace(/@react-scrolly\//, '');

module.exports = {
  entry: `./src/index.ts`,

  context: packageDirname,
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  output: {
    filename: `${packageName}.js`,
    path: path.resolve(packageDirname, 'dist'),
    library: dashToCamelCase(packageName),
  },

  module: {
    rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            configFile: `${packageDirname}/src/tsconfig.cjs.json`,
          },
        },
    ],
  },

  externals: {
    react: 'React',
    "react-dom": "ReactDOM",
    "styled-components": {
      commonjs: "styled-components",
      commonjs2: "styled-components",
      amd: "styled-components",
    },
  }
};
