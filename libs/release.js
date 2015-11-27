/**
 * 发布静态文件
 */

var async = require("async"),
    path = require("path"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    build = require("./build").run,
    util = require("../util"),
    config = util.getConfig()


function releaseScript(cb) {
    
    return gulp.src(path.resolve(config.jsDist, "appSrc/*.js"))
        .on("end", cb)
        .pipe(gulp.dest(path.resolve(config.release, "js")))
}

function releaseStyle(cb) {
    return gulp.src(path.resolve(config.cssDist, "*.css"))
        .on("end", cb)
        .pipe(gulp.dest(config.release))
}

function release(cb) {

    cb = cb || gutil.noop

    async.series([
        build,
        releaseStyle,
        releaseScript
    ], function() {
        cb()
    })
}

module.exports = {
    run: release
}
