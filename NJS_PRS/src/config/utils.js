
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name)?window.localStorage.getItem(name):'';
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 写入本地文件
 */
export const writeFile = (str, file) => {
	file && external.lego && external.lego.FileSystem.WriteFile(file, btoa(str), (result)=>{
		// console.log('writeFile result', result)
	})
}

/**
 * 读取本地文件
 */
export const readFile = (file) => {
	if(file && external.lego){
		return new Promise((resolve, reject) => {
			external.lego.FileSystem.ReadFile(file, 1000000, (base64String) => {
				let data = atob(JSON.parse(base64String).data);
				if(data)
					resolve(data)
				else
					reject({err: 'no file'})
			});
		})
	}
}

export const clipstring = (str, len) => {
	str && (str = str.replace(/(^\s*)|(\s*$)/g, ""))
	if(!str || !len) { return ''; }
	let a = 0, i = 0, temp = '';
	for(i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 255)
			a += 2;
		else
			a++;
		if(a > len) { return temp + "..";}
		temp += str.charAt(i);
	}
	return str;
}

export const getRequest = () => {
	let url = location.search,
		theRequest = new Object();
	if (url.indexOf("?") !== -1) {
		let str = url.substr(1),
			strs = str.split("&");
		for (let i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
	let target;
	// scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
	if (attr === 'scrollTop') {
		target = element.scrollTop;
	}else if(element.currentStyle){
		target = element.currentStyle[attr];
	}else{
		target = document.defaultView.getComputedStyle(element,null)[attr];
	}
	//在获取 opactiy 时需要获取小数 parseFloat
	return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
}

/**
 * 时间比较
 */
export const compareTime = (itemA, itemB) => {
	let timeA = itemA.updated,
		timeB = itemB.updated
	if(timeA && timeB){
		let beginTime = timeA;
		let endTime = timeB;
		let beginTimes = beginTime.substring(0, 10).split('-');
		let endTimes = endTime.substring(0, 10).split('-');
		beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
		endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
		let a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
		if (a > 0) {
			return 1;
		} else if (a < 0) {
			return -1;
		} else if (a === 0) {
			return 0;
		}
	}else if(timeA && !timeB) return 1
	else if(!timeA && timeB) return -1
}

export const getOperationFullTime = date => {
	let updateDate = new Date(date);
	if (!updateDate) {
		return '';
	}
	let month = updateDate.getMonth();
	month ++;
	month = month < 10? '0' + month : month
	let day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
	let hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
	let minutes = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
	let sceonds = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
	return '' + updateDate.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + sceonds;
}