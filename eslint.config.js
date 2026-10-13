const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  { ignores: ['ios/*', 'android/*', 'dist/*', 'vendor/*', '.expo/*'] },
  {
    // Spec 01 §4: features never import another feature.
    files: ['src/features/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: ['@/features/*'], message: 'Features must not import other features.' }] }],
    },
  },
];
