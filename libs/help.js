/**
 * 显示帮助
 */

var help = require("u-help"),
	pkg = require("../package.json")

function main(){
	help.show('xtx v' + pkg.version, {
        "命令": {
            build: '构建代码',
            clean: '清理编译文件',
            dist: '输出编译文件',
            sync: '同步代码到开发机',
            server: '本地调试服务器',
            release: '发布',
            upload: '上传文件到storage',
            pure : '简洁模式',
            base64 : 'base64图片'
        }
    })
}

module.exports = {
	run : main
}