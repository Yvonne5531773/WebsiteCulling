import {host} from '../../config/config'
import { websiteApi } from 'api'
import { getOperationFullTime } from '../../config/utils'

const worker = (function(){
	let workerArr = [];
	let callbacks = Object.create(null);
	let i = 1;
	let reg = /=\?(?=&|$)/;
	let scriptFile = 'static/javascripts/work.js';
	function popWorker(){
		return workerArr.pop() || new Worker(scriptFile);
	}
	function clearWorkers(){
		for(let i=workerArr.length-1;i>-1;--i){
			let worker = workerArr[i];
			worker.terminate();
		}
		workerArr.length = 0;
	}
	let to;
	function pushWorker(worker){
		workerArr.push(worker);
		clearTimeout(to);
		to = setTimeout(clearWorkers, 10 * 1000);
	}
	return function(option, fn){
		let id = i;
		++i;
		if(i === id){
			i = 1;
		}
		let url = option.url;
		let found = false;
		// let callback = option.callback || ( 'callback' + id );
		let callback = "callback";
		url = url && url.replace(reg, function(){
			found = true;
			return '=' + callback;
		});
		if(!found){
			url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callback;
		}
		let worker = popWorker();
		worker.onmessage = function(e){
			let msg = e.data;
			if(msg && msg.i ){
				worker.onmessage = null;
				pushWorker(worker);
				let id = msg.i;
				let fn = callbacks[id];
				if(fn){
					delete callbacks[id];
					fn(msg.s, msg.r);
				}
			}
		};
		callbacks[id] = fn;
		worker.postMessage({
			u: url,
			i: id,
			r: callback
		});
	};
})();

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