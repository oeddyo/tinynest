// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["universe/native", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: false,
      },
    ],
    "no-console": "warn",
    "no-unused-vars": "warn",
  },
  ignorePatterns: ["/dist/*"],
}
