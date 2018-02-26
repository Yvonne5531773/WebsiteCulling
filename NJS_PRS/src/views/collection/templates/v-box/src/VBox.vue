<template>
	<div class="v-box">
		<section class="box-content">
			<h2 class="path">{{txt1}}
				<span> > </span>
				<span>{{category.name}}</span>
			</h2>
			<div class="f-l">
				<div class="introduce" :style="categoryid===`0099`&&`height:265px`">
					<div class="avatar">
						<img v-lazy="addHttp(category.avatar)" :style="categoryid===`0099`&&`bottom:3px`"/>
						<span>{{category.name}}</span>
						<div class="mask"></div>
					</div>
					<div class="title">
						<a target="_blank" :title="category.name">{{category.name | clip(13)}}</a>
					</div>
					<div class="collect-btn">
						<VCollect :category="category"></VCollect>
					</div>
				</div>
			</div>
			<div class="f-r">
				<div class="content">
					<div class="block" :key="site.id" v-for="(site, index) in sites" @click="open(site, $event)">
						<div class="name">
							<div ref="img" class="i">
								<img v-lazy="site.iconLazyObj"/>
							</div>
							<span>{{site.name | clip(22)}}</span>
						</div>
						<div class="description" :title="site.description">
							<span>{{site.description | clip(60)}}</span>
						</div>
						<div class="heart" :title="likeTxt" @click="liked(site, index)" >
							<span :style="site.liked&&`backgroundPositionX:-30px`" class="like"></span>
							<span class="text" v-if="!site.liked">{{likeTxt}}</span>
							<span class="liked-text" v-else>{{likedTxt}}</span>
						</div>
						<div ref="alert" class="alert" v-show="site.likedAlert">
							<span>{{alertTxt}}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import { likes } from 'mock/likes'
	export default {
		name: 'VBox',
		data () {
			return {
				category: {},
				sites: [],
				txt1: this.$txt.TXT_13,
				likeTxt: this.$txt.TXT_14,
				likedTxt: this.$txt.TXT_15,
				alertTxt: this.$txt.TXT_16,
			}
		},
		computed: {
			categoryid() {
				return this.$route.query.categoryid || ''
			},
		},
		mounted () {
			this.init()
			this.$nextTick(()=>{
				this.category = _.cloneDeep(this.category)
			})
		},
		methods: {
			async init () {
				if (this.categoryid === '0099') { //喜欢的网单
					this.category = likes[0]
					this.sites = await this.getSite()
					this.sites = _.reverse(_.filter(this.sites, site => site.liked))
				} else {
					this.category = await this.constructCategory(this.categoryid)
					await this.construct()
				}
				this.sites && this.sites.forEach( (site) => {
					site.iconLazyObj = {
						src: this.addHttp(site.icon),
						error: 'static/img/default-icon.png',
						loading: 'static/img/default-icon.png'
					}
				})
				this.category = _.cloneDeep(this.category)
				this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:1,name:this.category.name,url:''})
			},
			async construct () {
				const localSites = await this.getSite()
				this.sites = _.cloneDeep(this.category.sites)
				if(_.isEmpty(this.sites)) return
				for(let i = 0; i < this.sites.length; i++){
					let site = this.sites[i],
						si = _.find(localSites, {'id': site.id+''})
					!_.isEmpty(si) && (site.liked = si.liked, site.views = si.views)
					site.liked && (this.sites.splice(i, 1), this.sites.unshift(site))
				}
			},
			liked (site, i) {
				if(!site) return
				site.alertTimeout && (clearTimeout(site.alertTimeout))
				site.likedAlert = site.liked = !site.liked
				site.alertEl = this.$refs.alert[i]
				site.liked && (site.alertTimeout = setTimeout(() => {
					site.likedAlert = false
					const alert = site.alertEl
					this.$velocity(alert, {opacity:0}, {duration:400, complete:()=>{alert.style.display='none',alert.style.opacity=0.95}})
				}, 1000))
				this.saveSite(_.cloneDeep(site), this.categoryid)
				this.category = _.cloneDeep(this.category)
				site.liked && this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:3,name:this.category.name,url:site.url})
			},
			open (site, event) {
				const url = site.href_url? site.href_url : this.addHttp(site.url),
					className = event.target.className
//				site.views = site.views? site.views+1 : 1
//				this.saveSite(_.cloneDeep(site), this.categoryid)
				typeof className==='string' && !~className.indexOf('text') && !~className.indexOf('like') && !~className.indexOf('heart') && (window.open(url), this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:2,name:this.category.name,url:site.url}))
			},
		},
	}
</script>

<style lang="stylus" scoped>
	.box-content
		display flex
		margin 120px auto
		width 1043px
		.path
			font-size 12px
			position absolute
			color #5454a6
		.f-l
			width 252px
			position relative
			top 35px
			.introduce
				float left
				list-style none
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
					cursor pointer
					bottom -21px
					left -14px
					margin auto
					position absolute
					line-height 4.5
					&:hover
						background-position -270px
					&:active
						background-position -540px
					img
						position relative
						top 4px
					span
						font-size 16px
						padding-right 7px
		.f-r
			top 35px
			left 40px
			position relative
			h2
				font-size 18px
				color #5454a6
				height 40px
			.content
				display flex
				flex-wrap wrap
				.block
					width 240px
					height 122px
					margin 0 20px 20px 0
					box-sizing border-box
					background #fff
					font-size 12px
					position relative
					cursor pointer
					border 1px solid #fff
					transition all .2s linear
					&:hover
						box-shadow 0 1px 20px -5px rgb(84, 84, 166)
					.name
						padding 10px 0 0 16px
						font-size 14px
						.i
							img
								float left
								width 16px
								height 16px
								padding 6px 10px 0 0
								position relative
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
						bottom 6px
						right 10px
						cursor pointer
						font-size 14px
						z-index 0
						&:hover
							.like
								background-position -15px
						&:active
							.like
								background-position -30px
						.like
							background url("../../../../../assets/img/relation/like.png") no-repeat
							width 15px
							height 15px
							float left
							top 4px
							right 8px
						span
							cursor pointer
							position relative
							width 20px
							z-index 99
							&:nth-child(2)
								font-size 12px
						.text
							color #5454a6
						.liked-text
							color #ff3f5f
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