module.exports = function ( grunt ) {

	grunt.config.set( 'webpack', {
		dev: require('../../webpack.config.js')
	} );

	grunt.loadNpmTasks( 'grunt-webpack' );
};
