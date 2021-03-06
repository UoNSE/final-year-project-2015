'use strict';

var gulp = require('gulp');
var exec = require('gulp-exec');
var less = require('gulp-less');
var jshint = require('gulp-jshint');

/**
 * Configuration: paths to scrips and resources.
 */
var paths = {
    client: ['src/app/*.js', 'src/app/**/*.js'],
    styles: ['src/resources/css']
};

/**
 * Compiles .less files.
 */
gulp.task('less', function () {
    return gulp.src('src/resources/css/*.less')
        .pipe(less({
            paths: paths.styles
        }))
        .pipe(gulp.dest('src/resources/css/'));
});

/**
 * Performs a JSHint code evaluation.
 */
gulp.task('lint', function () {
    return gulp.src(paths.client)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Serves our Node server.
 */
gulp.task('serve', function () {
    gulp.src('./')
        .pipe(exec('node app.js'));
});

/**
 * Task:
 * - initiates 'serve' and reloads changes.
 * - bundles above tasks.
 */
gulp.task('start', ['serve', 'less', 'lint'], function () {
    // add additional config
});

/**
 * Default startup task.
 */
gulp.task('default', ['start']);