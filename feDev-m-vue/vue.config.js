const vuxLoader = require('vux-loader');
const isProduction = process.env.NODE_ENV === "production";

// 这里只列一部分，具体配置参考文档
module.exports = {
	configureWebpack: config => {
		vuxLoader.merge(config, {
			options: {},
			plugins: ['vux-ui', 'duplicate-style', {
				name: 'less-theme',
				path: 'src/myless/myless_for_vux.less'
			}]
		});
		/* // 分离打包js,用cdn加速，由于本应用目前没有走外网，故先不做
		if (isProduction) {
			config.externals = {
				'vue': 'Vue',
				'vue-router': 'VueRouter',
				'axios': 'axios',
				'vuex': 'Vuex',
			}
		} */
		// 开启Gzip, 由于本应用目前没有走外网，故先不做 (Gzip的变小率还是蛮大的)
		/*
		// 安装插件
		// yarn add -D compression-webpack-plugin
		// 在vue-config.js 中加入
		*/
		const CompressionWebpackPlugin = require('compression-webpack-plugin');
		const productionGzipExtensions = ['js', 'css'];
		if (isProduction) {
			config.plugins.push(new CompressionWebpackPlugin({
				algorithm: 'gzip',
				test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
				threshold: 10240,
				minRatio: 0.8
			}))
		}

		/* // 还有修改uglifyOptions去除console来减少文件大小，
		// 安装uglifyjs-webpack-plugin
		// yarn add -D uglifyjs-webpack-plugin*/
		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		if (isProduction) {
			config.plugins.push(
				new UglifyJsPlugin({
					uglifyOptions: {
						warnings: false,
						compress: {
							drop_debugger: true,
							drop_console: true,
						},
					},
					sourceMap: false,
					parallel: true,
				})
			)
		}

		// 公共代码抽离
        /* if (isProduction) {
			config.optimization = {
				splitChunks: {
					cacheGroups: {
						// vux: {
							// name: 'chunk-vux',
							// test: /[\\/]node_modules[\\/]vux[\\/]/,
							// chunks: 'initial',
							// priority: 3,
							// reuseExistingChunk: true,
							// enforce: true
						// },
						vendor: {
							chunks: 'all',
							test: /node_modules/,
							name: 'vendor',
							minChunks: 1,
							maxInitialRequests: 3,
							minSize: 300 * 1024,
							priority: 100,
							maxSize: 400 * 1024
						},
						common: {
							chunks: 'all',
							test: /[\\/]src[\\/]js[\\/]/,
							name: 'common',
							minChunks: 2,
							maxInitialRequests: 5,
							minSize: 0,
							priority: 60
						},
						// styles: {
							// name: 'styles',
							// test: /\.(sa|sc|c)ss$/,
							// chunks: 'all',
							// enforce: true
						// },
						runtimeChunk: {
							name: 'manifest'
						}
					}
				}
			}
		} */
	},
	// 部署生产环境和开发环境下的URL。
	// 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
	// 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
	// process.env.NODE_ENV:  production development
	//baseUrl: isProduction ? "./" : "/",  //从 Vue CLI 3.3 起已弃用，请使用publicPath
	publicPath: isProduction ? "/apps/mb/" : "/apps/",

	// outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
	//outputDir: "dist",
	//用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
	//assetsDir: "assets",
	//指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
	// indexPath: "myIndex.html",
	//默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
	//filenameHashing: false,

	//   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
	//lintOnSave: true,
	//如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
	// lintOnSave: process.env.NODE_ENV !== 'production',

	//是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
	runtimeCompiler: true,

	/**
	 * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
	 *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
	 *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
	 *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
	 * */
	productionSourceMap: false,

	// 它支持webPack-dev-server的所有选项
	devServer: {
		host: "0.0.0.0",
		port: 8080, // 端口号
		https: false, // https:{type:Boolean}
		hotOnly: false,
		//open: true, //配置自动启动浏览器
		// proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理

		// 配置多个代理
		proxy: {
			"/api": {
				target: "http://localhost:8888/apps",
				changeOrigin: true
			},
			"/foo": {
				target: "<other_url>"
			}
		}
	}
};