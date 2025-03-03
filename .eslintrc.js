// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  rules: {
    "comma-dangle": ["error", "never"],
    // Add any other style rules you want to customize
    semi: ["error", "always"],
    quotes: ["error", "double"]
  },
  ignorePatterns: ["/dist/*"]
};
