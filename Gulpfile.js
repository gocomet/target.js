
var pkg           = require('./package.json');
var gulp          = require('gulp');
var babelify      = require('babelify');
var bro           = require('gulp-bro');
var rename        = require('gulp-rename');
var argv          = require('yargs').argv;

const IS_PROD = argv.p || 0;

var transformDefault = [
  babelify.configure({ presets: ['es2015'] })
];

gulp.task('scripts', function() {
  var transform = [].concat(transformDefault);
  var name = IS_PROD ? 'target.min.js': 'target.js';

  // only minify JS when in production
  if (IS_PROD) {
    transform.push(['uglifyify', { global: true }]);
  }  

  return gulp.src(pkg.main)
    .pipe(bro({ transform: transform }))
    .pipe(rename(name))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['scripts']);
});
