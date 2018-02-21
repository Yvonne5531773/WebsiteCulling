import Vue from 'vue'
import App from './App'
import routes from './router/router'
import components from './components'
import plugins from './plugin'
import store from './store'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import { routerMode } from '../src/config/config'
import _ from 'lodash'

// import VueResource from 'vue-resource'
// Vue.use(VueResource)
Vue.use(components)
Vue.use(plugins)
Vue.use(VueLazyload, {
	preLoad: 1.2,
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

new Vue({
	router,
	store,
	el: '#app',
	template: '<App/>',
	components: { App }
})



