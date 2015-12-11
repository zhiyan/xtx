/**
 * 编译静态文件
 */

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    gutil = require("gulp-util"),
    rjs = require("requirejs"),
    glob = require("glob"),
    async = require("async"),
    clean = require("./clean").run,
    dist = require("./dist").run,
    util = require("../util"),
    config = util.getConfig(),
    includePaths = require("bourbon").includePaths,
    args = util.args()

/**
 * 编译css文件
 */
function buildStyle(cb) {

    cb = cb || gutil.noop

    var sassSetting = {
        "outputStyle": "compressed",
        "precision": 10,
        "includePaths": [config.cssSource].concat(includePaths)
    }

    var autoprefixerSetting = {
        "browsers": ["last 2 versions", "ie 9"],
        "map": true
    }

    var callback = function() {
        gutil.log("css编译完毕!")
        cb()
    }

    gutil.log("开始编译css...")

    return gulp.src(config.cssSource + "/app/**/*.scss")
        .on("end", callback)
        .pipe(sourcemaps.init())
        .pipe(sass(sassSetting).on("error", sass.logError))
        .pipe(autoprefixer(autoprefixerSetting))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.cssBuild))
}

/**
 * 编译js文件
 */
function buildScript(cb) {

    cb = cb || gutil.noop

    gutil.log("开始编译js...")

    rjs.optimize({
        appDir: config.jsSource,
        baseUrl: ".",
        stubModules: ["cs"],
        mainConfigFile: config.requireConfig,
        skipModuleInsertion: false,
        wrapShim: true,
        optimizeCss: "none",
        dir: config.jsBuild,
        optimize: "none",
        modules: rjModules()
    }, function() {
        gutil.log("js编译完毕!")
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

/**
 * rjs模块数组构造器
 * @return {Array} 
 * @todo  重写
 */
function rjModules() {
    var special = ~args.ctrl.indexOf("special")
    var deep = (~args.ctrl.indexOf("all") || special ) ? "**/*.js" : "*.js"
    var dirAppSrc = glob.sync(config.jsSource + "/appSrc/" + deep);
    var dirSpecial = glob.sync(config.jsSource + "/special/" + deep);
    var dirStandalone = glob.sync(config.jsSource + "/standalone/" + deep);
    var allArr = [];
    var i = 0,
        l;

    var arrForReturn = [];

    if( !special ){
        for (i = 0, l = dirAppSrc.length; i < l; i++) {
            allArr.push(dirAppSrc[i].match(/(appSrc\/.*)\.js/)[1]);
        }
        for (i = 0, l = dirStandalone.length; i < l; i++) {
            allArr.push(dirStandalone[i].match(/(standalone\/.*)\.js/)[1]);
        }
    }
    
    for (i = 0, l = dirSpecial.length; i < l; i++) {
        allArr.push(dirSpecial[i].match(/(special\/.*)\.js/)[1]);
    }
    
    for (i = 0, l = allArr.length; i < l; i++) {
        var json = {};
        json.name = allArr[i];
        if (json.name === "appSrc/appCommon") {
            json.name = "appCommon";
            json.exclude = ["coffee-script", "normalize"];
        } else if (json.name === "appSrc/fragmentIpad") {
            json.exclude = ["coffee-script", "normalize"];
        } else if (json.name === "appSrc/analyticsmobile") {
            json.name = "analyticsmobile";
            json.exclude = ["coffee-script", "normalize", "zepto"];
        } else if (json.name === "appSrc/migu") {
            json.exclude = ["coffee-script", "normalize"];
        } else if (json.name.indexOf("standalone") !== -1) {
            json.exclude = ["coffee-script", "normalize"];
        } else {
            json.exclude = ["jquery", "angular", "appCommon", "normalize", "coffee-script", "cs", "css", "text", "css-builder"];
        }
        arrForReturn.push(json);
        json = null;
    }
    return arrForReturn;
}

module.exports = {
    run: build,
    js: buildScript,
    css: buildStyle
}
