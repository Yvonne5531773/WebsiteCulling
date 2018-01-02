<template>
	<div class="favorite-page">
		<VHeader :favoritePage="true"></VHeader>
		<section class="favorite">
			<div class="f-l">
				<div class="introduce">
					<div class="avatar">
						<img v-lazy="addHttp(category.avatar)" :style="categoryid===`0099`&&`bottom:3px`"/>
						<span>{{category.name}}</span>
						<div class="mask"></div>
					</div>
					<div class="title">
						<a target="_blank" :title="category.name">{{category.name | clip(13)}}</a>
						<span class="by">{{by}}</span>
					</div>
					<div class="add" :style="category.collected&&`backgroundPosition:-170px`" @click="collect" v-if="categoryid!==`0099`"></div>
				</div>
			</div>
			<div class="f-r">
				<h2>{{txt1}}</h2>
				<div class="content">
					<div class="block" :key="site.id" v-for="(site, index) in sites" @click="open(site, $event)">
						<div class="name">
							<div ref="img" class="i">
								<img v-lazy="site.iconLazyObj"/>
								<img v-lazy="site.iconLazyObj"/>
							</div>
							<span>{{site.name | clip(40)}}</span>
						</div>
						<div class="description" :title="site.description">
							<span>{{site.description | clip(60)}}</span>
						</div>
						<div class="heart" :title="likeTxt" @click="liked(site, index)" >
							<span :style="site.liked&&`backgroundPositionX:-16px`" class="like"></span>
							<span class="text" v-if="!site.liked">{{likeTxt}}</span>
							<span class="text" v-else>{{likedTxt}}</span>
						</div>
						<!--<button ref="heart" class="icobutton" :title="likeTxt" @click="liked(site)">-->
						<!--<span class="fa fa-heart"></span>-->
						<!--<span class="text" v-if="!site.liked">{{likeTxt}}</span>-->
						<!--<span class="text" v-else>{{likedTxt}}</span>-->
						<!--</button>-->
						<div ref="alert" class="alert" v-show="site.likedAlert">
							<span>{{alertTxt}}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
		<VAlert v-show="showAlert"></VAlert>
	</div>
</template>

<script>
	import VHeader from 'components/common/VHeader'
	import VAlert from 'components/common/VAlert'
	import { clipstring, getOperationFullTime } from '../../config/utils'
	import { websiteApi } from 'api'
	import Velocity from 'velocity-animate/velocity.min'
	import { likes } from '../../mock/likes'
	import { jsonp } from 'components/common/mixin'
	import { mapMutations } from 'vuex'
	import { mockData } from '../../mock/data'
	import { match } from '../../mock/match'
	export default {
		data () {
			return {
				txt1: '网站列表',
				categoryid: this.$route.query.categoryid,
				category: {},
				sites: [],
				showAlert: false,
				by: '',
				likeTxt: '收藏',
				likedTxt: '已收藏',
				alertTxt: '已添加到我喜欢的网单',
				collectAlertSTO: {},
				catePath: '/v1/category/'
			}
		},
		mixins: [jsonp],
		mounted () {
			this.init()
			this.$nextTick(()=>{
				//在$nextTick里重新赋值，不然v-lazy="category.avatar"会失效
				this.category = _.cloneDeep(this.category)
			})
		},
		methods: {
			...mapMutations(['SET_LIKED', 'SAVE_POSITION']),
			async init () {
				if (this.categoryid === '0099') { //喜欢的网单
					this.category = likes[0]
					this.sites = await this.getSite()
					this.sites = _.filter(this.sites, site => site.liked)
				} else {
					let res = {}
					try {
						res = await this.jsonp(this.catePath + this.categoryid)
					}catch (e) {
						console.log('error:', e)
					}
					if(_.isEmpty(res)) return
					this.category = res[0]
					this.by = 'by ' + this.category.by
					await this.construct()
				}
				this.sites && this.sites.forEach( (site) => {
					site.iconLazyObj = {
						src: this.addHttp(site.icon),
						error: 'static/img/favorite/default-icon.png',
						loading: 'static/img/favorite/default-icon.png'
					}
				})
				this.category = _.cloneDeep(this.category)
				this.sites = _.cloneDeep(this.sites)
				websiteApi.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:1,name:this.category.name,url:''})
			},
			async construct () {
				const localCategories = await this.getForm(),
					localSites = await this.getSite(),
					cat = _.find(localCategories, {'id': this.categoryid+''})
				!_.isEmpty(cat) && (this.category.collected = cat.collected)
				this.sites = _.cloneDeep(this.category.sites)
				for(let i = 0; i < this.sites.length; i++){
					let site = this.sites[i],
						si = _.find(localSites, {'id': site.id+''})
					!_.isEmpty(si) && (site.liked = si.liked, site.views = si.views)
					site.liked && (this.sites.splice(i, 1), this.sites.unshift(site))
				}
			},
			liked (site, i) {
				if(!site) return
				let component = document.getElementsByClassName('component')[0].children[0],
					cTop = component.getBoundingClientRect().top,
					cLeft = component.getBoundingClientRect().left,
					img = this.$refs.img[i].children[0],
					iTop = img.getBoundingClientRect().top,
					iLeft = img.getBoundingClientRect().left,
					iimg = this.$refs.img[i].children[1]
				site.alertTimeout && (clearTimeout(site.alertTimeout))
				site.likedAlert = site.liked = !site.liked
				site.liked && (site.alertTimeout = setTimeout(() => {
					site.likedAlert = false
					this.$refs.alert[i].style.display = 'none'
				}, 800), Velocity(img, { translateY:cTop-iTop,translateX:cLeft-iLeft,opacity:0}, {duration: Math.floor(i/3)!==0?(Math.floor(i/3)+1)*400:800}))
				!site.liked && (img.style = iimg.style)
				this.saveSite(_.cloneDeep(site), this.categoryid)
				site.liked && this.SET_LIKED({liked: true})
				this.category = _.cloneDeep(this.category)
				this.sites = _.cloneDeep(this.sites)
				site.liked && websiteApi.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:3,name:this.category.name,url:site.url})
			},
			collect () {
				!this.category.collected &&
				(this.showAlert = true,
					this.collectAlertSTO = setTimeout( () => {
						this.showAlert = false
					}, 1800))
				this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
				this.category.collected = !this.category.collected
				this.category = _.cloneDeep(this.category)
				this.saveForm(this.category)
				this.category.collected && websiteApi.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:4,name:this.category.name,url:''})
			},
			open (site, event) {
				const url = site.href_url? site.href_url : this.addHttp(site.url),
					className = event.target.className
				site.views = site.views? site.views+1 : 1
				this.saveSite(_.cloneDeep(site), this.categoryid)
				websiteApi.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:2,name:this.category.name,url:site.url})
				typeof className==='string' && !~className.indexOf('text') && !~className.indexOf('like') && !~className.indexOf('heart') && window.open(url)
			},
			addHttp(url) {
				if(url){
					return !~url.indexOf('http')? 'http://'+url : url
				}
			}
//			buildHeart (el) {
//				let span = el.querySelector('span')
//				new Animocon.animocon(el, {
//					tweens : [
//						new mojs.Shape({
//							parent: el,
//							duration: 750,
//							type: 'circle',
//							radius: {0: 20},
//							fill: 'transparent',
//							stroke: '#F35186',
//							strokeWidth: {6:0},
//							opacity: 0.2,
//							top: '30%',
//							left: '70%',
//							easing: mojs.easing.bezier(0, 1, 0.5, 1)
//						}),
//						new mojs.Shape({
//							parent: el,
//							duration: 500,
//							delay: 180,
//							type: 'circle',
//							radius: {0: 18},
//							fill: 'transparent',
//							stroke: '#F35186',
//							strokeWidth: {5:0},
//							opacity: 0.5,
//							x: -30,
//							y: -10,
//							isRunLess: true,
//							easing: mojs.easing.sin.out
//						}),
//						new mojs.Shape({
//							parent: el,
//							duration: 800,
//							delay: 240,
//							type: 'circle',
//							radius: {0: 14},
//							fill: 'transparent',
//							stroke: '#F35186',
//							strokeWidth: {5:0},
//							opacity: 0.3,
//							x: -15,
//							y: -6,
//							easing: mojs.easing.sin.out
//						}),
//						new mojs.Shape({
//							parent: el,
//							duration: 800,
//							delay: 240,
//							type: 'circle',
//							radius: {0: 12},
//							fill: 'transparent',
//							stroke: '#F35186',
//							strokeWidth: {5:0},
//							opacity: 0.4,
//							x: 10,
//							y: -13,
//							easing: mojs.easing.sin.out
//						}),
//						new mojs.Tween({
//							duration : 1200,
//							easing: mojs.easing.ease.out,
//							onUpdate: function(progress) {
//								if(progress > 0.3) {
//									let elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
//									span.style.WebkitTransform = span.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
//								}
//								else {
//									span.style.WebkitTransform = span.style.transform = 'scale3d(0,0,1)';
//								}
//							}
//						})
//					],
//					onCheck : function() {
//						el.style.color = '#F35186';
//					},
//					onUnCheck : function() {
//						el.style.color = '#C0C1C3';
//					}
//				})
//			},
		},
		filters: {
			clip (str, len) {
				return clipstring(str, len)
			},
		},
		components: {
			VHeader,
			VAlert
		},
	}
</script>

<style lang="stylus" scoped>
	.favorite-page
		zoom 1
		-webkit-box-orient vertical
		-webkit-box-direction normal
		-ms-flex-direction column
		flex-direction column
		-webkit-box-align stretch
		-ms-flex-align stretch
		align-items stretch
		-ms-flex-negative 0
		flex-shrink 0
		width 100%
		height 100%
		top 0
		bottom 0
		overflow-x hidden
		background #edeff1
		position fixed
		overflow-y scroll
		.favorite
			display flex
			margin 120px auto
			width 1102px
			.f-l
				margin 0 auto
				width 252px
				position relative
				top 35px
				.introduce
					float left
					list-style none
					margin 0 0 0 10px
					width 242px
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
					border 1px solid #eae9ef
					.avatar
						height 160px
						-webkit-box-sizing border-box
						box-sizing border-box
						overflow hidden
						position relative
						font-size 24px
						color white
						letter-spacing 7px
						border-radius 4px
						img
							position relative
						span
							position absolute
							overflow hidden
							top 0
							right 0
							left 0
							bottom 0
							margin auto
							height 40px
							z-index 99
						.mask
							background-color black
							width 240px
							height 156px
							position absolute
							left 0
							top 0
							opacity 0.2
							z-index 9
					.title
						margin 16px 16px 7px
						color #333
						font-size 16px
						font-weight 600
						font-synthesis style
						overflow hidden
						text-overflow ellipsis
						white-space nowrap
						border-bottom 1px solid #949494
						height 30px
						.by
							float right
							font-size 12px
							color #949494
							line-height 2
						a
							color #333
							position relative
							float left
							width 102px
							overflow hidden
							text-align left
					.detail
						padding 10px
					.add
						background url("../../../static/img/favorite/add.png") no-repeat
						width 170px
						height 66px
						cursor pointer
						bottom 0
						margin auto
						left 0
						right 0
						position absolute
			/*&:active
				background-position -165px*/
			.f-r
				width 850px
				bottom 6px
				left 46px
				position relative
				h2
					font-size 18px
					color #5454a6
					height 40px
				.content
					display flex
					flex-wrap wrap
					.block
						width 29.5%
						height 122px
						margin 0 30px 30px 0
						box-sizing border-box
						box-shadow 0 8px 18px rgba(0,0,0,.06)
						background #fff
						font-size 12px
						border-radius 4px
						position relative
						cursor pointer
						border 1px solid #fff
						&:hover
							border 1px solid #bcbcdc
							box-shadow 0 1px 20px -5px rgb(84, 84, 166)
						.name
							padding 10px 0 0 16px
							font-size 14px
							.i
								width 20px
								display inline-block
								height 20px
								img
									float left
									width 16px
									height 16px
									padding 5px 10px 0 0
									position absolute
									/*z-index 200*/
							span
								line-height 2
								color #333333
						.description
							margin 3px 20px 0 42px
							span
								display block
								color #5b5b5b
								height 38px
								overflow hidden
						.heart
							position absolute
							bottom 0
							right 0
							margin auto
							padding 0 20px 12px 0
							cursor pointer
							font-size 14px
							z-index 0
							.like
								float left
								width 16px
								height 16px
								top 4px
								right 4px
								position relative
								background url("../../../static/img/favorite/like.png") no-repeat
								cursor pointer
							span
								cursor pointer
								position relative
								width 20px
								z-index 99
								&:nth-child(2)
									font-size 12px
							.text
								color #5454a6
						.icobutton
							position absolute
							bottom 0
							right 0
							margin auto
							padding 0 20px 12px 0
							color #c0c1c3
							border 0
							background none
							overflow visible
							-webkit-tap-highlight-color rgba(0,0,0,0)
							cursor pointer
							font-size 14px
							z-index 0
							&:hover, &:focus
								outline none
							span
								cursor pointer
								position relative
								width 20px
								z-index 99
								&:nth-child(2)
									font-size 12px
							.text
								color #5454a6
					.alert
						width 100%
						height 100%
						background-color #fe5976
						position absolute
						left 0
						top 0
						opacity 0.95
						font-size 16px
						color #ffffff
						text-align center
						z-index 99
						border-radius 4px
						span
							height 25px
							top 0
							left 0
							right 0
							bottom 0
							margin auto
							position absolute
</style>