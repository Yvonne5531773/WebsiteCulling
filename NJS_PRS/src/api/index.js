
/*
*
// 用户在起始页中选择的感兴趣的分类
void GetUserSelectedInfo(const base::ListValue* args);
   "websiteculling.GetUserSelectedCallback(JSON)"
void SetUserSelectedInfo(const base::ListValue* args);

// 网址类存/取接口
void GetURLSelectedInfo(const base::ListValue* args);
   "websiteculling.GetTopUrlCallback(JSON)";
void SetURLSelectedInfo(const base::ListValue* args);

// 网单类存/取接口
void GetFormSelectedInfo(const base::ListValue* args);
   "websiteculling.GetTopFormCallback(JSON)"
void SetFormSelectedInfo(const base::ListValue* args);
*/

export const websiteApi = {
	//获取已选的主题
	getUserSelectedInfo () {
		chrome.send && chrome.send("GetUserSelectedInfo");
	},
	//获取回调数据
	getGlobalSelectedInfo () {
		return new Promise(function (resolve) {
			setTimeout( () => {
				resolve(globalSelectedInfo)
			}, 200)
		})
	},
	//存储已选的主题
	setUserSelectedInfo (ids) {
		chrome.send && chrome.send("SetUserSelectedInfo", [ids]);
	},

	//获取网单
	getFormSelectedInfo () {
		chrome.send && chrome.send("GetFormSelectedInfo");
	},
	//获取网单回调数据
	getGlobalTopForm () {
		return new Promise(function (resolve) {
			setTimeout( () => {
				resolve(globalTopForm)
			}, 200)
		})
	},
	//存储网单
	setFormSelectedInfo (item) {
		console.log('setFormSelectedInfo item', item)
		chrome.send && chrome.send("SetFormSelectedInfo", [item]);
	},

	//获取网址
	getURLSelectedInfo () {
		chrome.send && chrome.send("GetURLSelectedInfo");
	},
	//获取网址回调数据
	getGlobalTopUrl () {
		return new Promise(function (resolve) {
			setTimeout(() => {
				resolve(globalTopUrl)
			}, 200)
		})
	},
	//存储网址
	setURLSelectedInfo (item) {
		console.log('setURLSelectedInfo item', item)
		chrome.send && chrome.send("SetURLSelectedInfo", [item]);
	},

	/*
	 上报
	*/
	reportByInfoc(name, data) {
		if(name){
			let tableName = name.split(' ')[0],
				arr = [],
				i,
				reportData = {
					name: name
				};
			data.version = 6
			for (i in data) {
				if (data.hasOwnProperty(i)) {
					arr.push(i + '=' + encodeURIComponent(data[i]));
				}
			}
			reportData.data = arr.join('&');
			chrome.send && chrome.send("reportnoformat", [JSON.stringify(reportData)]);
			// console.log('reportnoformat: ', JSON.stringify(reportData))
		}
	},
}

//暴露回调对象
let globalSelectedInfo = {},
	globalTopForm = {},
	globalTopUrl = {}

global.websiteculling = {
	GetUserSelectedCallback: res => {
		console.log('GetUserSelectedCallback res', res)
		globalSelectedInfo = res
	},
	GetTopFormCallback: res => {
		console.log('GetTopFormCallback res', res)
		globalTopForm = res
	},
	GetTopUrlCallback: res => {
		console.log('GetTopUrlCallback res', res)
		globalTopUrl = res
	},
}

