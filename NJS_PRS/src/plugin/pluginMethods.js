import { mapMutations } from 'vuex'
import { worker } from 'api/worker'
import { host, categoryPath } from 'config/index'
import { getOperationFullTime } from 'utils/index'

export default {
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
		this.SET_POSITION({position: position})
	},

	fetch(path, data, type, method) {
		const url = host + path
		return worker.work(url)
	},

	async getSelectedInfo() {
		return await this.$api.getUserSelectedInfo()
	},

	async getForm() {
		const categories = await this.$api.getFormSelectedInfo()
		return !_.isEmpty(categories)? JSON.parse(categories):[]
	},

	async getSite() {
		const sites = await this.$api.getURLSelectedInfo()
		return !_.isEmpty(sites)? JSON.parse(sites):[]
	},

	async getHistories(criteria, type) {
		if(type === 1){
			let arr = []
			for(let i = 0; i < criteria; i++){
				const histories = await this.$api.getHistories(i, type)
				arr = [...arr, ...histories]
			}
			return arr
		}else if(type === 2){
			const histories = await this.$api.getHistories(criteria, type)
			return !_.isEmpty(histories)? histories:[]
		}
	},

	async getBookmark(criteria) {
		const bookmarks = await this.$api.getBookmarks(criteria)
		return !_.isEmpty(bookmarks)? bookmarks:[]
	},

	async submitHTTPRequest(criteria) {
		return await this.$api.submitHTTPRequest(criteria)
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
		this.$api.setFormSelectedInfo(JSON.stringify(data))
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
		this.$api.setURLSelectedInfo(JSON.stringify(data))
	},

	async constructCategory(categoryid) {
		let res = {},
			category
		try {
			res = await this.fetch(categoryPath + categoryid)
		}catch (e) {
			console.log('error:', e)
			return {}
		}
		category = res? res[0] : {}
		const localCategories = await this.getForm(),
			cat = _.find(localCategories, {'id': category.id+''})
		category.collected = !_.isEmpty(cat)? cat.collected:false
		category.banner = this.addHttp(category.banner)
		return category
	},

	addHttp(url) {
		if(url){
			return !~url.indexOf('http')? 'http:'+url : url
		}
	}
}