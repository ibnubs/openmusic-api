import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: "latest"
      }
    },
    rules: {
      "no-console": "off",
      "no-underscore-dangle": "off",
      "camelcase": "off",
      "linebreak-style": "off"
    }
  },
  pluginJs.configs.recommended
];