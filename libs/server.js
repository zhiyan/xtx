/**
 * 本地开发服务器
 */

var fs = require('fs-extra'),
    gulp = require('gulp'),
    browserSync = require('browser-sync'),
    buildStyle = require('./build').css,
    util = require('../util'),
    config = util.getConfig()


gulp.task('buildStyle', function() {
    buildStyle(browserSync.reload)
})

function server() {
    browserSync.init({
        server: {
            baseDir: '.',
            directory: true,
            middleware: middlewareBuilder()
        },
        port: 9000
    })
    gulp.watch(config.cssRoot + '/**/*.scss', ['buildStyle'])
    gulp.watch([config.html + '/**/*.html', config.jsSource + '/**/*.js']).on('change', browserSync.reload)
}

/**
 * 本地dev服务器中间件
 * @return {Array} 中间件数组
 */
function middlewareBuilder() {

    var middlewares = []

    // 非GET请求处理
    middlewares.unshift(function(req, res, next) {

        if (['POST', 'PUT', 'DELETE'].indexOf(req.method.toUpperCase()) !== -1) {
            if (fs.existsSync(req.url) && fs.statSync(req.url).isFile()) {
                return res.end(fs.readFileSync(req.url))
            }
        }

        return next()
    })

    // mock处理
    middlewares.unshift(function(req, res, next) {

        req.url = req.url.replace(/^\/mock\//, '/')

        return next()
    })

    if (!config.compatible) {

        // 旧版兼容
        middlewares.unshift(function(req, res, next) {

            req.url = req.url.replace(/^\/static\//, '/src/')
                .replace(/^\/pages2\//, '/html/')

            if (/^\/src\/css\/(.)*\.css(.map)?$/.test(req.url)) {
                req.url = req.url.replace(/^\/src/, '/build')
            }

            return next()
        })
    }


    return middlewares
}

module.exports = {
    run: server
}
