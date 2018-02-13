
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router/router'
import VueLazyload from 'vue-lazyload'
// import VueResource from 'vue-resource'
import { routerMode } from '../src/config/config'
import _ from 'lodash'

// Vue.use(VueResource)

Vue.use(VueLazyload, {
	preLoad: 1.5,
	loading: 'static/img/default.png',
	error: 'static/img/default.png'
})

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior(to, from, savedPosition) { //当转到新的页面时，定位到最顶端，只在history模式下有效
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop
			}
			return { x: 0, y: to.meta.savedPosition ||0}
		}
	}
})

import store from './store'

new Vue({
	router,
	store,
	el: '#app',
	template: '<App/>',
	components: { App }
})



