/**
 * 快速编译
 */

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util")

gulp.task("css", function(){
    return gulp.src(["**/*.scss","**/*.css","!dist/**"])
        .on("end",function(){
            gutil.log("编译css结束")
        })
        .pipe(sass({"outputStyle": "compressed","precision": 10}).on("error", sass.logError))
        .pipe(autoprefixer({"browsers": ["last 2 versions", "ie 9"],"map": true}))
        .pipe(gulp.dest("dist"))
})

gulp.task("js", function(){
    return gulp.src(["**/*.js","!dist/**"])
        .on("end",function(){
            gutil.log("编译js结束")
        })
        .pipe(uglify())
        .pipe(gulp.dest("dist"))
})

function main(){
    gulp.start(["css","js"])
    gulp.watch(["**/*.js","**/*.css","**/*.scss","!dist/**"],["css","js"])
}

module.exports = {
    "run" : main
}
