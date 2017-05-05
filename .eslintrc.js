var something = '';
module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: '2017',
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
		},
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-console': 'off',
		'comma-dangle': ['error', 'always-multiline'],
	},
};
