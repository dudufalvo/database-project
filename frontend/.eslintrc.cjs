{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022
  },
  "plugins": [
    "@typescript-eslint",
    "babel",
    "eslint-comments",
    "eslint-plugin-no-inline-styles",
    "import",
    "react-hooks",
    "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "browser": true,
    "jest": true
  },
  "rules": {
    "global-require": "off",
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "func-names": "off",
    "no-nested-ternary": "off",
    "no-confusing-arrow": "error",
    "no-console": [
      "error",
      {
        "allow": [
          "info"
        ]
      }
    ],
    "semi": [
      "error",
      "never"
    ],
    "prefer-destructuring": "warn",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "no-unused-expressions": "error",
    "no-multiple-empty-lines": "error",
    "no-inline-styles/no-inline-styles": "error",
    "consistent-return": "warn",
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "default-case": "off",
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "linebreak-style": 0,
    "comma-dangle": [
      "error",
      "only-multiline"
    ],
    "eol-last": [
      "error",
      "always"
    ],
    "eslint-comments/no-unused-disable": "error",
    "import/prefer-default-export": "off",
    "import/no-named-as-default": "off",
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "type",
          "parent",
          "sibling",
          "index",
          "object"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-filename-extension": [
      "warn",
      {
        "extensions": [
          ".js",
          ".jsx",
          ".tsx"
        ]
      }
    ],
    "react/require-default-props": "off",
    "react/jsx-first-prop-new-line": [
      "error",
      "multiline"
    ],
    "react/state-in-constructor": [
      "error",
      "never"
    ],
    "react/static-property-placement": "off",
    "react/jsx-props-no-spreading": "off",
    "react/sort-comp": "off",
    "react/forbid-foreign-prop-types": "error",
    "react/function-component-definition": [
      "error",
      {
        "namedComponents": "arrow-function"
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "quotes": [
      "error",
      "single"
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_"
      }
    ]
  },
  "globals": {
    "File": "readonly",
    "process": "readonly",
    "fetch": "readonly",
    "navigator": "readonly",
    "FormData": "readonly",
    "Headers": "readonly",
    "Blob": "readonly"
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".js",
        ".jsx",
        ".ts",
        ".tsx"
      ]
    },
    "import/resolver": {
      "node": {
        "paths": [
          "src"
        ],
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    },
    "react": {
      "version": "detect"
    }
  }
}