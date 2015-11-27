/**
 * 输出静态文件
 */

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    postcss = require("gulp-postcss"),
    uglify = require("gulp-uglify"),
    es = require('event-stream'),
    async = require("async"),
    util = require("../util"),
    config = util.getConfig()


/**
 * 输出css文件
 */
function distStyle(cb) {

    cb = cb || gutil.noop

    var callback = function() {
        gutil.log("css输出完毕!")
        cb()
    }

    gutil.log("开始输出css...")

    return gulp.src(config.cssBuild + "/**/*.css")
        .on("end", callback)
        .pipe(postcss([], {
            map: false
        }))
        .pipe(gulp.dest(config.cssDist))
}

/**
 * 输出js文件
 */
function distScript(cb) {

    cb = cb || gutil.noop

    var callback = function() {
        gutil.log("js压缩输出完毕!")
        cb()
    }

    gutil.log("开始压缩js...")

    return es.merge(
        gulp.src(config.jsBuild + "/appSrc/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/appSrc")),

        gulp.src(config.jsBuild + "/special/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/special")),

        gulp.src(config.jsBuild + "/standalone/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/standalone"))
    ).on("end", callback)
}

function dist(cb) {

    cb = cb || gutil.noop

    async.parallel([
        distStyle,
        distScript
    ], function() {
        cb()
    })
}

module.exports = {
    run: dist,
    js: distScript,
    css: distStyle
}
