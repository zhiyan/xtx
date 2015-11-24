var pkg = require("./package.json"),
    fs = require("fs"),
    path = require("path"),
    gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    runSequence = require('run-sequence').use(gulp),
    es = require('event-stream'),
    rjs = require("requirejs"),
    glob = require("glob"),
    del = require("del"),
    extend = require("extend"),
    postcss = require("gulp-postcss"),
    pngquant = require("imagemin-pngquant"),
    rsync = require("rsync"),
    cjson = require("cjson"),
    help = require("u-help"),
    chalk = require("chalk"),
    prettyTime = require('pretty-hrtime'),
    browserSync = require('browser-sync').create(),
    sass = plugins.sass,
    sourcemaps = plugins.sourcemaps,
    autoprefixer = plugins.autoprefixer,
    uglify = plugins.uglify,
    imagemin = plugins.imagemin,
    gutil = plugins.util

/**
 * 配置
 * @type {Object}
 */
var config = {

    // 项目根目录
    root : ".",

    // html目录
    html: "html",

    // css源目录
    cssSource: "src/sass",

    // js源目录
    jsSource: "src/script",

    // 图片源目录
    imgSource: "src/images",

    // 编译目录
    build: "build",

    // css编译目录
    cssBuild: "build/css",

    // js编译目录
    jsBuild: "build/script",

    // 图片编译目录
    imgBuild: "build/images",

    // 输出目录
    dist: "dist",

    // css输出目录
    cssDist: "dist/css",

    // js输出目录
    jsDist: "dist/script",

    // 图片输出目录
    imgDist: "dist/images",

    // release目录
    release: "/edx/app/edxapp/edx-platform/lms/static/xuetangx",

    // r.js配置文件
    requireConfig: "src/script/lib/requirejsPlugin/rjConfig.js",

    // 开发机配置文件
    devConfig: ".dev",

    // dev同步目录
    devPath: "/edx/app/edxapp/edx-platform/lms/static/xuetangx"
}

/**
 * 任务: 帮助
 */
gulp.task("help", function() {
    help.show('xtx v' + pkg.version, {
        "命令": {
            // init: '初始化项目',
            // pack: '打包代码',
            build: '构建代码',
            clean: '清理编译文件',
            img: '图片目录压缩',
            sync: '同步代码到开发机',
            server: '本地调试服务器',
            release: '发布',
            // install: '安装组件',
            // update: '更新组件',
            // remove: '删除组件',
            // publish: '发布组件'
        }
    })
})


/**
 * 任务: 编译css文件
 * @todo: mapping的目录问题 
 */
gulp.task("build:css", function() {

    var sassSetting = {
        "outputStyle": "compressed",
        "precision": 10,
        "includePaths": [config.cssSource]
    }

    var autoprefixerSetting = {
        "browsers": ["last 2 versions", "ie 9"],
        "map": true
    }

    return gulp.src(config.cssSource + "/app/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass(sassSetting).on("error", sass.logError))
        .pipe(autoprefixer(autoprefixerSetting))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.cssBuild))
        .pipe(browserSync.stream())
})

/**
 * 任务: 编译js文件
 */
gulp.task("build:js", function(cb) {
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
        cb();
    }, cb);
})

/**
 * 任务: 压缩图片
 */
gulp.task("build:img", function() {
    return gulp.src(path.resolve(config.imgSource, "**/*"))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.resolve(config.imgBuild)));
})

/**
 * 任务: 输出css文件
 */
gulp.task("dist:css", function() {
    gulp.src(config.cssBuild + "/**/*.css")
        .pipe(postcss([], {
            map: false
        }))
        .pipe(gulp.dest(config.cssDist))
})

/**
 * 任务: 输出js文件
 */
gulp.task("dist:js", function() {

    return es.merge(
        gulp.src(config.jsBuild + "/appSrc/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/appSrc")),

        gulp.src(config.jsBuild + "/special/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/special")),

        gulp.src(config.jsBuild + "/standalone/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist + "/standalone"))
    )
})

/**
 * 任务: 编译源文件
 */
gulp.task("build", function(cb) {
    runSequence("clean", ["build:css", "build:js"], ["dist:css", "dist:js"], cb)
})

/**
 * 任务: 清理已编译文件
 */
gulp.task("clean", function() {
    return del([
        config.build,
        config.jsDist,
        config.cssDist
    ])
})


/**
 * 任务: 开启本地dev服务器，并监听scss变化,livereload
 */
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: ".",
            directory: true,
            middleware: middlewareBuilder()
        },
        port: 9000
    })
    gulp.watch(config.cssSource + "/**/*.scss", ["build:css"])
    gulp.watch([config.html + "/**/*.html",config.jsSource + "/**/*.js",config.imgSource + "**/*"]).on("change", browserSync.reload)
})


/**
 * 任务: css上线
 */
gulp.task("release:css", function() {
    gulp.src(path.resolve(config.cssDist, "*.css"))
        .pipe(gulp.dest(config.release))
})

/**
 * 任务: js上线
 */
gulp.task("release:js", function() {
    gulp.src(path.resolve(config.jsDist, "appSrc/*.js"))
        .pipe(gulp.dest(path.resolve(config.release, "js")))
})

/**
 * 任务: 上线
 */
gulp.task("release", function(cb) {
    runSequence("build", ["release:css", "release:js"], cb)
})

/**
 * 任务: 同步开发机
 */
gulp.task("sync", function() {

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
})

// 任务开始钩子
gulp.on('task_start', function(e) {
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
})

// 任务结束钩子
gulp.on('task_stop', function(e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
        'Finished', '\'' + chalk.cyan(e.task) + '\'',
        'after', chalk.magenta(time)
    );
})

// expose xtx
module.exports = {
    run: run
}

/**
 * xtx命令入口
 * @param  {String} cmd 命令名称
 */
function run(cmd) {

    if (!cmd || !(cmd in gulp.tasks)) {
        cmd = "help"
    }

    runSequence(cmd)
}


/**
 * rjs模块数组构造器
 * @return {Array} 
 * @todo  重写
 */
function rjModules() {
    // if (argv) {
    //     return [{
    //         name: argv,
    //         exclude: ["jquery", "angular", "appCommon", "normalize", "coffee-script", "cs", "css", "text", "css-builder"]
    //     }]
    // }

    var dirAppSrc = glob.sync(config.jsSource + "/appSrc/*.js");
    var dirSpecial = glob.sync(config.jsSource + "/special/*.js");
    var dirStandalone = glob.sync(config.jsSource + "/standalone/*.js");
    var allArr = [];
    var i = 0,
        l;

    var arrForReturn = [];
    for (i = 0, l = dirAppSrc.length; i < l; i++) {
        allArr.push(dirAppSrc[i].match(/(appSrc\/.*)\.js/)[1]);
    }
    for (i = 0, l = dirSpecial.length; i < l; i++) {
        allArr.push(dirSpecial[i].match(/(special\/.*)\.js/)[1]);
    }
    for (i = 0, l = dirStandalone.length; i < l; i++) {
        allArr.push(dirStandalone[i].match(/(standalone\/.*)\.js/)[1]);
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

/**
 * 本地dev服务器中间件
 * @return {Array} 中间件数组
 * @todo 404 status
 */
function middlewareBuilder() {

    var middlewares = []

    // 文件不存在
    // middlewares.unshift(function(req, res, next) {

    //     var url = path.join(opt.root, req.url)

    //     if (/favicon.ico$/.test(req.url)) {
    //         return res.end("")
    //     }

    //     if (!fs.existsSync(url) || !fs.statSync(url).isFile()) {
    //         console.log("Not Found: " + url)
    //         return res.end("404")
    //     }

    //     return next()
    // })

    // 非GET请求处理
    middlewares.unshift(function(req, res, next) {

        if (['POST', 'PUT', 'DELETE'].indexOf(req.method.toUpperCase()) !== -1) {
            if (fs.existsSync(req.url) && fs.statSync(req.url).isFile()) {
                return res.end(fs.readFileSync(req.url));
            }
        }

        return next()
    })

    // mock处理
    middlewares.unshift(function(req, res, next) {

        req.url = req.url.replace(/^\/mock\//, "/")

        return next()
    })

    // 旧版兼容
    middlewares.unshift(function(req, res, next) {

        req.url = req.url.replace(/^\/static\//, "/src/")
            .replace(/^\/pages2\//, "/html/")

        if (/^\/src\/css\/(.)*\.css(.map)?$/.test(req.url)) {
            req.url = req.url.replace(/^\/src/, "/build")
        }

        return next()
    })

    return middlewares;
}
