/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
	root: true,
	extends: ["@econominhas", "@econominhas/eslint-config/typescript"],
	parserOptions: {
		project: "tsconfig.lint.json",
	},
};
