module.exports = {
  env: {
    browser: true,
    es6: true,
    jasmine: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  rules: {
    quotes: ['warn', 'single'],
    indent: 'off',
    'import/named': 'off',
  },
};
