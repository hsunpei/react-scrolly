module.exports = {
  preset: 'ts-jest',
  rootDir: '../',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/config/tsconfig.base.json',
    },
  },
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
  ],
};
