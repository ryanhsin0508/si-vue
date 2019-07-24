var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('default', function () {
    return gulp.watch('sass/*.scss', gulp.series('styles'));
});

gulp.task('styles', function () {
    var processors = [
        autoprefixer({
            browsers: ['last 3 versions', 'ie > 9']
        }),
        cssnano()
    ];
    return gulp.src('sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('css/'));
});