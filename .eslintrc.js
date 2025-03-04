// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["prettier"],
  rules: {
    "comma-dangle": ["error", "never"],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "object-curly-spacing": ["error", "always"],
    indent: ["error", 2],
    "max-len": ["warn", { code: 100 }],
    "prettier/prettier": "error",
  },
  ignorePatterns: ["/dist/*"],
};
