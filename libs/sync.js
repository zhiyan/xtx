/**
 * 文件同步开发机
 */

var config = require("../config"),
	fs = require("fs-extra"),
	path = require("path"),
	cjson = require("cjson"),
	extend = require("extend"),
	rsync = require("rsync")


function sync(){
	var devConfig = {},
        dest,
        setting = {
            flags: "avz",
            shell: "ssh"
        }

    if (fs.existsSync(config.devConfig)) {
        devConfig = cjson.load(config.devConfig)
        dest = (devConfig.user || "root") + "@" + devConfig.host + ":" + (devConfig.path || config.devPath)
    } else {
        console.log("没有.dev配置文件")
        return;
    }

    // css
    rsync
        .build(extend({
            source: path.resolve(config.cssDist, "*.css"),
            destination: dest
        }, setting))
        .execute()

    // js
    rsync.build(extend({
            source: path.resolve(config.jsDist, "appSrc", "*.js"),
            destination: dest + "/js"
        }, setting))
        .execute()

}

module.exports = {
	run : sync
}