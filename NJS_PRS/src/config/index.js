'use strict'

// const host = 'http://10.20.216.64:8081'; //test
let host = 'http://lburlshare.liebao.cn'; //prod
const routerMode = 'hash',
	fbHref = 'http://www.liebao.cn/helper/feedback/',
	prePage = 'https://www.duba.com/',
	restoreOnStartup = 4,
	dataServicePath = 'http://act.cmcmcdn.com/liebao/website/',
	styleConfigPath = dataServicePath + 'config/style.json',
	indexPath = '/v1/index',
	themePath = '/v1/theme/',
	categoryPath = '/v1/category/',
	hotsitePath = '/v1/hotsite',
	recommendPath = '/v1/recommend',
	aiRecommendPath = '/v1/ai_recommend',
	baiduPath = 'https://www.baidu.com/baidu?ie=utf-8&tn=98012088_5_dg&ch=5&word='

if (process.env.NODE_ENV === 'development') {

}else if(process.env.NODE_ENV === 'production'){

}

export {
	host,
	routerMode,
	fbHref,
	restoreOnStartup,
	prePage,
	dataServicePath,
	styleConfigPath,
	indexPath,
	themePath,
	categoryPath,
	hotsitePath,
	recommendPath,
	aiRecommendPath,
	baiduPath
}