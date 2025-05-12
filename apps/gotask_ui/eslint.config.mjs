import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  {
    // Add this block to disable warnings for unused vars starting with '_'
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { "argsIgnorePattern": "^_" } // Ignore unused variables that start with '_'
      ],
    },
  },
]);
