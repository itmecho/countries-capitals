module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    'jest-extended'
  ],
  collectCoverageFrom: [
    'src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
