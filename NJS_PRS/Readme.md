# Project powered by vuejs with a series of vuejs plugins included vuex, vue-router

> vuex 单页面数据状态管理器

> vue-router 单页面路由管理

> web worker http请求

## 基于猎豹浏览器的客户端api

## 基于后台api

## how to use

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## 目录结构

初始的目录结构如下：

~~~
www  WEB部署目录（或者子目录）

├───build               应用webpack打包配置
├───config              应用webpack打包配置参数
├───src                 应用开发代码
│   ├───api             客户度的接口
│   ├───assets          资源文件夹
│   ├───components      自定义开发的可重复使用的UI组件
│   ├───config          app开发配置信息
│   ├───external        外部配置文件
│   ├───mock            mock文件夹
│   ├───plugin          自定义vuejs插件
│   ├───router          路由配置信息
│   ├───store           vuex文件夹
│   ├───txt             全局字符串配置
│   ├───utils           公共库
│   ├───views           页面组件
│   └───worker          跨域组件
├───static              静态文件夹
├───test                测试文件夹
└───website_culling     打包后文件夹