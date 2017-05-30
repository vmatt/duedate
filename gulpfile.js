
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
gulp.task('default', function() {
	livereload.listen();
	nodemon({
		script: 'index.js',
		ext: 'js'
	}).on('restart', function(){
		gulp.src('index.js')
			.pipe(livereload());
	})
})
