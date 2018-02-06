'use strict'

// const host = 'http://10.20.216.64:8081'; //test
let host = 'http://lburlshare.liebao.cn'; //prod
const routerMode = 'hash',
	dataServicePath = 'http://act.cmcmcdn.com/liebao/website/',
	styleConfigPath = dataServicePath + 'config/style.json',
	categoryPath = '/v1/category/'

if (process.env.NODE_ENV === 'development') {

}else if(process.env.NODE_ENV === 'production'){

}

export {
	host,
	routerMode,
	dataServicePath,
	styleConfigPath,
	categoryPath
}