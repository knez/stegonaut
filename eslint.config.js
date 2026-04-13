import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                crypto: "readonly",
                FileReader: "readonly",
                Blob: "readonly",
                TextEncoder: "readonly",
                Uint8Array: "readonly",
                alert: "readonly",
                setTimeout: "readonly",
                localStorage: "readonly",
            },
        },
        rules: {
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "camelcase": ["error"],
            "no-unused-vars": "warn",
        },
    },
];
