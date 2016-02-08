var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var stylus = require('gulp-stylus');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var childProcess = require('child_process');
var rename = require('gulp-rename');
var nib = require('nib');
var ngConfig = require('gulp-ng-config');
var karma = require('gulp-karma');

gulp.task('config', function() {
    gulp.src('public/ng/app.config.json')
        .pipe(ngConfig('spicyTaste', {
            environment: 'development',
            createModule: false
        }))
        .pipe(gulp.dest('public/ng'));
});


gulp.task('test', function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('autotest', function() {
    return gulp.watch(['public/ng/**/*.js', 'public/test/unit/*.js'], ['test']);
});

//script task
gulp.task('js', function() {
    gulp.src(['public/ng/module.js', 'public/ng/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('public/assets'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        //.pipe(sourcemaps.write())
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
        .pipe(concat('site.styl'))
        .pipe(stylus({
            use: [nib()],
            import: ['nib'],
            compress: true
        }))
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
    childProcess.exec('mongod', function(err, stdout, stderr) {
        console.log(stdout);
    });

    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['public/ng*', 'public/assets*'],
        env: {
            'NODE_ENV': 'production'
        }
    });
});

//dev task
gulp.task('dev', ['dev:server', 'config', 'watch:css', 'watch:js', 'watch:html']);
