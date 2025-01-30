import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: 
    { globals: 
      {...globals.browser, 
        ...globals.node
      } 
    },
    "node": true,
    "es2021": true,
    "extends": "airbnb-base"
  },
  pluginJs.configs.recommended,
];