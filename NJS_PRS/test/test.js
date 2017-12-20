
const set = [{v:true}, {v:true}, {v:false}, {v:true}, {v:false}];

set.sort((a, b)=>{
	if(a || b) return -1
})

console.log(set)