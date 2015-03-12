var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var stylus = require('gulp-stylus');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

//script task
gulp.task('js', function() {
    gulp.src(['public/ng/module.js', 'public/ng/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets'))
        .pipe(livereload());
});

gulp.task('watch:js', ['js'], function() {
    livereload.listen();
    gulp.watch('public/ng/**/*.js', ['js']);
});

//css task
gulp.task('css', function() {
    gulp.src('public/css/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('public/assets'))
        .pipe(livereload());
});

gulp.task('watch:css', function() {
    livereload.listen();
    gulp.watch('public/css/**/*.styl', ['css']);
});

//html task
gulp.task('html', function() {
    gulp.src('public/ng/views/**/*.html')
        .pipe(livereload());
});

gulp.task('watch:html', function() {
    livereload.listen();
    gulp.watch('public/ng/views/**/*.html', ['html']);
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
gulp.task('dev', ['watch:css', 'watch:js', 'watch:html', 'dev:server']);
