<template>
	<div>
		<div class="relation" v-if="list&&list.length>0">
			<div class="head">
				<h2>{{title}}</h2>
				<div class="change">
					<span>{{txt1}}</span>
					<a class="c" @click="change" v-if="list&&list.length>1">
						<b></b>
						<span>{{txt2}}</span>
					</a>
				</div>
			</div>
			<section class="content">
				<div class="r-data" v-for="(data, i) in vm" v-if="data.title">
					<a class="avatar" target="_blank" :href="data.host" :title="data.title" @click="open(data)">
						<img v-lazy="data.iconLazyObj"/>
					</a>
					<p class="title">
						<a target="_blank" class="name" :href="data.host" :title="data.title" @click="open(data)">{{data.title | clip(24)}}</a>
						<a target="_blank" class="description" :href="data.host" :title="data.description" @click="open(data)">{{data.description | clip(60)}}</a>
					</p>
					<span class="r-t">
						<a @click="like(data)" class="like" title="喜欢" :style="data.liked&&`backgroundPosition:-30px`"></a>
						<span>{{data.hot}}</span>
					</span>
				</div>
			</section>
		</div>
		<!--<VLoading v-else></VLoading>-->
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { service } from 'components/common/mixin'
	import { getHost, clipstring } from '../../config/utils'
	import { mockRelation } from '../../mock/relation'
	import { aiRecommendPath } from '../../config/config'
export default {
	data () {
		return {
			list: [],
			vm: [],
			title: '猜你喜欢',
			txt1: '根据您的上网兴趣推荐',
			txt2: '换一换',
			index: 0
		}
	},
	mixins: [service],
	props: {
		localSites: {
			type: Array
		}
	},
	watch: {
		localSites() {
			this.init()
		}
	},
	mounted () {
//		this.init()
	},
	methods: {
		async init() {
			try {
				const bookmarks = await this.constructRecommend(),
					bookmarksStr = !_.isEmpty(bookmarks)? bookmarks.join(','):''
				this.list = await this.getRelations(bookmarksStr)
				this.vm = this.list[this.index]
			}catch(e) {
				console.log('error:', e)
			}
		},
		async constructRecommend() {
			//收藏夹数据
			let bookmarks = await this.getBookmark()
			bookmarks = bookmarks.map(bm => {
				return getHost(bm.url)
			})
			bookmarks = _.union(bookmarks)
			return bookmarks
		},
		async getRelations(bookmarksStr) {
			let list = []
			try {
				list = await this.jsonp(aiRecommendPath, 'post', 'urls=' + bookmarksStr)
			}catch(e) {
				console.log('error', e)
			}
			list = !_.isEmpty(list)? list:mockRelation
			list = _.filter(list , l => {
				return this.checkValid(l.title)===1
			})
			list.forEach(l => {
				l.iconLazyObj = {
					src: l.icon,
					error: 'static/img/default-icon.png',
					loading: 'static/img/default-icon.png'
				}
				l.description = l.description&&l.description!=='None'&&l.description!==''? l.description:(l.keywords&&l.keywords!=='None'&&l.keywords!==''? l.keywords:(l.title!==''? l.title:''))
				l.host = this.addHttp('//'+l.host)
				l.hot = l.hot? parseInt(l.hot) : ''
				const findSite = _.find(this.localSites, {'name': l.title})
				l.liked = !_.isEmpty(findSite)? findSite.liked:false
				l.id = !_.isEmpty(findSite)? findSite.id : (new Date()).valueOf()+Math.floor(Math.random()*1000 + 1)+''
			})
//			list = _.orderBy(list, ['hot'], ['desc'])
			return _.chunk(list, 10)
		},
		open(data) {
			websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:11,url:data.host,value:0})
		},
		like(data) {
			data.liked = !data.liked
			const store = {}
			store.id = data.id
			store.name = data.title
			store.url = data.host
			store.href_url = data.host
			store.description = data.description
			store.icon = data.iconLazyObj.src
			store.liked = data.liked
			this.vm = _.cloneDeep(this.vm)
			this.saveSite(store)
			store.liked && websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:12,url:data.host,value:0})
		},
		change() {
			const list = this.list[this.index+1]
			this.vm = []
			this.index = _.isEmpty(list)? 0:this.index+1
			this.$nextTick(() => {
				this.vm = _.cloneDeep(this.list[this.index])
			})
			websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:14,url:'',value:0})
		},
		checkValid(val) {
			let ret = 1
			const error = ['400','401','403','404','405','406','407','410','412','414','500','501','502','504']
			error.forEach(e => {
				if(!!~val.indexOf(e)){
					ret = 0
				}
			})
			return ret
		},
	},
}
</script>

<style lang="stylus" scoped>
	.relation
		float left
		width 214px
		position relative
		margin-left 60px
		.head
			color #6346de
			padding-bottom 8px
			border-bottom 1px solid #cdcdde
			h2
				font-size 14px
				position relative
				bottom 5px
			.change
				display flex
				justify-content space-between
				.c
					width 57px
					color #6346de
					display flex
					&:hover
						b
							background-position -17px
					b
						background url("../../../static/img/relation/change.png") no-repeat
						width 18px
						margin 1px
		.content
			position relative
			top 20px
			.r-data
				height 78px
				margin-bottom 18px
				font-size 14px
				.avatar
					float left
					img
						height 16px
						width 16px
				.title
					padding-left 10px
					overflow hidden
					position relative
					bottom 3px
					.name
						overflow hidden
						text-overflow ellipsis
						white-space nowrap
						display block
					a
						color #333333
					.description
						font-size 12px
						height 38px
						display block
						color #5b5b5b !important
			.r-t
				float right
				font-size 12px
				color #949494
				position relative
				bottom 3px
				display flex
				.like
					background url("../../../static/img/relation/like.png") no-repeat
					margin 2px 5px
					width 15px
					height 15px
					&:hover
						background-position -15px
					&:active
						background-position -30px
</style>