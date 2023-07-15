module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/all',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 1,
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/explicit-member-accessibility': [
      2,
      {
        accessibility: 'explicit',
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/prefer-readonly-parameter-types': 0,
    '@typescript-eslint/promise-function-async': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unsafe-assignment': 1,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/no-extraneous-class': 0,
    '@typescript-eslint/no-unsafe-return': 0,
  },
};
