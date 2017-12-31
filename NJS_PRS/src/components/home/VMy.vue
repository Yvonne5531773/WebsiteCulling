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
					<li v-for="(content, index) in contents" v-if="content.data.length>0">
						<div>
							<div class="head">
								<b class="circle"></b>
								<div class="left">
									<span class="head-t">
										{{content.name}}
									</span>
								</div>
							</div>
							<div class="body" :style="content.sort>=3&&`borderTop:none;margin:0px 0px 25px 10px;width:1122px`">
								<ul class="list">
									<li :key="data.id" v-for="data in content.data" :title="data.name" :class='{block:content.sort>=3}'>
										<a target="_blank" style="display:flex" :href="data.href_url" v-if="content.sort<3" @click="openUrl(data, content.sort)">
											<img v-lazy="data.iconLazyObj" />
											<span class="name" :style="{letterSpacing:data.letterSpace,textAlign:data.textAlign}">{{data.name}}</span>
										</a>
										<VItem :category="data" v-else></VItem>
									</li>
									<li v-if="content.name===`我收藏的网单`">
										<a class="add-more">
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
	export default {
		data() {
			return {
				isnull: false,
				txt1: '该页面正在开发，敬请期待...',
				contents: [
					{name: '我常用的', data: [], sort: 1},
					{name: '热门网站', data: [], sort: 2},
					{name: '最近访问', data: [], sort: 3},
					{name: '我的网单', data: [], sort: 4},
					{name: '我收藏的网单', data: [], sort: 5}
				],
				addmore: {
					txt1: '收藏更多',
					txt2: '赶快去收藏你喜欢的网单吧',
					txt3: '在【发现网站】页，丰富的个性化网单等你挑选！',
				},
				localCategories: [],
				localSites: []
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
			init () {
				this.construct()
			},
			openUrl (data, sort) {
				data.views = data.views? data.views+1 : 1
				data && sort === 1 && this.saveSite(data)
			},
			async construct() {
				//热门网站
				let hotSites = []
				try {
					hotSites = await this.jsonp('/v1/hotsite')
				} catch (e) {
					console.log('error: ', e)
				}
				this.contents[1].data = hotSites&&hotSites.length===0? hots:hotSites

				//我常用的
				await this.getLocal()
				this.contents[0].data = _.orderBy(this.localSites, ['views'], ['desc'])
				this.doContent()

//				this.contents[2].data = _.sortBy(localCategory, ['updated'])
				const dateRange = {
					updated: ''
				}

				//最近访问
				let ids = this.localCategories.sort(compareTime).map((c) => {
					return c.id
				})
				let res = await this.getData(ids)
				this.contents[2].data = _.cloneDeep(res)
				//我的网单
				likes[0].sites = _.cloneDeep(this.localSites)
				this.contents[3].data = likes
				//我收藏的网单
				ids = this.localCategories.filter((c) => {
					return c.collected
				}).map((c) => {
					return c.id
				})
				res = await this.getData(ids)
				this.contents[4].data = _.cloneDeep(res)

				console.log('this.contents', this.contents)
			},
			async getData (ids) {
				let data = []
				for(let i = 0; i < ids.length; i++) {
					let resObj = {}
					try {
						resObj = await this.jsonp('/v1/category/' + ids[i])
						console.log('construct resObj', resObj)
					} catch (e) {
						console.log('error: ', e)
					}
					!_.isEmpty(resObj) && data.push(resObj)
				}
				return data
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
					margin 10px 0 0 25px
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
						.add-more
							background url("../../../static/img/my/add-more.png") no-repeat
							width 243px
							height 320px
							position relative
							right 3px
							bottom 10px
							color #fff
							display block
							/*float left*/
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
</style>