import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
];