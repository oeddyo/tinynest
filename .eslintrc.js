// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["universe/native", "prettier"],
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
    "prettier/prettier": [
      "error",
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: false,
        trailingComma: "es5",
        bracketSpacing: true,
      },
    ],
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "parens-new-line",
        prop: "parens-new-line",
      },
    ],
    "react/jsx-max-props-per-line": [
      "error",
      { maximum: 1, when: "multiline" },
    ],
  },
  ignorePatterns: ["/dist/*"],
};
