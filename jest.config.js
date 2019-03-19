module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/']
};