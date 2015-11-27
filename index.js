var fs = require("fs-extra"),
    path = require("path")

// expose xtx
module.exports = {
    run: run
}

/**
 * xtx命令入口
 * @param  {String} cmd 命令名称
 */
function run(cmd) {
    var cmdPath = path.join(__dirname, "libs", cmd + ".js")

    // 若找不到命令，显示帮助
    if (!fs.existsSync(cmdPath)) {
        cmdPath = path.join(__dirname, "libs/help.js")
    }

    require(cmdPath).run()
}
