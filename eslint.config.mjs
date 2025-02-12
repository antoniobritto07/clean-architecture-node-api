import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(""), {
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "module",
        ecmaVersion: 2020,

        parserOptions: {
            project: "tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/method-signature-style": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/return-await": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/n/no-path-concat": "off",
        "n/no-path-concat": "off",
    },
    ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/docs/**",
        "**/scripts/**",
        "**/tests/**",
        "**/test/**",
        "**/__tests__/**",
        "**/__snapshots__/**",
        "**/__fixtures__/**",
        "**/__mocks__/**",
        "**/__generated__/**",
        "**/__data__/**",
        "**/__resources__/**",
        "**/__snapshots__/**",
        "**/__tests__/__snapshots__/**",
        "**/__tests__/__mocks__/**",
        "**/__tests__/__fixtures__/**",
        "**/__tests__/__generated__/**",
    ],
}];