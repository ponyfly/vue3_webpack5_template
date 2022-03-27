const path = require("path");
console.log(__dirname)
module.exports = {
	entry: path.resolve(__dirname, '../src/main.ts'),
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../src'),
		},
		modules: [path.resolve(__dirname, '../src'), 'node_modules'],
	},
	devtool: 'eval-cheap-module-source-map',
	externals: {
		lodash: '_',
	}
}
