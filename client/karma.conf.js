module.exports = function (config) {
    config.set({
        basePath: './',

        files: [
            'src/components/angular/angular.js',
            'src/components/angular-*/angular-*.js',
            'build/prod/app/**/*.js',
            'test/lib/angular-mocks/angular-mocks.js',
            'src/**/*.spec.js'
        ],

        exclude: [
            'app/lib/angular/angular-loader.js',
            'app/lib/angular/*.min.js',
            'app/lib/angular/angular-scenario.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    })
};