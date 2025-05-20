const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const inquirer = require('inquirer');

// Start : reward - FO
gulp.task('scss:reward', function () {
  console.log('reward FO SCSS 컴파일...');

  return gulp.src('./assets/scss/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded', indentType: 'tab', indentWidth: 1,}))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));

});

gulp.task('scss_map:reward', function () {
  console.log('reward FO SCSS 컴파일...');
  return gulp.src('./assets/scss/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('watch:reward', gulp.series(function () {
  var initTask = gulp.series('scss:reward');
  initTask();
  console.log('Executing Watch Function');

  browserSync.init({
    server: {
      baseDir: './'
    },
  });
  var html = gulp.watch('*.html');
  /*html.on('change', function (path, stats) {
      browserSync.notify("html file Changed!");
      browserSync.reload("*.html");
  });*/

  var js = gulp.watch('./assets/js/*.js');
  js.on('change', function (path, stats) {
    browserSync.notify("js file Changed!");
    browserSync.reload("*.js");
  });

  var scss = gulp.watch('./assets/scss/**/*.scss', gulp.series('scss:reward'));
  scss.on('change', function (path, stats) {
    browserSync.notify("SCSS Changed!");
    browserSync.reload("*.scss");
  });

}));

gulp.task('watch', function () {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Watch할 타겟을 선택해주세요.',
      choices: ['watch:reward'],
    },
  ]).then(function (res) {
    gulp.series(res.selected)();
  });
});