/**
 * 文件同步开发机
 */

var path = require('path'),
    extend = require('extend'),
    rsync = require('rsync'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    util = require('../util'),
    config = util.getConfig()


function sync() {
    var dest,
        setting = {
            flags: 'avz',
            shell: 'ssh'
        }

    if (config.host) {
        dest = config.user + '@' + config.host + ':' + config.devPath
    } else {
        console.log('无配置文件或没配置开发机host')
        return
    }

    gulp.src(path.resolve(config.jsDist, 'appSrc', '*.js'))
        .pipe(gulp.dest(path.resolve(config.dist, 'js')))
        .on('end', function() {
            rsync
                .build(extend({
                    source: [path.resolve(config.cssDist, '*.css'), path.resolve(config.dist, 'js')],
                    destination: dest
                }, setting))
                .execute(clear)
        })

}

function clear() {
    return del(path.resolve(config.dist, 'js')).then(function() {
        gutil.log('同步完成')
    })
}

module.exports = {
    run: sync
}
