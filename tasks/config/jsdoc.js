module.exports = function ( grunt ) {

	grunt.config.set( 'jsdoc', {
		dist: {
			src: ['src/*.js', 'src/**/*.js'],
			options: {
				destination: 'docs'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-jsdoc' );

};
