/**
 * 显示帮助
 */

var help = require("u-help"),
	pkg = require("../package.json")

function help(){
	help.show('xtx v' + pkg.version, {
        "命令": {
            build: '构建代码',
            clean: '清理编译文件',
            dist: '输出编译文件',
            img: '图片目录压缩',
            sync: '同步代码到开发机',
            server: '本地调试服务器',
            release: '发布',
            upload: '上传文件到storage'
        }
    })
}

module.exports = {
	run : help
}