module.exports = function ( grunt ) {

	grunt.config.set( 'jsdoc', {
		dist: {
			src: ['src/*.js', 'src/**/*.js'],
			options: {
				destination: 'doc'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-jsdoc' );

};
