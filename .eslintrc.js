module.exports = {
  extends: ['./node_modules/poetic/config/eslint/eslint-config.js'],
  rules: {
    'arrow-body-style': ['off', 'as-needed'],
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'arrow-body-style': ['off', 'as-needed'],
        'no-shadow': 'off',
        'no-param-reassign': [2, { props: false }],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
      },
    },
  ],
};
