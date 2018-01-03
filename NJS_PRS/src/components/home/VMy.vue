<template>
	<div class="my-page">
		<VBaidu></VBaidu>
		<section class="containerRow">
			<div class="null" v-if="isnull">
				<img src="../../../static/img/my/null.png"/>
				<h2 class="txt1">{{txt1}}</h2>
			</div>
			<div class="content" v-else>
				<ul>
					<li v-for="(content, index) in contents" v-if="content.data&&content.data.length>0||content.name===`我收藏的网单`">
						<div>
							<div class="head">
								<b class="circle"></b>
								<div class="left">
									<span class="head-t">
										{{content.name}}
									</span>
								</div>
							</div>
							<div class="body" :class="{'body-more-3':content.sort>=3}" :style="content.sort<3&&`minHeight:85px`">
								<ul class="list">
									<li :key="data.id" v-for="data in content.data" :title="data.name" :class='{block:content.sort>=3}'>
										<a target="_blank" style="display:flex" :href="data.href_url" v-if="content.sort<3" @click="openUrl(data, content.sort)">
											<img v-lazy="data.iconLazyObj" />
											<span class="name" :style="{letterSpacing:data.letterSpace,textAlign:data.textAlign}">{{data.name}}</span>
										</a>
										<a class="add-like" v-else-if="content.sort===4&&data.sites.length===0"  @click="addMore">
											<p class="txt4">{{addmore.txt4}}</p>
											<p class="bottom">
												<span class="txt5">{{addmore.txt5}}</span>
												<span class="txt6">{{addmore.txt6}}</span>
											</p>
										</a>
										<VItem :category="data" :sort="content.sort" v-else></VItem>
									</li>
									<li v-if="content.name===`我收藏的网单`">
										<a class="add-more" @click="addMore">
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
	</div>
</template>
<script>
	import { websiteApi } from 'api'
	import VBaidu from 'components/common/VBaidu'
	import VItem from 'components/home/VItem'
	import { jsonp } from 'components/common/mixin'
	import { hots } from '../../mock/hots'
	import { recents } from '../../mock/recents'
	import { likes } from '../../mock/likes'
	import { compareTime } from '../../config/utils'
	import { collects } from '../../mock/collects'
	import { mapMutations } from 'vuex'
	import { setStore } from '../../config/utils'
	export default {
		data() {
			return {
				isnull: false,
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
				hotsitePath: '/v1/hotsite',
				catePath: '/v1/category/'
			}
		},
		mixins: [jsonp],
		mounted() {
			this.init()
			this.$nextTick( () => {
				//由于用了keep alive，所以要拷贝值，图片懒加载才生效
				this.contents = _.cloneDeep(this.contents)
			})
		},
		methods: {
			...mapMutations(['SET_COMPONENT']),
			async init () {
				await this.construct()
				websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:1,url:'',value:0})
//				this.gotoPosition()
			},
			openUrl (data, sort) {
				data.views = data.views? data.views+1 : 1
				data && sort === 1 && this.saveSite(data)
				sort === 1 && websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:3,url:data.url,value:data.id})
				sort === 2 && websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:4,url:data.url,value:data.id})
			},
			async construct() {
				//我常用的
				await this.getLocal()
				const localSites = _.orderBy(this.localSites, ['views'], ['desc'])
				this.buildVM(localSites.slice(0, 16), '我常用的', 1)
				//热门网站
				let hotSites = []
				try {
					hotSites = await this.jsonp(this.hotsitePath)
				} catch (e) {
					console.log('error: ', e)
				}
				this.buildVM(hotSites&&hotSites.length===0? hots:hotSites, '热门网站', 2)
				this.doContent()
				//最近访问
				let ids = this.localCategories.sort(compareTime).map((c) => {
					return c.id
				})
				ids = ids && ids.slice(0, 8)
				let res = await this.getData(ids)
				this.buildVM(res, '最近访问', 3)
				//我的网单
				let likedSites = _.cloneDeep(localSites)
				likedSites = likedSites && likedSites.filter(site => {
					return site.liked
				})
				likes[0].sites = _.cloneDeep(likedSites)
				this.buildVM(likes, '我的网单', 4)
				//我收藏的网单
				ids = this.localCategories.filter((c) => {
					return c.collected
				}).map((c) => {
					return c.id
				})
				res = await this.getData(ids)
				this.buildVM(res, '我收藏的网单', 5)
				console.log('this.contents', this.contents)
			},
			async getData (ids) {
				if(_.isEmpty(ids)) return
				let res = []
				try {
					res = await this.jsonp(this.catePath + ids.join(','))
					console.log('construct res', res)
				} catch (e) {
					console.log('error: ', e)
				}
				return res
			},
			async getLocal () {
				this.localCategories = await this.getForm()
				this.localSites = await this.getSite()
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
							switch (c.name.length) {
								case 2:
									c.letterSpace = '11px';c.textAlign = 'center';return
								case 3:
									c.letterSpace = '6px';c.textAlign = 'center';return
								case 4:
									c.letterSpace = '1px';return
							}
						}
					})
				})
			},
			buildVM(data, name, sort) {
				let vm = {}
				vm.data = _.cloneDeep(data)
				vm.name = name
				vm.sort = sort
				this.contents.push(vm)
			},
			addMore() {
				this.SET_COMPONENT({component: 'VDiscover'})
				setStore('COMPONENT_NAME', 'VDiscover')
				websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:7,url:'',value:0})
			},
			gotoPosition() {
				console.log('vmy gotoPosition this.position', this.position)
				document.documentElement.scrollTop = this.position
				document.body.scrollTop = this.position
			}
		},
		components: {
			VBaidu,
			VItem,
		}
	}
</script>

<style lang="stylus" scoped>
	.my-page
		zoom 1
		display flex
		.containerRow
			width 1093px
			position relative
			float left
			margin auto
			top 192px
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
				li
					display flex
					.circle
						background url("../../../static/img/home/circle.png") no-repeat
						width 20px
						height 20px
						float left
						margin 3px 5px 0 0
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
								line-height 24px
								color #5454a6
				.body
					margin 10px 0 25px 25px
					border-top 1px solid #cdcdde
					min-height 130px
					width 1060px
					.list
						padding-top 21px
						display flex
						flex-wrap wrap
						li
							margin 0 42px 26px 0
							font-size 14px
							cursor pointer
							&:nth-child(8n)
								margin 0
							img
								width 16px
								height 16px
								padding 3px 8px 0 0
							.name
								color #333
								width 70px
								overflow hidden
								text-overflow ellipsis
								white-space nowrap
						.add-like
							background url("../../../static/img/my/add-like.png") no-repeat
							width 243px
							height 312px
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
							width 243px
							height 320px
							position relative
							right 3px
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
						margin 0 40px 26px 0 !important
						width 239px
						height 310px
						text-align center
						color gray
						-webkit-box-sizing border-box
						box-sizing border-box
						-webkit-box-shadow 0 8px 18px rgba(0,0,0,.06)
						box-shadow 0 8px 18px rgba(0,0,0,.06)
						background #fff
						font-size 14px
						position relative
						border-radius 4px
						margin-top 0
						&:nth-child(4n)
							margin 0 !important
				.body-more-3
					border-top none !important
					margin 0 0 25px 10px !important
					width 1122px !important
</style>