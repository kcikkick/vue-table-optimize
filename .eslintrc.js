// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'no-console': ['off'],
    'arrow-parens': ['error', 'as-needed'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'brace-style': ['error', 'stroustrup'],
    'prefer-template': 'error',
    'object-curly-spacing': ['error', 'never'],
    // allow debugger during development
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-quotes': ['error', 'single'],
    'vue/mustache-interpolation-spacing': ['error', 'never'],
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-multi-spaces': ['error'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/require-v-for-key': ['off'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
