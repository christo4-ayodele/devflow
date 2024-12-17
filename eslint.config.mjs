import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Combine extends and plugins using FlatCompat
const eslintConfig = [
  // Load and extend configurations
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:tailwindcss/recommended",
    "prettier"
  ),

  // Add plugins
  ...compat.plugins("import"),

  // Custom rules
  {
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Built-in modules
            "external", // External libraries
            "internal", // Internal modules
            ["parent", "sibling"], // Parent and sibling modules
            "index", // Index file imports
            "object", // Object imports
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },

    // Ignore specific files or patterns
    ignores: ["components/ui/**"],
  },

  // Overrides for specific file types
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
