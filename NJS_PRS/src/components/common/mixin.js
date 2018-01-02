import { host } from '../../config/config'
import { worker } from '../../config/worker'
import { websiteApi } from 'api'
import { getOperationFullTime } from '../../config/utils'

export const jsonp = {
	methods: {
		jsonp (path = '', params = {}) {
			let url = ''
			if(!~path.indexOf('http'))
				url = host + path
			else url = path
			// return this.$http.jsonp(url, {
			// 	params: params,
			// 	jsonp: 'callback'
			// })
			return new Promise(function (resolve, reject) {
				worker({'url': url}, (success, data) => {
					if (success) {
						resolve(data)
					} else {
						reject('promise error')
					}
				})
			})
		},
		async getSelectedInfo() {
			websiteApi.getUserSelectedInfo()
			return await websiteApi.getGlobalSelectedInfo()
		},
		async getForm() {
			websiteApi.getFormSelectedInfo()
			const categories = await websiteApi.getGlobalTopForm()
			return !_.isEmpty(categories)? JSON.parse(categories):[]
		},
		async getSite() {
			websiteApi.getURLSelectedInfo()
			const sites = await websiteApi.getGlobalTopUrl()
			return !_.isEmpty(sites)? JSON.parse(sites):[]
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
			console.log('saveSite site', site)
			let data = {}
			if (site) {
				data.id = site.id+''
				data.categoryId = categoryId? categoryId+'' : ''
				data.name = site.name || ''
				data.url = site.url || ''
				data.href_url = site.href_url || ''
				data.description = site.description || ''
				data.icon = site.icon || ''
				data.liked = site.liked || false
				data.views = site.views
			}
			websiteApi.setURLSelectedInfo(JSON.stringify(data))
		}
	}
}