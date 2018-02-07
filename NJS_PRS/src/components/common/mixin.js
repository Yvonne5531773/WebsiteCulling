import { host, categoryPath } from '../../config/config'
import { worker } from '../../config/worker'
import { websiteApi } from 'api'
import { getOperationFullTime, clipstring } from '../../config/utils'
import { mapMutations } from 'vuex'

export const service = {
	methods: {
		...mapMutations(['SET_COMPONENT', 'SET_LIKED', 'SET_FULL_SCREEN', 'SET_POSITION']),

		setComponent(component) {
			this.SET_COMPONENT({component: component})
		},

		setLike(liked) {
			this.SET_LIKED({liked: liked})
		},

		setFullScreen(isFullScreen) {
			this.SET_FULL_SCREEN({isFullScreen: isFullScreen})
		},

		setPosition(position) {
			this.SET_POSITION(position)
		},

		jsonp (path = '', type = 'get', data = {}) {
			let url = ''
			if(!~path.indexOf('http'))
				url = host + path
			else url = path
			// return this.$http.jsonp(url, {
			// 	params: params,
			// 	jsonp: 'callback'
			// })
			return new Promise(function (resolve, reject) {
				worker({'url': url, type: type, data: data}, (success, data) => {
					if (success) {
						resolve(data)
					} else {
						reject('promise error')
					}
				})
			})
		},

		async getSelectedInfo() {
			return await websiteApi.getUserSelectedInfo()
		},

		async getForm() {
			const categories = await websiteApi.getFormSelectedInfo()
			return !_.isEmpty(categories)? JSON.parse(categories):[]
		},

		async getSite() {
			const sites = await websiteApi.getURLSelectedInfo()
			return !_.isEmpty(sites)? JSON.parse(sites):[]
		},

		async getHistories(criteria, type) {
			if(type === 1){
				let arr = []
				for(let i = 0; i < criteria; i++){
					const histories = await websiteApi.getHistories(i, type)
					arr = [...arr, ...histories]
				}
				return arr
			}else if(type === 2){
				const histories = await websiteApi.getHistories(criteria, type)
				return !_.isEmpty(histories)? histories:[]
			}
		},

		async getBookmark(criteria) {
			const bookmarks = await websiteApi.getBookmarks(criteria)
			return !_.isEmpty(bookmarks)? bookmarks:[]
		},

		async submitHTTPRequest(criteria) {
			return await websiteApi.submitHTTPRequest(criteria)
		},

		async getJSON(path) {
			let data = {}
			try {
				const res = await this.submitHTTPRequest([path, '', ''])
				data = res && !_.isEmpty(res.return_data)? JSON.parse(res.return_data) : {}
			} catch (e) {
				console.log('error:', e)
			}
			return data
		},

		saveForm (item) {
			let data = {}
			if(item){
				data.id = item.id+''
				data.name = item.name || ''
				data.avatar = item.avatar || ''
				data.description = item.description || ''
				data.collected = item.collected || false
				data.sort = item.sort || 0
				data.updated = getOperationFullTime(new Date())
				// data.sites = item.sites
			}
			websiteApi.setFormSelectedInfo(JSON.stringify(data))
		},

		saveSite (site, categoryId) {
			let data = {}
			if (site) {
				data.id = site.id? site.id+'' : ''
				data.categoryId = categoryId? categoryId+'' : ''
				data.name = site.name || ''
				data.url = site.url || ''
				data.href_url = site.href_url || ''
				data.description = site.description || ''
				data.icon = site.icon || ''
				data.liked = site.liked || false
				// data.views = site.views
				site.liked && this.SET_LIKED({liked: true})
			}
			websiteApi.setURLSelectedInfo(JSON.stringify(data))
		},

		async constructCategory () {
			let res = {},
				category
			try {
				res = await this.jsonp(categoryPath + this.categoryid)
			}catch (e) {
				console.log('error:', e)
			}
			category = res? res[0] : {}
			const localCategories = await this.getForm(),
				cat = _.find(localCategories, {'id': category.id+''})
			category.collected = !_.isEmpty(cat)? cat.collected:false
			category.banner = this.addHttp(category.banner)
			category.by = 'by ' + category.by
			return category
		},

		addHttp(url) {
			if(url){
				return !~url.indexOf('http')? 'http:'+url : url
			}
		},
	},
	filters: {
		clip(str, len) {
			return clipstring(str, len)
		},
	},
}