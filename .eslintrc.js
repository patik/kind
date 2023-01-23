module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'node', 'prettier'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
        'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    },
    env: {
        jest: true,
        node: true,
    },
}
