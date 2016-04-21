/**
 * 编译静态文件
 */

var path = require('path'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    rjs = require('requirejs'),
    glob = require('glob'),
    async = require('async'),
    clean = require('./clean').run,
    dist = require('./dist').run,
    util = require('../util'),
    config = util.getConfig(),
    includePaths = require('bourbon').includePaths,
    args = util.args()

/**
 * 编译css文件
 */
function buildStyle(cb) {

    cb = cb || gutil.noop

    var sassSetting = {
        'outputStyle': 'compressed',
        'precision': 10,
        'includePaths': [config.cssRoot].concat(includePaths)
    }

    var autoprefixerSetting = {
        'browsers': ['last 2 versions', 'ie 9'],
        'map': true
    }

    var callback = function() {
        gutil.log('css编译完毕!')
        cb()
    }

    gutil.log('开始编译css...')

    return gulp.src(path.join(config.cssSource, '/**/*.scss'))
        .on('end', callback)
        .pipe(sourcemaps.init())
        .pipe(sass(sassSetting).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerSetting))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.cssBuild))
}

/**
 * 编译js文件
 */
function buildScript(cb) {

    cb = cb || gutil.noop

    gutil.log('开始编译js...')

    rjs.optimize({
        appDir: config.jsSource,
        baseUrl: '.',
        stubModules: ['cs', 'jsx', 'text', 'JSXTransformer'],
        mainConfigFile: config.requireConfig,
        skipModuleInsertion: false,
        wrapShim: true,
        optimizeCss: 'none',
        dir: config.jsBuild,
        optimize: 'none',
        modules: typeof config.module === 'function' ? config.module(config.jsSource, glob, args) : (config.module || [])
    }, function() {
        gutil.log('js编译完毕!')
        cb()
    })
}

function build(cb) {

    cb = cb || gutil.noop
    async.series([
        clean,
        buildStyle,
        buildScript,
        dist
    ], function() {
        cb()
    })
}

module.exports = {
    run: build,
    js: buildScript,
    css: buildStyle
}
