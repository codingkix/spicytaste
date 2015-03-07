var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var stylus = require('gulp-stylus');

var nodemon = require('gulp-nodemon');

//script task
gulp.task('js', function() {
    gulp.src('public/ng/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets'));
});

gulp.task('watch:js', ['js'], function() {
    gulp.watch('public/ng/**/*.js', ['js']);
});

//css task
gulp.task('css', function() {
    gulp.src('public/css/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('public/assets'));
});

gulp.task('watch:css', function() {
    gulp.watch('public/css/**/*.styl', ['css']);
});


//server task
gulp.task('dev:server', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['public/ng*', 'public/assets*']
    });
});

//dev task
gulp.task('dev', ['watch:css', 'watch:js', 'dev:server']);
