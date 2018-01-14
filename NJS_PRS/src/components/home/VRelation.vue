<template>
	<div class="relation" v-if="list&&list.length>0">
		<div class="head">
			<h2>{{title}}</h2>
			<div class="change">
				<span>{{txt1}}</span>
				<a class="c">
					<img src="../../../static/img/relation/change.png"/>
					<span>{{txt2}}</span>
				</a>
			</div>
		</div>
		<section class="content">
			<div class="r-data" v-for="(data, index) in list" v-if="data.title">
				<a class="avatar" target="_blank" :href="data.host" :title="data.title" @click="open(data)">
					<img v-lazy="data.icon"/>
				</a>
				<p class="title">
					<a target="_blank" :href="data.host" :title="data.title" @click="open(data)">{{data.title | clip(1)}}</a>
					<span class="like" v-if="data.hot">
						<img src="../../../static/img/relation/like.png" />
						<span>{{data.hot}}</span>
					</span>
					<a target="_blank" class="description" :href="data.host" :title="data.description" @click="open(data)">{{data.description}}</a>
				</p>
			</div>
		</section>
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { jsonp } from 'components/common/mixin'
	import { getHost, clipstring } from '../../config/utils'
	import { mockRecommend } from '../../mock/recommend'
export default {
	data () {
		return {
			defaultAvatar: '/static/img/home/recommend/default.png',
			list: [],
			path: 'http://10.20.216.64:8081/v1/ai_recommend',
			title: '相关推荐',
			txt1: '根据您的上网兴趣推荐',
			txt2: '换一换',
		}
	},
	mixins: [jsonp],
	activated() {
		console.log('relation activated')
	},
	mounted () {
		console.log('relation mount')
		this.init()
	},
	methods: {
		async init () {
			try {
//				this.list = [{
//					id: '001',
//					title: '米尔网米尔网米尔网米尔网米尔网',
//					host: 'www.miercn.com',
//					description: 'None',
//					keywords: 'None',
//				}]
				const bookmarks = await this.constructRecommend(),
					bookmarksStr = !_.isEmpty(bookmarks)? bookmarks.join(','):''
				await this.getRelations(bookmarksStr)
			}catch (e) {
				console.log('error:', e)
			}
		},
		async constructRecommend() {
			//收藏夹数据
			let bookmarks = await this.getBookmark()
			bookmarks = _.unionBy(bookmarks, 'url').map(bm => {
				return getHost(bm.url)
			})
			return bookmarks
		},
		async getRelations(bookmarksStr) {
			try {
				this.list = await this.jsonp(this.path, 'post', 'urls=' + bookmarksStr)
			}catch(e) {
				console.log('error', e)
			}
			if(_.isEmpty(this.list)) return
			this.list = _.filter(this.list , l => {
				return this.checkValid(l.title)===1
			})
			this.list.forEach(l => {
				l.icon = l.host? 'http://'+l.host+'/favicon.ico' : ''
				l.description = l.description&&l.description!=='None'&&l.description!==''? l.description:(l.keywords&&l.keywords!=='None'&&l.keywords!==''? l.keywords:'')
				l.host = this.addHttp('//'+l.host)
			})
			this.list = _.orderBy(this.list, ['hot'], ['desc'])
			this.list = !_.isEmpty(this.list)? this.list.slice(0, 10):[]
			console.log('this.list2', this.list)
		},
		open(data) {
			websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:3,value:0,hotsite:data.id,url:'',name:''})
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
		}
	},
	filters: {
		clip(str, type) {
			return type===1? clipstring(str, 18) : clipstring(str, 16)
		},
	},
}
</script>

<style lang="stylus" scoped>
	.relation
		float left
		width 225px
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
					color #6346de
					img
						position relative
						top 2px
		.content
			position relative
			bottom 7px
			.r-data
				height 45px
				font-size 14px
				.avatar
					float left
					img
						height 16px
						width 16px
				.title
					margin 25px 0
					padding-left 10px
					text-overflow ellipsis
					white-space pre-wrap
					word-wrap break-word
					overflow hidden
					height 52px
					position relative
					left 10px
					bottom 6px
					line-height 2
					a
						padding-top 5px
						color #333333
					.description
						font-size 12px
						display block
					.like
						float right
						font-size 12px
						color #949494
						padding-top 5px
						display flex
						img
							padding 1px 3px
							width 16px
							height 16px
</style>