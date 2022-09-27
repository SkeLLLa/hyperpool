const packageJson = require('./package.json');
const devDependencies = Object.keys(packageJson.devDependencies || {});

module.exports = {
  $schema: 'https://json.schemastore.org/eslintrc',
  env: {
    es6: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
    'jest': { version: 29 },
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:node/recommended-module',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.mock.ts'],
      env: {
        jest: true,
      },
      rules: {
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: devDependencies,
          },
        ],
        'node/no-unpublished-import': [
          'error',
          {
            allowModules: devDependencies,
          },
        ],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'require-jsdoc': 'off',
        'no-new-wrappers': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    ecmaVersion: 2020,
    sourceType: 'module',
    // eslint-disable-next-line no-undef
    tsconfigRootDir: __dirname,
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'new-cap': 'off',
    'no-invalid-this': 'off',
    // extends plugin:node/recommended-module
    'node/no-missing-import': 'off',
    // extends plugin:@typescript-eslint/recommended
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          Array: 'Use [] instead of Array.',
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    // extends plugin:jest/recommended
    'jest/expect-expect': 'error',
    'jest/no-commented-out-tests': 'error',
    'jest/no-disabled-tests': 'off',

    // extends plugin:jest/style
    'jest/no-alias-methods': 'error',

    // extends plugin:import/recommended
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/export': 'off',
  },
};
