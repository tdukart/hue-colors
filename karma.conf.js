// Karma configuration
// Generated on Sun Aug 21 2016 17:46:27 GMT-0400 (EDT)

var webpackConfig = require( './webpack.config.js' );
webpackConfig.entry = {};
webpackConfig.devtool = 'inline-source-map';

//delays coverage til after tests are run, fixing transpiled source coverage error
webpackConfig.module.postLoaders = [
	{
		test: /\.js$/,
		exclude: /(test|node_modules|bower_components)\//,
		loader: 'istanbul-instrumenter'
	}
];

var path = require( 'path' );

module.exports = function ( config ) {
	config.set( {
		basePath: '',
		frameworks: [
			'jasmine',
			'jasmine-matchers'
		],
		reporters: ['progress', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,

		resolve: {
			root: [
				path.resolve( './src' )
			]
		},

		files: [
			'test/*.js'
		],

		preprocessors: {
			'src/*.js': ['webpack', 'sourcemap'],
			'test/*.js': ['webpack', 'sourcemap']
		},

		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},

		webpack: webpackConfig,
		webpackMiddleware: {noInfo: true},

		concurrency: Infinity
	} );
};
