import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-throw-literal': 'error',
            'prefer-promise-reject-errors': 'error',
            'no-return-await': 'error',
            'require-await': 'error',
        },
    },
    {
        ignores: [
            'node_modules/',
            'coverage/',
            'dist/',
            'drizzle/',
        ],
    },
];
