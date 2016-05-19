/**
 * dependencies
 */
var pkg				= require('./package.json');
var gulp 			= require('gulp');
var order 			= require('gulp-order');
var livereload 		= require('gulp-livereload');
var gulpif 			= require('gulp-if');
var srcmaps 		= require('gulp-sourcemaps');
var jshint 			= require('gulp-jshint');
var concat 			= require('gulp-concat');
var stripDebug 		= require('gulp-strip-debug');
var uglify 			= require('gulp-uglify');
var isProduction 	= pkg.environment === 'production';
var jspaths = [
	pkg.pathToSrc + 'js/app/core/*.js',
	pkg.pathToSrc + 'js/app/base/*.js',
	pkg.pathToSrc + 'js/app/services/*.js',
	pkg.pathToSrc + 'js/app/components/*.js',
	pkg.pathToSrc + 'js/app/*.js'
];

/**
 * scripts task
 * concatenate
 * environment-sensitive minification
 */
gulp.task('scripts', function() {
	// prepend our pathToJs to each js file in the manifest (to make our lives easy -- less writing)
	return gulp.src(jspaths)
		// order files
		.pipe(order(jspaths, {
			base: './'
		}))

		// js hinting for code standards
		.pipe(jshint())
		.pipe(jshint.reporter('default'))

		// if we're not in production mode, prepare to output sass sourcemaps
		.pipe(gulpif(!isProduction, srcmaps.init()))
		
		// concatenate all our js files into one file named shop.js
		.pipe(concat(pkg.javascriptName + '.js'))

		// if we are in production mode,
		// strip out our console.logs and debugger statements
		.pipe(gulpif(isProduction, stripDebug()))
		
		// again, if we're not in production mode, output sourcemap
		.pipe(gulpif(!isProduction, srcmaps.write()))

		// uglify or beatify our js,
		// depending on environment (production or develop)
		.pipe(uglify({
			mangle: isProduction,
			compress: isProduction,
			output: {
				beautify: !isProduction,
				comments: !isProduction
			},
			preserveComments: !isProduction
		}))

		// output our js to our specified destination
		.pipe(gulp.dest(pkg.pathToDest))

		// refresh browser
		.pipe(livereload());
});

/**
 * when manifest is changed,
 * reload it and run `scripts`
 */
gulp.task('reloadManifest', function() {
	jsmanifest = require('./jsmanifest.json');
	gulp.start('scripts');
});

//-------------------------------
// Gulp Watch
//-------------------------------
gulp.task('watch', function() {
	// js watchers
	livereload.listen();
	gulp.watch(pkg.pathToSrc + '**/*.js', ['scripts']);
	gulp.watch('jsmanifest.json', ['reloadManifest']);
});

//-------------------------------
// Default Task
//-------------------------------
gulp.task('default', function() {
	gulp.start('scripts');
	gulp.start('watch');
});