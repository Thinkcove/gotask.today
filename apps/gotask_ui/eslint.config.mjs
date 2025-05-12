import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,tsx}"] 
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: globals.browser
    }
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  // Add Next.js plugin
  {
    files: ["**/*.{js,ts,tsx}"],
    plugins: {
      next: nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...tseslint.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      
      "@typescript-eslint/no-explicit-any": "warn",
     
    }
  }
]);