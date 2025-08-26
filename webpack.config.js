const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
		library: {
			name: 'eou-experience-utilities',
			type: 'umd'
		},
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	externals: {
		react: 'react',
		'react-dom': 'react-dom',
		'@ellucian/react-design-system/core': '@ellucian/react-design-system/core',
		'@ellucian/react-design-system/core/styles/tokens': '@ellucian/react-design-system/core/styles/tokens',
		'@ellucian/experience-extension-utils': '@ellucian/experience-extension-utils'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	mode: 'production'
};