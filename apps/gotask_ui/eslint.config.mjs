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
  // TypeScript ESLint with properly configured parser options
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
      // Change all type-related rules to warnings (1) instead of errors (2)
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      // You can add more type-related rules here as needed
    }
  }
]);