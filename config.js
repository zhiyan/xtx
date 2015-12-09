module.exports = {

    // 是否兼容模式
    "compatible": false,

    // 项目根目录
    "root": ".",

    // html目录
    "html": "html",

    // css源目录
    "cssSource": "src/sass",

    // js源目录
    "jsSource": "src/script",

    // 图片源目录
    "imgSource": "src/images",

    // 编译目录
    "build": "build",

    // css编译目录
    "cssBuild": "build/css",

    // js编译目录
    "jsBuild": "build/script",

    // 图片编译目录
    "imgBuild": "build/images",

    // 输出目录
    "dist": "dist",

    // css输出目录
    "cssDist": "dist/css",

    // js输出目录
    "jsDist": "dist/script",

    // 图片输出目录
    "imgDist": "dist/images",

    // release目录
    "release": "/edx/app/edxapp/edx-platform/lms/static/xuetangx",

    // r.js配置文件
    "requireConfig": "src/script/lib/requirejsPlugin/rjConfig.js",

    // 通用配置文件
    "configFile": "config.json",

    // 开发机配置文件
    "devConfig": ".dev",

    // dev同步目录
    "devPath": "/edx/app/edxapp/edx-platform/lms/static/xuetangx",

    // dev开发机用户名
    "user": "root",

    // storage目录
    "storage": "http://10.0.0.113/upload/public_assets/xuetangx/",

    // 扩展名文件对应storage默认目录
    "defaultStoragePath": {
        ".png": "images",
        ".jpg": "images",
        ".gif": "images",
        ".jpeg": "images",
        ".js": "js",
        ".css": "style"
    },

    // 图片mimetype
    "mime": {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
        "png": "image/png",
        "svg" : "image/svg-xml"
    }
}
