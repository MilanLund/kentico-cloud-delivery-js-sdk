const gulp = require('gulp'),
      eslint = require('gulp-eslint');
gulp.task('lint', () => {
  return gulp.src(['src/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], () => {
});
