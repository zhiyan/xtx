/**
 * 清理编译目录
 * @description 删除build和dist目录
 */

var del = require("del"),
	util = require("../util"),
	gutil = require("gulp-util"),
	config = util.getConfig()

function clean( cb ){
	
	cb = cb || gutil.noop

	var callback = function(){
		gutil.log("清理目录完成")
		cb()
	}

	gutil.log("正在清理目录")
	return del([
        config.build,
        config.dist
    ]).then(callback)
}

module.exports = {
	run: clean
}