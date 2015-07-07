var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var karma = require('karma').server;
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Test
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function () {
        done();
    });
});


// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('src/app//**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
    return gulp.src('src/common/images/**/*')
        .pipe(gulp.dest('../server/build-dev/assets/images'))
        .pipe(gulp.dest('build/prod/assets/images'))
        .pipe($.size({title: 'images'}));
});

//

// Copy web fonts to dist
gulp.task('fonts', function () {
    return gulp.src(['app/common/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'src/sass/**/*.scss'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.changed('.tmp/styles', {extension: '.css'}))
        .pipe($.sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('../server/build-dev/assets/styles'))
        .pipe(gulp.dest('build/prod/assets/styles'))
        .pipe($.size({title: 'styles'}));
});

// Turn partials into JS templates
gulp.task('html2js', function () {
    gulp.src('src/app/**/**/*.tpl.html')
        .pipe(gulp.dest('../server/build-dev/app'))
        // Minify
        .pipe($.minifyHtml({
            empty: true,
            sparse: true,
            quotes: true
        }))
        // Put the minified HTML into appropriate folders in prod
        .pipe(gulp.dest('build/prod/app/'))
        .pipe($.ngHtml2js({
            moduleName: 'PartialTemplates',
            prefix: '/partials'
        }))
        .pipe($.concat('partials.js'))
        .pipe(gulp.dest('src/app/util/partials'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/common/scripts/**.js')
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('../server/build-dev/assets/script'))
        .pipe($.uglify())
        .pipe(gulp.dest('build/prod/assets/script/'));
});

// Build angular components
gulp.task('ng', function () {
    return gulp.src(['src/app/**/*.js', '!src/app/**/*.spec.js'])
        .pipe($.ngAnnotate())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('../server/build-dev/app/'))
        .pipe($.uglify())
        .pipe(gulp.dest('build/prod/app/'));
});

// Build CSS Libs
gulp.task('css-lib', function () {
    return gulp.src('vendor/min/*.css')
        .pipe($.concat('lib.css'))
        .pipe(gulp.dest('build/prod/assets/styles'))
        .pipe(gulp.dest('../server/build-dev/assets/styles'));
});

// HTML Minify
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('../server/build-dev'))
        .pipe($.minifyHtml())
        .pipe(gulp.dest('build/prod'));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'build/*', '../server/build-dev/*', '!dist/.git'], {
    dot: true,
    force: true
}));

// Watch files for changes & reload
gulp.task('live', function () {
    gulp.watch(['src/app/**/**/*.tpl.html', 'src/app/**/*.js', '!src/app/util/partials'], ['live-script']);
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/common/images/**/*', ['images']);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'MPH',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});

// Build production files, the default task
gulp.task('default', ['clean'], function () {
    runSequence('styles', ['jshint', 'images', 'fonts', 'html2js', 'ng', 'html', 'css-lib', 'scripts']);
});

gulp.task('live-task', function () {
    runSequence('styles', ['jshint', 'images', 'fonts', 'html2js', 'ng', 'html', 'css-lib', 'scripts']);

});

gulp.task('live-script', function () {
    runSequence('html2js', ['ng']);
});

