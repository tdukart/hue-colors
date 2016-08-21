module.exports = function ( grunt ) {

	grunt.config.set( 'webpack', {
		dev: {
			devtool: 'source-map',
			entry: './src/main.js',
			output: {
				path: 'dist',
				filename: '<%= pkg.name %>.js'
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
		}
	} );

	grunt.loadNpmTasks( 'grunt-webpack' );
};
