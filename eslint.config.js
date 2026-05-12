import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', '*.config.js', 'lib/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',
      ...prettier.rules,
    },
  },
];