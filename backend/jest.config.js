module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ['<rootDir>/src/__test__/**/*.test.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/src/__test__/*.test.ts']
};
