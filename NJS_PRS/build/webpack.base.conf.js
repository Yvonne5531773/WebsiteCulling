var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require("webpack")
var Jarvis = require("webpack-jarvis")
var projectRoot = path.resolve(__dirname, '../')
var env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		app: './src/main.js'
	},
	output: {
		path: config.build.assetsRoot,
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.vue', '.json'],
		fallback: [path.join(__dirname, '../node_modules')],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'src': path.resolve(__dirname, '../src'),
			'assets': path.resolve(__dirname, '../src/assets'),
			'api': path.resolve(__dirname, '../src/api'),
			'components': path.resolve(__dirname, '../src/components'),
			'utils': path.resolve(__dirname, '../src/utils'),
			'config': path.resolve(__dirname, '../src/config'),
			'mock': path.resolve(__dirname, '../src/mock')
		}
	},
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	module: {
		loaders: [
			// {
			//  test: /\.(js|vue)$/,
			//  loader: 'eslint-loader',
			//  enforce: "pre",
			//  include: [resolve('src'), resolve('test')],
			//  options: {
			//    formatter: require('eslint-friendly-formatter')
			//  }
			// },
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				include: [
					path.join(projectRoot, 'src')
				],
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 50000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 50000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	vue: {
		loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
		postcss: [
			require('autoprefixer')({
				browsers: ['last 2 versions']
			})
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('common.js'),
		new webpack.ProvidePlugin({
			// jQuery: "jquery",
			// $: "jquery",
			// 'window.jQuery': 'jquery'
		}),
		// new Jarvis({
		// 	port: 1337
		// })
	]
}
