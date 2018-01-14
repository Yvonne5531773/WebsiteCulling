/**
 * Created by lica4 on 12/30/2017.
 */
export const worker = (option, fn) => {
	let workerArr = [],
		callbacks = Object.create(null),
		i = 1,
		reg = /=\?(?=&|$)/,
		scriptFile = 'static/javascripts/work.js',
		to
	const popWorker = () => {
		return workerArr.pop() || new Worker(scriptFile);
	}
	const clearWorkers = () => {
		for(let i=workerArr.length-1;i>-1;--i){
			let worker = workerArr[i];
			worker.terminate();
		}
		workerArr.length = 0;
	}
	const pushWorker = worker => {
		workerArr.push(worker);
		clearTimeout(to);
		to = setTimeout(clearWorkers, 10 * 1000);
	}

	let id = i;
	++i;
	if(i === id){
		i = 1;
	}
	let url = option.url,
		type = option.type,
		data = option.data
	let found = false;
	// let callback = option.callback || ( 'callback' + id );
	let callback = "callback";
	url = url && url.replace(reg, function(){
			found = true;
			return '=' + callback;
		});
	if(!found && type === 'get'){
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
		r: callback,
		t: type,
		d: data
	});
}