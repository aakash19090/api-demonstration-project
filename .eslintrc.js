module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    
  },
  plugins: ['react', 'prettier'],
  rules: {
    semi: 0, //no strict semicolon required
    // 'prettier/prettier': ['error'],
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'no-console': ['error', { allow: ['warn'] }],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/no-static-element-interactions': 0,
  },
  settings: {
    'import/core-modules': ['history', 'prop-types'],
  },
}
