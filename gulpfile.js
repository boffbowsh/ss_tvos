const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');
const s3 = require('gulp-s3');

var aws = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: "ss-tvos",
  region: "eu-west-1"
};

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

gulp.task("publish", ["default"], function() {
  gulp.src('./dist/**')
    .pipe(s3(aws));
});
