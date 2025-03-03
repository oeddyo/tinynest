// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  rules: {
    "comma-dangle": ["error", "never"],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "object-curly-spacing": ["error", "always"],
    indent: ["error", 2],
    "max-len": ["warn", { code: 100 }]
  },
  ignorePatterns: ["/dist/*"]
};
