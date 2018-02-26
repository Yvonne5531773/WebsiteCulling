import workerize from 'workerize'

export const worker = workerize(`
	export function work(url = '', data = {}, type = 'GET', method = 'fetch') {
		function asJson(res) {
	    return res.json();
	  }
	  
		type = type.toUpperCase();
		if (type === 'GET') {
			let dataStr = '';
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})
	
			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}
	
		if (fetch && method === 'fetch') {
			if (type === 'POST') {
				Object.defineProperty(requestConfig, 'body', {
					value: JSON.stringify(data)
				})
			}
			try {
				return fetch(url).then(asJson);
			} catch (error) {
				throw new Error(error)
			}
		} else {
			return new Promise((resolve, reject) => {
				let requestObj;
				if (window.XMLHttpRequest) {
					requestObj = new XMLHttpRequest();
				} else {
					requestObj = new ActiveXObject;
				}
	
				let sendData = '';
				if (type === 'POST') {
					sendData = JSON.stringify(data);
				}
	
				requestObj.open(type, url, true);
				requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				requestObj.send(sendData);
	
				requestObj.onreadystatechange = () => {
					if (requestObj.readyState === 4) {
						if (requestObj.status === 200) {
							let obj = requestObj.response
							if (typeof obj !== 'object') {
								obj = JSON.parse(obj);
							}
							resolve(obj)
						} else {
							reject(requestObj)
						}
					}
				}
			})
		}
	}
`, { type: 'module' })