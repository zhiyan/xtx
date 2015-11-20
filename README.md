xtx
=====================

##### xtx是一套前端开发工具, 其中包含了
* 本地开发支持环境
* 静态文件编译 css / js
* 开发辅助工具等

## 如何安装 ##

#### 安装前提

##### nodejs & npm
* 版本需大于 0.10.2
* windows: [http://nodejs.org/dist/v0.12.7/node-v0.12.7-x86.msi](http://nodejs.org/dist/v0.12.7/node-v0.12.7-x86.msi)
* mac: [http://nodejs.org/dist/v0.12.7/node-v0.12.7.pkg](http://nodejs.org/dist/v0.12.7/node-v0.12.7.pkg)
* linux: 自行使用 apt-get(ubuntu) 或 yum(centos) 安装

#### 安装
    
    npm install xtx -g


### 使用

    xtx {命令名}


### 基本命令

* build: '构建代码, 编译css和js生成build和dist两个目录,其中build下js只打包不压缩, dist下是压缩混淆后代码',
* clean: '清理编译文件',
* img: '图片目录压缩, 压缩images到图片目录',
* watch: '监视sass代码修改',
* sync: '同步代码到开发机',
* server: '本地调试服务器',
* release: '发布'
