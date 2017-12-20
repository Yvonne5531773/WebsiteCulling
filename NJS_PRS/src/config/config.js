'use strict'


let host = '';
let routerMode = 'history';

if (process.env.NODE_ENV === 'development') {

}else if(process.env.NODE_ENV === 'production'){

}

export {
	host,
	routerMode
}