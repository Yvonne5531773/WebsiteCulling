(function(b){
	var importScript = (function(globalEval){
		var xhr = new XMLHttpRequest;
		return function importScripts(){
			var args=Array.prototype.slice.call(arguments)
				,len=args.length
				,i=0
				,meta
				,data
				,content
			if(args[i].substr(0,5).toLowerCase()==="data:"){
				data=args[i];
				content=data.indexOf(",");
				meta=data.substr(5,content).toLowerCase();
				data=decodeURIComponent(data.substr(content+1));
				if(/;\s*base64\s*[;,]/.test(meta)){
					data=atob(data);
				}
				if(/;\s*charset=[uU][tT][fF]-?8\s*[;,]/.test(meta)){
					data=decodeURIComponent(escape(data));
				}
			}else{
				if(args[i+1] === 'get') {
					xhr.open("GET", args[i], false);
					xhr.send(null);
					data = xhr.responseText;
					globalEval(data);
				}else if(args[i+1] === 'post') {
					xhr.open("post", args[i], false);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
					xhr.onreadystatechange = function() {
						data = xhr.responseText;
						globalEval('callback(' + data + ')');
					}
					xhr.send(args[i+2]);
				}
			}
		};
	}(eval));
	function h(){}
	onmessage=function(a){
		a=a.data;
		if(a&&a.u&&a.i&&a.r&&a.t&&a.d){
			var g=!1,c=function(a){
				g||(g=!0,postMessage(a))},d=a.r,e=a.i,f=function(a){clearTimeout(k);
				a?b[d]=h:delete b[d]};
			b[d]=function(a){
				f();
				c({s:!0,i:e,r:a})};
			var k=setTimeout(function(){f();
				c({s:!1,i:e,r:null})},a.t||3E4);
			try{
				importScript(a.u, a.t, a.d)
			}
			catch(l){
				f(), c({s:!1,i:e,r:null})
			}
		}
	}
})(self)