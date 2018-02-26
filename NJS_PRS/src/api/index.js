'use strict'

/*
* 客户端接口
* */
global.websiteculling = {}
const globalRes = {
	globalSelectedInfo: [],
	globalTopForm: [],
	globalTopUrl: [],
	globalResponse: {},
	globalHistories: [],
	globalBookmarks: []
}

export const websiteApi = {
	//获取已选的主题
	getUserSelectedInfo() {
		if(!global.websiteculling.GetUserSelectedCallback) {
			global.websiteculling.GetUserSelectedCallback = res => {
				globalRes.globalSelectedInfo = res
			}
		}
		chrome.send && chrome.send("GetUserSelectedInfo")
		//获取回调数据
		return new Promise(function (resolve) {
			setTimeout( () => {
				resolve(globalRes.globalSelectedInfo)
			}, 100)
		})
	},
	//存储已选的主题
	setUserSelectedInfo(ids) {
		chrome.send && chrome.send("SetUserSelectedInfo", [ids]);
	},

	//获取网单
	getFormSelectedInfo() {
		if(!global.websiteculling.GetTopFormCallback) {
			global.websiteculling.GetTopFormCallback = res => {
				globalRes.globalTopForm = res
			}
		}
		chrome.send && chrome.send("GetFormSelectedInfo")
		//获取网单回调数据
		return new Promise(function (resolve) {
			setTimeout( () => {
				resolve(globalRes.globalTopForm)
			}, 100)
		})
	},
	//存储网单
	setFormSelectedInfo(item) {
		chrome.send && chrome.send("SetFormSelectedInfo", [item])
	},

	//获取网址
	getURLSelectedInfo() {
		if(!global.websiteculling.GetTopUrlCallback) {
			global.websiteculling.GetTopUrlCallback = res => {
				globalRes.globalTopUrl = res
			}
		}
		chrome.send && chrome.send("GetURLSelectedInfo")
		//获取网址回调数据
		return new Promise(function (resolve) {
			setTimeout(() => {
				resolve(globalRes.globalTopUrl)
			}, 100)
		})
	},
	//存储网址
	setURLSelectedInfo(item) {
		chrome.send && chrome.send("SetURLSelectedInfo", [item])
	},

	//我常用网站
	getHistories(criteria, type) {
		if(!global.historyResult) {
			global.historyResult = (res, response) => {
				globalRes.globalHistories = response
			}
		}
		type===1 && chrome.send && chrome.send("getHistory", [criteria]) //获取天的数据
		type===2 && chrome.send && chrome.send("queryHistoryWithCount", [criteria]) //获取数量的数据
		//我常用网站回调
		return new Promise(function (resolve) {
			setTimeout(() => {
				resolve(globalRes.globalHistories)
			}, 100)
		})
	},

	//获取收藏夹数据
	getBookmarks(criteria) {
		if(!global.bookmarksResult) {
			global.bookmarksResult = res => {
				globalRes.globalBookmarks = res
			}
		}
		chrome.send && chrome.send("query3rdBookMarks", [criteria])
		//收藏夹数据回调
		return new Promise(function (resolve) {
			setTimeout(() => {
				resolve(globalRes.globalBookmarks)
			}, 100)
		})
	},

	//跨域获取数据
	submitHTTPRequest(criteria) {
		if(si) {
			clearInterval(si)
			globalRes.globalResponse = ''
		}
		const randomStr = () => {
			return String(new Date().getTime() % 600000 + Math.random());
		}
		let arr = [...criteria],
			context = randomStr(),
			si = null
		if(!global.notifyHttpResponse) {
			global.notifyHttpResponse = (response, context) => {
				try {
					globalRes.globalResponse = JSON.parse(response)
				} catch (e) {
					console.log('notifyHttpResponse error: ', e)
				}
			}
		}
		arr.unshift(context)
		chrome.send && chrome.send('submitHttpRequest', arr)
		return new Promise(function (resolve) {
			let count = 0
			si = setInterval(() => {
				if((globalRes.globalResponse && globalRes.globalResponse.return_data) || count===60) {
					resolve(globalRes.globalResponse)
					clearInterval(si)
					globalRes.globalResponse = ''
				}
				count++
			}, 100)
		})
	},

	reportByInfoc(name, data) {
		if(name){
			let arr = [],
				i,
				reportData = {
					name: name
				};
			data.ver = 4
			for (i in data) {
				if (data.hasOwnProperty(i)) {
					arr.push(i + '=' + encodeURIComponent(data[i]))
				}
			}
			reportData.data = arr.join('&');
			chrome.send && chrome.send("reportnoformat", [JSON.stringify(reportData)])
		}
	},

	getWebsiteFlag() {
		return external.CallWrapper? external.CallWrapper('websiteCulling', '{"popup_view_id":"get_website_flag"}'):0
	},

	getWebsiteNewTab() {
		return external.CallWrapper? external.CallWrapper('websiteCulling', '{"popup_view_id":"get_website_new_tab"}'):0
	},

	/**
	 * 移除安装目录下文件websiteflag.dat
	 *
	 * @author CainLi<lizihao@cmcm.com>
	 */
	removeWebsiteFlag() {
		external.CallWrapper && external.CallWrapper('websiteCulling', '{"popup_view_id":"remove_website_flag"}')
	},

	/**
	 * 设置浏览器启动时打开的页面
	 * @param {number} val 设置值
	 *
	 * @example
	 * setRestoreOnStartup(5) 打开 "新标签" 页
	 * setRestoreOnStartup(1) 恢复上次未关闭的页面
	 * setRestoreOnStartup(6) 打开上次未关闭的页面列表
	 * setRestoreOnStartup(7) 打开收藏管理器
	 * setRestoreOnStartup(8) 打开 "猎豹网址精选"
	 * setRestoreOnStartup(4) 打开主页
	 *
	 * @author CainLi<lizihao@cmcm.com>
	 */
	setRestoreOnStartup(val) {
		if(!val) return
		const obj = {
			popup_view_id: 'restore_on_startup',
			restore_on_startup: val
		}
		external.CallWrapper && external.CallWrapper('website', JSON.stringify(obj))
	}
}


