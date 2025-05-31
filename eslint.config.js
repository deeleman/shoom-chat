import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
      "dist/**/*",
      "node_modules",
      "public",
      "src/server/**/*",
      "eslint.config.js"
    ]),
  {
    files: ["src/client/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  reactHooks.configs["recommended-latest"],
  [{
    rules: {
			"react/prop-types": "off",
			"react/react-in-jsx-scope": "off",
		},
  }]
]);
