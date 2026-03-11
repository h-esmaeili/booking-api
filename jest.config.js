module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/generated/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/generated/"],
};