<template>
	<div class="my-page">
		<section class="containerRow">
			<VBaidu></VBaidu>
			<div class="content">
				<ul>
					<li v-for="(content, index) in contents" v-if="content.data&&content.data.length>0||content.name===`我收藏的网单`">
						<div>
							<div class="head">
								<b :class="content.sort<3?'flag f-s':'flag f-f'"></b>
								<div class="left">
									<span class="head-t">
										{{content.name}}
									</span>
								</div>
							</div>
							<div class="body" :class="{'body-more-3':content.sort>=3}" :style="content.sort<3&&`minHeight:85px`">
								<ul class="list">
									<li :key="data.id" v-for="(data,index) in content.data" :title="data.name" :class='{block:content.sort>=3}'>
										<a target="_blank" :href="data.href_url" v-if="content.sort<3" @click="openUrl(data, content.sort, index)">
											<img v-lazy="data.iconLazyObj" />
											<span class="name" :style="{letterSpacing:data.letterSpace,textAlign:data.textAlign,width:data.width}">{{data.name | clip(10)}}</span>
										</a>
										<a class="add-like" v-else-if="content.sort===4&&data.sites.length===0" @click="addMore(1)">
											<p class="txt4">{{addmore.txt4}}</p>
											<p class="bottom">
												<span class="txt5">{{addmore.txt5}}</span>
												<span class="txt6">{{addmore.txt6}}</span>
											</p>
										</a>
										<VItem :category="data" :sort="content.sort" v-else></VItem>
									</li>
									<li v-if="content.name===`我收藏的网单`">
										<a class="add-more" @click="addMore(2)">
											<p class="txt1">{{addmore.txt1}}</p>
											<p class="bottom">
												<span class="txt2">{{addmore.txt2}}</span>
												<span class="txt3">{{addmore.txt3}}</span>
											</p>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</section>
		<!--<VRelation :localSites="localSites"></VRelation>-->
	</div>
</template>
<script>
	import { websiteApi } from 'api'
	import VBaidu from 'components/common/VBaidu'
	import VItem from 'components/home/VItem'
	import VRelation from 'components/home/VRelation'
	import { service } from 'components/common/mixin'
	import { hots } from '../../mock/hots'
	import { likes } from '../../mock/likes'
	import { compareTime, setStore, getHost } from '../../config/utils'
	import { mapState, mapMutations } from 'vuex'
	import { categoryPath } from '../../config/config'

	export default {
		data() {
			return {
				txt1: '该页面正在开发，敬请期待...',
				contents: [
//					{name: '我常用的', data: [], sort: 1},
//					{name: '热门网站', data: [], sort: 2},
//					{name: '最近访问', data: [], sort: 3},
//					{name: '我的网单', data: [], sort: 4},
//					{name: '我收藏的网单', data: [], sort: 5}
				],
				addmore: {
					txt1: '收藏更多',
					txt2: '赶快去收藏你喜欢的网单吧',
					txt3: '在【发现网站】页，丰富的个性化网单等你挑选！',
					txt4: '我喜欢的网站',
					txt5: '赶快去收藏你喜欢的网站吧',
					txt6: '点击喜欢，将网站一键加入我喜欢的网单！',
				},
				localCategories: [],
				localSites: [],
				likedSites: [],
				histories: [],
				bookmarks: [],
				hotsitePath: '/v1/hotsite',
			}
		},
		computed:{
			...mapState([
				'position'
			])
		},
		mixins: [service],
//		created() {
//			this.init()
//		},
		mounted() {
			this.init()
			this.$nextTick( () => {
				//由于用了keep alive，所以要拷贝值，图片懒加载才生效
				this.contents = _.cloneDeep(this.contents)
			})
		},
		methods: {
			...mapMutations(['SET_COMPONENT']),
			async init() {
				await this.construct()
				websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:1,url:'',value:0})
				this.position.name==='VMy' && this.gotoPosition()
			},
			openUrl(data, sort, index) {
//				data.views = data.views? data.views+1 : 1
//				data && sort === 1 && this.saveSite(data)
				sort === 1 && websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:3,url:data.href_url,value:0})
				sort === 2 && websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:4,url:data.url,value:data.id})
			},
			async buildHistories() {
				let arrs = []
				this.histories = await this.getHistories(100, 2)
				this.histories && this.histories.forEach(history => {
					if(!this.checkSite(history.title)){
						history.title = getHost(history.title)
						const data = {}
						data.domain = history.domain
						data.name = history.title
						data.href_url = history.url
						data.icon = 'chrome://favicon/size/16/'+history.url
						data.count = 0
						arrs.push(data)
					}
				})
				arrs.forEach((obj) => {
					arrs.forEach((o) => {
						obj.domain === o.domain && obj.count++
					})
				})
				arrs = _.unionBy(arrs, 'domain')
				arrs = _.orderBy(arrs, ['count'], ['desc'])
				return arrs
			},
			async construct() {
//				await this.constructHistory()
				await this.constructHotSite()
				this.doContent()
				await this.constructRecent()
				await this.constructLike()
				await this.constructCollect()
			},
			async constructHistory() {
				//我常用的
				const histories = await this.buildHistories()
				this.buildVM(histories.slice(0, 12), '我常用的', 1)
			},
			async constructHotSite() {
				//热门网站
				let hotSites = []
				try {
					hotSites = await this.jsonp(this.hotsitePath)
					hotSites = hotSites? hotSites.slice(0, 32):[]
				} catch (e) {
					console.log('error: ', e)
				}
				this.buildVM(hotSites&&hotSites.length===0? hots:hotSites, '热门网站', 2)
			},
			async constructRecent() {
				//最近访问
				this.localCategories = await this.getForm()
				const recentCategories = this.localCategories.sort(compareTime).slice(0, 8)
				this.buildVM(recentCategories, '最近访问', 3)
				const recentIds = recentCategories.map((c) => {
					return c.id
				})
				this.update(recentIds, '最近访问')
			},
			async constructLike() {
				//我的网单
				this.localSites = await this.getSite()
//				this.localSites = _.orderBy(this.localSites, ['views'], ['desc'])
				this.likedSites = _.cloneDeep(_.reverse(this.localSites))
				this.likedSites.filter(site => {
					return site.liked
				}).forEach(site => {
					site.url = getHost(site.url)
				})
				likes[0].sites = _.cloneDeep(this.likedSites)
				this.buildVM(likes, '我的网单', 4)
			},
			async constructCollect() {
				//我收藏的网单
				const collectCategories = this.localCategories.filter((c) => {
					return c.collected
				})
				this.buildVM(collectCategories, '我收藏的网单', 5)
				const collectIds = collectCategories.map((c) => {
					return c.id
				})
				this.update(collectIds, '我收藏的网单')
			},
			buildVM(data, name, sort) {
				let vm = {}
				vm.data = _.cloneDeep(data)
				vm.name = name
				vm.sort = sort
				this.contents.push(vm)
			},
			updateVM(data, name) {
				let vm = _.find(this.contents, {'name': name})
				vm.data = _.cloneDeep(data)
			},
			update(ids, name) {
				if(_.isEmpty(ids)) return
				this.jsonp(categoryPath + ids.join(',')).then(res => {
					this.updateVM(res, name)
				}).catch(e => console.log('error: ', e))
			},
			doContent() {
				this.contents.forEach( content => {
					!_.isEmpty(content.data) && content.sort<3 && content.data.forEach( (c) => {
						if(c){
							c.iconLazyObj = {
								src: c.icon&&!~c.icon.indexOf('http')?'http://'+c.icon : c.icon,
								error: 'static/img/favorite/default-icon.png',
								loading: 'static/img/favorite/default-icon.png'
							}
							switch (c.name && c.name.length) {
								case 2:
									c.letterSpace = '11px';c.textAlign = 'center';c.width = '67px';return
								case 3:
									c.letterSpace = '6px';c.textAlign = 'center';c.width = '63px';return
								case 4:
									c.letterSpace = '1px';return
							}
						}
					})
				})
			},
			addMore(type) {
				this.SET_COMPONENT({component: 'VDiscover'})
				type===1&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:6,url:'',value:0})
				type===2&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:8,url:'',value:0})
			},
			gotoPosition() {
				document.documentElement.scrollTop = this.position.scrolly
				document.body.scrollTop = this.position.scrolly
			},
			checkSite(name) {
				if(!name) return false
				const error = ['400','401','403','404','405','406','407','410','412','414','500','501','502','504',]
				return !!~error.indexOf(name.split(' ')[0])
			},
		},
		components: {
			VBaidu,
			VItem,
			VRelation,
		}
	}
</script>

<style lang="stylus" scoped>
	.my-page
		width 1045px
		height 100%
		margin auto
		zoom 1
		position relative
		top 115px
		.containerRow
			/*width 770px*/
			margin auto
			float left
			.null
				position absolute
				margin auto
				left 0
				bottom 0
				right 0
				top 0
				text-align center
				font-size 15px
				width 320px
				height 345px
				.txt1
					font-size 18px
					color #888888
					margin-top 10px
				img
					position relative
					bottom 10px
					right 10px
			.content
				position relative
				top 30px
				li
					display flex
					.flag
						width 20px
						height 20px
						float left
						margin 3px 3px 0 0
					.f-s
						background url("../../../static/img/my/f-s.png") no-repeat
					.f-f
						background url("../../../static/img/my/f-f.png") no-repeat
					.head
						position relative
						height 24px
						white-space nowrap
						.left
							float left
							.head-t
								float left
								vertical-align middle
								display inline-block
								font-size 18px
								line-height 22px
								color #5454a6
				.body
					margin 10px 0 15px 25px
					border-top 1px solid #cdcdde
					min-height 130px
					.list
						padding-top 18px
						display flex
						flex-wrap wrap
						li
							margin 0 10px 18px 0
							font-size 14px
							&:nth-child(8n)
								margin 0
							a
								display flex
								width 118px
								img
									width 16px
									height 16px
									padding 3px 8px 0 0
								.name
									color #333
									overflow hidden
									text-overflow ellipsis
									white-space nowrap
						.add-like
							background url("../../../static/img/my/add-like.png") no-repeat
							width 240px
							height 310px
							position relative
							color #fff
							display block
							.txt4
								top 20px
								bottom 0
								left 0
								right 0
								margin auto
								height 40px
								position absolute
								font-size 24px
								letter-spacing 7px
								text-align center
							.bottom
								bottom 0
								margin auto
								left 0
								right 0
								position absolute
								height 95px
								width 205px
								text-align left
								span
									display block
								.txt5
									font-size 14px
									margin-bottom 12px
								.txt6
									font-size 12px
						.add-more
							background url("../../../static/img/my/add-more.png") no-repeat
							width 240px
							height 320px
							position relative
							bottom 10px
							color #fff
							display block
							.txt1
								top 20px
								bottom 0
								left 0
								right 0
								margin auto
								height 40px
								position absolute
								font-size 24px
								letter-spacing 7px
								text-align center
							.bottom
								bottom 0
								margin auto
								left 0
								right 0
								position absolute
								height 95px
								width 205px
								span
									display block
								.txt2
									font-size 14px
									margin-bottom 12px
								.txt3
									font-size 12px
					.block
						float left
						list-style none
						margin 0 20px 17px 0 !important
						width 240px
						height 310px
						text-align center
						color gray
						-webkit-box-sizing border-box
						box-sizing border-box
						background #fff
						font-size 14px
						position relative
						margin-top 0
						&:nth-child(4n)
							margin 0 !important
				.body-more-3
					border-top none !important
					margin 0 0 10px 0 !important
</style>