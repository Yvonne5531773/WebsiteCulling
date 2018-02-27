var fs = require("fs");

//path模块，可以生产相对和绝对路径
var path = require("path");
var _ = require('lodash')

//配置远程路径
var remotePath = "D:/development/code/WebsiteCulling/data.js";

//获取当前目录绝对路径，这里resolve()不传入参数
var filePath = 'D:/development/code/WebsiteCulling/external/datafile';

//读取文件目录

const readDir = function (fileName) {
	return new Promise(function (resolve, reject) {
		fs.readdir(fileName, function(error, data) {
			if (error) return reject(error);
			resolve(data);
		});
	});
};

const readFile = function (fileName) {
	return new Promise(function (resolve, reject) {
		fs.readFile(fileName, 'utf-8', function(error, data) {
			if (error) return reject(error);
			resolve(data);
		});
	});
};

const writeFile = function (data){
	return new Promise(function (resolve, reject) {
		fs.writeFile(remotePath, data, function(error){
			if (error) return reject(error);
			resolve('success');
		});
	});
}

function trim(str, is_global) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g,"");
	if(is_global.toLowerCase()=="g") {
		result = result.replace(/\s/g,"");
	}
	return result;
}

const asyncReadFile = async function () {
	let f1 = await readDir(filePath);
	let arraies = [];
	for(let i = 0; i < f1.length; i++){
		let obj = {
			id: '',
			sort: '',
			name: '',
			avatar: '',
			description: '',
			selected: false,
			selectTime: '',
			updateTime: '',
			categories: [],
		}
		let filename = f1[i]
		console.log('filename', filename)
		obj.sort = parseInt(filename.split('-')[0])
		obj.id = '' + Math.floor(Math.random()*100 + 1)
		obj.name = filename.split('-')[1]
		let p = path.join(filePath, filename);
		let files = await readDir(p);
		for(let j = 0; j < files.length; j++){
			let file = files[j]
			if(!!~file.indexOf('.result')) continue
			let category = {}, filename = ''
			category.sort = parseInt(file.split('-')[0])
			filename = file.split('-')[1]
			category.id = '' + Math.floor(Math.random()*1000 + 100)
			category.name = filename.slice(0, filename.indexOf('.'))
			category.avatar = '/static/img/avatar/'+filename.slice(0, filename.indexOf('.'))+'.png'
			category.sites = []
			category.by = '猎豹浏览器'
			let name = p + "/" + file
			let data = await readFile(name)
			let datas = data.split('\n')
			datas.forEach( (d) => {
				d = trim(d, 'g')
				let site = {}
				site.id = '' + Math.floor(Math.random()*10000 + 1000)
				site.name = d.split(':')[0]
				site.url = d.split(':')[1]+ ':' +d.split(':')[2]
				site.icon = ''
				site.description = ''
				site.liked = false
				category.sites.push(site)
			})
			obj.categories.push(category)
		}
		// console.log('obj', obj)
		arraies.push(obj)
	}
	// console.log('arraies2', arraies)
	console.log('res', await writeFile(JSON.stringify(arraies)))
};

const asyncReadIconFile = async function () {
	var filePath = 'D:/development/code/WebsiteCulling/external/avatar';
	let f1 = await readDir(filePath);
	let arraies = [];
	for(let i = 0; i < f1.length; i++){
		let obj = {
			id: '',
			name: '',
			avatar: '',
			description: '',
			selected: false,
			selectTime: '',
			updateTime: '',
			categories: []
		}
		let filename = f1[i]
		console.log('http://act.cmcmcdn.com/static/img/avatar/'+filename)
	}
	// console.log('arraies2', arraies)
	console.log('res', await writeFile(JSON.stringify(arraies)))
};

const asyncReadFile1 = async function () {
	var filePath = 'D:/43.json';
	let arr = await readFile(filePath);
	let arraies = _.unionBy(JSON.parse(arr), 'title');
	// console.log('arr', arr)
	console.log('arraies2', arraies)
	// console.log('f1', f1)
	await writeFile(JSON.stringify(arraies))
};

// asyncReadFile()
// asyncReadIconFile()
asyncReadFile1()