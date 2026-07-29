import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import cypressPlugin from 'eslint-plugin-cypress';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // 1. Configuração recomendada do Cypress (globais + regras recomendadas)
  cypressPlugin.configs.recommended,

  // 2. Regras do TypeScript
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cy.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // 3. Suas regras customizadas e o Prettier
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cy.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'cypress/no-unnecessary-waiting': 'warn',
    },
  },

  // 4. Desativa regras do ESLint/TS que conflitam com o Prettier (sempre o último)
  prettierConfig,
];
