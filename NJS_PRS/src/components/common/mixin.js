import { host } from '../../config/config'
import { worker } from '../../config/worker'
import { websiteApi } from 'api'
import { getOperationFullTime, clipstring } from '../../config/utils'

export const service = {
	methods: {
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
			}
			websiteApi.setURLSelectedInfo(JSON.stringify(data))
		},

		addHttp(url) {
			if(url){
				return !~url.indexOf('http')? 'http:'+url : url
			}
		}
	},
	filters: {
		clip(str, len) {
			return clipstring(str, len)
		},
	},
}