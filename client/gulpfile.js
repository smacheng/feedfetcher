var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

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
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('build/dev/assets/images'))
        .pipe(gulp.dest('build/prod/assets/images'))
        .pipe($.size({title: 'images'}));
});

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
        .pipe(gulp.dest('build/dev/assets/styles'))
        .pipe($.size({title: 'styles'}));
});

// Turn partials into JS templates
gulp.task('html2js', function () {
    gulp.src('src/app/**/**/*.tpl.html')
        .pipe(gulp.dest('build/dev/app'))
        // Minify
        .pipe($.minifyHtml({
            empty: true,
            sparse: true,
            quotes: true
        }))
        .pipe(gulp.dest('build/prod/app/'))
        .pipe($.ngHtml2js({
            moduleName: 'PartialTemplates',
            prefix: '/partials'
        }))
        .pipe($.concat('partials.js'))
        .pipe(gulp.dest('src/app/util/partials'));
});

// Build angular components
gulp.task('ng', function () {
    return gulp.src('src/app/**/*.js')
        .pipe($.ngAnnotate())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('build/dev/app/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest('build/prod/app/'));
});

// Stitch together script libs for dev
gulp.task('script-lib-dev', function () {
    return gulp.src('vendor/full/*.js')
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest('build/dev/assets/scripts'));
});

// Stitch together minified script libs for prod
gulp.task('script-lib-prod', function () {
    return gulp.src('vendor/min/*.js')
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest('build/prod/assets/scripts'));
});

// Build CSS Libs
gulp.task('css-lib', function () {
    return gulp.src('vendor/min/*.css')
        .pipe($.concat('lib.css'))
        .pipe(gulp.dest('build/prod/assets/styles'))
        .pipe(gulp.dest('build/dev/assets/styles'));
});

// HTML Minify
gulp.task('html', function () {
    return gulp.src('src/app/**/**/*.html')
        .pipe(gulp.dest('build/dev'))
        .pipe($.minifyHtml())
        .pipe(gulp.dest('build/prod'));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
    browserSync({
        notify: false,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app']
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
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
    runSequence('styles', ['jshint', 'images', 'fonts', 'html2js', 'ng', 'html', 'script-lib-dev', 'script-lib-prod', 'css-lib']);
});

