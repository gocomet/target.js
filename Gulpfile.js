/**
 * dependencies
 */
var pkg				= require('./package.json');
var jsmanifest 		= require('./jsmanifest.json');
var gulp 			= require('gulp');
var babel 			= require('gulp-babel');
var livereload 		= require('gulp-livereload');
var gulpif 			= require('gulp-if');
var srcmaps 		= require('gulp-sourcemaps');
var jshint 			= require('gulp-jshint');
var concat 			= require('gulp-concat');
var stripDebug 		= require('gulp-strip-debug');
var uglify 			= require('gulp-uglify');
var exec 			= require('child_process').exec;
var argv 			= require('yargs').argv;
var headerFooter 	= require('gulp-headerfooter');
var isProduction 	= pkg.environment === 'production';

/**
 * scripts task
 * transpile ES6 to 5
 * concatenate
 * environment-sensitive minification
 */
gulp.task('scripts', function() {
	// prepend our pathToJs to each js file in the manifest (to make our lives easy -- less writing)
	var jspaths = [];
	jsmanifest.forEach(function(val) { 
		jspaths.push(pkg.pathToSrc + 'js/' + val + '.js');
	});
	
	return gulp.src(jspaths)
		// js hinting for code standards
		.pipe(jshint())
		.pipe(jshint.reporter('default'))

		// if we're not in production mode, prepare to output sass sourcemaps
		.pipe(gulpif(!isProduction, srcmaps.init()))
		
		// concatenate all our js files into one file named shop.js
		.pipe(concat(pkg.javascriptName + '.js'))

		// transpile ES6 to ES5
		.pipe(babel({
			presets: ['es2015']
		}))

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
				beautify: !isProduction
			},
			preserveComments: !isProduction
		}))

		// wrap in IIFE
		.pipe(headerFooter('(function() {', '})();'))

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