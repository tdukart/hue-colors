module.exports = function ( grunt ) {

	grunt.config.set( 'watch', {
		scripts: {
			files: ['src/**/*'],
			tasks: ['webpack:dev'],
			options: {
				spawn: false
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-newer' );
};
