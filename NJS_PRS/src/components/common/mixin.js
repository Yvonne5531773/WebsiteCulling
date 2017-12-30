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
				data.sites = item.sites
			}
			websiteApi.setFormSelectedInfo(JSON.stringify(data))
		},
		saveSite (item, categoryId) {
			let data = {}
			if (item) {
				data.id = item.id+''
				data.categoryId = categoryId? categoryId+'' : ''
				data.name = item.name || ''
				data.url = item.url || ''
				data.description = item.description || ''
				data.icon = item.icon || ''
				data.liked = item.liked || false
				data.views = item.views
			}
			websiteApi.setURLSelectedInfo(JSON.stringify(data))
		}
	}
}