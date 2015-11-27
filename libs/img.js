/**
 * 压缩图片
 */

var path = require("path"),
    gulp = require("gulp"),
    imagemin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant"),
    gutil = require("gulp-util"),
    util = require("../util"),
    config = util.getConfig()


function img() {
    var callback = function(){
        gutil.log("压缩输出图片完毕.")
    }
    gutil.log("正在压缩输出图片...")
    return gulp.src(path.resolve(config.imgSource, "**/*"))
        .on("end",callback)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.resolve(config.imgBuild)));
}

module.exports = {
    run: img,
}
