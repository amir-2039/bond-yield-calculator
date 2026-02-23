/** @type {import('jest').Config} */
module.exports = {
  watchman: false,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testRegex: '\\.(spec|e2e-spec)\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
