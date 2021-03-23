const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync');
const imagemin = require('gulp-image');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function(){
    return gulp.src('./css/**/*.css')
    .pipe(cleanCSS({
        level: 2
      }))
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream())
});

gulp.task('js', function (){
    return gulp.src('./js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
});

gulp.task('img', function (){
    return gulp.src('./img/**')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./build/img'))
});

gulp.task('sass-compile', function(){
    return gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'));
});

gulp.task('clean', function (){
    return del(['build/*'])
});

gulp.task('watch', function (){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./img/**', gulp.series('img'))
    gulp.watch('./css/**/*.css', gulp.series('css'))
    gulp.watch('./js/**/*.js', gulp.series('js'))
    gulp.watch('./scss/**/*.scss', gulp.series('sass-compile'))
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', gulp.parallel('css','js','img')));
gulp.task('dev', gulp.series('build','watch'));