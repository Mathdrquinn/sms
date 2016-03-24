console.log('------ base-app ------');
console.log(process.cwd());

var gulp = require('gulp');
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    express = require('express'),
    liveReload = require('connect-livereload');

// Trying to find index.html in sibling directory
gulp.task('express', function() {
  var app = express();
  app.use(liveReload({port: 4002}));
  app.use(express.static( __dirname + '/public' ));
  app.listen(4000);
});


var tinylr;
gulp.task('livereload', function() {
  console.log('livereload');
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
  console.log('Listening on port 4000');
});

function notifyLiveReload(event) {
  console.log('notify live reload');
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('build-css', function() {
  console.log('build-css');
  return sass('dev/scss/styles.scss', { style: 'expanded' })
  .pipe(gulp.dest('public/src/css'))
  .pipe(autoPrefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
  .pipe(gulp.dest('public/src/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('public/src/css'));
});

gulp.task('build-js', function() {
  console.log('build-js');
  return gulp.src(['dev/js/app.js', 'dev/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(process.env.NODE_ENV === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/src/js'));
});

gulp.task('watch', function() {
  console.log('watch');
  gulp.watch('public/index.html', notifyLiveReload);
  gulp.watch('public/src/tpl/*.html', notifyLiveReload);
  gulp.watch('dev/scss/**/*.scss', ['build-css']);
  gulp.watch('public/src/css/**/*.css', notifyLiveReload);
  gulp.watch('dev/js/**/*.js', ['build-js']);
  gulp.watch('public/src/js/**/*.js', notifyLiveReload);
});


gulp.task('default', ['build-css', 'build-js', 'express', 'livereload', 'watch'], function() {

});
