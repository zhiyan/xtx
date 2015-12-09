/**
 * base64图片
 */

var fs = require("fs-extra"),
	path = require("path"),
	util = require("../util"),
	gutil = require("gulp-util"),
	config = util.getConfig(),
	args = util.args()

function base64(){
	var param = args.param,
		res,
		filePath,
		ext

	if( param.length ){
		filePath = param[0]
		if(!fs.existsSync(filePath)){
			gutil.log("文件不存在")
			return false
		}
		ext = path.parse(filePath).ext.substring(1)
		if( ext in config.mime ){
			res = ["data:",config.mime[ext],";base64,"]
			res.push(fs.readFileSync(filePath,'base64'))
			console.log(res.join(""))
		}
		
	}else{
		gutil.log("请指定要编码的图片!")
	}
	
}

module.exports = {
	run: base64
}