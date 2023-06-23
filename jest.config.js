module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/__mocks__/firebase.js'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.story.{js,jsx,ts,tsx}',
    '!<rootDir>/**/index.{js,jsx,ts,tsx}',
    '!<rootDir>/**/constants.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/**/types.ts',
  ],
  transform: {
    '^.+\\.{js,jsx,ts,tsx}?$': ['ts-jest', { isolatedModules: true }],
  },
  testPathIgnorePatterns: [
    'node_modules',
    '__mocks__',
    'coverage',
    '.storybook',
    'dist',
    'logs',
  ],
  resetMocks: false,
  clearMocks: true,
  moduleNameMapper: {
    '^.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};
