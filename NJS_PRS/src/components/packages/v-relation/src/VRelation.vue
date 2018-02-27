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
	import { getHost, clipstring } from 'utils/index'
	import { mockRelation } from 'mock/relation'
	import { aiRecommendPath } from 'config/index'
	export default {
		name: 'VRelation',
		data() {
			return {
				list: [],
				vm: [],
				title: '猜你喜欢',
				txt1: '根据您的上网兴趣推荐',
				txt2: '换一换',
				index: 0
			}
		},
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
		mounted() {
			//		this.init()
		},
		methods: {
			async init() {
				try {
					const bookmarks = await this.constructRecommend(),
						bookmarksStr = !_.isEmpty(bookmarks) ? bookmarks.join(',') : ''
					this.list = await this.getRelations(bookmarksStr)
					this.vm = this.list[this.index]
				} catch (e) {
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
					list = await this.fetch(aiRecommendPath, 'post', 'urls=' + bookmarksStr)
				} catch (e) {
					console.log('error', e)
				}
				list = !_.isEmpty(list) ? list : mockRelation
				list = _.filter(list, l => {
					return this.checkValid(l.title) === 1
				})
				list.forEach(l => {
					l.iconLazyObj = {
						src: l.icon,
						error: 'static/img/default-icon.png',
						loading: 'static/img/default-icon.png'
					}
					l.description = l.description && l.description !== 'None' && l.description !== '' ? l.description : (l.keywords && l.keywords !== 'None' && l.keywords !== '' ? l.keywords : (l.title !== '' ? l.title : ''))
					l.host = this.addHttp('//' + l.host)
					l.hot = l.hot ? parseInt(l.hot) : ''
					const findSite = _.find(this.localSites, {'name': l.title})
					l.liked = !_.isEmpty(findSite) ? findSite.liked : false
					l.id = !_.isEmpty(findSite) ? findSite.id : (new Date()).valueOf() + Math.floor(Math.random() * 1000 + 1) + ''
				})
				//			list = _.orderBy(list, ['hot'], ['desc'])
				return _.chunk(list, 10)
			},
			open(data) {
				this.$api.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte', {
					action: 11,
					url: data.host,
					value: 0
				})
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
				store.liked && this.$api.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte', {
					action: 12,
					url: data.host,
					value: 0
				})
			},
			change() {
				const list = this.list[this.index + 1]
				this.vm = []
				this.index = _.isEmpty(list) ? 0 : this.index + 1
				this.$nextTick(() => {
					this.vm = _.cloneDeep(this.list[this.index])
				})
				this.$api.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte', {
					action: 14,
					url: '',
					value: 0
				})
			},
			checkValid(val) {
				let ret = 1
				const error = ['400', '401', '403', '404', '405', '406', '407', '410', '412', '414', '500', '501', '502', '504']
				error.forEach(e => {
					if (!!~val.indexOf(e)) {
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
		position relative
		float left
		margin-left 60px
		width 214px
		.head
			padding-bottom 8px
			border-bottom 1px solid #cdcdde
			color #6346de
			h2
				position relative
				bottom 5px
				font-size 14px
			.change
				display flex
				justify-content space-between
				.c
					display flex
					width 57px
					color #6346de
					&:hover
						b
							background-position -17px
					b
						background url("../../../../assets/img/relation/change.png") no-repeat
						width 18px
						margin 1px
		.content
			position relative
			top 20px
			.r-data
				margin-bottom 18px
				height 78px
				font-size 14px
				.avatar
					float left
					img
						height 16px
						width 16px
				.title
					position relative
					bottom 3px
					overflow hidden
					padding-left 10px
					.name
						display block
						overflow hidden
						text-overflow ellipsis
						white-space nowrap
					a
						color #333333
					.description
						display block
						font-size 12px
						height 38px
						color #5b5b5b !important
			.r-t
				display flex
				position relative
				bottom 3px
				float right
				font-size 12px
				color #949494
				.like
					margin 2px 5px
					background url("../../../../assets/img/relation/like.png") no-repeat
					width 15px
					height 15px
					&:hover
						background-position -15px
					&:active
						background-position -30px
</style>