module.exports = {
	devtool: 'source-map',
	entry: './src/main.js',
	output: {
		path: 'dist',
		filename: 'hue-colors.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.json']
	}
};