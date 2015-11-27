/**
 * 上传文件到storage
 * @augments --no-md5 不加MD5时间戳
 */

var config = require("../config"),
    util = require("../util"),
    path = require("path"),
    fs = require("fs-extra"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    up = require("gulp-upload"),
    md5 = require('blueimp-md5').md5

var args = util.args()

/**
 * 上传主函数
 */
function upload(){
    var filePath,
        distPath,
        pathObj,
        content

    if (args.param.length && fs.existsSync(args.param[0])) {

        filePath = args.param[0]
        distPath = args.param[1]

        pathObj = path.parse(filePath)

        if (!distPath && pathObj.ext in config.defaultStoragePath) {
            distPath = config.defaultStoragePath[pathObj.ext]
        }

        content = fs.readFileSync(filePath).toString()

        // md5
        // 二进制文件每次根据时间戳生成最新md5值,
        // 文本文件根据内容生成md5
        if (!~args.ctrl.indexOf("no-md5")) {
            pathObj.name = md5(util.isBinary(content) ? +new Date() : content) + "." + pathObj.name
        }

        // 文件名覆盖
        pathObj.base = pathObj.name + pathObj.ext

        // 上传路径覆写
        pathObj.dir = distPath

        gulp.src(path.join(filePath))
            .pipe(up({
                server: config.storage + path.format(pathObj),
                callback: callback
            }))
    } else {
        gutil.log("[error]缺少参数或文件不存在")
    }
}

/**
 * 上传完成回调函数
 * @description 显示上传后的真实路径
 */
function callback(err,data){
    if (err) {
        gutil.log('[error]' + err.toString());
    } else {
        data = data.toString()
        data = JSON.parse(data)
        gutil.log(data.success ? data.url : data.error)
    }
}

module.exports = {
    run: upload
}