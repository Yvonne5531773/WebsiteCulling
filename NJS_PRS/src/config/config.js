'use strict'


// const host = 'http://10.20.216.64:8081';
let host = 'http://lburlshare.liebao.cn';
const routerMode = 'hash';

if (process.env.NODE_ENV === 'development') {

}else if(process.env.NODE_ENV === 'production'){

}

export {
	host,
	routerMode
}