/*jslint node: true */
"use strict";
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('jshint', function () {
    return gulp.src(['**/*.js', '!node_modules/**/**', '!build-dev/**/**', '!lib/feedfetcher/lib/**'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// Tests
gulp.task('test', function () {
    return gulp.src('./tests/test.js')
        .pipe($.mocha({reporter: 'nyan'}));
});