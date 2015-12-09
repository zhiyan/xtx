var fs = require("fs-extra"),
    path = require("path"),
    gutil = require("gulp-util")

// expose xtx
module.exports = {
    run: run
}

/**
 * xtx命令入口
 * @param  {String} cmd 命令名称
 */
function run(cmd) {
	cmd = cmd.split(":")

    var cmdPath = path.join(__dirname, "libs", cmd[0] + ".js"),
    	cb = cmd[1] || "run",
    	lib

    // 若找不到命令，显示帮助
    if (!fs.existsSync(cmdPath)) {
        cmdPath = path.join(__dirname, "libs/help.js")
    }

    lib = require(cmdPath)

    if(lib[cb]){
    	lib[cb]()
    }else{
    	gutil.log("没有找到" + cb + "命令!")
    }

}
