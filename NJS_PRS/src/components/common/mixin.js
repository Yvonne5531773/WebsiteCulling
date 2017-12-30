import { host } from '../../config/config'
import { worker } from '../../config/worker'
import { websiteApi } from 'api'
import { getOperationFullTime } from '../../config/utils'

export const jsonp = {
	methods: {
		jsonp (path = '', params = {}) {
			const url = host + path
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
				data.description = site.description || ''
				data.icon = site.icon || ''
				data.liked = site.liked || false
				data.views = site.views
			}
			websiteApi.setURLSelectedInfo(JSON.stringify(data))
		}
	}
}