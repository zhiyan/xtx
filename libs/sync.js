/**
 * 文件同步开发机
 */

var path = require("path"),
	extend = require("extend"),
	rsync = require("rsync"),
    util = require("../util"),
    config = util.getConfig()


function sync(){
	var dest,
        setting = {
            flags: "avz",
            shell: "ssh"
        }

    if (config.host) {
        dest = config.user + "@" + config.host + ":" + config.devPath
    } else {
        console.log("无配置文件或没配置开发机host")
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