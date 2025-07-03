module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
  },
  overrides: [
    {
      files: ["backend/**/*.js"],
      env: {
        node: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        // Disabilita regole frontend che non servono qui
      },
    },
  ],
};
