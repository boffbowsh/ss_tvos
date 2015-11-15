const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');

var b = watchify(browserify({
  entries: ['./js/index.js'],
  plugins: [watchify],
  insertGlobalVars: {
  }
}));

b.transform("babelify", {presets: ["es2015"]});

function bundle() {
  return b.bundle()
  .on('error', (err) => {
      console.error(err.message);
  })
  .pipe(source("index.js"))
  .pipe(gulp.dest('dist'));
}

gulp.task("default", bundle);
b.on('update', bundle);
b.on('log', gutil.log);
