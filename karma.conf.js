// Karma configuration
// Generated on Mon Feb 08 2016 11:50:56 GMT-0800 (PST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        // list of files / patterns to load in the browser
        files: [
            'public/assets/angular/angular.js',
            'public/assets/angular-route/angular-route.js',
            'public/assets/angular-md5/angular-md5.js',
            'public/assets/angular-material/angular-material.js',
            'public/assets/angular-messages/angular-messages.js',
            'public/assets/angular-animate/angular-animate.js',
            'public/assets/angular-aria/angular-aria.js',
            'public/assets/angular-mocks/angular-mocks.js',
            'public/assets/app.js',
            'public/test/unit/*.js',
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
