module.exports = {
  env: {browser: true, es2020: true},
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh", "react", "prettier"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-misused-promises": "off",
    "react/no-unknown-property": ["error", {ignore: ["css"]}],
  },
  ignorePatterns: ["/functions/**"],
};
